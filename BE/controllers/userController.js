import * as userService from '../services/userService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  sendSuccess(res, {
    message: 'Daftar anggota berhasil diambil.',
    data: users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, {
    message: 'Detail anggota berhasil diambil.',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, {
    message: 'Data anggota berhasil diperbarui.',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  sendSuccess(res, {
    message: 'Anggota berhasil dihapus.',
    data: result,
  });
});
