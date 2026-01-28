const CACHE_NAME = 'unfair-cache-v1';

// ❗ 최소 필수만 precache
const CORE_ASSETS = [
  '/unfair/main.html',
  '/unfair/manifest.json',
  '/unfair/icon-192.png',
  '/unfair/icon-512.png'
];

// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// fetch (런타임 캐시)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // HTML / 이미지 / JS만 캐시
          if (
            response.status === 200 &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copy);
            });
          }
          return response;
        });
    })
  );
});
