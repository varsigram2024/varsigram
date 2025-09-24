// hooks/useNotificationNavigation.ts
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-hot-toast';

export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleNotificationClick = (notification: any) => {
    // Mark as read first (optional)
    // await markAsRead(notification.id);
    
    // Navigate based on notification type and target
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'reply':
      case 'mention':
        if (notification.target_post_id) {
          // Navigate to post page
          navigate(`/posts/${notification.target_post_id}`, {
            state: {
              scrollToComment: notification.target_comment_id,
              highlightComment: notification.target_comment_id
            }
          });
        } else if (notification.post?.id) {
          // Fallback to post ID from post object
          navigate(`/posts/${notification.post.id}`);
        } else {
          toast.error('Post not available');
        }
        break;

      case 'follow':
        if (notification.target_user_slug) {
          navigate(`/user-profile/${notification.target_user_slug}`);
        } else if (notification.sender?.username) {
          navigate(`/user-profile/${notification.sender.username}`);
        }
        break;

      case 'system':
        // Handle system notifications - maybe show a modal or navigate to settings
        toast.info(notification.title);
        break;

      default:
        // Default behavior - just mark as read
        toast.info('Notification clicked');
        break;
    }
  };

  return { handleNotificationClick };
};