"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, ClipboardCheck, ShieldCheck } from "lucide-react";

const POINTS = [
  {
    icon: BookOpen,
    title: "Katalog Terpusat",
    desc: "Seluruh informasi buku, penulis, penerbit, nomor ISBN, dan jumlah stok berasal langsung dari database perpustakaan.",
  },
  {
    icon: ClipboardCheck,
    title: "Persetujuan Terverifikasi",
    desc: "Setiap pengajuan peminjaman masuk ke daftar tunggu admin. Stok hanya dikurangi setelah permintaan disetujui petugas.",
  },
  {
    icon: ShieldCheck,
    title: "Pencatatan Sirkulasi",
    desc: "Setiap transaksi memiliki kode peminjaman unik serta tanggal jatuh tempo yang tercatat pada riwayat anggota.",
  },
];

// Sesuai PRD Section 3E: About Section menjelaskan singkat mengenai KlesiKo dan tujuan platform.
export function UserAboutSection() {
  return (
    <motion.section
      id="tentang"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="border-b-4 border-black pb-3">
        <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5">
          Tentang Platform
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
          Tentang KlesiKo
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 neo-card p-6 sm:p-8 bg-[#FFE814] flex flex-col justify-between gap-6">
          <div>
            <span className="inline-block bg-black text-white text-[11px] font-black uppercase px-2.5 py-1 mb-3">
              Sistem Manajemen Perpustakaan
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight leading-snug">
              Menghubungkan Koleksi Buku Fisik dengan Kemudahan Katalog Digital
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 leading-relaxed mt-3">
              KlesiKo adalah aplikasi perpustakaan berbasis web yang dirancang agar pengunjung
              dapat memeriksa ketersediaan buku sebelum datang ke meja sirkulasi, anggota dapat
              mengajukan peminjaman dengan tertib, dan pustakawan dapat mengelola stok buku secara
              akurat.
            </p>
          </div>

          <div className="border-t-3 border-black pt-4 flex items-center gap-2 text-xs font-black uppercase">
            <CheckCircle2 size={16} strokeWidth={2.8} />
            <span>Transparan • Terstruktur • Terverifikasi Petugas</span>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 gap-4">
          {POINTS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.06 }}
                className="neo-card p-5 bg-white flex items-start gap-4"
              >
                <div className="w-11 h-11 bg-[#2A52FF] text-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight">{p.title}</h4>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700 leading-relaxed mt-1">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
