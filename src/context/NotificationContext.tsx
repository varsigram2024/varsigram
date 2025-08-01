import React, { createContext, useContext, useEffect, useState } from 'react';
import { messaging, getToken, onMessage, registerServiceWorker } from '../firebase/messaging';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  isNotificationSupported: boolean;
  isNotificationEnabled: boolean;
  notificationPermission: NotificationPermission;
  unreadCount: number;
  requestNotificationPermission: () => Promise<void>;
  unregisterDevice: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [isNotificationSupported] = useState('Notification' in window && 'serviceWorker' in navigator);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load saved notification preference on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('notificationEnabled');
    if (savedPreference === 'true') {
      setIsNotificationEnabled(true);
    }
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    console.log('=== NOTIFICATION PERMISSION REQUEST ===');
    console.log('Notification supported:', isNotificationSupported);
    console.log('Current permission:', notificationPermission);
    
    if (!isNotificationSupported) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      console.log('Requesting notification permission...');
      
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        console.log('Permission granted, enabling notifications...');
        // Set the state immediately
        setIsNotificationEnabled(true);
        localStorage.setItem('notificationEnabled', 'true');
        
        // Call registerDevice directly with the current state
        await registerDeviceWithState(true, permission);
        
        toast.success('Notifications enabled successfully!');
      } else {
        console.log('Permission denied');
        setIsNotificationEnabled(false);
        localStorage.setItem('notificationEnabled', 'false');
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  // New function that accepts state parameters directly
  const registerDeviceWithState = async (notificationEnabled: boolean, permission: NotificationPermission) => {
    console.log('=== REGISTER DEVICE WITH STATE ===');
    console.log('Token exists:', !!token);
    console.log('Notification enabled:', notificationEnabled);
    console.log('Permission:', permission);
    
    if (!token || !notificationEnabled || permission !== 'granted') {
      console.log('Cannot register device - missing requirements');
      return;
    }

    try {
      console.log('Checking if messaging is available...');
      if (!messaging) {
        console.error('Messaging is not available');
        toast.error('Firebase messaging not available');
        return;
      }

      // Register service worker first
      console.log('Registering Firebase service worker...');
      const swRegistration = await registerServiceWorker();
      
      if (!swRegistration) {
        console.error('Failed to register service worker');
        toast.error('Failed to register service worker');
        return;
      }

      console.log('Service worker registered successfully');
      console.log('Waiting for service worker to be ready...');
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('Service worker is ready');
      
      console.log('About to call getToken with service worker registration...');
      console.log('VAPID key length:', import.meta.env.VITE_FIREBASE_VAPID?.length);
      
      // Pass the service worker registration to getToken
      const newFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
        serviceWorkerRegistration: swRegistration  // This is the key!
      });

      console.log('FCM Token obtained:', newFcmToken ? 'YES' : 'NO');
      
      if (newFcmToken) {
        console.log('FCM Token length:', newFcmToken.length);
        console.log('FCM Token (first 20 chars):', newFcmToken.substring(0, 20) + '...');
        setFcmToken(newFcmToken);
        
        console.log('Making API call to register device...');
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/register/`,
          {
            registration_id: newFcmToken,
            device_id: navigator.userAgent
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Device registration response:', response.status);
        console.log('Response data:', response.data);
        console.log('Device registered successfully');
        toast.success('Device registered for notifications');
      } else {
        console.error('Failed to get FCM token');
        toast.error('Failed to get device token');
      }
    } catch (error) {
      console.error('Error registering device:', error);
      toast.error('Failed to register device for notifications');
    }
  };

  const registerDevice = async () => {
    console.log('=== REGISTER DEVICE ===');
    console.log('Token exists:', !!token);
    console.log('Notification enabled:', isNotificationEnabled);
    console.log('Permission:', notificationPermission);
    
    if (!token || !isNotificationEnabled || notificationPermission !== 'granted') {
      console.log('Cannot register device - missing requirements');
      return;
    }

    try {
      console.log('Checking if messaging is available...');
      if (!messaging) {
        console.error('Messaging is not available');
        toast.error('Firebase messaging not available');
        return;
      }

      // Use the same registration function that's working
      console.log('Registering Firebase service worker...');
      const swRegistration = await registerServiceWorker();
      
      if (!swRegistration) {
        console.error('Failed to register service worker');
        toast.error('Failed to register service worker');
        return;
      }

      console.log('Service worker registered, getting FCM token...');
      console.log('VAPID key:', import.meta.env.VITE_FIREBASE_VAPID);
      
      // Pass the service worker registration to getToken
      const newFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
        serviceWorkerRegistration: swRegistration
      });

      console.log('FCM Token obtained:', newFcmToken ? 'YES' : 'NO');
      
      if (newFcmToken) {
        console.log('FCM Token length:', newFcmToken.length);
        console.log('FCM Token (first 20 chars):', newFcmToken.substring(0, 20) + '...');
        setFcmToken(newFcmToken);
        
        console.log('Making API call to register device...');
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/register/`,
          {
            registration_id: newFcmToken,
            device_id: navigator.userAgent
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Device registration response:', response.status);
        console.log('Response data:', response.data);
        console.log('Device registered successfully');
        toast.success('Device registered for notifications');
      } else {
        console.error('Failed to get FCM token');
        toast.error('Failed to get device token');
      }
    } catch (error) {
      console.error('Error registering device:', error);
      toast.error('Failed to register device for notifications');
    }
  };

  // Auto-register device when user logs in and notifications are enabled
  useEffect(() => {
    console.log('=== AUTO-REGISTER EFFECT ===');
    console.log('Token exists:', !!token);
    console.log('Notification enabled:', isNotificationEnabled);
    console.log('Permission granted:', notificationPermission === 'granted');
    
    if (token && isNotificationEnabled && notificationPermission === 'granted') {
      console.log('Auto-registering device...');
      registerDevice();
    }
  }, [token, isNotificationEnabled, notificationPermission]);

  // Handle foreground messages
  useEffect(() => {
    if (isNotificationEnabled) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast.success(payload.notification?.body || 'New notification received!');
      });

      return unsubscribe;
    }
  }, [isNotificationEnabled]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/mark-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unregisterDevice = async () => {
    console.log('=== UNREGISTER DEVICE ===');
    console.log('Token exists:', !!token);
    console.log('FCM token exists:', !!fcmToken);
    
    if (!token || !fcmToken) {
      console.log('No token or FCM token available for unregistering');
      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      return;
    }

    try {
      console.log('Unregistering device with FCM token:', fcmToken);
      
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/unregister/${fcmToken}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      setFcmToken(null);
      toast.success('Notifications disabled successfully!');
    } catch (error) {
      console.error('Error unregistering device:', error);
      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      setFcmToken(null);
      toast.success('Notifications disabled locally');
    }
  };

  const value = {
    isNotificationSupported,
    isNotificationEnabled,
    notificationPermission,
    unreadCount,
    requestNotificationPermission,
    unregisterDevice,
    markNotificationAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 