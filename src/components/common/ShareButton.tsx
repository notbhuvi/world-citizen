"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({ title, text, url }: { title: string; text?: string; url?: string }) {
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = url ?? window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard");
    }
  };

  return (
    <button aria-label="Share" onClick={handleShare} className="rounded-full p-1.5 text-muted">
      <Share2 size={16} />
    </button>
  );
}
