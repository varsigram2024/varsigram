console.log('Service Worker loaded');

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

self.addEventListener('push', (event) => {
  console.log('Push event received');
  
  const notificationTitle = 'Varsigram';
  const notificationOptions = {
    body: 'You have a new notification',
    icon: '/images/logo.png'
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
}); 