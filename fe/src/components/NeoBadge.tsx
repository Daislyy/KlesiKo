"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { BorrowStatus } from "@/types/library";

export type BadgeStatus = "tersedia" | "habis" | BorrowStatus;

interface NeoBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const BADGE_CONFIG: Record<
  BadgeStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  tersedia: { label: "Tersedia", color: "sticker--green", icon: CheckCircle2 },
  habis: { label: "Stok Habis", color: "sticker--pink", icon: AlertTriangle },
  pending: { label: "Menunggu", color: "sticker--yellow", icon: Clock },
  approved: { label: "Disetujui", color: "sticker--green", icon: CheckCircle2 },
  borrowed: { label: "Dipinjam", color: "sticker--blue", icon: BookOpenCheck },
  returned: { label: "Dikembalikan", color: "sticker--green", icon: RotateCcw },
  rejected: { label: "Ditolak", color: "sticker--pink", icon: XCircle },
  overdue: { label: "Terlambat", color: "sticker--pink", icon: AlertTriangle },
  cancelled: { label: "Dibatalkan", color: "sticker--orange", icon: XCircle },
};

export function NeoBadge({ status, className = "" }: NeoBadgeProps) {
  const config = BADGE_CONFIG[status] || BADGE_CONFIG.pending;
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`sticker ${config.color} ${className}`}
    >
      <Icon size={13} strokeWidth={2.6} />
      <span>{config.label}</span>
    </motion.span>
  );
}
