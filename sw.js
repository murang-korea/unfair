const CACHE_NAME = 'unfair-parkour-v1';

const CORE_ASSETS = [
  './',
  './main.html',
  './manifest.json',
  './game_1.html',
  './game_2.html',
  './game_3.html',
  './game_4.html',
  './game_5.html',
  './game_6.html',
  './game_7.html',
  './game_8.html',
  './game_9.html',
  './game_10.html',
  './game_11.html',
  './game_12.html',
  './game_13.html',
  './stage.html',
  './skins.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
