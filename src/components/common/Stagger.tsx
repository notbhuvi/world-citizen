"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

export function StaggerGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
