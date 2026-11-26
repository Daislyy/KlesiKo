"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Layers, Star } from "lucide-react";
import type { BookItem } from "@/types/library";
import { NeoBadge } from "@/components/NeoBadge";
import { NeoButton } from "@/components/NeoButton";

const COVER_COLORS = [
  "bg-[#FFE814]",
  "bg-[#00E575]",
  "bg-[#00D2FF]",
  "bg-[#FF4D8D]",
  "bg-[#FF6B35]",
];

interface UserBookCardProps {
  book: BookItem;
  index: number;
  onBorrow: (book: BookItem) => void;
  onSelectDetail: (book: BookItem) => void;
}

export function UserBookCard({
  book,
  index,
  onBorrow,
  onSelectDetail,
}: UserBookCardProps) {
  const isAvailable = book.availableStock > 0;
  const coverBg = COVER_COLORS[index % COVER_COLORS.length];
  const initial = book.title.trim().charAt(0).toUpperCase() || "K";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, delay: (index % 8) * 0.04 }}
      whileHover={{ y: -4 }}
      className="neo-card p-4 flex flex-col justify-between group overflow-hidden bg-white"
    >
      <div>
        {/* Sampul Buku */}
        <div
          className={`book-cover-art ${coverBg} cursor-pointer relative`}
          onClick={() => onSelectDetail(book)}
        >
          {book.coverImageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          ) : (
            <div className="book-cover-pattern" />
          )}

          <div className="flex justify-between items-start z-10">
            <span className="bg-black text-white text-[11px] font-black uppercase px-2 py-0.5 border border-white shadow-[2px_2px_0px_#000]">
              {book.category || "Umum"}
            </span>
            <span className="bg-white p-1 border-2 border-black shadow-[2px_2px_0px_#000]">
              <ArrowUpRight size={15} strokeWidth={3} />
            </span>
          </div>

          {!book.coverImageUrl && (
            <div className="flex items-end justify-between z-10">
              <span className="book-cover-initial">{initial}</span>
              {book.publishedYear && (
                <span className="text-[10px] font-black uppercase bg-white text-black px-1.5 py-0.5 border border-black">
                  {book.publishedYear}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Informasi Buku */}
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <NeoBadge status={isAvailable ? "tersedia" : "habis"} />
            <span className="text-xs font-black tracking-tight flex items-center gap-1 bg-neutral-100 border border-black px-2 py-0.5">
              <Layers size={13} strokeWidth={2.5} />
              {book.availableStock} / {book.stock} Stok
            </span>
          </div>

          <h3
            className="text-lg font-black uppercase tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer mt-1"
            onClick={() => onSelectDetail(book)}
          >
            {book.title}
          </h3>
          <p className="text-xs font-semibold text-neutral-700 line-clamp-1">
            Penulis: <span className="font-bold text-black">{book.author}</span>
          </p>

          {book.totalRatings > 0 && (
            <div className="flex items-center gap-1 text-xs font-black text-neutral-800 mt-0.5">
              <Star size={13} className="fill-[#FFE814] text-black" />
              <span>{book.averageRating.toFixed(1)}</span>
              <span className="text-neutral-500 font-semibold">
                ({book.totalRatings} ulasan)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-4 pt-3 border-t-2 border-black flex items-center gap-2">
        <NeoButton
          variant={isAvailable ? "primary" : "default"}
          disabled={!isAvailable}
          fullWidth
          className="py-2.5 text-xs font-black"
          onClick={() => onBorrow(book)}
        >
          {isAvailable ? "Pinjam Buku" : "Tidak Tersedia"}
        </NeoButton>
        <NeoButton
          variant="accent"
          className="py-2.5 px-3 text-xs"
          onClick={() => onSelectDetail(book)}
          title="Detail Buku"
        >
          <BookOpen size={15} strokeWidth={2.8} />
        </NeoButton>
      </div>
    </motion.article>
  );
}

export { UserBookCard as NeoBookCard };
