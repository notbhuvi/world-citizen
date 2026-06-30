# External APIs

All APIs used by Moved Out are **public and keyless** unless noted. Every call is made directly from the user's device — there is no proxy server.

| API | Used for | Auth | Docs |
|---|---|---|---|
| [Open-Meteo Forecast](https://open-meteo.com/) | Temperature, apparent temperature, humidity, wind, UV index, weather code, sunrise/sunset | None | `api.open-meteo.com/v1/forecast` |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | US AQI, PM2.5, PM10 | None | `air-quality-api.open-meteo.com/v1/air-quality` |
| [BigDataCloud Reverse Geocode](https://www.bigdatacloud.com/) | City/region/country from lat-lon | None (client-side free tier) | `api.bigdatacloud.net/data/reverse-geocode-client` |
| [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) | Nearby hospitals, pharmacies, police, fuel, ATMs, restaurants, schools, embassies, attractions, etc. | None | `overpass-api.de/api/interpreter` (with `overpass.kumi.systems` as fallback mirror) |
| [Frankfurter](https://www.frankfurter.app/) | Currency exchange rates | None | `api.frankfurter.app/latest` |
| [Nager.Date](https://date.nager.at/) | Public holidays by country/year | None | `date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}` |
| [Anthropic Messages API](https://docs.anthropic.com/) | Conversational AI assistant | **User-supplied API key**, stored only in the device's IndexedDB | `api.anthropic.com/v1/messages` |

## Caching strategy

- Every API response that powers a screen is cached in IndexedDB (`src/lib/db.ts`, `cache` store) with a timestamp, so the UI can render instantly from cache and revalidate in the background.
- The service worker (`public/sw.js`) caches the same hostnames at the network layer with a stale-while-revalidate strategy, so the app keeps working across full page reloads while offline.

## Rate limits & reliability notes

- Overpass's public instances are community-run and can be slow or rate-limited under heavy use; `fetchNearby` in `src/lib/api/overpass.ts` tries a primary endpoint then falls back to a mirror.
- Open-Meteo, Frankfurter, and Nager.Date have generous free public-tier limits suitable for personal use; none require registration.
- None of these APIs require CORS workarounds — they all support browser-direct calls.
