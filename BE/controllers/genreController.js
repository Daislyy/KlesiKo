import * as genreService from '../services/genreService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getAllGenres = asyncHandler(async (req, res) => {
  const genres = await genreService.getAllGenres();
  sendSuccess(res, {
    message: 'Daftar genre berhasil diambil.',
    data: genres,
  });
});

export const getGenreById = asyncHandler(async (req, res) => {
  const genre = await genreService.getGenreById(req.params.id);
  sendSuccess(res, {
    message: 'Detail genre berhasil diambil.',
    data: genre,
  });
});

export const createGenre = asyncHandler(async (req, res) => {
  const genre = await genreService.createGenre(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Genre berhasil ditambahkan.',
    data: genre,
  });
});

export const updateGenre = asyncHandler(async (req, res) => {
  const genre = await genreService.updateGenre(req.params.id, req.body);
  sendSuccess(res, {
    message: 'Genre berhasil diperbarui.',
    data: genre,
  });
});

export const deleteGenre = asyncHandler(async (req, res) => {
  const result = await genreService.deleteGenre(req.params.id);
  sendSuccess(res, {
    message: 'Genre berhasil dihapus.',
    data: result,
  });
});
