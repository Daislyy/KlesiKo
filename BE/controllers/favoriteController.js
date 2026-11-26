import * as favoriteService from '../services/favoriteService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getMyFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getUserFavorites(req.user.id);
  sendSuccess(res, {
    message: 'Daftar buku favorit berhasil diambil.',
    data: favorites,
  });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const bookId = req.body.book_id || req.params.bookId;
  const favorite = await favoriteService.addFavorite(req.user.id, bookId);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Buku ditambahkan ke favorit.',
    data: favorite,
  });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const result = await favoriteService.removeFavorite(req.user.id, req.params.bookId);
  sendSuccess(res, {
    message: 'Buku dihapus dari favorit.',
    data: result,
  });
});
