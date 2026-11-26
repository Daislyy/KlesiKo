export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server.';

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Data sudah terdaftar dan tidak boleh duplikat.';
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'Data masih berelasi dengan data lain atau referensi tidak ditemukan.';
  } else if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    statusCode = 400;
    message = 'Nilai data tidak memenuhi aturan validasi database.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
