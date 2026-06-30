"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function AuthScreenLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="blob-bg" />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col items-center gap-3"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-lg font-bold text-white"
        >
          M
        </motion.div>
        <div className="text-center">
          <h1 className="font-handwritten text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.05 }}
        className="glass w-full max-w-sm rounded-2xl p-5"
      >
        {children}
      </motion.div>
    </div>
  );
}
