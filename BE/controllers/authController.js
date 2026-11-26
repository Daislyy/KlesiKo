import * as authService from '../services/authService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Registrasi berhasil.',
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendSuccess(res, {
    message: 'Login berhasil.',
    data: result,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  sendSuccess(res, {
    message: 'Profil berhasil diambil.',
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Profil berhasil diperbarui.',
    data: user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Password berhasil diubah.',
  });
});
