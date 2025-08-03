import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging: any = null;

try {
  messaging = getMessaging(app);
  console.log('Firebase messaging initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase messaging:', error);
}

// Get the base path from environment or use default
const basePath = import.meta.env.VITE_BASE_PATH || '/varsigram';

// Best practice service worker registration for Firebase v9+ with correct base path
const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.error('Service Worker not supported');
    return null;
  }

  try {
    console.log('Attempting to register Firebase service worker...');
    console.log('Base path:', basePath);
    
    // Register the Firebase service worker with the correct path
    const swPath = `${basePath}/firebase-messaging-sw.js`;
    const swScope = `${basePath}/firebase-cloud-messaging-push-scope`;
    
    console.log('Service worker path:', swPath);
    console.log('Service worker scope:', swScope);
    
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: swScope
    });
    
    console.log('Firebase Service Worker registered successfully:', registration);
    
    // Skip the service worker ready wait
    console.log('Skipping service worker ready wait in registerServiceWorker...');
    // await navigator.serviceWorker.ready;
    // console.log('Service Worker is ready');
    
    return registration;
  } catch (error) {
    console.error('Firebase Service Worker registration failed:', error);
    return null;
  }
};

export { messaging, getToken, onMessage, registerServiceWorker };