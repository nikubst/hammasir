/* هم‌مسیر - Service Worker: offline support
 * App shell: network-first (so new deploys show up immediately), cache fallback when offline.
 * Fonts: cache-first.
 */
const CACHE = "hammasir-v1";
const SHELL = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-180.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);

    // Google Fonts: cache-first
    if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
        event.respondWith(
            caches.match(req).then((hit) =>
                hit ||
                fetch(req).then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
            )
        );
        return;
    }

    if (url.origin !== self.location.origin) return;

    // Same-origin: network-first, fall back to cache (and to the shell for navigations)
    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                }
                return res;
            })
            .catch(() =>
                caches.match(req, { ignoreSearch: true }).then(
                    (hit) => hit || (req.mode === "navigate" ? caches.match("/index.html") : undefined)
                )
            )
    );
});
