"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useAuthContext } from "@/components/auth/AuthProvider";

export default function TopBar() {
  useTheme();
  const auth = useAuthContext();

  return (
    <header className="safe-top sticky top-0 z-40">
      <div className="glass flex items-center gap-2 px-5 py-3 mx-3 mt-3 rounded-2xl">
        <motion.div
          initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-bold text-white"
        >
          M
        </motion.div>
        <div>
          <p className="font-handwritten text-xl font-bold leading-tight">Moved Out</p>
          <p className="text-[11px] text-muted leading-tight">
            {auth.account ? `Hey ${auth.account.name} 👋` : "New place. New start."}
          </p>
        </div>
      </div>
    </header>
  );
}
