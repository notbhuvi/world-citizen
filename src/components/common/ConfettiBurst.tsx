"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#1E7DFF", "#8B3EF6", "#30D158", "#FFD60A", "#FF453A", "#FF9F0A"];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  shape: "circle" | "square";
}

export default function ConfettiBurst({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    (async () => {
      await Promise.resolve();
      const next = Array.from({ length: 24 }, (_, i) => ({
        id: trigger * 100 + i,
        x: (Math.random() - 0.5) * 280,
        y: -(Math.random() * 220 + 60),
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        shape: Math.random() > 0.5 ? ("circle" as const) : ("square" as const),
      }));
      setParticles(next);
      timeout = setTimeout(() => setParticles([]), 900);
    })();
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/3 z-[70] flex justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1, rotate: p.rotate }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute"
            style={{
              width: 8,
              height: 8,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "9999px" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
