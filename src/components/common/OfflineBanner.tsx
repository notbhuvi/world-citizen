"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="mx-3 mt-2 flex items-center gap-2 rounded-xl bg-warning/15 px-4 py-2 text-xs font-medium text-warning">
      <WifiOff size={14} />
      You&apos;re offline — showing the last saved data.
    </div>
  );
}
