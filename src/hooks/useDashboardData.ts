"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAirQuality, fetchWeather, type AirQualitySnapshot, type WeatherSnapshot } from "@/lib/api/openMeteo";
import { getCacheEntry, setCache } from "@/lib/db";
import type { LocationInfo } from "@/lib/geo";

interface DashboardData {
  weather: WeatherSnapshot | null;
  airQuality: AirQualitySnapshot | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
  lastUpdated: number | null;
  refresh: () => void;
}

export function useDashboardData(location: LocationInfo | null): DashboardData {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const load = useCallback(async (lat: number, lon: number) => {
    const key = `dashboard-${lat.toFixed(2)}-${lon.toFixed(2)}`;
    setLoading(true);
    setError(null);
    const cached = await getCacheEntry<{ weather: WeatherSnapshot; airQuality: AirQualitySnapshot }>(key);
    if (cached) {
      setWeather(cached.data.weather);
      setAirQuality(cached.data.airQuality);
      setLastUpdated(cached.updatedAt);
    }
    try {
      const [w, a] = await Promise.all([fetchWeather(lat, lon), fetchAirQuality(lat, lon)]);
      setWeather(w);
      setAirQuality(a);
      setStale(false);
      const now = Date.now();
      setLastUpdated(now);
      await setCache(key, { weather: w, airQuality: a });
    } catch {
      if (cached) {
        setStale(true);
      } else {
        setError("Couldn't load live data. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    (async () => {
      await load(location.latitude, location.longitude);
    })();
  }, [location, load, refreshTick]);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  return { weather, airQuality, loading, error, stale, lastUpdated, refresh };
}
