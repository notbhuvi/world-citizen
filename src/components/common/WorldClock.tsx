"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import GlassCard from "./GlassCard";
import SearchBar from "./SearchBar";
import { useWorldClock } from "@/hooks/useWorldClock";
import { getTimezoneList, formatTimezoneLabel, getZoneOffsetLabel } from "@/lib/timezones";

export default function WorldClock() {
  const { zones, addZone, removeZone, ready } = useWorldClock();
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return getTimezoneList()
      .filter((z) => !zones.includes(z) && z.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, zones]);

  if (!ready) return null;

  return (
    <div>
      <div className="mb-3">
        <SearchBar placeholder="Add a city or timezone (e.g. Tokyo)" value={query} onChange={setQuery} />
      </div>

      {suggestions.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {suggestions.map((zone) => (
            <button
              key={zone}
              onClick={() => {
                addZone(zone);
                setQuery("");
              }}
              className="glass flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm"
            >
              <span>{formatTimezoneLabel(zone)}</span>
              <span className="text-[11px] text-muted">{zone}</span>
            </button>
          ))}
        </div>
      )}

      {zones.length === 0 && (
        <p className="text-sm text-muted">Add cities to see their local time at a glance — handy while traveling.</p>
      )}

      <div className="space-y-2.5">
        {zones.map((zone) => (
          <GlassCard key={zone} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-accent" />
              <div>
                <p className="text-sm font-medium">{formatTimezoneLabel(zone)}</p>
                <p className="text-[11px] text-muted">{getZoneOffsetLabel(zone)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold tabular-nums">
                {now.toLocaleTimeString("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit" })}
              </p>
              <button onClick={() => removeZone(zone)} className="text-muted">
                <Trash2 size={14} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
