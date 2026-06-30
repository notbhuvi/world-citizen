# Architecture

## Overview

Moved Out is a **client-only PWA**. There is no application server and no database server — every screen renders from data fetched directly from public, keyless APIs and from the device's own IndexedDB store. The only server-side component is GitHub Pages, which serves the static build files (HTML/CSS/JS) over a permanent HTTPS URL — it runs no application logic and stores no user data.

```
┌─────────────────────────────── iPhone (Safari / Home Screen PWA) ───────────────────────────────┐
│                                                                                                    │
│  ┌──────────────┐      ┌──────────────────┐      ┌────────────────────────────────────────────┐  │
│  │  App Shell    │      │  Service Worker   │      │              IndexedDB                     │  │
│  │  (Next.js     │◄────►│  public/sw.js      │      │  • bookmarks   • settings   • api cache    │  │
│  │  App Router)  │      │  - precache shell  │◄────►│  (lib/db.ts via the `idb` wrapper)         │  │
│  └──────┬───────┘      │  - stale-while-    │      └────────────────────────────────────────────┘  │
│         │              │    revalidate API  │                                                      │
│         │              └──────────────────┘                                                      │
│         ▼                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Browser platform APIs                                                                       │  │
│  │  Geolocation · Web Share · SpeechRecognition · SpeechSynthesis                               │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                 │  HTTPS, direct from device, no proxy
                                                 ▼
                    ┌────────────────────────────────────────────────────────────┐
                    │                 Public keyless APIs                        │
                    │  Open-Meteo (weather/AQI) · Overpass (OSM places)          │
                    │  Frankfurter (currency) · Nager.Date (holidays)            │
                    │  BigDataCloud (reverse geocode)                            │
                    │  Anthropic API — only if the user supplies their own key   │
                    └────────────────────────────────────────────────────────────┘
```

## Data flow

1. **Location** (`src/hooks/useGeolocation.ts`) — browser `navigator.geolocation`, reverse-geocoded via BigDataCloud, cached in IndexedDB so the app still shows your last known city when offline or denied.
2. **Dashboard data** (`src/hooks/useDashboardData.ts`) — fetches weather + air quality from Open-Meteo keyed off lat/lon, cached in IndexedDB, served stale-while-revalidate by the service worker as a second layer.
3. **Nearby places** (`src/components/common/NearbyFinder.tsx`) — a single generic component, parameterized by OSM tag presets (`src/lib/api/overpass.ts`), reused across Maps, Health, Shopping, Food, Education, Housing, and Travel. This is why those sections are fully live rather than placeholders. Tapping a place's pin icon opens `MapAppChooser` (`src/components/common/MapAppChooser.tsx`), which lets the user pick Apple Maps, Google Maps, or Waze — built from universal links (`src/lib/mapApps.ts`) that work whether or not the chosen app is installed, since there's no web API to detect installed native apps.
4. **Bookmarks** — every bookmarkable item writes a `BookmarkRecord` to the `bookmarks` IndexedDB store; the `/bookmarks` page reads it back.
5. **AI app handoff** — `src/hooks/useAiAppPreference.ts` (exposed app-wide via `AiAppProvider`/`useAiApp`) asks once, on first launch, which AI app the user already has (ChatGPT, Claude, Gemini, Perplexity, Copilot — see `src/lib/aiApps.ts`), stores the choice in IndexedDB, and exposes a `research(query)` helper. `GuidedSearchSection` and the AI Assistant page both call this to hand a question off to that app via a deep link, the same pattern as `MapAppChooser`.
6. **In-app AI chat (optional)** — voice input/output uses on-device Web Speech APIs (no key, no network call for STT/TTS). The AI Assistant page also offers a separate in-app chat that calls the Anthropic Messages API directly from the browser using a key the user pastes in, stored only in IndexedDB — distinct from the app-handoff flow above.
7. **Offline-first caching** — the service worker (`public/sw.js`) precaches every route's HTML shell (not just `/`), so navigating between sections works fully offline after first install, not only on pages already visited. Map tiles from OpenStreetMap are cached separately with a capped LRU-style eviction so the embedded map also renders offline once an area has been viewed.
8. **QR code generation** — `qrcode` (open-source, MIT-licensed, runs entirely client-side, no API/key) renders a scannable code for live-location sharing and the emergency medical profile, for cases where showing a code is faster or more reliable than a native share sheet.
9. **Home country / travel detection** — `src/hooks/useHomeCountry.ts` stores a one-time home-country choice; the dashboard compares it against the live detected country (`src/components/dashboard/AbroadCard.tsx`) to surface a "you're traveling" prompt with shortcuts to Travel/Finance/Emergency.
10. **Local authentication** — `src/lib/authCrypto.ts` has the PBKDF2 hashing and recovery-code generation (Web Crypto API, no library). `src/hooks/useAuth.ts` holds the account/lock state, shared app-wide via `src/components/auth/AuthProvider.tsx` (React context, same pattern as `AiAppProvider`). `src/components/auth/AuthGate.tsx` sits at the top of `layout.tsx`, above `AppShell`, and renders Signup/Login/Recovery screens instead of the app until unlocked. There is no server-side session — "login" only ever compares a locally-derived hash against a locally-stored one.

## Why no backend

The product requirement was explicit: no Supabase, no Vercel, fully local on-device storage. This removes an entire class of concerns (auth, hosting, secrets management) at the cost of: no cross-device sync, no server-side push notifications, and no admin-curated content — those would require reintroducing a backend.

## Folder structure

```
src/
  app/<section>/page.tsx     one route per top-level section
  components/
    layout/                  AppShell, TopBar, BottomTabs, ServiceWorkerRegistration
    common/                  GlassCard, SearchBar, FilterChips, BookmarkButton, ShareButton,
                              NearbyFinder, GuidedSearchSection, LeafletMap, SectionShell, OfflineBanner
    dashboard/                WeatherCard, StatCard
  hooks/                      useGeolocation, useTheme, useOnlineStatus, useDashboardData
  lib/
    api/                      openMeteo.ts, overpass.ts, frankfurter.ts, nagerDate.ts
    db.ts                     IndexedDB wrapper (bookmarks, settings, cache)
    geo.ts                    geolocation + reverse geocoding
    sections.ts               section registry (icon, color, status, route)
    emergencyNumbers.ts        country → emergency number dataset
    aiClient.ts                pluggable LLM client (Anthropic, user-supplied key)
public/
  manifest.webmanifest
  sw.js
  icons/                      generated PWA icons (all sizes + maskable)
```
