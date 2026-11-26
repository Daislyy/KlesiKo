import * as ratingService from '../services/ratingService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getBookRatings = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getBookRatings(req.params.bookId);
  sendSuccess(res, {
    message: 'Daftar ulasan buku berhasil diambil.',
    data: ratings,
  });
});

export const upsertRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.upsertRating(req.user.id, req.params.bookId, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Rating dan ulasan berhasil disimpan.',
    data: rating,
  });
});

export const deleteRating = asyncHandler(async (req, res) => {
  const result = await ratingService.deleteRating(req.params.id, req.user);
  sendSuccess(res, {
    message: 'Rating berhasil dihapus.',
    data: result,
  });
});
