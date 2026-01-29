/* ===============================
   Firebase Messaging Service Worker
   파일명: firebase-messaging-sw.js
   ⚠️ 반드시 루트에 위치해야 함
================================ */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

/* ===============================
   Firebase 초기화
================================ */
firebase.initializeApp({
  apiKey: "AIzaSyBD3xGanrrWmSXQjy4ERBV9MpCfYpLSXQM",
  authDomain: "unfair-f15f8.firebaseapp.com",
  projectId: "unfair-f15f8",
  messagingSenderId: "782743211131",
  appId: "1:782743211131:web:187f30e93cbbb9f40566de"
});

const messaging = firebase.messaging();

/* ===============================
   백그라운드 푸시 수신
================================ */
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Push 수신', payload);

  const title = payload.notification?.title || 'Unfair Parkour';
  const options = {
    body: payload.notification?.body || '새 업데이트가 있음!',
    icon: '/unfair/icon-192.png',
    badge: '/unfair/icon-192.png',
    data: {
      url: '/unfair/main.html'
    }
  };

  self.registration.showNotification(title, options);
});

/* ===============================
   알림 클릭 시 앱 열기
================================ */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes('/unfair/') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/unfair/main.html');
        }
      })
  );
});
