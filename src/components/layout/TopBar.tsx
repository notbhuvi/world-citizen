"use client";

import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function TopBar() {
  const { theme, toggleTheme, ready } = useTheme();

  return (
    <header className="safe-top sticky top-0 z-40">
      <div className="glass flex items-center justify-between px-5 py-3 mx-3 mt-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
            <Globe size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">World Citizen</p>
            <p className="text-[11px] text-muted leading-tight">Everywhere, instantly</p>
          </div>
        </div>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 active:scale-90 transition-transform"
        >
          {ready && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
