const CACHE_VERSION = "world-citizen-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

const BASE_PATH = "/world-citizen";
const OFFLINE_URL = `${BASE_PATH}/offline/`;
const PRECACHE_URLS = [`${BASE_PATH}/`, OFFLINE_URL, `${BASE_PATH}/manifest.webmanifest`];

const API_HOSTS = [
  "api.open-meteo.com",
  "geocoding-api.open-meteo.com",
  "air-quality-api.open-meteo.com",
  "overpass-api.de",
  "overpass.kumi.systems",
  "api.frankfurter.app",
  "date.nager.at",
  "api.bigdatacloud.net",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("world-citizen-") && key !== STATIC_CACHE && key !== API_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (API_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match(OFFLINE_URL));
      })
    );
  }
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || (await networkPromise) || new Response(JSON.stringify({ offline: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
