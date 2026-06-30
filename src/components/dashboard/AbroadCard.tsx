"use client";

import Link from "next/link";
import { Globe2, Plane } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { useHomeCountry } from "@/hooks/useHomeCountry";
import { getCountryList } from "@/lib/countries";
import type { LocationInfo } from "@/lib/geo";

export default function AbroadCard({ location }: { location: LocationInfo | null }) {
  const { homeCountry, setHomeCountry, ready } = useHomeCountry();

  if (!ready) return null;

  if (!homeCountry) {
    return (
      <GlassCard className="mb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Globe2 size={16} className="text-accent" /> Set your home country
        </div>
        <p className="mb-3 mt-1 text-xs text-muted">
          So Moved Out can tell you when you&apos;re traveling and surface the right currency, visa, and emergency info.
        </p>
        <select
          defaultValue=""
          onChange={(e) => {
            const country = getCountryList().find((c) => c.code === e.target.value);
            if (country) setHomeCountry(country);
          }}
          className="glass w-full rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="" disabled>
            Choose your home country…
          </option>
          {getCountryList().map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </GlassCard>
    );
  }

  const isAbroad = Boolean(location?.countryCode && location.countryCode !== homeCountry.code);

  if (!isAbroad) {
    return (
      <button
        onClick={() => setHomeCountry(null)}
        className="mb-4 flex items-center gap-1.5 text-[11px] text-muted"
      >
        <Globe2 size={11} /> Home: {homeCountry.name} · Change
      </button>
    );
  }

  return (
    <GlassCard className="mb-4 !bg-accent/10">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
          <Plane size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">You&apos;re traveling in {location?.country}</p>
          <p className="text-xs text-muted">Away from home ({homeCountry.name})</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Link href="/travel" className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white">
              Travel guides
            </Link>
            <Link href="/finance" className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium dark:bg-white/10">
              Currency
            </Link>
            <Link href="/emergency" className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium dark:bg-white/10">
              Emergency numbers
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
