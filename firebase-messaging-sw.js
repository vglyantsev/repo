// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Обработчик установки Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting(); // Немедленно активируем новый Service Worker
});

// Обработчик активации Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(clients.claim()); // Берем контроль над всеми клиентами
});

// Обработчик сообщений от страницы
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Конфигурация Firebase для test-project-1-to-1
firebase.initializeApp({
    apiKey: "AIzaSyCxHbpZ44xpg80L67lHOwbvlyNqsdzEfqM",
    authDomain: "test-project-1-to-1.firebaseapp.com",
    projectId: "test-project-1-to-1",
    storageBucket: "test-project-1-to-1.appspot.com",
    messagingSenderId: "732798826390",
    appId: "1:732798826390:web:db8ba268d97fdd60138fb7"
});

const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || 'Новое уведомление';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '',
        data: payload.data
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка кликов на уведомления
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    const urlToOpen = event.notification.data?.FCM_MSG?.fcm_options?.link || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
