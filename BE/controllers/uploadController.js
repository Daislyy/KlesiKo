import * as uploadService from '../services/uploadService.js';
import { asyncHandler, sendSuccess } from '../utils/response.js';

export const uploadCover = asyncHandler(async (req, res) => {
  const relativePath = await uploadService.saveCover(req.body.data);
  const url = `${req.protocol}://${req.get('host')}${relativePath}`;

  sendSuccess(res, {
    statusCode: 201,
    message: 'Cover berhasil diunggah.',
    data: { url },
  });
});
