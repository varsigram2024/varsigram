import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Text } from '../../components/Text/index.tsx';
import { Img } from '../../components/Img/index.tsx';
import { Heading } from '../../components/Heading/index.tsx';
import Sidebar1 from '../../components/Sidebar1/index.tsx';
import BottomNav from '../../components/BottomNav/index.tsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Adjusted interface to match backend model and common naming conventions
interface Notification {
  id: number; // Assuming integer ID from Django's AutoField
  title: string;
  body: string; // Changed from 'message' to 'body' to match Django model
  data: Record<string, any> | null; // For custom JSON data
  is_read: boolean;
  created_at: string;
  read_at: string | null; // When it was marked read
  // Optional related objects (ensure your serializer includes these if needed)
  sender?: {
    id: number; // Assuming integer ID
    username: string;
    profile_pic_url: string | null;
  };
  post?: {
    id: number; // Assuming integer ID
    content: string;
  };
  type: string; // Ensure your backend sends a 'type' field in the `data` payload or as a separate field
                // Example: data: { "type": "like" }
                // If it's a direct field on Notification model, add it.
}

export default function NotificationsPage() {
  const { token, user } = useAuth(); // Assuming `user` is also available for potential display
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // This will be managed by separate fetches/updates

  // Combine fetching notifications and unread count
  useEffect(() => {
    if (token) {
      fetchNotificationsAndCount();
    }
  }, [token]); // Dependency on token to refetch when user logs in/out

  const fetchNotificationsAndCount = async () => {
    setLoading(true); // Set loading true at the start of the combined fetch
    try {
      // 1. Fetch all notifications for the user
      const notificationsResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/`, // Assumes pagination, if not remove .results
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Adjust this based on whether your API uses pagination results (response.data.results)
      // or returns a direct array (response.data)
      setNotifications(notificationsResponse.data.results || notificationsResponse.data);

      // 2. Fetch unread count separately (since NotificationListView doesn't provide it)
      const unreadCountResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/unread_count/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUnreadCount(unreadCountResponse.data.unread_count || 0);

    } catch (error) {
      console.error('Error fetching notifications or unread count:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => { // Use number for ID
    try {
      const response = await axios.patch( // Use patch as per backend
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/mark-read/`,
        {}, // Empty body is fine for a PATCH action
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state: mark as read and decrement count
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, read_at: response.data.read_at || new Date().toISOString() } // Update read_at from response or locally
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read!'); // Provide feedback
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read/`, // NEW backend endpoint
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update all notifications in local state as read
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0); // Set unread count to 0
      toast.success('All notifications marked as read!');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read.');
    }
  };

  // Helper to get icon based on notification 'type'
  // Ensure your backend's 'data' JSONField contains a 'type' key
  // or that 'type' is a direct field on your Notification model.
  const getNotificationIcon = (type: string | undefined) => { // 'type' can be undefined if not present
    switch (type) {
      case 'like':
        return '/images/vectors/like_filled.svg';
      case 'comment':
        return '/images/vectors/vars.svg';
      case 'follow':
        return '/images/vectors/follow.svg';
      case 'mention':
        return '/images/vectors/at.svg';
      // case 'system': // Added system type icon
        // return '/images/vectors/settings.svg';
      default:
        return '/images/vectors/bell.svg'; // Default bell icon
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    // Consider adding days, weeks, months, years for older notifications
    if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}d ago`; // 30 days
    
    // Fallback for older dates (e.g., "Jan 1, 2024")
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return created.toLocaleDateString(undefined, options);
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
              className="text-sm text-blue-600 hover:text-blue-800 font-medium" // Added font-medium
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
                When you get notifications, they'll appear here.
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
                    {/* Notification Icon (derived from notification.type) */}
                    <div className="flex-shrink-0">
                      <Img
                        src={getNotificationIcon(notification.data?.type)} // Access type from 'data' field
                        alt={notification.data?.type || 'notification'}
                        className="w-6 h-6"
                      />
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {notification.sender && (
                          // Ensure profile_pic_url is an absolute URL or correctly prefixed
                          <Img
                            src={notification.sender.profile_pic_url || '/images/user-image.png'}
                            alt={notification.sender.username}
                            className="w-6 h-6 rounded-full object-cover" // Added object-cover
                          />
                        )}
                        <Text className="text-sm font-medium text-gray-900 flex-1">
                          {notification.title}
                        </Text>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <Text className="text-sm text-gray-600 mt-1">
                        {notification.body} {/* Use notification.body */}
                      </Text>
                      
                      {notification.post && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          {/* Display full content or truncate as needed */}
                          "{notification.post.content}"
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