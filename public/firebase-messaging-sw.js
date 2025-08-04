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

  // --- Handle Background Messages (PREFERRED FCM METHOD) ---
  // This listener is triggered when the app is in the background or closed.
  messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Received background message:', payload);
    
    // Customize notification title and options
    const notificationTitle = payload.notification?.title || 'Varsigram Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message or update.',
      icon: '/images/logo.png', // Ensure this path is correct relative to domain root
      badge: '/images/logo.png', // Shown on some platforms (e.g., Android)
      data: payload.data, // Custom data payload from your backend
    };

    // Show the notification using the Service Worker's registration
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  console.log('FCM Service Worker setup complete: onBackgroundMessage listener active.');

} catch (error) {
  console.error('Error initializing Firebase or setting up Messaging in service worker:', error);
}

// --- Service Worker Lifecycle Events ---

// The `install` event is fired when the service worker is first installed.
self.addEventListener('install', (event) => {
  console.log('[SW] Service worker installed.');
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// The `activate` event is fired when the service worker becomes active.
self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated.');
  // Claim control of existing clients (pages) immediately.
  event.waitUntil(self.clients.claim());
});

// --- Notification Click Handler ---
// This handles clicks on notifications displayed by this service worker.
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag, event.action);
  event.notification.close(); // Close the notification after click

  const clickedNotificationData = event.notification.data;
  let targetUrl = '/'; // Default URL to open if no specific link is provided

  // Option 1: If you send a specific URL in `data.click_action` from your backend
  if (clickedNotificationData && clickedNotificationData.click_action) {
    targetUrl = clickedNotificationData.click_action;
  }
  // Option 2: If you send the notification_id and want to open a specific page for it
  else if (clickedNotificationData && clickedNotificationData.notification_id) {
    targetUrl = `/notifications/${clickedNotificationData.notification_id}`;
  }


  event.waitUntil(
    // Get all opened windows/tabs
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Look for an existing client that is your app's main page or any page from your origin
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            // If found, focus on it. If the URL is different, navigate it.
            if (client.url !== self.location.origin + targetUrl) {
                return client.focus().then(c => c.navigate(targetUrl));
            }
            return client.focus();
          }
        }
        // If no existing client, open a new window/tab
        return self.clients.openWindow(targetUrl);
      })
  );
});