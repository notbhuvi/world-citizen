"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";

const KEY = "world_clock_zones";

export function useWorldClock() {
  const [zones, setZonesState] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSetting<string[]>(KEY, []).then((value) => {
      setZonesState(value);
      setReady(true);
    });
  }, []);

  const addZone = useCallback(
    (zone: string) => {
      setZonesState((prev) => {
        if (prev.includes(zone)) return prev;
        const next = [...prev, zone];
        setSetting(KEY, next);
        return next;
      });
    },
    []
  );

  const removeZone = useCallback((zone: string) => {
    setZonesState((prev) => {
      const next = prev.filter((z) => z !== zone);
      setSetting(KEY, next);
      return next;
    });
  }, []);

  return { zones, addZone, removeZone, ready };
}
