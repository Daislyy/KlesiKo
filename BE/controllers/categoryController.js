import * as categoryService from '../services/categoryService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, {
    message: 'Daftar kategori berhasil diambil.',
    data: categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  sendSuccess(res, {
    message: 'Detail kategori berhasil diambil.',
    data: category,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Kategori berhasil ditambahkan.',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, {
    message: 'Kategori berhasil diperbarui.',
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, {
    message: 'Kategori berhasil dihapus.',
    data: result,
  });
});
