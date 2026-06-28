export interface NearbyPlace {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  distanceKm: number;
  address?: string;
  phone?: string;
  openingHours?: string;
}

export interface OverpassPreset {
  key: string;
  label: string;
  query: string; // overpass tag filter, e.g. amenity=hospital
}

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function fetchNearby(
  lat: number,
  lon: number,
  presets: OverpassPreset[],
  radiusMeters = 5000
): Promise<NearbyPlace[]> {
  const filters = presets.map((p) => `node[${p.query}](around:${radiusMeters},${lat},${lon});`).join("\n");
  const query = `[out:json][timeout:20];(${filters});out center 60;`;

  let lastError: unknown;
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (!res.ok) throw new Error("Overpass request failed");
      const data = await res.json();
      const presetByQuery = (tags: Record<string, string>) =>
        presets.find((p) => {
          const [key, value] = p.query.split("=");
          return tags[key] === value;
        });

      return (data.elements as Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>)
        .filter((el) => el.tags?.name)
        .map((el) => {
          const tags = el.tags ?? {};
          const preset = presetByQuery(tags);
          return {
            id: String(el.id),
            name: tags.name as string,
            lat: el.lat,
            lon: el.lon,
            type: preset?.label ?? "Place",
            distanceKm: haversineKm(lat, lon, el.lat, el.lon),
            address: [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
              .filter(Boolean)
              .join(" "),
            phone: tags.phone ?? tags["contact:phone"],
            openingHours: tags.opening_hours,
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 40);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("All Overpass endpoints failed");
}

export const CATEGORY_PRESETS: Record<string, OverpassPreset[]> = {
  hospitals: [{ key: "hospital", label: "Hospital", query: "amenity=hospital" }],
  pharmacies: [{ key: "pharmacy", label: "Pharmacy", query: "amenity=pharmacy" }],
  clinics: [{ key: "clinic", label: "Clinic", query: "amenity=clinic" }],
  dentists: [{ key: "dentist", label: "Dentist", query: "amenity=dentist" }],
  police: [{ key: "police", label: "Police", query: "amenity=police" }],
  fuel: [{ key: "fuel", label: "Fuel Station", query: "amenity=fuel" }],
  atms: [{ key: "atm", label: "ATM", query: "amenity=atm" }],
  banks: [{ key: "bank", label: "Bank", query: "amenity=bank" }],
  restaurants: [
    { key: "restaurant", label: "Restaurant", query: "amenity=restaurant" },
    { key: "fast_food", label: "Fast Food", query: "amenity=fast_food" },
  ],
  cafes: [{ key: "cafe", label: "Cafe", query: "amenity=cafe" }],
  supermarkets: [{ key: "supermarket", label: "Supermarket", query: "shop=supermarket" }],
  groceries: [{ key: "convenience", label: "Grocery", query: "shop=convenience" }],
  malls: [{ key: "mall", label: "Mall", query: "shop=mall" }],
  schools: [{ key: "school", label: "School", query: "amenity=school" }],
  universities: [{ key: "university", label: "University", query: "amenity=university" }],
  libraries: [{ key: "library", label: "Library", query: "amenity=library" }],
  evCharging: [{ key: "charging_station", label: "EV Charging", query: "amenity=charging_station" }],
  parking: [{ key: "parking", label: "Parking", query: "amenity=parking" }],
  busStops: [{ key: "bus_station", label: "Bus Stop", query: "highway=bus_stop" }],
  trainStations: [{ key: "train_station", label: "Train Station", query: "railway=station" }],
  realEstate: [{ key: "real_estate", label: "Real Estate Agent", query: "office=estate_agent" }],
  embassies: [{ key: "embassy", label: "Embassy", query: "office=diplomatic" }],
  attractions: [{ key: "attraction", label: "Attraction", query: "tourism=attraction" }],
};
