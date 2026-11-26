"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  BookmarkCheck,
  LogIn,
  LogOut,
  Shield,
  UserCircle,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { AuthMode } from "./UserAuthPage";

interface UserNavbarProps {
  activeLink: "home" | "pinjaman";
  activeLoanCount: number;
  onNavigate: (target: "home" | "pinjaman" | "admin" | "user-dashboard") => void;
  onOpenAuth: (mode: AuthMode) => void;
}

// Sesuai PRD Section 3A & 4:
// - Public: Logo KlesiKo, Home, Katalog Buku, Tentang Kami, Login, Register.
// - User: Logo KlesiKo, Home, Katalog Buku, Riwayat Peminjaman, Profil, Logout.
export function UserNavbar({
  activeLink,
  activeLoanCount,
  onNavigate,
  onOpenAuth,
}: UserNavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-black shadow-[0_4px_0_0_#000]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo KlesiKo */}
        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer select-none group text-left"
          onClick={() => onNavigate("home")}
        >
          <div className="w-10 h-10 bg-[#FFE814] text-black border-3 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            <BookOpen size={22} strokeWidth={2.8} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-xl sm:text-2xl tracking-tight uppercase leading-none text-black">
              KlesiKo
            </span>
            <span className="text-[10px] font-black tracking-widest bg-black text-white px-1.5 py-0.5 mt-0.5 w-max uppercase">
              Perpustakaan Digital
            </span>
          </div>
        </button>

        {/* Link Navigasi */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-black uppercase tracking-wider text-neutral-800">
          <a
            href="#beranda"
            onClick={() => onNavigate("home")}
            className="hover:text-blue-600 transition-colors py-1 border-b-2 border-transparent hover:border-black"
          >
            Home
          </a>
          <a
            href="#katalog"
            onClick={() => onNavigate("home")}
            className="hover:text-blue-600 transition-colors py-1 border-b-2 border-transparent hover:border-black"
          >
            Katalog Buku
          </a>
          <a
            href="#kategori"
            onClick={() => onNavigate("home")}
            className="hover:text-blue-600 transition-colors py-1 border-b-2 border-transparent hover:border-black"
          >
            Kategori
          </a>
          <a
            href="#tentang"
            onClick={() => onNavigate("home")}
            className="hover:text-blue-600 transition-colors py-1 border-b-2 border-transparent hover:border-black"
          >
            Tentang Kami
          </a>
        </nav>

        {/* Tombol Akun */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {user ? (
            <>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                className={`neo-btn py-2 px-3 sm:px-4 text-xs ${
                  activeLink === "pinjaman" ? "neo-btn--pink" : ""
                }`}
                onClick={() => onNavigate("pinjaman")}
              >
                <BookmarkCheck size={15} strokeWidth={2.5} />
                <span>Riwayat Pinjaman</span>
                {activeLoanCount > 0 && (
                  <span className="bg-black text-[#FFE814] font-black px-1.5 py-0.5 text-xs border border-white">
                    {activeLoanCount}
                  </span>
                )}
              </motion.button>

              {user.role === "admin" ? (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  type="button"
                  className="neo-btn neo-btn--green py-2 px-3 sm:px-4 text-xs"
                  onClick={() => onNavigate("admin")}
                >
                  <Shield size={15} strokeWidth={2.8} />
                  <span>Dashboard Admin</span>
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate("user-dashboard")}
                  className="border-2 border-black bg-[#FFE814] hover:bg-yellow-400 px-3 py-2 text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <UserCircle size={15} />
                  <span>{user.fullName || user.username}</span>
                </button>
              )}

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="p-2 border-2 border-black bg-neutral-200 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut size={15} strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                className="neo-btn bg-white py-2 px-3 sm:px-4 text-xs font-black"
                onClick={() => onOpenAuth("login")}
              >
                <LogIn size={15} strokeWidth={2.8} />
                <span>Login</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                className="neo-btn neo-btn--primary py-2 px-3 sm:px-4 text-xs font-black"
                onClick={() => onOpenAuth("register")}
              >
                <UserPlus size={15} strokeWidth={2.8} />
                <span>Register</span>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export { UserNavbar as NeoNavbar };
