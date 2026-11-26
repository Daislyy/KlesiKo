import * as bookService from '../services/bookService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getAllBooks = asyncHandler(async (req, res) => {
  const { books, meta } = await bookService.getAllBooks(req.query);
  sendSuccess(res, {
    message: 'Daftar buku berhasil diambil.',
    data: books,
    meta,
  });
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);
  sendSuccess(res, {
    message: 'Detail buku berhasil diambil.',
    data: book,
  });
});

export const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body, req.user?.id || null);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Buku berhasil ditambahkan.',
    data: book,
  });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  sendSuccess(res, {
    message: 'Buku berhasil diperbarui.',
    data: book,
  });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const result = await bookService.deleteBook(req.params.id);
  sendSuccess(res, {
    message: 'Buku berhasil dihapus.',
    data: result,
  });
});
