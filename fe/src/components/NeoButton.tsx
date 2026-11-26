"use client";

import type { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export type NeoButtonVariant = "default" | "primary" | "accent" | "pink" | "green" | "danger";

interface NeoButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: NeoButtonVariant;
  fullWidth?: boolean;
}

export function NeoButton({
  children,
  variant = "default",
  fullWidth = false,
  disabled = false,
  className = "",
  ...props
}: NeoButtonProps) {
  const variantClass = variant !== "default" ? `neo-btn--${variant}` : "";

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03, rotate: -0.5 }}
      whileTap={disabled ? undefined : { scale: 0.96, rotate: 0.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`neo-btn ${variantClass} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
