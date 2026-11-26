import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getBookRatings = async (bookId) => {
  const [rows] = await pool.query(
    `SELECT
       br.*,
       u.full_name,
       u.username,
       u.profile_image_url
     FROM book_ratings br
     JOIN users u ON u.id = br.user_id
     WHERE br.book_id = ?
     ORDER BY br.created_at DESC`,
    [bookId]
  );
  return rows;
};

export const upsertRating = async (userId, bookId, { rating, review = null }) => {
  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw new AppError('Rating harus berupa angka bulat antara 1 sampai 5.', 400);
  }

  const [books] = await pool.query('SELECT id FROM books WHERE id = ?', [bookId]);
  if (books.length === 0) {
    throw new AppError('Buku tidak ditemukan.', 404);
  }

  const [existing] = await pool.query(
    'SELECT id FROM book_ratings WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  );

  let ratingId;
  if (existing.length > 0) {
    ratingId = existing[0].id;
    await pool.query(
      'UPDATE book_ratings SET rating = ?, review = ? WHERE id = ?',
      [parsedRating, review, ratingId]
    );
  } else {
    ratingId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO book_ratings (id, user_id, book_id, rating, review) VALUES (?, ?, ?, ?, ?)',
      [ratingId, userId, bookId, parsedRating, review]
    );
  }

  const [rows] = await pool.query(
    `SELECT br.*, u.full_name, u.username
     FROM book_ratings br
     JOIN users u ON u.id = br.user_id
     WHERE br.id = ?`,
    [ratingId]
  );
  return rows[0];
};

export const deleteRating = async (ratingId, actor) => {
  const [rows] = await pool.query('SELECT * FROM book_ratings WHERE id = ?', [ratingId]);
  if (rows.length === 0) {
    throw new AppError('Rating tidak ditemukan.', 404);
  }
  if (actor.role !== 'admin' && rows[0].user_id !== actor.id) {
    throw new AppError('Anda tidak memiliki izin untuk menghapus rating ini.', 403);
  }
  await pool.query('DELETE FROM book_ratings WHERE id = ?', [ratingId]);
  return { id: ratingId };
};
