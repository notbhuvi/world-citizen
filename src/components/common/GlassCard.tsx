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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className={`glass rounded-2xl p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}
