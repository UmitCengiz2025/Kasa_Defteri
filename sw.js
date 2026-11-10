const CACHE_NAME = "kasa-pwa-v2";
const ASSETS = [
  "./kasa.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js",
  "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes("script.google.com") || e.request.url.includes("googleapis.com")) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => cached))
  );
});
