import React, { createContext, useContext, useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../firebase/messaging';
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
    if (!isNotificationSupported) {
      toast.error('Notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setIsNotificationEnabled(true);
        localStorage.setItem('notificationEnabled', 'true');
        await registerDevice();
        toast.success('Notifications enabled successfully!');
      } else {
        setIsNotificationEnabled(false);
        localStorage.setItem('notificationEnabled', 'false');
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const unregisterDevice = async () => {
    if (!token || !fcmToken) {
      console.log('No token or FCM token available for unregistering');
      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      return;
    }

    try {
      console.log('Unregistering device with FCM token:', fcmToken);
      
      // Call backend to unregister device using the correct endpoint
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
      // Even if backend call fails, disable locally
      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      setFcmToken(null);
      toast.success('Notifications disabled locally');
    }
  };

  const registerDevice = async () => {
    if (!token || !isNotificationEnabled) return;

    try {
      console.log('Attempting to get FCM token...');
      const newFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID
      });

      if (newFcmToken) {
        console.log('FCM Token obtained:', newFcmToken);
        setFcmToken(newFcmToken);
        
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/register/`,
          {
            registration_id: newFcmToken,
            device_id: navigator.userAgent
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Device registered successfully');
      }
    } catch (error) {
      console.error('Error registering device:', error);
      // Don't show error toast on auto-registration to avoid spam
    }
  };

  // Auto-register device when user logs in and notifications are enabled
  useEffect(() => {
    if (token && isNotificationEnabled && notificationPermission === 'granted') {
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