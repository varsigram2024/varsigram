// hooks/useNotificationNavigation.ts
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-hot-toast';

export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleNotificationClick = (notification: any) => {
    console.log('=== NOTIFICATION CLICK DEBUG ===');
    console.log('Full notification object:', notification);
    console.log('Notification data:', notification.data);
    console.log('Notification type:', notification.data?.type);
    console.log('Sender object:', notification.sender);
    
    // Extract data from notification - the payload fields are in notification.data
    const data = notification.data || {};
    
    // Navigate based on notification type and target
    switch (data.type) {
      case 'comment':
      case 'reply':
      case 'mention':
        console.log('Comment/Reply/Mention notification - post_id:', data.post_id, 'comment_id:', data.comment_id);
        if (data.post_id) {
          // Navigate to post page with comment highlighting
          const params = new URLSearchParams();
          if (data.comment_id) {
            params.append('commentId', data.comment_id);
            params.append('highlight', 'true');
          }
          const targetUrl = `/posts/${data.post_id}?${params.toString()}`;
          console.log('Navigating to:', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('Post ID missing for comment/reply/mention notification');
          toast.error('Post not available');
        }
        break;

      case 'like':
      case 'new_post':
        console.log('Like/New Post notification - post_id:', data.post_id);
        if (data.post_id) {
          const targetUrl = `/posts/${data.post_id}`;
          console.log('Navigating to:', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('Post ID missing for like/new_post notification');
          toast.error('Post not available');
        }
        break;

      case 'follow':
        console.log('Follow notification - follower_display_name_slug:', data.follower_display_name_slug, 'follower_id:', data.follower_id, 'sender:', notification.sender);
        
        // First priority: Use display name slug if available
        if (data.follower_display_name_slug) {
          const targetUrl = `/user-profile/${data.follower_display_name_slug}`;
          console.log('Navigating to (using display name slug):', targetUrl);
          navigate(targetUrl);
        } 
        // Second priority: Use follower_id if display name slug is not available
        else if (data.follower_id) {
          // TEMPORARY: Navigate using follower_id until backend provides display_name_slug
          const targetUrl = `/user-profile/${data.follower_id}`;
          console.log('Navigating to (using follower_id as temporary fallback):', targetUrl);
          navigate(targetUrl);
        }
        // Third priority: Use sender username if available
        else if (notification.sender?.username) {
          const targetUrl = `/user-profile/${notification.sender.username}`;
          console.log('Navigating to (using sender username):', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('No user identifier found for follow notification');
          toast.error('User profile not available');
        }
        break;

      case 'system':
        console.log('System notification - title:', notification.title);
        // Handle system notifications - maybe show a modal or navigate to settings
        toast.info(notification.title || 'System notification');
        break;

      default:
        console.log('Unknown notification type:', data.type);
        // Default behavior for unknown types
        toast.info('Notification clicked');
        break;
    }
    console.log('=== END DEBUG ===');
  };

  return { handleNotificationClick };
};