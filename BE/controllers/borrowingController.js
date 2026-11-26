import * as borrowingService from '../services/borrowingService.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const createBorrowing = asyncHandler(async (req, res) => {
  const borrowing = await borrowingService.createBorrowing(req.user.id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Peminjaman berhasil dibuat.',
    data: borrowing,
  });
});

export const getAllBorrowings = asyncHandler(async (req, res) => {
  const borrowings = await borrowingService.getAllBorrowings(req.query);
  sendSuccess(res, {
    message: 'Daftar peminjaman berhasil diambil.',
    data: borrowings,
  });
});

export const getMyBorrowings = asyncHandler(async (req, res) => {
  const borrowings = await borrowingService.getAllBorrowings({
    ...req.query,
    user_id: req.user.id,
  });
  sendSuccess(res, {
    message: 'Daftar peminjaman Anda berhasil diambil.',
    data: borrowings,
  });
});

export const getBorrowingById = asyncHandler(async (req, res) => {
  const borrowing = await borrowingService.getBorrowingById(req.params.id);
  if (req.user.role !== 'admin' && borrowing.user_id !== req.user.id) {
    throw new AppError('Anda tidak memiliki izin melihat peminjaman ini.', 403);
  }
  sendSuccess(res, {
    message: 'Detail peminjaman berhasil diambil.',
    data: borrowing,
  });
});

export const updateBorrowingStatus = asyncHandler(async (req, res) => {
  const borrowing = await borrowingService.updateBorrowingStatus(
    req.params.id,
    req.body,
    req.user
  );
  sendSuccess(res, {
    message: 'Status peminjaman berhasil diperbarui.',
    data: borrowing,
  });
});
