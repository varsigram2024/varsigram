// hooks/useNotificationNavigation.ts
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-hot-toast';

export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleNotificationClick = (notification: any) => {
    // Extract data from notification - the payload fields are in notification.data
    const data = notification.data || {};
    
    // Navigate based on notification type and target
    switch (data.type) {
      case 'comment':
      case 'reply':
      case 'mention':
        if (data.post_id) {
          // Navigate to post page with comment highlighting
          const params = new URLSearchParams();
          if (data.comment_id) {
            params.append('commentId', data.comment_id);
            params.append('highlight', 'true');
          }
          navigate(`/posts/${data.post_id}?${params.toString()}`);
        } else {
          toast.error('Post not available');
        }
        break;

      case 'like':
      case 'new_post':
        if (data.post_id) {
          navigate(`/posts/${data.post_id}`);
        } else {
          toast.error('Post not available');
        }
        break;

      case 'follow':
        if (data.follower_id) {
          // Navigate to follower's profile using their ID
          navigate(`/profile/${data.follower_id}`);
        } else if (notification.sender?.username) {
          // Fallback to sender username if follower_id not available
          navigate(`/profile/${notification.sender.username}`);
        } else {
          toast.error('User profile not available');
        }
        break;

      case 'system':
        // Handle system notifications - maybe show a modal or navigate to settings
        toast.info(notification.title || 'System notification');
        break;

      default:
        // Default behavior for unknown types
        toast.info('Notification clicked');
        break;
    }
  };

  return { handleNotificationClick };
};