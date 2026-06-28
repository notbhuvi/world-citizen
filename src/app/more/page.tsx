"use client";

import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

export default function MorePage() {
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-1 text-xl font-semibold">All Sections</h1>
      <p className="mb-5 text-xs text-muted">Everything World Citizen covers, in one place.</p>
      <div className="grid grid-cols-2 gap-3 pb-4">
        {SECTIONS.filter((s) => s.slug !== "").map((section) => (
          <Link key={section.slug} href={`/${section.slug}`} className="glass flex items-center gap-3 rounded-2xl p-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: section.color }}
            >
              <section.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{section.title}</p>
              <p className="truncate text-[11px] text-muted leading-tight">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
