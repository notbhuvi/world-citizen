"use client";

import { useTheme } from "@/hooks/useTheme";
import { useAuthContext } from "@/components/auth/AuthProvider";

export default function TopBar() {
  useTheme();
  const auth = useAuthContext();

  return (
    <header className="safe-top sticky top-0 z-40">
      <div className="glass flex items-center gap-2 px-5 py-3 mx-3 mt-3 rounded-2xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white text-sm font-bold">
          M
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Moved Out</p>
          <p className="text-[11px] text-muted leading-tight">
            {auth.account ? `Hi, ${auth.account.name}` : "New place. New start."}
          </p>
        </div>
      </div>
    </header>
  );
}
