import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

export const getUserNotifications = async (userId, { unread_only } = {}) => {
  const conditions = ['user_id = ?'];
  const params = [userId];

  if (unread_only === 'true') {
    conditions.push('is_read = FALSE');
  }

  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC`,
    params
  );
  return rows;
};

export const markAsRead = async (notificationId, userId) => {
  const [result] = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [notificationId, userId]
  );
  if (result.affectedRows === 0) {
    throw new AppError('Notifikasi tidak ditemukan.', 404);
  }
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [notificationId]);
  return rows[0];
};

export const markAllAsRead = async (userId) => {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE', [
    userId,
  ]);
  return true;
};

export const deleteNotification = async (notificationId, userId) => {
  const [result] = await pool.query(
    'DELETE FROM notifications WHERE id = ? AND user_id = ?',
    [notificationId, userId]
  );
  if (result.affectedRows === 0) {
    throw new AppError('Notifikasi tidak ditemukan.', 404);
  }
  return { id: notificationId };
};
