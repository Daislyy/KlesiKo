import crypto from 'crypto';
import { pool } from '../config/database.js';
import { AppError } from '../utils/appError.js';

const VALID_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'borrowed',
  'returned',
  'overdue',
  'cancelled',
];

// Status di mana buku sedang "dipegang" peminjam (stok sudah dikurangi).
const STOCK_HELD_STATUSES = ['approved', 'borrowed', 'overdue'];

// Status akhir, tidak bisa diubah lagi.
const FINAL_STATUSES = ['returned', 'rejected', 'cancelled'];

const STATUS_MESSAGES = {
  approved: 'disetujui. Silakan ambil buku di meja sirkulasi',
  rejected: 'ditolak oleh petugas',
  borrowed: 'tercatat sudah diambil',
  returned: 'selesai, buku telah dikembalikan',
  overdue: 'melewati tanggal jatuh tempo',
  cancelled: 'dibatalkan',
};

export const LOAN_DAYS = 7;

const generateBorrowingCode = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BRW-${datePart}-${randomPart}`;
};

const createNotification = (conn, userId, title, message, referenceId) =>
  conn.query(
    `INSERT INTO notifications (id, user_id, title, message, type, reference_id)
     VALUES (?, ?, ?, ?, 'borrowing', ?)`,
    [crypto.randomUUID(), userId, title, message, referenceId]
  );

const attachItemsToBorrowings = async (borrowings) => {
  if (borrowings.length === 0) return [];
  const ids = borrowings.map((b) => b.id);
  const [items] = await pool.query(
    `SELECT
       bi.id,
       bi.borrowing_id,
       bi.book_id,
       bi.quantity,
       bi.returned_quantity,
       b.title,
       b.author,
       b.cover_image_url
     FROM borrowing_items bi
     JOIN books b ON b.id = bi.book_id
     WHERE bi.borrowing_id IN (?)`,
    [ids]
  );

  const itemMap = new Map();
  for (const item of items) {
    if (!itemMap.has(item.borrowing_id)) itemMap.set(item.borrowing_id, []);
    itemMap.get(item.borrowing_id).push(item);
  }

  return borrowings.map((b) => ({
    ...b,
    items: itemMap.get(b.id) || [],
  }));
};

// Kurangi stok saat peminjaman disetujui admin.
const takeStock = async (conn, items) => {
  for (const item of items) {
    const [rows] = await conn.query(
      'SELECT title, available_stock FROM books WHERE id = ? FOR UPDATE',
      [item.book_id]
    );
    const book = rows[0];
    if (!book || book.available_stock < item.quantity) {
      throw new AppError(`Stok buku "${book?.title || ''}" tidak mencukupi untuk disetujui.`, 400);
    }

    await conn.query(
      `UPDATE books
       SET available_stock = available_stock - ?,
           status = IF(available_stock = 0, 'unavailable', 'available')
       WHERE id = ?`,
      [item.quantity, item.book_id]
    );
  }
};

// Kembalikan stok saat buku dikembalikan / peminjaman dibatalkan setelah disetujui.
const releaseStock = async (conn, items, markReturned) => {
  for (const item of items) {
    const toRestore = item.quantity - item.returned_quantity;
    if (toRestore <= 0) continue;

    await conn.query(
      `UPDATE books
       SET available_stock = LEAST(stock, available_stock + ?),
           status = 'available'
       WHERE id = ?`,
      [toRestore, item.book_id]
    );

    if (markReturned) {
      await conn.query('UPDATE borrowing_items SET returned_quantity = quantity WHERE id = ?', [item.id]);
    }
  }
};

export const createBorrowing = async (userId, { items, book_id, quantity = 1, due_date, notes = null }) => {
  const borrowingItems = Array.isArray(items) && items.length > 0
    ? items
    : book_id
      ? [{ book_id, quantity }]
      : [];

  if (borrowingItems.length === 0) {
    throw new AppError('Minimal satu buku harus dipilih untuk dipinjam.', 400);
  }

  const dueDateObj = due_date
    ? new Date(due_date)
    : new Date(Date.now() + LOAN_DAYS * 24 * 60 * 60 * 1000);

  if (Number.isNaN(dueDateObj.getTime())) {
    throw new AppError('Format tanggal jatuh tempo tidak valid.', 400);
  }

  const borrowingId = crypto.randomUUID();
  const borrowingCode = generateBorrowingCode();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO borrowings (id, user_id, borrowing_code, due_date, status, notes)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [borrowingId, userId, borrowingCode, dueDateObj, notes]
    );

    for (const item of borrowingItems) {
      const qty = Number(item.quantity) || 1;
      if (!item.book_id || qty <= 0) {
        throw new AppError('ID buku dan jumlah pinjaman harus valid.', 400);
      }

      const [bookRows] = await conn.query(
        'SELECT id, title, available_stock FROM books WHERE id = ?',
        [item.book_id]
      );
      if (bookRows.length === 0) {
        throw new AppError('Buku tidak ditemukan.', 404);
      }

      const book = bookRows[0];
      if (book.available_stock < qty) {
        throw new AppError(`Stok buku "${book.title}" tidak mencukupi.`, 400);
      }

      // Sesuai PRD: stok TIDAK dikurangi saat status masih pending.
      await conn.query(
        `INSERT INTO borrowing_items (id, borrowing_id, book_id, quantity, returned_quantity)
         VALUES (?, ?, ?, ?, 0)`,
        [crypto.randomUUID(), borrowingId, book.id, qty]
      );
    }

    await createNotification(
      conn,
      userId,
      'Permintaan peminjaman diajukan',
      `Peminjaman ${borrowingCode} berhasil diajukan dan menunggu persetujuan petugas.`,
      borrowingId
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getBorrowingById(borrowingId);
};

export const getAllBorrowings = async ({ status, user_id } = {}) => {
  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('br.status = ?');
    params.push(status);
  }
  if (user_id) {
    conditions.push('br.user_id = ?');
    params.push(user_id);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT
       br.*,
       u.full_name AS borrower_name,
       u.username AS borrower_username,
       u.email AS borrower_email,
       a.full_name AS approved_by_name
     FROM borrowings br
     JOIN users u ON u.id = br.user_id
     LEFT JOIN users a ON a.id = br.approved_by
     ${whereClause}
     ORDER BY br.created_at DESC`,
    params
  );

  return attachItemsToBorrowings(rows);
};

export const getBorrowingById = async (id) => {
  const [rows] = await pool.query(
    `SELECT
       br.*,
       u.full_name AS borrower_name,
       u.username AS borrower_username,
       u.email AS borrower_email,
       a.full_name AS approved_by_name
     FROM borrowings br
     JOIN users u ON u.id = br.user_id
     LEFT JOIN users a ON a.id = br.approved_by
     WHERE br.id = ?`,
    [id]
  );

  if (rows.length === 0) {
    throw new AppError('Data peminjaman tidak ditemukan.', 404);
  }

  const [borrowing] = await attachItemsToBorrowings(rows);
  return borrowing;
};

export const updateBorrowingStatus = async (id, { status, notes }, actor) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new AppError(`Status peminjaman tidak valid. Pilihan: ${VALID_STATUSES.join(', ')}`, 400);
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query('SELECT * FROM borrowings WHERE id = ? FOR UPDATE', [id]);
    if (rows.length === 0) {
      throw new AppError('Data peminjaman tidak ditemukan.', 404);
    }

    const current = rows[0];

    if (FINAL_STATUSES.includes(current.status)) {
      throw new AppError('Peminjaman ini sudah selesai diproses.', 400);
    }

    // User biasa hanya boleh membatalkan peminjaman miliknya yang masih pending.
    if (actor.role !== 'admin') {
      if (current.user_id !== actor.id || status !== 'cancelled' || current.status !== 'pending') {
        throw new AppError('Anda hanya dapat membatalkan peminjaman sendiri yang masih pending.', 403);
      }
    }

    const [items] = await conn.query(
      'SELECT id, book_id, quantity, returned_quantity FROM borrowing_items WHERE borrowing_id = ?',
      [id]
    );

    const wasHeld = STOCK_HELD_STATUSES.includes(current.status);
    const willHold = STOCK_HELD_STATUSES.includes(status);

    if (!wasHeld && willHold) {
      await takeStock(conn, items);
    }
    if (wasHeld && !willHold) {
      await releaseStock(conn, items, status === 'returned');
    }

    const returnedAt = status === 'returned' ? new Date() : current.returned_at;
    const approvedBy =
      ['approved', 'borrowed', 'rejected'].includes(status) && actor.role === 'admin'
        ? actor.id
        : current.approved_by;

    await conn.query(
      `UPDATE borrowings
       SET status = ?, notes = COALESCE(?, notes), returned_at = ?, approved_by = ?
       WHERE id = ?`,
      [status, notes ?? null, returnedAt, approvedBy, id]
    );

    await createNotification(
      conn,
      current.user_id,
      'Status peminjaman diperbarui',
      `Peminjaman ${current.borrowing_code} ${STATUS_MESSAGES[status] || `berstatus ${status}`}.`,
      id
    );

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }

  return getBorrowingById(id);
};
