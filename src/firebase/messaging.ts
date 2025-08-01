import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBA440Gz5RfUdK-FMcq4oduiYPj8iEIAgY",
  authDomain: "versigram-pd.firebaseapp.com",
  databaseURL: "https://versigram-pd-default-rtdb.firebaseio.com",
  projectId: "versigram-pd",
  storageBucket: "versigram-pd.firebasestorage.app",
  messagingSenderId: "940781181779",
  appId: "1:940781181779:web:86d48d0a0629abd859dfa6",
  measurementId: "G-RXK0VTEE36"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage }; 