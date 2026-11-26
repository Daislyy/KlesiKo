"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Bookmark, CheckCircle2, UserPlus } from "lucide-react";
import type { BookItem, User } from "@/types/library";
import { NeoButton } from "@/components/NeoButton";
import { NeoBadge } from "@/components/NeoBadge";

interface UserHeroProps {
  user: User | null;
  books: BookItem[];
  totalBooks: number;
  activeLoanCount: number;
  onExploreCatalog: () => void;
  onOpenRegister: () => void;
  onOpenMyLoans: () => void;
  onSelectDetail: (book: BookItem) => void;
  onBorrow: (book: BookItem) => void;
}

export function UserHero({
  user,
  books,
  totalBooks,
  activeLoanCount,
  onExploreCatalog,
  onOpenRegister,
  onOpenMyLoans,
  onSelectDetail,
  onBorrow,
}: UserHeroProps) {
  const spotlightBook = books[0] || null;
  const totalStock = books.reduce((sum, b) => sum + b.stock, 0);
  const availableCount = books.filter((b) => b.availableStock > 0).length;

  return (
    <section id="beranda" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Kolom Kiri: Headline & CTA */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="lg:col-span-7 neo-card p-6 sm:p-10 flex flex-col justify-between gap-8 bg-white relative overflow-hidden"
      >
        <div className="flex flex-col gap-4 z-10">
          <div className="flex items-center gap-3 flex-wrap">
            {user ? (
              <span className="sticker sticker--green">
                <CheckCircle2 size={14} strokeWidth={2.8} />
                Halo, {user.fullName || user.username}
              </span>
            ) : (
              <span className="sticker sticker--pink">
                <BookOpen size={14} strokeWidth={2.8} /> Perpustakaan KlesiKo
              </span>
            )}
            <span className="sticker sticker--yellow">
              <CheckCircle2 size={14} strokeWidth={2.8} /> Data Katalog Real-Time
            </span>
          </div>

          <h1 className="text-black font-black uppercase text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none mt-1">
            Katalog Pustaka & <br />
            <span className="bg-[#FFE814] px-3 py-1 border-4 border-black inline-block mt-2 shadow-[5px_5px_0px_#000]">
              Sirkulasi Buku
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-neutral-800 max-w-xl leading-relaxed">
            KlesiKo memudahkan pengunjung menelusuri katalog buku perpustakaan, memeriksa
            ketersediaan stok di rak, dan mengajukan peminjaman buku secara terstruktur.
          </p>

          <div className="flex items-center gap-4 flex-wrap mt-2">
            <NeoButton
              variant="primary"
              className="text-sm sm:text-base py-3.5 px-6"
              onClick={onExploreCatalog}
            >
              <span>Lihat Katalog Buku</span>
              <ArrowRight size={18} strokeWidth={2.8} />
            </NeoButton>

            {user ? (
              <NeoButton
                variant="accent"
                className="text-sm sm:text-base py-3.5 px-6"
                onClick={onOpenMyLoans}
              >
                <span>Riwayat Pinjaman ({activeLoanCount})</span>
              </NeoButton>
            ) : (
              <NeoButton
                variant="accent"
                className="text-sm sm:text-base py-3.5 px-6"
                onClick={onOpenRegister}
              >
                <UserPlus size={18} strokeWidth={2.8} />
                <span>Daftar Anggota</span>
              </NeoButton>
            )}
          </div>
        </div>

        {/* Statistik Real Database */}
        <div className="grid grid-cols-3 border-4 border-black bg-[#FFFDF9] shadow-[5px_5px_0px_#000] z-10 divide-x-4 divide-black">
          <div className="p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-4xl font-black">{totalBooks}</div>
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-700">
              Judul Koleksi
            </div>
          </div>
          <div className="p-3 sm:p-4 text-center bg-[#00E575]/20">
            <div className="text-2xl sm:text-4xl font-black text-green-700">
              {availableCount}
            </div>
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-700">
              Tersedia di Rak
            </div>
          </div>
          <div className="p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-4xl font-black">{totalStock}</div>
            <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-700">
              Total Eksemplar
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kolom Kanan: Sorotan Buku Terbaru dari Database */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="lg:col-span-5 flex flex-col"
      >
        <div className="neo-card p-6 bg-[#2A52FF] text-white border-4 flex flex-col justify-between flex-1">
          <div className="flex items-center justify-between border-b-2 border-white pb-3">
            <div className="flex items-center gap-2">
              <Bookmark className="text-yellow-300" size={20} strokeWidth={2.8} />
              <span className="font-black uppercase tracking-widest text-xs sm:text-sm">
                Koleksi Buku Terbaru
              </span>
            </div>
            <span className="bg-[#FFE814] text-black px-2 py-0.5 text-xs font-black border border-black">
              SOROTAN
            </span>
          </div>

          {spotlightBook ? (
            <div className="my-5 bg-white text-black p-5 border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                {/* Foto Cover Buku dari Database */}
                <div
                  onClick={() => onSelectDetail(spotlightBook)}
                  className="w-24 h-36 border-3 border-black bg-[#FFE814] shrink-0 flex items-center justify-center overflow-hidden shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  {spotlightBook.coverImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={spotlightBook.coverImageUrl}
                      alt={spotlightBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-4xl text-black">
                      {spotlightBook.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">
                      {spotlightBook.category || "Umum"}
                    </span>
                    <NeoBadge
                      status={spotlightBook.availableStock > 0 ? "tersedia" : "habis"}
                    />
                  </div>

                  <h3
                    onClick={() => onSelectDetail(spotlightBook)}
                    className="text-lg sm:text-xl font-black uppercase mt-2 leading-tight cursor-pointer hover:text-blue-600"
                  >
                    {spotlightBook.title}
                  </h3>

                  <p className="text-xs font-bold text-neutral-600 mt-1">
                    Penulis: {spotlightBook.author}
                    {spotlightBook.publishedYear ? ` • ${spotlightBook.publishedYear}` : ""}
                  </p>

                  {spotlightBook.description && (
                    <p className="text-xs text-neutral-700 font-medium line-clamp-2 mt-2">
                      {spotlightBook.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-neutral-200 gap-2">
                <span className="text-xs font-black">
                  Stok Tersedia:{" "}
                  <strong className="text-blue-600">{spotlightBook.availableStock}</strong> /{" "}
                  {spotlightBook.stock}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectDetail(spotlightBook)}
                    className="text-xs font-black uppercase underline cursor-pointer hover:text-blue-600"
                  >
                    Detail
                  </button>
                  {spotlightBook.availableStock > 0 && (
                    <button
                      type="button"
                      onClick={() => onBorrow(spotlightBook)}
                      className="bg-[#FFE814] text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                    >
                      Pinjam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="my-6 bg-white text-black p-6 border-4 border-black shadow-[6px_6px_0px_#000] text-center">
              <p className="text-sm font-black uppercase">Belum Ada Buku di Database</p>
              <p className="text-xs font-semibold text-neutral-600 mt-1">
                Masuk sebagai admin untuk menambahkan koleksi buku beserta foto sampulnya.
              </p>
            </div>
          )}

          <div className="bg-black/30 p-3 border-2 border-white/40 text-xs font-medium text-white/90">
            Seluruh data buku dan sampul pada halaman ini terhubung langsung dengan database
            MySQL KlesiKo.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export { UserHero as NeoHeroSection };
