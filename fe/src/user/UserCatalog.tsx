"use client";

import { motion } from "framer-motion";
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import type { BookItem, CategoryItem, PageMeta } from "@/types/library";
import { UserBookCard } from "./UserBookCard";
import { NeoButton } from "@/components/NeoButton";

interface UserCatalogProps {
  books: BookItem[];
  categories: CategoryItem[];
  meta: PageMeta;
  loading: boolean;
  search: string;
  selectedCategoryId: string;
  onlyAvailable: boolean;
  onChangeSearch: (value: string) => void;
  onChangeCategory: (categoryId: string) => void;
  onToggleAvailable: () => void;
  onChangePage: (page: number) => void;
  onResetFilter: () => void;
  onBorrow: (book: BookItem) => void;
  onSelectDetail: (book: BookItem) => void;
}

// Sesuai PRD Section 5: Pencarian (judul, penulis, ISBN), filter kategori & ketersediaan,
// serta pagination yang terhubung ke API backend.
export function UserCatalog({
  books,
  categories,
  meta,
  loading,
  search,
  selectedCategoryId,
  onlyAvailable,
  onChangeSearch,
  onChangeCategory,
  onToggleAvailable,
  onChangePage,
  onResetFilter,
  onBorrow,
  onSelectDetail,
}: UserCatalogProps) {
  const hasFilter = search !== "" || selectedCategoryId !== "" || onlyAvailable;

  return (
    <motion.section
      id="katalog"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-black pb-4">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5">
            Koleksi Buku
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1">
            Katalog Perpustakaan
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-black bg-[#FFE814] px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
            {meta.total} Buku Ditemukan
          </span>
          {hasFilter && (
            <NeoButton
              variant="default"
              className="py-1 px-3 text-xs"
              onClick={onResetFilter}
            >
              <RotateCcw size={13} strokeWidth={2.5} />
              <span>Reset Filter</span>
            </NeoButton>
          )}
        </div>
      </div>

      {/* Form Pencarian & Filter */}
      <div className="neo-card p-5 bg-[#FFFDF9] flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="Cari judul buku, penulis, atau nomor ISBN..."
              className="neo-input pl-11 text-sm sm:text-base font-bold placeholder:text-neutral-500"
            />
            <Search
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black pointer-events-none"
              strokeWidth={2.5}
            />
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="button"
              onClick={onToggleAvailable}
              className={`w-full py-3 px-4 border-3 border-black font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_#000] ${
                onlyAvailable
                  ? "bg-[#00E575] text-black"
                  : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              <BookOpenCheck size={18} strokeWidth={2.5} />
              <span>{onlyAvailable ? "Filter: Stok Tersedia" : "Tampilkan Stok Tersedia"}</span>
            </button>
          </div>
        </div>

        {/* Pil Kategori */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t-2 border-neutral-200">
          <span className="text-xs font-black uppercase flex items-center gap-1 mr-2 text-neutral-600">
            <Filter size={13} strokeWidth={2.5} />
            Kategori:
          </span>

          <button
            type="button"
            onClick={() => onChangeCategory("")}
            className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
              selectedCategoryId === ""
                ? "bg-[#2A52FF] text-white shadow-[2px_2px_0px_#000]"
                : "bg-white text-black hover:bg-[#FFE814]"
            }`}
          >
            Semua
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                selectedCategoryId === cat.id
                  ? "bg-[#2A52FF] text-white shadow-[2px_2px_0px_#000]"
                  : "bg-white text-black hover:bg-[#FFE814]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Buku */}
      {loading ? (
        <div className="neo-card p-12 text-center bg-white font-black uppercase text-sm">
          Memuat katalog buku dari database...
        </div>
      ) : books.length === 0 ? (
        <div className="neo-card p-12 text-center bg-white flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 bg-[#FFE814] border-3 border-black flex items-center justify-center font-black text-3xl shadow-[4px_4px_0px_#000]">
            ?
          </div>
          <h3 className="text-2xl font-black uppercase mt-2">Tidak Ada Buku</h3>
          <p className="text-neutral-700 text-sm font-semibold max-w-md">
            {hasFilter
              ? "Tidak ditemukan buku yang sesuai dengan kata kunci atau filter kategori."
              : "Belum ada koleksi buku di database. Silakan masuk sebagai admin untuk menambahkan buku."}
          </p>
          {hasFilter && (
            <NeoButton variant="accent" onClick={onResetFilter} className="mt-2">
              Tampilkan Semua Buku
            </NeoButton>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <UserBookCard
                key={book.id}
                book={book}
                index={index}
                onBorrow={onBorrow}
                onSelectDetail={onSelectDetail}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <NeoButton
                variant="default"
                disabled={meta.page <= 1}
                onClick={() => onChangePage(meta.page - 1)}
                className="py-2 px-3 text-xs"
              >
                <ChevronLeft size={15} />
                <span>Sebelumnya</span>
              </NeoButton>

              <span className="text-xs font-black uppercase px-3 py-2 border-2 border-black bg-white">
                Halaman {meta.page} dari {meta.total_pages}
              </span>

              <NeoButton
                variant="default"
                disabled={meta.page >= meta.total_pages}
                onClick={() => onChangePage(meta.page + 1)}
                className="py-2 px-3 text-xs"
              >
                <span>Berikutnya</span>
                <ChevronRight size={15} />
              </NeoButton>
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}

export { UserCatalog as NeoCatalogSection };
