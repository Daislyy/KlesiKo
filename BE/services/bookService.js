import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

const attachGenresToBooks = async (books) => {
  if (books.length === 0) return [];
  const bookIds = books.map((b) => b.id);
  const [genreRows] = await pool.query(
    `SELECT bg.book_id, g.id, g.name
     FROM book_genres bg
     JOIN genres g ON g.id = bg.genre_id
     WHERE bg.book_id IN (?)`,
    [bookIds]
  );

  const genreMap = new Map();
  for (const row of genreRows) {
    if (!genreMap.has(row.book_id)) genreMap.set(row.book_id, []);
    genreMap.get(row.book_id).push({ id: row.id, name: row.name });
  }

  return books.map((book) => ({
    ...book,
    average_rating: book.average_rating ? Number(Number(book.average_rating).toFixed(1)) : 0,
    total_ratings: Number(book.total_ratings || 0),
    genres: genreMap.get(book.id) || [],
  }));
};

export const getAllBooks = async ({ search, category_id, genre_id, status, available, sort, page = 1, limit = 20 } = {}) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)');
    const kw = `%${search}%`;
    params.push(kw, kw, kw);
  }
  if (category_id) {
    conditions.push('b.category_id = ?');
    params.push(category_id);
  }
  if (status) {
    conditions.push('b.status = ?');
    params.push(status);
  }
  if (available === 'true') {
    conditions.push('b.available_stock > 0');
  }
  if (genre_id) {
    conditions.push('EXISTS (SELECT 1 FROM book_genres bg WHERE bg.book_id = b.id AND bg.genre_id = ?)');
    params.push(genre_id);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = sort === 'rating'
    ? 'ORDER BY average_rating IS NULL, average_rating DESC, b.created_at DESC'
    : 'ORDER BY b.created_at DESC';
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNum - 1) * limitNum;

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM books b ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT
       b.*,
       c.name AS category_name,
       AVG(br.rating) AS average_rating,
       COUNT(DISTINCT br.id) AS total_ratings
     FROM books b
     LEFT JOIN categories c ON c.id = b.category_id
     LEFT JOIN book_ratings br ON br.book_id = b.id
     ${whereClause}
     GROUP BY b.id
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  const books = await attachGenresToBooks(rows);
  return {
    books,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      total_pages: Math.ceil(total / limitNum),
    },
  };
};

export const getBookById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
       b.*,
       c.name AS category_name,
       AVG(br.rating) AS average_rating,
       COUNT(DISTINCT br.id) AS total_ratings
     FROM books b
     LEFT JOIN categories c ON c.id = b.category_id
     LEFT JOIN book_ratings br ON br.book_id = b.id
     WHERE b.id = ?
     GROUP BY b.id`,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('Buku tidak ditemukan.', 404);
  }

  const [book] = await attachGenresToBooks(rows);
  return book;
};

export const createBook = async (payload, createdBy = null) => {
  const {
    category_id = null,
    title,
    author,
    publisher = null,
    isbn = null,
    description = null,
    cover_image_url = null,
    published_year = null,
    total_pages = null,
    stock = 0,
    available_stock,
    status,
    genre_ids = [],
  } = payload;

  if (!title || !title.trim()) {
    throw new AppError('Judul wajib diisi.', 400);
  }
  if (!author || !author.trim()) {
    throw new AppError('Penulis wajib diisi.', 400);
  }

  const parsedStock = Number(stock);
  const parsedAvailable = available_stock !== undefined ? Number(available_stock) : parsedStock;

  if (parsedStock < 0 || parsedAvailable < 0 || parsedAvailable > parsedStock) {
    throw new AppError('Stok tersedia tidak boleh negatif atau melebihi total stok.', 400);
  }

  const finalStatus = status || (parsedAvailable > 0 ? 'available' : 'unavailable');
  const id = crypto.randomUUID();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO books (
        id, category_id, title, author, publisher, isbn,
        description, cover_image_url, published_year, total_pages,
        stock, available_stock, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        category_id || null,
        title.trim(),
        author.trim(),
        publisher,
        isbn || null,
        description,
        cover_image_url,
        published_year,
        total_pages,
        parsedStock,
        parsedAvailable,
        finalStatus,
        createdBy,
      ]
    );

    if (Array.isArray(genre_ids) && genre_ids.length > 0) {
      const uniqueGenres = [...new Set(genre_ids)];
      const values = uniqueGenres.map((genreId) => [id, genreId]);
      await conn.query('INSERT INTO book_genres (book_id, genre_id) VALUES ?', [values]);
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getBookById(id);
};

export const updateBook = async (id, input) => {
  const existing = await getBookById(id);

  // Jika admin mengubah total stok, stok tersedia ikut disesuaikan
  // tanpa menghitung ulang buku yang sedang dipinjam.
  const borrowedCount = existing.stock - existing.available_stock;
  const nextStock = input.stock !== undefined ? Number(input.stock) : existing.stock;
  const nextAvailable =
    input.available_stock !== undefined ? Number(input.available_stock) : nextStock - borrowedCount;

  if (nextAvailable < 0) {
    throw new AppError(`Total stok tidak boleh kurang dari jumlah buku yang sedang dipinjam (${borrowedCount}).`, 400);
  }
  if (nextStock < 0 || nextAvailable > nextStock) {
    throw new AppError('Stok tersedia tidak boleh negatif atau melebihi total stok.', 400);
  }

  const payload = {
    ...input,
    stock: nextStock,
    available_stock: nextAvailable,
    status: nextAvailable > 0 ? 'available' : 'unavailable',
  };

  const allowedFields = [
    'category_id',
    'title',
    'author',
    'publisher',
    'isbn',
    'description',
    'cover_image_url',
    'published_year',
    'total_pages',
    'stock',
    'available_stock',
    'status',
  ];

  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(payload[key]);
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (fields.length > 0) {
      values.push(id);
      await conn.query(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    if (Array.isArray(payload.genre_ids)) {
      await conn.query('DELETE FROM book_genres WHERE book_id = ?', [id]);
      if (payload.genre_ids.length > 0) {
        const uniqueGenres = [...new Set(payload.genre_ids)];
        const genreValues = uniqueGenres.map((genreId) => [id, genreId]);
        await conn.query('INSERT INTO book_genres (book_id, genre_id) VALUES ?', [genreValues]);
      }
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getBookById(id);
};

export const deleteBook = async (id) => {
  await getBookById(id);
  await pool.query('DELETE FROM books WHERE id = ?', [id]);
  return { id };
};
