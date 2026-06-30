"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function SectionShell({
  title,
  description,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-4 pt-4">
      <div className="mb-5 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 16 }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: color }}
        >
          <Icon size={22} />
        </motion.div>
        <div>
          <h1 className="font-handwritten text-2xl font-bold leading-tight">{title}</h1>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
