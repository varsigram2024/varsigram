import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
  read: boolean;
  created_at: string;
  data?: any;
}

interface InAppNotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const InAppNotificationContext = createContext<InAppNotificationContextType | undefined>(undefined);

export const InAppNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/in-app/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications(response.data.results || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!token) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/in-app/${notificationId}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/in-app/mark-all-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Fetch notifications on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };

  return (
    <InAppNotificationContext.Provider value={value}>
      {children}
    </InAppNotificationContext.Provider>
  );
};

export const useInAppNotification = () => {
  const context = useContext(InAppNotificationContext);
  if (context === undefined) {
    throw new Error('useInAppNotification must be used within an InAppNotificationProvider');
  }
  return context;
}; 