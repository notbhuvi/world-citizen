import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <WifiOff size={36} className="text-muted" />
      <h1 className="text-lg font-semibold">You&apos;re offline</h1>
      <p className="max-w-xs text-sm text-muted">
        This page needs an internet connection. Your dashboard and saved bookmarks are still available from Home.
      </p>
    </div>
  );
}
