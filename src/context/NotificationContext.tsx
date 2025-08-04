import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
// Ensure these imports correctly point to your Firebase initialization
// In firebase/messaging.ts, 'messaging' should be initialized and 'getToken', 'onMessage' exported.
import { messaging, getToken, onMessage } from '../firebase/messaging';
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

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth(); // Assuming useAuth provides the JWT token
  
  // State for notification capabilities and status
  const [isNotificationSupported] = useState('Notification' in window && 'serviceWorker' in navigator);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null); // Stores the obtained FCM device token
  const [unreadCount, setUnreadCount] = useState(0); // Tracks unread notifications
  
  // Flag to prevent multiple simultaneous registration attempts
  const [isRegistering, setIsRegistering] = useState(false);

  // --- Initial Setup & State Loading ---

  // Load saved notification preference from localStorage on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('notificationEnabled');
    if (savedPreference === 'true') {
      setIsNotificationEnabled(true);
    }
    // Set initial browser notification permission state
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Fetch initial unread count from the backend when user token becomes available
  useEffect(() => {
    if (token) { // Only fetch if authenticated
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
                // Assume backend returns { "unread_count": N }
                setUnreadCount(response.data.unread_count);
            } catch (error) {
                console.error('Error fetching initial unread count:', error);
                // Optionally toast.error for user if critical
            }
        };
        fetchUnreadCount();
    }
  }, [token]); // Re-run when authentication token changes

  // --- Core Notification Logic Functions (wrapped in useCallback for memoization) ---

  // Function to register the device with FCM and your backend
  const registerDeviceWithState = useCallback(async (
    notificationEnabled: boolean,
    permission: NotificationPermission,
    showToastOnError = true // Control whether to show toasts for errors
  ) => {
    // Prevent re-entry if a registration process is already active
    if (isRegistering) {
      console.log("Device registration already in progress. Aborting duplicate call.");
      return;
    }
    
    setIsRegistering(true); // Set flag to indicate registration is in progress
    
    try {
      // Pre-conditions check: Ensure user is authenticated, notifications are enabled, and permission is granted
      if (!token || !notificationEnabled || permission !== 'granted') {
        // If any condition is not met, exit gracefully without error
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
        // if it's placed in your public directory (which Vite serves from root).
        // The timeout adds robustness against hanging requests.
        const timeoutPromise = new Promise<string>((_, reject) => {
            setTimeout(() => {
              reject(new Error('FCM token acquisition timed out after 15 seconds.'));
            }, 15000); // Increased timeout slightly for network fluctuations
          });
        
        const getTokenPromise = getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID,
          // No `serviceWorkerRegistration` needed here for standard setup.
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
        setFcmToken(newFcmToken); // Store token in component state
        
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/notifications/register/`, // Your backend register endpoint
            {
              registration_id: newFcmToken,
              device_id: navigator.userAgent // Using user agent as a simple device identifier
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Authenticate with your backend token
                'Content-Type': 'application/json'
              }
            }
          );

          // Handle specific backend responses
          if (response.status === 201) { // HTTP 201 Created
            if (showToastOnError) toast.success('Device registered for notifications!');
          } else if (response.status === 200) { // HTTP 200 OK (e.g., if device was already registered/updated)
            if (showToastOnError) toast.success('Notifications are already enabled for this device.');
          } else {
             // Fallback for other unexpected 2xx codes
             if (showToastOnError) toast.success('Device registration process completed.');
          }

        } catch (apiError: any) {
          // Check for specific HTTP status codes from your backend
          if (apiError.response?.status === 409) { // Conflict: device already registered (backend should ideally return 200)
            if (showToastOnError) toast.success('Notifications are already enabled for this device.');
          } else if (apiError.response?.status === 400) { // Bad Request
            if (showToastOnError) toast.error(`Registration failed: ${apiError.response.data.detail || 'Bad request.'}`);
          } else { // Generic API error
            if (showToastOnError) toast.error('Failed to register device for notifications on backend.');
            console.error('Backend registration API error:', apiError);
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
  }, [token, messaging, isRegistering]); // Dependencies for useCallback

  // --- Permission Request and Auto-Registration ---

  // Function to request notification permission from the user
  const requestNotificationPermission = useCallback(async () => {
    if (!isNotificationSupported) {
      toast.error('Notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission); // Update React state with new permission
      
      if (permission === 'granted') {
        setIsNotificationEnabled(true); // User granted permission, so enable notifications
        localStorage.setItem('notificationEnabled', 'true'); // Persist preference
        
        // Attempt to register the device after permission is granted
        await registerDeviceWithState(true, permission); 
        
        toast.success('Notifications enabled successfully!');
      } else {
        setIsNotificationEnabled(false); // Permission denied
        localStorage.setItem('notificationEnabled', 'false');
        toast.error('Notification permission denied.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications.');
    }
  }, [isNotificationSupported, registerDeviceWithState]); // Dependencies for useCallback

  // Auto-register device when user logs in or relevant states change
  useEffect(() => {
    if (token && isNotificationEnabled && notificationPermission === 'granted') {
      // Use `showToastOnError=false` to avoid spamming toasts on page load/re-renders
      registerDeviceWithState(isNotificationEnabled, notificationPermission, false).catch((error) => {
        console.error('Auto-registration failed:', error);
      });
    }
  }, [token, isNotificationEnabled, notificationPermission, registerDeviceWithState]); // Dependencies for useEffect

  // --- Foreground Message Handling ---

  // Listen for incoming messages when the app is in the foreground
  useEffect(() => {
    // Only set up listener if notifications are enabled and messaging is initialized
    if (isNotificationEnabled && messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        // Display a toast for the new notification
        toast.success(payload.notification?.body || 'New notification received!');
        // Increment unread count for the new notification
        setUnreadCount(prev => prev + 1);
        
        // Optional: Trigger a browser notification if you want one to pop up even if app is open
        // (FCM automatically shows system notifications if app is in background/closed)
        if (payload.notification) {
          new Notification(payload.notification.title || 'New Notification', {
            body: payload.notification.body,
            icon: payload.notification.icon, // Or a default icon
            data: payload.data, // Custom data
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
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/mark-read/`, // Backend endpoint
        {}, // Empty body for PATCH as we're just triggering an action
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUnreadCount(prev => Math.max(0, prev - 1)); // Decrement unread count, ensuring it doesn't go below 0
      toast.success('Notification marked as read.');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read.');
    }
  }, [token, setUnreadCount]); // Dependencies for useCallback

  // --- Unregister Device ---

  const unregisterDevice = useCallback(async () => {
    // Only attempt to unregister from backend if we have an FCM token to unregister
    if (token && fcmToken) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/unregister/${fcmToken}/`, // Backend unregister endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Notifications successfully disabled from backend.');
      } catch (error: any) {
        console.error('Error unregistering device from backend:', error);
        // Show specific error if it's a 404 (token not found on backend)
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
    setFcmToken(null); // Clear the FCM token in state

    // Optional: Also delete the FCM token from the browser's IndexedDB.
    // This revokes the token on the client-side.
    // import { deleteToken } from 'firebase/messaging'; // Make sure to import this
    // if (messaging && fcmToken) {
    //   try {
    //     await deleteToken(messaging);
    //     console.log("FCM token deleted from client.");
    //   } catch (error) {
    //     console.error("Error deleting FCM token from client:", error);
    //   }
    // }
  }, [token, fcmToken, setIsNotificationEnabled, setFcmToken, messaging]); // Dependencies for useCallback


  // --- Context Value Memoization ---

  // Memoize the context value to ensure stable references and prevent unnecessary re-renders
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

// Custom hook to consume the NotificationContext
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
