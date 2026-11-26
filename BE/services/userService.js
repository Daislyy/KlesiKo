import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getAllUsers = async ({ search, role, is_active } = {}) => {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(full_name LIKE ? OR username LIKE ? OR email LIKE ?)');
    const kw = `%${search}%`;
    params.push(kw, kw, kw);
  }
  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }
  if (is_active !== undefined && is_active !== '') {
    conditions.push('is_active = ?');
    params.push(is_active === 'true' || is_active === true ? 1 : 0);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, profile_image_url, bio, is_active, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC`,
    params
  );
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, profile_image_url, bio, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new AppError('Anggota tidak ditemukan.', 404);
  }
  return rows[0];
};

export const updateUser = async (id, { full_name, role, is_active, bio }) => {
  await getUserById(id);

  const fields = [];
  const values = [];

  if (full_name !== undefined) {
    fields.push('full_name = ?');
    values.push(full_name);
  }
  if (role !== undefined) {
    if (!['admin', 'user'].includes(role)) {
      throw new AppError('Role harus bernilai admin atau user.', 400);
    }
    fields.push('role = ?');
    values.push(role);
  }
  if (is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(Boolean(is_active));
  }
  if (bio !== undefined) {
    fields.push('bio = ?');
    values.push(bio);
  }

  if (fields.length === 0) {
    throw new AppError('Tidak ada data yang diperbarui.', 400);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return getUserById(id);
};

export const deleteUser = async (id) => {
  await getUserById(id);
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return { id };
};
