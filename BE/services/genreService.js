import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getAllGenres = async () => {
  const [rows] = await pool.query(
    `SELECT g.*, COUNT(bg.book_id) AS total_books
     FROM genres g
     LEFT JOIN book_genres bg ON bg.genre_id = g.id
     GROUP BY g.id
     ORDER BY g.name ASC`
  );
  return rows;
};

export const getGenreById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM genres WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new AppError('Genre tidak ditemukan.', 404);
  }
  return rows[0];
};

export const createGenre = async ({ name, description = null }) => {
  if (!name || !name.trim()) {
    throw new AppError('Nama genre wajib diisi.', 400);
  }
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO genres (id, name, description) VALUES (?, ?, ?)',
    [id, name.trim(), description]
  );
  return getGenreById(id);
};

export const updateGenre = async (id, { name, description }) => {
  await getGenreById(id);
  const fields = [];
  const values = [];

  if (name !== undefined) {
    if (!name.trim()) throw new AppError('Nama genre wajib diisi.', 400);
    fields.push('name = ?');
    values.push(name.trim());
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }

  if (fields.length === 0) {
    throw new AppError('Tidak ada data yang diperbarui.', 400);
  }

  values.push(id);
  await pool.query(`UPDATE genres SET ${fields.join(', ')} WHERE id = ?`, values);
  return getGenreById(id);
};

export const deleteGenre = async (id) => {
  await getGenreById(id);
  await pool.query('DELETE FROM genres WHERE id = ?', [id]);
  return { id };
};
