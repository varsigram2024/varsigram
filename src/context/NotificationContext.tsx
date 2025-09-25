import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { messaging, getToken, onMessage } from '../firebase/messaging'; // Ensure these imports are correct
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Define the shape of the context's value
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

// Generate and persist a unique device ID once per browser instance
// This is used for the 'device_id' field sent to your backend,
// providing a stable identifier for the browser instance across sessions.
let uniqueDeviceId = localStorage.getItem('uniqueDeviceId');
if (!uniqueDeviceId) {
  uniqueDeviceId = crypto.randomUUID(); // Requires HTTPS
  localStorage.setItem('uniqueDeviceId', uniqueDeviceId);
  console.log('Generated new uniqueDeviceId:', uniqueDeviceId);
} else {
  console.log('Using existing uniqueDeviceId:', uniqueDeviceId);
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth(); // Assuming useAuth provides the JWT token

  // State for notification capabilities and status
  const [isNotificationSupported] = useState('Notification' in window && 'serviceWorker' in navigator);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  // Initialize fcmToken from localStorage to persist across sessions
  const [fcmToken, setFcmToken] = useState<string | null>(localStorage.getItem('fcmToken'));
  const [unreadCount, setUnreadCount] = useState(0); // Tracks unread notifications

  // Flag to prevent multiple simultaneous registration attempts
  const [isRegistering, setIsRegistering] = useState(false);

  // --- Initial Setup & State Loading ---

  // Load saved notification preference and initial browser permission on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('notificationEnabled');
    if (savedPreference === 'true') {
      setIsNotificationEnabled(true);
    }
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    // Also log initial fcmToken state
    console.log('Initial FCM token state:', fcmToken);
  }, []); // Empty dependency array means this runs only once on mount

  // Fetch initial unread count from the backend when user token becomes available
  useEffect(() => {
    if (token) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/notifications/unread_count/`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setUnreadCount(response.data.unread_count);
        } catch (error) {
          console.error('Error fetching initial unread count:', error);
        }
      };
      fetchUnreadCount();
    }
  }, [token]);

  // --- Core Notification Logic Functions (wrapped in useCallback for memoization) ---

  // Function to register the device with FCM and your backend
  const registerDeviceWithState = useCallback(async (showToastOnError = true) => {
    // PREVENT CONCURRENT CALLS
    if (isRegistering) {
      console.log("Device registration already in progress. Aborting duplicate call.");
      return;
    }

    setIsRegistering(true); // Set flag to indicate registration is in progress

    try {
      // Pre-conditions check: Ensure user is authenticated, notifications are enabled, and permission is granted
      if (!token || !isNotificationEnabled || notificationPermission !== 'granted') {
        console.log("Pre-conditions not met for registration:", { token: !!token, isNotificationEnabled, notificationPermission });
        return;
      }

      // Ensure Firebase messaging object is available
      if (!messaging) {
        if (showToastOnError) {
          toast.error('Firebase messaging service not initialized.');
        }
        return;
      }

      let newFcmToken: string | null = null;
      try {
        // --- Standard FCM Token Acquisition ---
        // `getToken` handles the service worker registration for `firebase-messaging-sw.js`
        // if it's placed in your public directory.
        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => {
            reject(new Error('FCM token acquisition timed out after 15 seconds.'));
          }, 15000);
        });

        const getTokenPromise = getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
        });

        newFcmToken = await Promise.race([getTokenPromise, timeoutPromise]);

      } catch (error: any) {
        console.error('Error getting FCM token:', error);
        if (showToastOnError) {
          if (error.code === 'messaging/permission-blocked') {
            toast.error('Notification access is blocked by your browser settings. Please enable them manually.');
          } else if (error.message.includes('timed out')) {
            toast.error('Failed to get device token: operation timed out. Please check internet and retry.');
          } else {
            toast.error(`Failed to get device token: ${error.message || 'Unknown error'}`);
          }
        }
        return; // Exit if token acquisition fails
      }

      // If FCM token successfully obtained, register it with your backend
      if (newFcmToken) {
        // PREVENT BACKEND RE-REGISTRATION IF TOKEN IS UNCHANGED
        if (fcmToken === newFcmToken) {
          console.log("FCM token unchanged. Skipping backend registration (already registered/updated).");
          return; // Token is the same, assume backend is up-to-date
        }

        setFcmToken(newFcmToken); // Update state with new token
        localStorage.setItem('fcmToken', newFcmToken); // PERSIST THE FCM TOKEN LOCALLY

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/notifications/register/`, // Your backend register endpoint
            {
              registration_id: newFcmToken,
              device_id: uniqueDeviceId // Using the stable uniqueDeviceId
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Authenticate with your backend token
                'Content-Type': 'application/json'
              }
            }
          );

          // Handle specific backend responses (DRF serializer.save() or update_or_create)
          if (response.status === 201) { // HTTP 201 Created (new device)
            if (showToastOnError) toast.success('Device registered for notifications!');
            console.log('Backend device registered (201):', response.data);
          } else if (response.status === 200) { // HTTP 200 OK (device already registered/updated)
            if (showToastOnError) toast.success('Notifications are already enabled for this device.');
            console.log('Backend device updated/exists (200):', response.data);
          } else {
            if (showToastOnError) toast.success('Device registration process completed.');
            console.log('Backend registration unexpected status:', response.status, response.data);
          }

        } catch (apiError: any) {
          console.error('Backend registration API error:', apiError);
          // Check for specific HTTP status codes from your backend
          if (axios.isAxiosError(apiError) && apiError.response) {
            if (apiError.response.status === 400) { // Bad Request (e.g., validation error)
              const errorData = apiError.response.data;
              console.error('Specific 400 error:', errorData);
              if (errorData.device_id?.includes("Device with this device id already exists.") && !showToastOnError) {
                 // This specific 400 means the device_id is a problem, but it might be okay if reg_id updated
                 // No toast if it's an auto-registration
                 console.warn("Backend 400: Device ID exists, likely due to previous registration. Check backend logic.");
              } else {
                 if (showToastOnError) toast.error(`Registration failed: ${JSON.stringify(errorData)}`);
              }
            } else if (apiError.response.status === 401) { // Unauthorized
                if (showToastOnError) toast.error('Authentication required to register notifications.');
            } else if (apiError.response.status === 409) { // Conflict (if your backend explicitly sends it)
                if (showToastOnError) toast.success('Notifications are already enabled for this device.');
            } else { // Generic API error
                if (showToastOnError) toast.error('Failed to register device for notifications on backend.');
            }
          } else {
             if (showToastOnError) toast.error('An unexpected error occurred during backend registration.');
          }
        }
      } else {
        if (showToastOnError) {
          toast.error('Could not obtain a valid device token.');
        }
      }
    } catch (error: any) {
      console.error('An unexpected error occurred during notification setup:', error);
      if (showToastOnError) {
        toast.error('An unexpected error occurred during notification setup.');
      }
    } finally {
      setIsRegistering(false); // Always reset the flag
    }
  }, [token, messaging, fcmToken, isNotificationEnabled, notificationPermission, isRegistering]);
  // Dependencies for useCallback:
  // fcmToken: to check if token has changed before backend call
  // isNotificationEnabled, notificationPermission: for pre-conditions check
  // isRegistering: used internally by useCallback for debouncing
  // token, messaging: for actual API calls and Firebase Messaging instance
  // uniqueDeviceId (implicit from outer scope, no need to add to deps)


  // --- Permission Request and Manual Registration ---

  // Function to request notification permission from the user
  const requestNotificationPermission = useCallback(async () => {
    if (!isNotificationSupported) {
      console.warn('Notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        // Enable notifications
        setIsNotificationEnabled(true);
        console.log('Notifications enabled successfully.');
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  }, [isNotificationSupported]);
  // --- Auto-registration on Load/Login ---
  useEffect(() => {
    // Only proceed if authenticated, notifications are intended to be enabled,
    // permission is granted, and we are NOT currently registering.
    if (token && isNotificationEnabled && notificationPermission === 'granted' && !isRegistering) {
      // CRITICAL GUARD: Only auto-register if we don't already have an FCM token in state
      // (meaning it hasn't been fetched/registered in the current session OR from localStorage)
      if (fcmToken) {
        console.log("FCM token already exists in state for auto-registration check. Skipping.");
        return;
      }

      console.log("Attempting auto-registration...");
      // Call the registration logic. Pass `false` for `showToastOnError` to make it silent.
      registerDeviceWithState(false).catch((error) => {
        console.error('Silent auto-registration failed:', error);
      });
    }
  }, [token, isNotificationEnabled, notificationPermission, fcmToken, isRegistering, registerDeviceWithState]);
  // Dependencies:
  // `token`: User must be logged in.
  // `isNotificationEnabled`: User preference to have notifications.
  // `notificationPermission`: Browser permission status.
  // `fcmToken`: Crucial for preventing infinite loops. Only run if `fcmToken` is null/not yet set.
  // `isRegistering`: To avoid race conditions if multiple effects/events trigger.
  // `registerDeviceWithState`: Because it's a `useCallback`, its reference changes if its own deps change.
  //                          We accept this for `useEffect` now that `fcmToken` is a strong guard.


  // --- Foreground Message Handling ---

  // Listen for incoming messages when the app is in the foreground
  useEffect(() => {
    // Only set up listener if notifications are enabled and messaging is initialized
    if (isNotificationEnabled && messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast.success(payload.notification?.body || 'New notification received!');
        setUnreadCount(prev => prev + 1);

        if (payload.notification) {
          new Notification(payload.notification.title || 'New Notification', {
            body: payload.notification.body,
            icon: payload.notification.icon,
            data: payload.data,
          });
        }
      });

      return unsubscribe; // Cleanup function: unsubscribe when component unmounts or dependencies change
    }
    return () => {}; // Ensure a cleanup function is always returned
  }, [isNotificationEnabled, messaging]); // Dependencies for useEffect

  // --- Mark Notification as Read ---

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
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
      toast.success('Notification marked as read.');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read.');
    }
  }, [token, setUnreadCount]);

  // --- Unregister Device ---

  const unregisterDevice = useCallback(async () => {
    let unregisterBackendSuccess = false;
    // Only attempt to unregister from backend if we have an FCM token to unregister
    if (token && fcmToken) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/unregister/${fcmToken}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Notifications successfully disabled from backend.');
        unregisterBackendSuccess = true;
      } catch (error: any) {
        console.error('Error unregistering device from backend:', error);
        if (error.response?.status === 404) {
          toast.error('Device token not found on server, disabling locally.');
        } else {
          toast.error('Failed to unregister device from backend. Disabling locally.');
        }
      }
    } else {
      toast.success('No active device token to unregister, disabling locally.');
    }

    // Always update local state and localStorage regardless of backend success/failure
    setIsNotificationEnabled(false);
    localStorage.setItem('notificationEnabled', 'false');

    // Also delete the FCM token from the browser's IndexedDB.
    // This revokes the token on the client-side, making it invalid.
    if (messaging && fcmToken) {
      try {
        await deleteToken(messaging); // Make sure deleteToken is imported from 'firebase/messaging'
        console.log("FCM token deleted from client.");
      } catch (error) {
        console.error("Error deleting FCM token from client:", error);
        // This might fail if the token is already invalid or Firebase internal error
      }
    }
    setFcmToken(null); // Clear the FCM token in state and make it null in localStorage next time.
    localStorage.removeItem('fcmToken'); // Remove from localStorage explicitly


  }, [token, fcmToken, setIsNotificationEnabled, setFcmToken, messaging]);


  // --- Context Value Memoization ---

  const value = useMemo(() => ({
    isNotificationSupported,
    isNotificationEnabled,
    notificationPermission,
    unreadCount,
    requestNotificationPermission,
    unregisterDevice,
    markNotificationAsRead
  }), [
    isNotificationSupported,
    isNotificationEnabled,
    notificationPermission,
    unreadCount,
    requestNotificationPermission,
    unregisterDevice,
    markNotificationAsRead,
  ]);

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