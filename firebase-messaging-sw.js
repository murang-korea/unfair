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

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'Unfair Parkour';
  const options = {
    body: payload.notification?.body || '업데이트가 있습니다!',
    icon: '/unfair/icon-192.png',
    badge: '/unfair/icon-192.png',
    data: {
      url: '/unfair/main.html'
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/unfair/main.html')
  );
});
