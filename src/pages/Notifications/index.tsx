import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Text } from '../../components/Text/index.tsx';
import { Img } from '../../components/Img/index.tsx';
import { Heading } from '../../components/Heading/index.tsx';
import Sidebar1 from '../../components/Sidebar1/index.tsx';
import BottomNav from '../../components/BottomNav/index.tsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    username: string;
    profile_pic_url: string | null;
  };
  post?: {
    id: string;
    content: string;
  };
}

export default function NotificationsPage() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNotifications(response.data.results || response.data);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
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
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '/images/vectors/like_filled.svg';
      case 'comment':
        return '/images/vectors/comment.svg';
      case 'follow':
        return '/images/vectors/user.svg';
      case 'mention':
        return '/images/vectors/at.svg';
      default:
        return '/images/vectors/bell.svg';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-[1200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <Text className="mt-4 text-gray-600">Loading notifications...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar1 />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between w-full p-4 bg-white shadow-sm">
          <Heading size="lg" className="text-gray-900">
            Notifications
          </Heading>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="w-full bg-white">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Img
                src="/images/vectors/bell.svg"
                alt="No notifications"
                className="w-16 h-16 text-gray-400 mb-4"
              />
              <Text className="text-gray-600 text-center">
                No notifications yet
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2">
                When you get notifications, they'll appear here
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      <Img
                        src={getNotificationIcon(notification.type)}
                        alt={notification.type}
                        className="w-6 h-6"
                      />
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {notification.sender && (
                          <Img
                            src={notification.sender.profile_pic_url || '/images/user-image.png'}
                            alt={notification.sender.username}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <Text className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </Text>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <Text className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </Text>
                      
                      {notification.post && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          "{notification.post.content.substring(0, 100)}..."
                        </div>
                      )}
                      
                      <Text className="text-xs text-gray-400 mt-2">
                        {formatTimeAgo(notification.created_at)}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
} 