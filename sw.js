//* ===============================
   Cache 설정
================================ */
const CACHE_NAME = 'unfair-cache-v1';

const CORE_ASSETS = [
  '/unfair/main.html',
  '/unfair/manifest.json',
  '/unfair/icon-192.png',
  '/unfair/icon-512.png'
];

/* ===============================
   install
================================ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

/* ===============================
   activate
================================ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ===============================
   fetch (오프라인 대응)
================================ */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});

/* ===============================
   🔔 백그라운드 푸시 처리
================================ */
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Push 수신', payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: '/unfair/icon-192.png'
    }
  );
});
