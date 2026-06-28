"use client";

import { useEffect, useState } from "react";
import SectionShell from "@/components/common/SectionShell";
import GlassCard from "@/components/common/GlassCard";
import BookmarkButton from "@/components/common/BookmarkButton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { fetchPublicHolidays, type PublicHoliday } from "@/lib/api/nagerDate";
import { getCache, setCache } from "@/lib/db";
import { getSection } from "@/lib/sections";

export default function CalendarPage() {
  const meta = getSection("calendar")!;
  const { location } = useGeolocation();
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unsupportedCountry, setUnsupportedCountry] = useState(false);

  useEffect(() => {
    if (!location?.countryCode) return;
    const year = new Date().getFullYear();
    const key = `holidays-${location.countryCode}-${year}`;

    (async () => {
      setLoading(true);
      setError(null);
      setUnsupportedCountry(false);
      const cached = await getCache<PublicHoliday[]>(key, 1000 * 60 * 60 * 24);
      if (cached) setHolidays(cached);
      try {
        const data = await fetchPublicHolidays(year, location.countryCode!);
        setHolidays(data);
        setUnsupportedCountry(data.length === 0);
        await setCache(key, data);
      } catch {
        if (!cached) setError("Couldn't load holidays — check your connection and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location?.countryCode]);

  const upcoming = holidays.filter((h) => new Date(h.date) >= new Date(new Date().toDateString()));

  return (
    <SectionShell title={meta.title} description={meta.description} icon={meta.icon} color={meta.color}>
      {!location?.countryCode && <p className="text-sm text-muted">Detecting your country…</p>}
      {loading && <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass h-16 animate-pulse rounded-2xl" />)}</div>}
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="space-y-2.5">
        {upcoming.map((h) => (
          <GlassCard key={h.date} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{h.localName}</p>
              <p className="text-xs text-muted">
                {new Date(h.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <BookmarkButton
              record={{ id: `calendar-${h.date}-${h.name}`, section: "calendar", title: h.localName, subtitle: h.date }}
            />
          </GlassCard>
        ))}
      </div>

      {!loading && !error && unsupportedCountry && location?.country && (
        <p className="text-sm text-muted">
          We don&apos;t have holiday data for {location.country} from our current source yet.
        </p>
      )}

      {!loading && !error && !unsupportedCountry && upcoming.length === 0 && location?.country && (
        <p className="text-sm text-muted">No more public holidays this year for {location.country}.</p>
      )}
    </SectionShell>
  );
}
