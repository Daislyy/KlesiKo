import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import { pool } from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Token autentikasi wajib disertakan.', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'klesiko_dev_secret_change_me');

    const [rows] = await pool.query(
      'SELECT id, full_name, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return next(new AppError('Pengguna tidak ditemukan.', 401));
    }

    if (!rows[0].is_active) {
      return next(new AppError('Akun tidak aktif. Hubungi admin.', 403));
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Sesi telah berakhir. Silakan masuk kembali.', 401));
    }
    return next(new AppError('Token tidak valid.', 401));
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Anda tidak memiliki izin untuk mengakses resource ini.', 403));
  }
  next();
};
