"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface StatusBannerProps {
  message: string;
  onClose: () => void;
}

export function StatusBanner({ message, onClose }: StatusBannerProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          className="status-bar"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <span className="status-bar__text">
            <Check size={16} strokeWidth={2.5} aria-hidden="true" />
            <span>{message}</span>
          </span>
          <button
            type="button"
            className="spotlight__icon-btn"
            aria-label="Tutup pesan"
            onClick={onClose}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
