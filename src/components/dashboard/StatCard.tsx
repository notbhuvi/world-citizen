"use client";

import type { LucideIcon } from "lucide-react";
import GlassCard from "../common/GlassCard";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accentColor = "#0A84FF",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accentColor?: string;
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{label}</p>
        <Icon size={16} style={{ color: accentColor }} />
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </GlassCard>
  );
}
