const CACHE_NAME = 'unfair-parkour-v1';

const CORE_ASSETS = [
  '/',                // 루트
  '/main.html',       // 메인 페이지
  '/manifest.json',
  '/game_1.html',
  '/stage.html',
  '/skins.html'
];

// 설치: 핵심 파일 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 활성화: 이전 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 요청 처리: cache-first (게임에 적합)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        }).catch(() => {
          // 오프라인 + 없는 파일일 때 fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/main.html');
          }
        })
      );
    })
  );
});
