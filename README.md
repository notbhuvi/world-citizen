# World Citizen

**Everything a person needs to know anywhere in the world.**

A local-first Progressive Web App (PWA) that detects your location and surfaces weather, air quality, health, emergency, finance, travel, and civic information for wherever you are. No backend, no account, no app store — everything runs on your iPhone via Safari → Add to Home Screen, with data cached on-device for offline use.

## Why local-first

This build intentionally has **no server and no cloud account**. All personal data (bookmarks, settings, cached API responses, your optional AI API key) lives in your iPhone's IndexedDB, never leaves the device except for the direct, anonymous calls to the public data APIs below.

## What's live vs. reference-only

| Section | Status | How it works |
|---|---|---|
| Dashboard (weather, AQI, UV, sunrise/sunset) | ✅ Live | Open-Meteo, keyless |
| Emergency (SOS, share location, helplines) | ✅ Live | Browser Geolocation + Web Share API + built-in country number dataset |
| Maps & Nearby | ✅ Live | OpenStreetMap / Overpass API, keyless |
| Health, Shopping, Food, Education, Housing | ✅ Live | Same Overpass nearby-places engine, category-filtered |
| Finance (currency, EMI, salary/tax calculators) | ✅ Live | Frankfurter API (keyless) + local calculators |
| Calendar (public holidays) | ✅ Live | Nager.Date API, keyless |
| Government, Jobs, Travel, Utilities, Laws | ✅ Live, guided | Curated topic lists with "find official source" deep links — these areas legally differ by country/region, so the app points you to authoritative sources rather than guessing facts |
| AI Assistant | ⚙️ Voice search & text-to-speech work with no setup. Conversational AI needs your own Anthropic API key (entered locally, stored only on your device) |

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Framer Motion for animation
- IndexedDB (via `idb`) for bookmarks, settings, and offline cache
- Hand-written Service Worker (`public/sw.js`) — stale-while-revalidate for API calls, cache-first for the app shell
- Leaflet + OpenStreetMap tiles for maps
- No backend, no database server, no deployment target

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Testing on your iPhone (Add to Home Screen)

See [SETUP.md](./SETUP.md) for the full walkthrough — you need HTTPS on your LAN for the service worker and geolocation to work on a real device (iOS only allows these on `localhost` or a secure `https://` origin).

```bash
npm run lan           # serves https://<your-mac-lan-ip>:3000
```

Then on your iPhone: Safari → open that URL → accept the self-signed certificate warning once → Share → **Add to Home Screen**.

## Documentation

- [SETUP.md](./SETUP.md) — local dev, LAN HTTPS, iPhone install steps
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system diagram and data flow
- [API.md](./API.md) — every external API the app calls, all keyless
