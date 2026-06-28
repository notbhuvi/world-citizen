"use client";

import { Cloud, Droplets, Wind } from "lucide-react";
import GlassCard from "../common/GlassCard";
import { weatherCodeLabel, type WeatherSnapshot } from "@/lib/api/openMeteo";

export default function WeatherCard({ weather, city }: { weather: WeatherSnapshot; city?: string }) {
  return (
    <GlassCard className="col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted">{city ?? "Your location"}</p>
          <p className="mt-1 text-4xl font-semibold">{Math.round(weather.temperature)}°</p>
          <p className="text-sm text-muted">
            Feels like {Math.round(weather.apparentTemperature)}° · {weatherCodeLabel(weather.weatherCode)}
          </p>
        </div>
        <Cloud size={32} className="text-accent" />
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Droplets size={14} /> {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind size={14} /> {Math.round(weather.windSpeed)} km/h
        </span>
        {weather.precipitation > 0 && <span>{weather.precipitation} mm rain</span>}
      </div>
    </GlassCard>
  );
}
