"use client";

import { Wind, Sun, Sunrise, Sunset, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDashboardData } from "@/hooks/useDashboardData";
import WeatherCard from "@/components/dashboard/WeatherCard";
import StatCard from "@/components/dashboard/StatCard";
import AbroadCard from "@/components/dashboard/AbroadCard";
import GlassCard from "@/components/common/GlassCard";
import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

function uvLabel(uv: number) {
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very High";
  return "Extreme";
}

function aqiColor(aqi: number) {
  if (aqi <= 50) return "#30D158";
  if (aqi <= 100) return "#FFD60A";
  if (aqi <= 150) return "#FF9F0A";
  if (aqi <= 200) return "#FF453A";
  return "#BF5AF2";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

export default function DashboardPage() {
  const { location, error: geoError, permissionDenied, refresh } = useGeolocation();
  const { weather, airQuality, loading, error, stale, lastUpdated, refresh: refreshDashboard } = useDashboardData(location);

  const cityLabel = location ? [location.city, location.country].filter(Boolean).join(", ") : undefined;
  const quickLinks = SECTIONS.filter((s) => s.slug !== "");

  return (
    <div className="px-4 pt-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <MapPin size={14} />
        {cityLabel ?? "Detecting your location…"}
      </div>

      <AbroadCard location={location} />

      {permissionDenied && (
        <GlassCard className="mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium">Location access needed</p>
              <p className="text-xs text-muted">
                Enable location in Settings → Safari → Location to personalize your dashboard.
              </p>
            </div>
            <button onClick={refresh} className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white">
              Retry
            </button>
          </div>
        </GlassCard>
      )}

      {!permissionDenied && geoError && (
        <p className="mb-4 text-xs text-warning">{geoError}</p>
      )}

      {stale && <p className="mb-3 text-xs text-warning">Showing last saved data — couldn&apos;t refresh.</p>}

      {error && !weather && <p className="mb-4 text-sm text-danger">{error}</p>}

      {loading && !weather ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass h-28 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        weather && (
          <div className="grid grid-cols-2 gap-3">
            <WeatherCard weather={weather} city={cityLabel} />
            {airQuality && (
              <StatCard
                icon={Wind}
                label="Air Quality (AQI)"
                value={String(airQuality.aqi)}
                hint={airQuality.category}
                accentColor={aqiColor(airQuality.aqi)}
              />
            )}
            <StatCard
              icon={Sun}
              label="UV Index"
              value={weather.uvIndex.toFixed(1)}
              hint={uvLabel(weather.uvIndex)}
              accentColor="#FF9F0A"
            />
            <StatCard icon={Sunrise} label="Sunrise" value={formatTime(weather.sunrise)} accentColor="#FFD60A" />
            <StatCard icon={Sunset} label="Sunset" value={formatTime(weather.sunset)} accentColor="#FF453A" />
          </div>
        )
      )}

      {weather && lastUpdated && (
        <button onClick={refreshDashboard} className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          Updated {formatRelativeTime(lastUpdated)} · tap to refresh
        </button>
      )}

      <h2 className="mb-3 mt-7 text-sm font-semibold text-muted">Everything else</h2>
      <div className="grid grid-cols-3 gap-3 pb-4">
        {quickLinks.map((section) => (
          <Link
            key={section.slug}
            href={`/${section.slug}`}
            className="glass flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: section.color }}
            >
              <section.icon size={18} />
            </div>
            <span className="text-[11px] font-medium leading-tight">{section.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
