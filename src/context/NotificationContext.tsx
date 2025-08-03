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
        
        await registerDeviceWithState(true, permission);
        
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

  // Add a flag to prevent multiple simultaneous calls
  const [isRegistering, setIsRegistering] = useState(false);

  const registerDeviceWithState = async (notificationEnabled: boolean, permission: NotificationPermission, showToastOnError = true) => {
    // Prevent multiple simultaneous calls
    if (isRegistering) {
      return;
    }
    
    setIsRegistering(true);
    
    try {
      if (!token || !notificationEnabled || permission !== 'granted') {
        return;
      }

      if (!messaging) {
        if (showToastOnError) {
          toast.error('Firebase messaging not available');
        }
        return;
      }

      // Check if service worker is already registered
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      
      let swRegistration = null;
      
      // Try to use existing registration first
      if (existingRegistrations.length > 0) {
        swRegistration = existingRegistrations[0];
      } else {
        // Register new service worker
        swRegistration = await registerServiceWorker();
        
        if (!swRegistration) {
          if (showToastOnError) {
            toast.error('Failed to register service worker');
          }
          return;
        }
      }

      // Check if service worker is already active
      if (swRegistration.active && swRegistration.active.state === 'activated') {
        // Service worker is already active
      } else {
        // Wait for service worker to be active with timeout
        try {
          const swReadyTimeout = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Service worker ready timeout'));
            }, 15000);
          });
          
          await Promise.race([
            navigator.serviceWorker.ready,
            swReadyTimeout
          ]);
        } catch (error) {
          // Continue anyway and check if we have an active service worker
        }
      }
      
      // Double-check that we have an active service worker
      const activeSW = swRegistration.active;
      
      if (!activeSW || activeSW.state !== 'activated') {
        if (showToastOnError) {
          toast.error('Service worker not ready');
        }
        return;
      }
      
      // Try getToken with timeout
      let newFcmToken = null;
      
      try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('getToken timeout after 10 seconds'));
            }, 10000);
          });
        
        const getTokenPromise = getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
          serviceWorkerRegistration: swRegistration
        });
        
        newFcmToken = await Promise.race([getTokenPromise, timeoutPromise]);
      } catch (error) {
        // Try without service worker registration as fallback
        try {
          const fallbackTimeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('getToken fallback timeout after 10 seconds'));
            }, 10000);
          });
          
          const fallbackGetTokenPromise = getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID
          });
          
          newFcmToken = await Promise.race([fallbackGetTokenPromise, fallbackTimeoutPromise]);
        } catch (fallbackError) {
          // Both attempts failed
        }
      }

      if (newFcmToken) {
        setFcmToken(newFcmToken);
        
        try {
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

          if (showToastOnError) {
            toast.success('Device registered for notifications');
          }
        } catch (apiError: any) {
          // Check if it's a 409 (Conflict) - device already registered
          if (apiError.response?.status === 409) {
            if (showToastOnError) {
              toast.success('Notifications are already enabled');
            }
          } else {
            // For other errors, show toast only if showToastOnError is true
            if (showToastOnError) {
              toast.error('Failed to register device for notifications');
            }
          }
        }
      } else {
        if (showToastOnError) {
          toast.error('Failed to get device token');
        }
      }
    } catch (error) {
      if (showToastOnError) {
        toast.error('Failed to register device for notifications');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const registerDevice = async () => {
    if (!token || !isNotificationEnabled || notificationPermission !== 'granted') {
      return;
    }

    try {
      if (!messaging) {
        toast.error('Firebase messaging not available');
        return;
      }

      const swRegistration = await registerServiceWorker();
      
      if (!swRegistration) {
        toast.error('Failed to register service worker');
        return;
      }

      const newFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
        serviceWorkerRegistration: swRegistration
      });

      if (newFcmToken) {
        setFcmToken(newFcmToken);
        
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

        toast.success('Device registered for notifications');
      } else {
        toast.error('Failed to get device token');
      }
    } catch (error) {
      toast.error('Failed to register device for notifications');
    }
  };

  // Auto-register device when user logs in and notifications are enabled
  useEffect(() => {
    if (token && isNotificationEnabled && notificationPermission === 'granted') {
      registerDeviceWithState(isNotificationEnabled, notificationPermission, false).catch((error) => {
        console.error('Auto-registration failed:', error);
      });
    }
  }, [token, isNotificationEnabled, notificationPermission]);

  // Handle foreground messages
  useEffect(() => {
    if (isNotificationEnabled) {
      const unsubscribe = onMessage(messaging, (payload) => {
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
    if (!token || !fcmToken) {
      setIsNotificationEnabled(false);
      localStorage.setItem('notificationEnabled', 'false');
      return;
    }

    try {
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