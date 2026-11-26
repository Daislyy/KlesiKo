"use client";

import { motion } from "framer-motion";
import type { BookItem } from "@/types/library";
import { UserBookCard } from "./UserBookCard";

interface UserFeaturedBooksProps {
  books: BookItem[];
  onBorrow: (book: BookItem) => void;
  onSelectDetail: (book: BookItem) => void;
}

// Sesuai PRD Section 3C: Featured Books menampilkan beberapa buku unggulan dari database.
export function UserFeaturedBooks({
  books,
  onBorrow,
  onSelectDetail,
}: UserFeaturedBooksProps) {
  if (books.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-4 border-black pb-3">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5">
            Pilihan Pustaka
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
            Buku Unggulan
          </h2>
        </div>
        <a
          href="#katalog"
          className="text-xs font-black uppercase underline hover:text-blue-600"
        >
          Lihat Seluruh Katalog &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.slice(0, 4).map((book, index) => (
          <UserBookCard
            key={book.id}
            book={book}
            index={index}
            onBorrow={onBorrow}
            onSelectDetail={onSelectDetail}
          />
        ))}
      </div>
    </motion.section>
  );
}
