"use client";

import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isBookmarked, toggleBookmark, type BookmarkRecord } from "@/lib/db";
import ConfettiBurst from "./ConfettiBurst";

export default function BookmarkButton({ record }: { record: BookmarkRecord }) {
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    isBookmarked(record.id).then(setSaved);
  }, [record.id]);

  return (
    <>
      <motion.button
        aria-label={saved ? "Remove bookmark" : "Add bookmark"}
        whileTap={{ scale: 0.7, rotate: -15 }}
        onClick={async (e) => {
          e.stopPropagation();
          const next = await toggleBookmark(record);
          setSaved(next);
          if (next) setBurst((b) => b + 1);
        }}
        className={`rounded-full p-1.5 transition-colors ${saved ? "text-accent" : "text-muted"}`}
      >
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      </motion.button>
      <ConfettiBurst trigger={burst} />
    </>
  );
}
