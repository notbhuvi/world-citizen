export interface MapDestination {
  lat: number;
  lon: number;
  label: string;
}

export interface MapAppOption {
  id: string;
  name: string;
  buildUrl: (dest: MapDestination) => string;
}

export const MAP_APPS: MapAppOption[] = [
  {
    id: "apple-maps",
    name: "Apple Maps",
    buildUrl: ({ lat, lon, label }) => `https://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(label)}`,
  },
  {
    id: "google-maps",
    name: "Google Maps",
    buildUrl: ({ lat, lon }) => `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
  },
  {
    id: "waze",
    name: "Waze",
    buildUrl: ({ lat, lon }) => `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`,
  },
];

export function openInMapApp(app: MapAppOption, dest: MapDestination) {
  window.location.href = app.buildUrl(dest);
}
