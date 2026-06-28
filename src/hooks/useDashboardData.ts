"use client";

import { useEffect, useState } from "react";
import { fetchAirQuality, fetchWeather, type AirQualitySnapshot, type WeatherSnapshot } from "@/lib/api/openMeteo";
import { getCache, setCache } from "@/lib/db";
import type { LocationInfo } from "@/lib/geo";

interface DashboardData {
  weather: WeatherSnapshot | null;
  airQuality: AirQualitySnapshot | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
}

export function useDashboardData(location: LocationInfo | null): DashboardData {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualitySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    if (!location) return;
    const key = `dashboard-${location.latitude.toFixed(2)}-${location.longitude.toFixed(2)}`;

    (async () => {
      setLoading(true);
      setError(null);
      const cached = await getCache<{ weather: WeatherSnapshot; airQuality: AirQualitySnapshot }>(key);
      if (cached) {
        setWeather(cached.weather);
        setAirQuality(cached.airQuality);
      }
      try {
        const [w, a] = await Promise.all([
          fetchWeather(location.latitude, location.longitude),
          fetchAirQuality(location.latitude, location.longitude),
        ]);
        setWeather(w);
        setAirQuality(a);
        setStale(false);
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
    })();
  }, [location]);

  return { weather, airQuality, loading, error, stale };
}
