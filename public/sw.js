const CACHE_VERSION = "world-citizen-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const TILE_CACHE = `${CACHE_VERSION}-tiles`;

const BASE_PATH = "/world-citizen";
const OFFLINE_URL = `${BASE_PATH}/offline/`;

const ROUTE_SLUGS = [
  "",
  "ai",
  "bookmarks",
  "calendar",
  "education",
  "emergency",
  "finance",
  "food",
  "government",
  "health",
  "housing",
  "jobs",
  "laws",
  "maps",
  "more",
  "offline",
  "shopping",
  "travel",
  "utilities",
];

const PRECACHE_URLS = [
  ...ROUTE_SLUGS.map((slug) => `${BASE_PATH}/${slug}${slug ? "/" : ""}`),
  `${BASE_PATH}/manifest.webmanifest`,
];

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

function isTileHost(hostname) {
  return hostname.endsWith(".tile.openstreetmap.org");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const keep = [STATIC_CACHE, API_CACHE, TILE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("world-citizen-") && !keep.includes(key)).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isTileHost(url.hostname)) {
    event.respondWith(cacheFirst(request, TILE_CACHE, 500));
    return;
  }

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

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Cross-origin tile <img> requests are "opaque" (status 0, ok=false) but still cacheable/usable.
    if (response.ok || response.type === "opaque") {
      await cache.put(request, response.clone());
      trimCache(cache, maxEntries);
    }
    return response;
  } catch {
    return cached || Response.error();
  }
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    trimCache(cache, maxEntries);
  }
}
