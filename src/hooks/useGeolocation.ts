"use client";

import { useCallback, useEffect, useState } from "react";
import { getCache, setCache } from "@/lib/db";
import { resolveLocation, type LocationInfo } from "@/lib/geo";

const CACHE_KEY = "last-location";

export function useGeolocation() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await resolveLocation();
      setLocation(info);
      setPermissionDenied(false);
      await setCache(CACHE_KEY, info);
    } catch (err) {
      const cached = await getCache<LocationInfo>(CACHE_KEY);
      if (cached) {
        setLocation(cached);
      }
      if (err instanceof GeolocationPositionError && err.code === err.PERMISSION_DENIED) {
        setPermissionDenied(true);
        setError("Location permission denied. Showing your last known location.");
      } else {
        setError("Could not determine location. Showing your last known location.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await getCache<LocationInfo>(CACHE_KEY);
      if (cached) setLocation(cached);
      await refresh();
    })();
  }, [refresh]);

  return { location, loading, error, permissionDenied, refresh };
}
