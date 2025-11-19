// hooks/useNotificationNavigation.ts
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-hot-toast';

export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleNotificationClick = (notification: any) => {
    
    if (notification.data) {
      console.log('   📋 DATA OBJECT:');
      Object.keys(notification.data).forEach(key => {
        console.log(`     - data.${key}:`, notification.data[key]);
      });
    } else {
      console.log('   📋 DATA OBJECT: null or undefined');
    }
    
    if (notification.sender) {
      console.log('   👤 SENDER OBJECT:');
      Object.keys(notification.sender).forEach(key => {
        console.log(`     - sender.${key}:`, notification.sender[key]);
      });
    } else {
      console.log('   👤 SENDER OBJECT: null or undefined');
    }
    
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
          const targetUrl = `/posts/${data.post_id}?${params.toString()}`;
          console.log('   🚀 Navigating to:', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('❌ Post ID missing for comment/reply/mention notification');
          toast.error('Post not available');
        }
        break;

      case 'like':
      case 'new_post':
        if (data.post_id) {
          const targetUrl = `/posts/${data.post_id}`;
          console.log('   🚀 Navigating to:', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('❌ Post ID missing for like/new_post notification');
          toast.error('Post not available');
        }
        break;

        case 'reward_point':
        if (data.post_id) {
          const targetUrl = `/posts/${data.post_id}`;
          console.log('   🎁 Reward navigation →', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('❌ Post ID missing for reward notification');
          toast.error('Post not available');
        }
        break;


      case 'follow':
        
        // Priority 1: Use display name slug for organizations
        if (data.follower_display_name_slug) {
          const targetUrl = `/user-profile/${data.follower_display_name_slug}`;
          console.log('   🏢 Organization detected');
          console.log('   🚀 Navigating to (using display name slug):', targetUrl);
          navigate(targetUrl);
        } 
        // Priority 2: Use follower_id for students (temporary until they get display_name_slug)
        else if (data.follower_id) {
          const targetUrl = `/user-profile/${data.follower_id}`;
          navigate(targetUrl);
        }
        // Priority 3: Fallback to sender username if available
        else if (notification.sender?.username) {
          const targetUrl = `/user-profile/${notification.sender.username}`;
          console.log('   🔄 Using sender username fallback');
          console.log('   🚀 Navigating to:', targetUrl);
          navigate(targetUrl);
        } else {
          console.warn('❌ No user identifier found for follow notification');
          toast.error('User profile not available');
        }
        break;

      case 'system':
        console.log('⚙️ System notification');
        console.log('   - Title:', notification.title);
        break;

      default:
        console.log('❓ Unknown notification type:', data.type);
        // Default behavior for unknown types
        break;
    }
    console.log('✅ === END NOTIFICATION HANDLER DEBUG ===');
  };

  return { handleNotificationClick };
};