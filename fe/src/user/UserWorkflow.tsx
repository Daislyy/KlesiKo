"use client";

import { motion } from "framer-motion";
import { Search, FileCheck, ClipboardList, RotateCcw } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Penelusuran Katalog",
    desc: "Cari judul buku berdasarkan pengarang, kategori, atau subjek pustaka dengan data ketersediaan rak waktu-nyata.",
    color: "bg-[#FFE814]",
    icon: Search,
  },
  {
    step: "02",
    title: "Permohonan Daring",
    desc: "Ajukan peminjaman buku yang berstatus tersedia langsung melalui portal anggota tanpa perlu antre formulir.",
    color: "bg-[#FF4D8D]",
    textColor: "text-white",
    icon: FileCheck,
  },
  {
    step: "03",
    title: "Validasi Pustakawan",
    desc: "Staf perpustakaan memverifikasi status keanggotaan dan menyiapkan eksemplar fisik di meja sirkulasi utama.",
    color: "bg-[#00E575]",
    icon: ClipboardList,
  },
  {
    step: "04",
    title: "Pengambilan & Sirkulasi",
    desc: "Ambil buku di gedung perpustakaan dengan masa pinjam 14 hari kerja. Pengembalian dapat dilakukan mandiri.",
    color: "bg-[#00D2FF]",
    icon: RotateCcw,
  },
];

export function UserWorkflow() {
  return (
    <section id="cara-kerja" className="flex flex-col gap-6 pt-4">
      <div className="flex items-center justify-between border-b-4 border-black pb-3">
        <div>
          <span className="bg-black text-white text-xs font-black uppercase px-2 py-0.5 tracking-wider">
            Prosedur Perpustakaan
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1 text-neutral-900">
            Alur Peminjaman & Sirkulasi
          </h2>
        </div>
        <span className="text-xs font-black uppercase bg-[#FFFDF9] border-2 border-black px-3 py-1 hidden sm:inline-block shadow-[2px_2px_0px_#000]">
          4 Tahap Standar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="neo-card p-5 flex flex-col justify-between bg-white relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`w-10 h-10 ${s.color} ${s.textColor || "text-black"} border-3 border-black font-black text-lg flex items-center justify-center shadow-[3px_3px_0px_#000]`}>
                    {s.step}
                  </span>
                  <div className="p-2 bg-neutral-100 border-2 border-black">
                    <Icon size={18} strokeWidth={2.6} className="text-black" />
                  </div>
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-neutral-900">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-neutral-700 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-neutral-200 flex justify-between items-center text-[11px] font-bold uppercase text-neutral-500">
                <span>Tahap {idx + 1}</span>
                <span className="text-black font-black">Sirkulasi Standar</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export { UserWorkflow as NeoWorkflowSection };
