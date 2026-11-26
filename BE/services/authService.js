import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'klesiko_dev_secret_change_me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async ({ full_name, username, email, password }) => {
  if (!full_name || !username || !email || !password) {
    throw new AppError('Nama lengkap, username, email, dan password wajib diisi.', 400);
  }
  if (password.length < 6) {
    throw new AppError('Password minimal 6 karakter.', 400);
  }

  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ? OR username = ?',
    [email, username]
  );
  if (existing.length > 0) {
    throw new AppError('Email atau username sudah digunakan.', 409);
  }

  const id = crypto.randomUUID();
  const password_hash = await bcrypt.hash(password, 10);

  // Registrasi publik selalu menjadi anggota (user). Akun admin dibuat langsung di database.
  await pool.query(
    `INSERT INTO users (id, full_name, username, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?, 'user')`,
    [id, full_name, username, email, password_hash]
  );

  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, profile_image_url, bio, is_active, created_at
     FROM users WHERE id = ?`,
    [id]
  );

  const user = rows[0];
  const token = signToken(user);
  return { user, token };
};

export const login = async ({ identifier, email, username, password }) => {
  const loginKey = identifier || email || username;
  if (!loginKey || !password) {
    throw new AppError('Email/username dan password wajib diisi.', 400);
  }

  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, password_hash, role, profile_image_url, bio, is_active, created_at
     FROM users WHERE email = ? OR username = ? LIMIT 1`,
    [loginKey, loginKey]
  );

  if (rows.length === 0) {
    throw new AppError('Email/username atau password salah.', 401);
  }

  const userRecord = rows[0];
  if (!userRecord.is_active) {
    throw new AppError('Akun Anda tidak aktif. Hubungi admin.', 403);
  }

  const isMatch = await bcrypt.compare(password, userRecord.password_hash);
  if (!isMatch) {
    throw new AppError('Email/username atau password salah.', 401);
  }

  const { password_hash, ...user } = userRecord;
  const token = signToken(user);
  return { user, token };
};

export const getProfile = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, profile_image_url, profile_image_path, bio, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [userId]
  );
  if (rows.length === 0) {
    throw new AppError('Pengguna tidak ditemukan.', 404);
  }
  return rows[0];
};

export const updateProfile = async (userId, { full_name, username, bio, profile_image_url, profile_image_path }) => {
  const fields = [];
  const values = [];

  if (full_name !== undefined) {
    fields.push('full_name = ?');
    values.push(full_name);
  }
  if (username !== undefined) {
    fields.push('username = ?');
    values.push(username);
  }
  if (bio !== undefined) {
    fields.push('bio = ?');
    values.push(bio);
  }
  if (profile_image_url !== undefined) {
    fields.push('profile_image_url = ?');
    values.push(profile_image_url);
  }
  if (profile_image_path !== undefined) {
    fields.push('profile_image_path = ?');
    values.push(profile_image_path);
  }

  if (fields.length === 0) {
    throw new AppError('Tidak ada data yang diperbarui.', 400);
  }

  values.push(userId);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return getProfile(userId);
};

export const changePassword = async (userId, { current_password, new_password }) => {
  if (!current_password || !new_password) {
    throw new AppError('Password lama dan password baru wajib diisi.', 400);
  }
  if (new_password.length < 6) {
    throw new AppError('Password baru minimal 6 karakter.', 400);
  }

  const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
  if (rows.length === 0) {
    throw new AppError('Pengguna tidak ditemukan.', 404);
  }

  const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
  if (!isMatch) {
    throw new AppError('Password lama tidak sesuai.', 400);
  }

  const newHash = await bcrypt.hash(new_password, 10);
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
  return true;
};
