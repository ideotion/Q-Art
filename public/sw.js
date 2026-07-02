/*
 * Q‑Art service worker (ADR-021) — hand-authored (Serwist-style), 0 dependencies.
 * v1 is a fully local app, so caching the shell + content-hashed assets makes it
 * work offline. No user content is cached beyond what the browser already stores;
 * decision content lives encrypted in IndexedDB, never here.
 *
 * Strategy:
 *  - app shell (the GUI routes): precached on install; navigations are
 *    network-first (only OK responses are cached), falling back to cache so the
 *    app opens offline.
 *  - static assets (/_next/static, icons, manifest): stale-while-revalidate.
 *    Everything else passes through untouched.
 *
 * Updates are consent-based: a new worker WAITS until the page posts
 * SKIP_WAITING (the in-app "new version ready" toast) — never a surprise
 * takeover of open pages. If precaching fails, install fails and the previous
 * worker keeps serving (no silently-broken offline shell).
 */
const CACHE = "qart-shell-v2"; // bump on any caching-strategy change to purge old entries
const SHELL = ["/", "/atlas", "/socrate", "/cartes", "/manifest.webmanifest", "/icon.svg"];

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname === "/icon.svg" ||
  url.pathname === "/manifest.webmanifest" ||
  url.pathname === "/favicon.ico";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Cache only healthy responses — a transient 500 must never become
          // the permanent offline fallback for a route.
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // Static assets only: stale-while-revalidate (content-hashed → safe to keep).
  if (!isStaticAsset(url)) return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
