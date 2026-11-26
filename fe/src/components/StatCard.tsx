"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtext?: string;
}

export function StatCard({ label, value, icon: Icon, color = "bg-[#FFE814]", subtext }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className="neo-card p-5 bg-white flex items-center justify-between gap-4"
    >
      <div>
        <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
          {label}
        </span>
        <div className="text-3xl font-black mt-0.5 tracking-tight">{value}</div>
        {subtext && (
          <span className="text-[10px] font-bold text-neutral-500 uppercase mt-1 block">
            {subtext}
          </span>
        )}
      </div>
      <div className={`w-12 h-12 ${color} border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]`}>
        <Icon size={24} strokeWidth={2.8} />
      </div>
    </motion.div>
  );
}
