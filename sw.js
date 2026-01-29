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


importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBD3xGanrrWmSXQjy4ERBV9MpCfYpLSXQM",
  authDomain: "unfair-f15f8.firebaseapp.com",
  projectId: "unfair-f15f8",
  messagingSenderId: "782743211131",
  appId: "1:782743211131:web:187f30e93cbbb9f40566de"
});

const messaging = firebase.messaging();

// 🔔 백그라운드 푸시 처리
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Push received', payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: '/unfair/icon-192.png'
    }
  );
});
