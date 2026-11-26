"use client";

import { Shield, LogOut, ArrowLeft, UserCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NeoButton } from "@/components/NeoButton";

interface TopbarProps {
  onBackToUser?: () => void;
  title?: string;
}

export function Topbar({ onBackToUser, title = "Admin Panel" }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b-4 border-black px-6 py-3.5 sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFE814] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Shield size={20} strokeWidth={2.8} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">{title}</h1>
            <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
              Klesiko Library Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 border-2 border-black bg-neutral-100 px-3 py-1 shadow-[2px_2px_0px_#000]">
              <UserCircle size={16} />
              <span className="text-xs font-black uppercase">{user.fullName || user.username}</span>
              <span className="bg-[#00E575] text-black px-1.5 py-0.2 text-[9px] font-black border border-black">
                ADMIN
              </span>
            </div>
          )}

          {onBackToUser && (
            <NeoButton variant="accent" className="py-2 px-3 text-xs font-black" onClick={onBackToUser}>
              <ArrowLeft size={15} strokeWidth={2.8} />
              <span>Lihat Website</span>
            </NeoButton>
          )}

          <NeoButton
            variant="danger"
            className="py-2 px-3 text-xs font-black"
            onClick={() => {
              logout();
              if (onBackToUser) onBackToUser();
            }}
          >
            <LogOut size={15} strokeWidth={2.8} />
            <span className="hidden sm:inline">Keluar</span>
          </NeoButton>
        </div>
      </div>
    </header>
  );
}
