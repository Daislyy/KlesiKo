export const sendSuccess = (res, { statusCode = 200, message = 'Berhasil', data = null, meta = null } = {}) => {
  const payload = {
    success: true,
    message,
    data,
  };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
