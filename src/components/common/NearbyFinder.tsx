"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, Phone, Clock, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { fetchNearby, CATEGORY_PRESETS, type NearbyPlace } from "@/lib/api/overpass";
import { getCache, setCache } from "@/lib/db";
import SearchBar from "./SearchBar";
import FilterChips from "./FilterChips";
import GlassCard from "./GlassCard";
import BookmarkButton from "./BookmarkButton";
import ShareButton from "./ShareButton";
import MapAppChooser from "./MapAppChooser";
import type { MapDestination } from "@/lib/mapApps";

const RADIUS_OPTIONS_KM = [5, 15, 30, 50];

export default function NearbyFinder({
  categories,
  sectionId,
}: {
  categories: { key: keyof typeof CATEGORY_PRESETS; label: string }[];
  sectionId: string;
}) {
  const { location } = useGeolocation();
  const [activeCategory, setActiveCategory] = useState(categories[0].label);
  const [radiusKm, setRadiusKm] = useState(50);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapDestination, setMapDestination] = useState<MapDestination | null>(null);

  const activePreset = categories.find((c) => c.label === activeCategory) ?? categories[0];

  useEffect(() => {
    if (!location) return;
    const cacheKey = `nearby-${sectionId}-${activePreset.key}-${radiusKm}-${location.latitude.toFixed(2)}-${location.longitude.toFixed(2)}`;

    (async () => {
      setLoading(true);
      setError(null);
      const cached = await getCache<NearbyPlace[]>(cacheKey, 1000 * 60 * 30);
      if (cached) setPlaces(cached);
      try {
        const results = await fetchNearby(
          location.latitude,
          location.longitude,
          CATEGORY_PRESETS[activePreset.key],
          radiusKm * 1000
        );
        setPlaces(results);
        await setCache(cacheKey, results);
      } catch {
        if (!cached) setError("Couldn't load nearby places. Check your connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [location, activePreset, sectionId, radiusKm]);

  const filtered = useMemo(
    () => places.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [places, query]
  );

  return (
    <div>
      <div className="mb-3">
        <SearchBar placeholder={`Search ${activeCategory.toLowerCase()}...`} value={query} onChange={setQuery} />
      </div>
      <div className="mb-2.5">
        <FilterChips options={categories.map((c) => c.label)} active={activeCategory} onChange={setActiveCategory} />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[11px] text-muted">Within</span>
        <FilterChips
          options={RADIUS_OPTIONS_KM.map((km) => `${km} km`)}
          active={`${radiusKm} km`}
          onChange={(v) => setRadiusKm(parseInt(v))}
        />
      </div>

      {!location && <p className="text-sm text-muted">Waiting for your location…</p>}

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass h-20 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && location && (
        <p className="text-sm text-muted">No {activeCategory.toLowerCase()} found within {radiusKm} km.</p>
      )}

      <div className="space-y-2.5">
        {filtered.map((place) => (
          <GlassCard key={place.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{place.name}</p>
                {place.address && <p className="text-xs text-muted">{place.address}</p>}
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Navigation size={11} /> {place.distanceKm.toFixed(1)} km
                  </span>
                  {place.phone && (
                    <a href={`tel:${place.phone}`} className="flex items-center gap-1 text-accent">
                      <Phone size={11} /> Call
                    </a>
                  )}
                  {place.openingHours && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {place.openingHours}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMapDestination({ lat: place.lat, lon: place.lon, label: place.name })}
                  className="rounded-full p-1.5 text-muted"
                  aria-label="Open in maps"
                >
                  <MapPin size={16} />
                </button>
                <ShareButton title={place.name} text={place.address} />
                <BookmarkButton
                  record={{
                    id: `${sectionId}-${place.id}`,
                    section: sectionId,
                    title: place.name,
                    subtitle: place.address,
                  }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <MapAppChooser destination={mapDestination} onClose={() => setMapDestination(null)} />
    </div>
  );
}
