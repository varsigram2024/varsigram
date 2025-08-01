console.log('Service Worker loaded successfully');

// Use a more recent Firebase version
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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

// Add this to handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  // Handle the click - you can open specific pages based on the notification
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    // Default behavior - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 