/* sw.js — service worker למערכת ניהול קנאביס רפואי (PWA) */
const CACHE_NAME = 'canabis-v1';
const APP_SHELL = ['./', './index.html', './manifest.json'];
const CDN_ALLOW = [
  (u) => /fonts\.googleapis\.com/.test(u),
  (u) => /fonts\.gstatic\.com/.test(u),
  (u) => /cdn\.jsdelivr\.net\/npm\/chart\.js@4\.4\.0/.test(u),
  (u) => /www\.gstatic\.com\/firebasejs\/10\.7\.1/.test(u)
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isCdn = CDN_ALLOW.some(fn => fn(e.request.url));

  // Only cache same-origin app shell and whitelisted CDN assets
  const sameOrigin = url.origin === self.location.origin;
  const matches = sameOrigin
    ? APP_SHELL.some(p => url.pathname === new URL(p, self.location.origin).pathname)
    : isCdn;
  if (!matches || e.request.method !== 'GET') return;

  // Network-first for Firebase RTDB (never cache), cache-first for static
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

// Firebase RTDB (websockets / longpoll) must never be intercepted
self.addEventListener('fetch', (e) => {
  if (/firebasedatabase\.app/.test(e.request.url) || /firebasedatabase/.test(e.request.url)) {
    // No respondWith — let the browser handle directly
    return;
  }
});
