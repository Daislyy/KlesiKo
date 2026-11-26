import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/appError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVER_DIR = path.join(__dirname, '..', 'uploads', 'covers');

const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

// Menyimpan cover buku dari data URL base64 ke folder uploads/covers.
// Mengembalikan path relatif, misal: /uploads/covers/abc.jpg
export const saveCover = async (dataUrl) => {
  const match = /^data:(image\/[a-z]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) {
    throw new AppError('Format gambar tidak valid.', 400);
  }

  const [, mimeType, base64] = match;
  const extension = ALLOWED_TYPES[mimeType];
  if (!extension) {
    throw new AppError('Cover harus berformat JPG, PNG, atau WEBP.', 400);
  }

  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > MAX_SIZE) {
    throw new AppError('Ukuran cover maksimal 2 MB.', 400);
  }

  await fs.mkdir(COVER_DIR, { recursive: true });
  const fileName = `${crypto.randomUUID()}.${extension}`;
  await fs.writeFile(path.join(COVER_DIR, fileName), buffer);

  return `/uploads/covers/${fileName}`;
};
