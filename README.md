# World Citizen

**Everything a person needs to know anywhere in the world.**

A local-first Progressive Web App (PWA) that detects your location and surfaces weather, air quality, health, emergency, finance, travel, and civic information for wherever you are. No backend, no account, no app store — install it on your iPhone via Safari → Add to Home Screen, and all personal data (bookmarks, settings, cached responses) stays on-device for offline use.

**Live URL:** https://notbhuvi.github.io/world-citizen/

The app is statically hosted on GitHub Pages (free, just serves files — no server, no database) so it works over mobile data or any Wi-Fi without your computer running anything.

## Why local-first

This build intentionally has **no server and no cloud account**. All personal data (bookmarks, settings, cached API responses, your optional AI API key) lives in your iPhone's IndexedDB, never leaves the device except for the direct, anonymous calls to the public data APIs below.

## What's live vs. reference-only

| Section | Status | How it works |
|---|---|---|
| Dashboard (weather, AQI, UV, sunrise/sunset) | ✅ Live | Open-Meteo, keyless |
| Emergency (SOS, share location, helplines) | ✅ Live | Browser Geolocation + Web Share API + built-in country number dataset |
| Maps & Nearby | ✅ Live | OpenStreetMap / Overpass API, keyless. Tapping a place opens a chooser to navigate in Apple Maps, Google Maps, or Waze — whichever you pick |
| Health, Shopping, Food, Education, Housing | ✅ Live | Same Overpass nearby-places engine, category-filtered, same map-app chooser |
| Finance (currency, EMI, salary/tax calculators) | ✅ Live | Frankfurter API (keyless) + local calculators |
| Calendar (public holidays) | ✅ Live | Nager.Date API, keyless |
| Government, Jobs, Travel, Utilities, Laws | ✅ Live, guided | Curated topic lists, each with an "Ask [your AI app]" handoff button plus a plain web-search fallback — these areas legally differ by country/region, so the app points you to authoritative sources rather than guessing facts |
| AI Assistant | ✅ Live | On first launch, the app asks which AI app you already use (ChatGPT, Claude, Gemini, Perplexity, or Copilot) and remembers it. Research buttons throughout the app hand off your question to that app via a deep link. Voice search and text-to-speech work with no setup; an optional in-app chat is also available if you add your own Anthropic API key |

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Framer Motion for animation
- IndexedDB (via `idb`) for bookmarks, settings, and offline cache
- Hand-written Service Worker (`public/sw.js`) — stale-while-revalidate for API calls, cache-first for the app shell
- Leaflet + OpenStreetMap tiles for maps
- No backend, no database server, no deployment target

## Getting started (local development)

```bash
npm install
npm run dev          # http://localhost:3000
```

## Installing on your iPhone

1. Open **https://notbhuvi.github.io/world-citizen/** in Safari on your iPhone.
2. Tap the **Share** icon → **Add to Home Screen** → **Add**.
3. Launch it from your Home Screen. From then on it works over mobile data or any Wi-Fi, fully independent of any computer.

Pushing to `main` redeploys automatically via the GitHub Actions workflow in `.github/workflows/deploy.yml`.

## Documentation

- [SETUP.md](./SETUP.md) — local dev, LAN HTTPS, iPhone install steps
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system diagram and data flow
- [API.md](./API.md) — every external API the app calls, all keyless
