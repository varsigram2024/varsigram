import React, { createContext, useContext, useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../firebase/messaging';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  isNotificationSupported: boolean;
  isNotificationEnabled: boolean;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<void>;
  registerDevice: () => Promise<void>;
  unregisterDevice: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [hasAttemptedRegistration, setHasAttemptedRegistration] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Check if notifications are supported
    setIsNotificationSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if (isNotificationSupported) {
      setNotificationPermission(Notification.permission);
      setIsNotificationEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!isNotificationSupported) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setIsNotificationEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        await registerDevice();
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const registerDevice = async () => {
    if (!token || !isNotificationEnabled) return;

    try {
      console.log('Attempting to get FCM token...');
      
      // First, ensure service worker is registered
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
      }
      
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID
      });

      console.log('FCM Token received:', fcmToken ? 'Yes' : 'No');

      if (fcmToken) {
        console.log('Registering device with backend...');
        await axios.post(
          `${API_BASE_URL}/notifications/register/`,
          {
            registration_id: fcmToken,
            device_id: navigator.userAgent
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Device registered for notifications');
        // Only show success toast if user manually enabled notifications
        if (hasAttemptedRegistration) {
          toast.success('Device registered for notifications');
        }
      } else {
        console.log('No FCM token received');
        if (hasAttemptedRegistration) {
          toast.error('Failed to get notification token');
        }
      }
    } catch (error: any) {
      console.error('Error registering device:', error);
      
      // Only show error toast if user manually enabled notifications
      if (hasAttemptedRegistration) {
        if (error.code === 'messaging/failed-service-worker-registration') {
          toast.error('Service worker registration failed. Please refresh the page and try again.');
        } else if (error.code === 'messaging/permission-blocked') {
          toast.error('Notification permission is blocked. Please enable notifications in your browser settings.');
        } else {
          toast.error('Failed to register device for notifications');
        }
      }
    }
  };

  const unregisterDevice = async () => {
    if (!token) return;

    try {
      const fcmToken = await getToken(messaging);
      if (fcmToken) {
        await axios.delete(
          `${API_BASE_URL}/notifications/unregister/${fcmToken}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log('Device unregistered from notifications');
        toast.success('Device unregistered from notifications');
      }
    } catch (error) {
      console.error('Error unregistering device:', error);
      toast.error('Failed to unregister device');
    }
  };

  // Handle foreground messages
  useEffect(() => {
    if (!isNotificationEnabled) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      
      // Show toast notification
      toast.success(payload.notification?.body || 'You have a new notification', {
        duration: 4000,
        icon: '🔔',
      });
    });

    return () => unsubscribe();
  }, [isNotificationEnabled]);

  // Auto-register device when user logs in and notifications are enabled
  // But only if we haven't attempted registration yet
  useEffect(() => {
    if (token && isNotificationEnabled && !hasAttemptedRegistration) {
      setHasAttemptedRegistration(true);
      registerDevice();
    }
  }, [token, isNotificationEnabled, hasAttemptedRegistration]);

  const value: NotificationContextType = {
    isNotificationSupported,
    isNotificationEnabled,
    notificationPermission,
    requestNotificationPermission,
    registerDevice,
    unregisterDevice
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 