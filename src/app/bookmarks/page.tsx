"use client";

import { useEffect, useState } from "react";
import { Bookmark as BookmarkIcon, Trash2 } from "lucide-react";
import GlassCard from "@/components/common/GlassCard";
import { listBookmarks, removeBookmark, type BookmarkRecord } from "@/lib/db";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);

  useEffect(() => {
    listBookmarks().then((b) => setBookmarks(b.sort((a, c) => (c.createdAt ?? 0) - (a.createdAt ?? 0))));
  }, []);

  const remove = async (id: string) => {
    await removeBookmark(id);
    setBookmarks((b) => b.filter((x) => x.id !== id));
  };

  return (
    <div className="px-4 pt-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
          <BookmarkIcon size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Saved</h1>
          <p className="text-xs text-muted">Everything you&apos;ve bookmarked, stored on this device</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-muted">Nothing saved yet. Tap the bookmark icon on any item to keep it here.</p>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((b) => (
            <GlassCard key={b.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{b.title}</p>
                {b.subtitle && <p className="text-xs text-muted">{b.subtitle}</p>}
                <p className="text-[10px] uppercase tracking-wide text-muted">{b.section}</p>
              </div>
              <button onClick={() => remove(b.id)} className="rounded-full p-1.5 text-danger">
                <Trash2 size={16} />
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
