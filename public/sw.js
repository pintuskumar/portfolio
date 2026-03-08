// Service Worker for PWA support
const CACHE_NAME = "portfolio-v1";
const PRECACHE_URLS = ["/", "/favicon.ico"];

// Static asset extensions to cache
const CACHEABLE_EXTENSIONS = [".js", ".css", ".woff2", ".woff", ".ttf", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API routes and external requests
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) return;

  // Only cache static assets and precached URLs, not dynamic HTML pages
  const isCacheable =
    PRECACHE_URLS.includes(url.pathname) ||
    CACHEABLE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext)) ||
    url.pathname.startsWith("/_next/static/");

  if (!isCacheable) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
