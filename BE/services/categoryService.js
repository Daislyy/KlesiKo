import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getAllCategories = async () => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(b.id) AS total_books
     FROM categories c
     LEFT JOIN books b ON b.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
  return rows;
};

export const getCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new AppError('Kategori tidak ditemukan.', 404);
  }
  return rows[0];
};

export const createCategory = async ({ name, description = null }) => {
  if (!name || !name.trim()) {
    throw new AppError('Nama kategori wajib diisi.', 400);
  }
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
    [id, name.trim(), description]
  );
  return getCategoryById(id);
};

export const updateCategory = async (id, { name, description }) => {
  await getCategoryById(id);
  const fields = [];
  const values = [];

  if (name !== undefined) {
    if (!name.trim()) throw new AppError('Nama kategori wajib diisi.', 400);
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
  await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
  return getCategoryById(id);
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);

  const [usage] = await pool.query('SELECT COUNT(*) AS total FROM books WHERE category_id = ?', [id]);
  if (usage[0].total > 0) {
    throw new AppError(
      `Kategori masih dipakai oleh ${usage[0].total} buku. Pindahkan buku ke kategori lain terlebih dahulu.`,
      400
    );
  }

  await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return { id };
};
