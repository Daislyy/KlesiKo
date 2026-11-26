"use client";

export function UserFooter() {
  return (
    <footer className="border-t-4 border-black bg-black text-white mt-20">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Logo dan Deskripsi Singkat */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-[#FFE814] text-black font-black text-xl flex items-center justify-center border-2 border-white">
                K
              </span>
              <span className="font-black text-2xl tracking-tight uppercase text-white">
                KlesiKo Library
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              Sistem manajemen perpustakaan berbasis web untuk penelusuran katalog buku,
              pengajuan peminjaman anggota, dan pengelolaan inventaris pustaka.
            </p>
          </div>

          {/* Navigasi Halaman */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FFE814] border-b border-neutral-800 pb-2">
              Navigasi Halaman
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm font-semibold text-neutral-300">
              <li>
                <a href="#beranda" className="hover:text-[#FFE814] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-[#FFE814] transition-colors">
                  Katalog Buku
                </a>
              </li>
              <li>
                <a href="#kategori" className="hover:text-[#FFE814] transition-colors">
                  Kategori Buku
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#FFE814] transition-colors">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Informasi Layanan */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#FFE814] border-b border-neutral-800 pb-2">
              Layanan Pustaka
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Peminjaman buku diproses melalui verifikasi petugas perpustakaan pada jam layanan
              kerja.
            </p>
          </div>
        </div>
      </div>

      {/* Hak Cipta */}
      <div className="border-t border-neutral-800 py-5 px-6 sm:px-8">
        <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-neutral-500">
          <span>&copy; 2026 KlesiKo Library Management System. Hak cipta dilindungi.</span>
          <span className="text-[11px] font-black uppercase text-neutral-400">
            Katalog & Sirkulasi Perpustakaan
          </span>
        </div>
      </div>
    </footer>
  );
}
