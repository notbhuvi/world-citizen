"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      whileHover={onClick ? { scale: 1.015 } : undefined}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      onClick={onClick}
      className={`glass rounded-2xl p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}
