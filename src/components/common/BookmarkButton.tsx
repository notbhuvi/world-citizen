"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { isBookmarked, toggleBookmark, type BookmarkRecord } from "@/lib/db";

export default function BookmarkButton({ record }: { record: BookmarkRecord }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isBookmarked(record.id).then(setSaved);
  }, [record.id]);

  return (
    <button
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      onClick={async (e) => {
        e.stopPropagation();
        const next = await toggleBookmark(record);
        setSaved(next);
      }}
      className={`rounded-full p-1.5 transition-colors ${saved ? "text-accent" : "text-muted"}`}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
