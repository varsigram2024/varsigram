console.log('Firebase Service Worker loaded successfully');

// Use Firebase v9+ compat imports
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

console.log('Firebase scripts loaded');

try {
  // Initialize Firebase
  firebase.initializeApp({
    apiKey: "AIzaSyBA440Gz5RfUdK-FMcq4oduiYPj8iEIAgY",
    authDomain: "versigram-pd.firebaseapp.com",
    databaseURL: "https://versigram-pd-default-rtdb.firebaseio.com",
    projectId: "versigram-pd",
    storageBucket: "versigram-pd.firebasestorage.app",
    messagingSenderId: "940781181779",
    appId: "1:940781181779:web:86d48d0a0629abd859dfa6",
    measurementId: "G-RXK0VTEE36"
  });

  console.log('Firebase initialized successfully');

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || 'Varsigram';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  console.log('Service worker setup complete');

} catch (error) {
  console.error('Error in service worker:', error);
}

// Handle install event
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

// Handle activate event
self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);
      
      const notificationTitle = payload.notification?.title || 'Varsigram';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        data: payload.data
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    } catch (error) {
      console.error('Error handling push event:', error);
    }
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    self.clients.openWindow('/')
  );
}); 