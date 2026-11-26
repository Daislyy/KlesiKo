"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Calendar, Layers, X } from "lucide-react";
import type { BookItem } from "@/types/library";
import { NeoButton } from "./NeoButton";
import { LOAN_DAYS, estimateReturnDate, formatDate } from "@/utils/format";

interface BorrowConfirmModalProps {
  book: BookItem | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: (book: BookItem) => void;
}

// Sesuai PRD Section 7 Step 2: Modal konfirmasi sebelum permintaan peminjaman dikirim.
export function BorrowConfirmModal({
  book,
  submitting,
  onClose,
  onConfirm,
}: BorrowConfirmModalProps) {
  if (!book) return null;

  const today = new Date();
  const dueDate = estimateReturnDate(today);

  return (
    <AnimatePresence>
      <div className="neo-modal-overlay" onClick={onClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.18 }}
          className="neo-modal-content p-6 sm:p-8 max-w-lg w-full relative"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 p-2 border-3 border-black bg-[#FFE814] shadow-[3px_3px_0px_#000] hover:bg-yellow-400 cursor-pointer"
          >
            <X size={18} strokeWidth={3} />
          </button>

          <div className="border-b-4 border-black pb-3 mb-5">
            <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5">
              Konfirmasi Peminjaman
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight mt-1">
              Ajukan Peminjaman Buku
            </h2>
          </div>

          {/* Ringkasan buku */}
          <div className="border-3 border-black bg-[#FFFDF9] p-4 shadow-[4px_4px_0px_#000] flex gap-4 items-start">
            <div className="w-20 h-28 border-2 border-black bg-[#FFE814] shrink-0 flex items-center justify-center overflow-hidden">
              {book.coverImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen size={24} strokeWidth={2.5} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {book.category && (
                <span className="inline-block bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 mb-1">
                  {book.category}
                </span>
              )}
              <h3 className="text-lg font-black uppercase leading-snug">{book.title}</h3>
              <p className="text-xs font-bold text-neutral-600 mt-0.5">
                Penulis: {book.author}
              </p>
            </div>
          </div>

          {/* Detail jadwal & jumlah */}
          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="border-2 border-black bg-white p-3">
              <span className="text-[10px] font-black uppercase text-neutral-500 flex items-center gap-1">
                <Layers size={12} /> Jumlah
              </span>
              <span className="text-sm font-black mt-1 block">1 Buku</span>
            </div>

            <div className="border-2 border-black bg-white p-3">
              <span className="text-[10px] font-black uppercase text-neutral-500 flex items-center gap-1">
                <Calendar size={12} /> Tgl Pinjam
              </span>
              <span className="text-xs font-black mt-1 block">{formatDate(today)}</span>
            </div>

            <div className="border-2 border-black bg-[#FFE814]/40 p-3">
              <span className="text-[10px] font-black uppercase text-neutral-600 flex items-center gap-1">
                <Calendar size={12} /> Batas Kembali
              </span>
              <span className="text-xs font-black mt-1 block">
                {formatDate(dueDate)} ({LOAN_DAYS} hari)
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-neutral-700 bg-neutral-100 border-2 border-black p-3 mb-5">
            Permintaan akan dikirim ke dashboard admin dengan status{" "}
            <strong className="uppercase">pending</strong>. Stok buku baru dikurangi setelah
            disetujui oleh petugas.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t-3 border-black">
            <NeoButton
              type="button"
              variant="default"
              disabled={submitting}
              onClick={onClose}
              className="py-2.5 px-4 text-xs"
            >
              Batalkan
            </NeoButton>
            <NeoButton
              type="button"
              variant="primary"
              disabled={submitting}
              onClick={() => onConfirm(book)}
              className="py-2.5 px-5 text-xs font-black"
            >
              {submitting ? "Mengirim..." : "Ya, Ajukan Peminjaman"}
            </NeoButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
