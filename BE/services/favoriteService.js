import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getUserFavorites = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
       f.id AS favorite_id,
       f.created_at AS favorited_at,
       b.*,
       c.name AS category_name
     FROM favorites f
     JOIN books b ON b.id = f.book_id
     LEFT JOIN categories c ON c.id = b.category_id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
};

export const addFavorite = async (userId, bookId) => {
  if (!bookId) {
    throw new AppError('ID buku wajib diisi.', 400);
  }

  const [books] = await pool.query('SELECT id FROM books WHERE id = ?', [bookId]);
  if (books.length === 0) {
    throw new AppError('Buku tidak ditemukan.', 404);
  }

  const [existing] = await pool.query(
    'SELECT id FROM favorites WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  );
  if (existing.length > 0) {
    throw new AppError('Buku sudah ada di daftar favorit.', 409);
  }

  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO favorites (id, user_id, book_id) VALUES (?, ?, ?)',
    [id, userId, bookId]
  );
  return { id, user_id: userId, book_id: bookId };
};

export const removeFavorite = async (userId, bookId) => {
  const [result] = await pool.query(
    'DELETE FROM favorites WHERE user_id = ? AND book_id = ?',
    [userId, bookId]
  );
  if (result.affectedRows === 0) {
    throw new AppError('Buku tidak ada di daftar favorit.', 404);
  }
  return { book_id: bookId };
};
