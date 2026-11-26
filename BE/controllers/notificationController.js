import * as notificationService from '../services/notificationService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Daftar notifikasi berhasil diambil.',
    data: notifications,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);
  sendSuccess(res, {
    message: 'Notifikasi ditandai sudah dibaca.',
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  sendSuccess(res, {
    message: 'Semua notifikasi ditandai sudah dibaca.',
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id, req.user.id);
  sendSuccess(res, {
    message: 'Notifikasi berhasil dihapus.',
    data: result,
  });
});
