"use client";

import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function SectionShell({
  title,
  description,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-4 pt-4">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: color }}
        >
          <Icon size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-xs text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
