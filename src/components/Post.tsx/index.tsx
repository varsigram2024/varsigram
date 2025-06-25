import React, { useState } from 'react';
import { Text } from '../Text';
import { Img } from '../Img';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { ClickableUser } from '../ClickableUser';
import { useNavigate } from 'react-router-dom';
import CommentSection from '../CommentSection';
import { useAuth } from "../../auth/AuthContext";
import EditPostModal from '../EditPostModal';


interface Post {
  id: string;
  author_id: string;
  author_username: string;
  author_profile_pic_url: string | null;
  content: string;
  slug: string;
  media_urls: string[];
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  trending_score: number;
  last_engagement_at: string | null;
  author_display_name: string;
  author_display_name_slug: string;
  author_name?: string;
}

interface PostProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (post: Post) => void;
  onPostEdit?: (post: Post) => void;
  currentUserId?: string;
  currentUserEmail?: string;
}

export const Post: React.FC<PostProps> = ({ 
  post, 
  onPostUpdate, 
  onPostDelete, 
  onPostEdit,
  currentUserId,
  currentUserEmail
}) => {
  const { token, user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString();
  };

  const renderMedia = () => {
    if (!post.media_urls || post.media_urls.length === 0) return null;
    // Only show up to 4 images
    const mediaToShow = post.media_urls.slice(0, 4);
    return (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {mediaToShow.map((url, index) => (
          <Img
            key={index}
            src={url}
            alt={`Post media ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg"
          />
        ))}
      </div>
    );
  };

  const handleLike = async () => {
    if (isLiking) return;

    if (!token) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      setIsLiking(true);
      setLikeCount(prev => hasLiked ? prev - 1 : prev + 1);
      setHasLiked(prev => !prev);

      const response = await axios.post(
        `https://api.varsigram.com/api/v1/posts/${post.id}/like/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (onPostUpdate) {
        onPostUpdate({
          ...post,
          like_count: response.data.like_count,
          has_liked: response.data.has_liked,
        });
      }
    } catch (error) {
      setLikeCount(post.like_count);
      setHasLiked(post.has_liked);
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handlePostDelete = async (postToDelete: Post) => {
    if (!postToDelete.id) {
      toast.error('Cannot delete post: missing post identifier');
      return;
    }

    if (!token) {
      toast.error('Please login to delete posts');
      return;
    }

    try {
      await axios.delete(
        `https://api.varsigram.com/api/v1/posts/${postToDelete.id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Call parent callback to remove from list
      if (onPostDelete) {
        onPostDelete(postToDelete);
      }
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handlePostEdit = (postToEdit: Post) => {
    setEditingPost(postToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (editedContent: string) => {
    if (!editingPost) return;

    if (!editingPost.id) {
      toast.error('Cannot edit post: missing post identifier');
      return;
    }

    if (!token) {
      toast.error('Please login to edit posts');
      return;
    }

    try {
      const response = await axios.put(
        `https://api.varsigram.com/api/v1/posts/${editingPost.id}/`,
        { content: editedContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedPost = { ...editingPost, content: editedContent };
      
      // Update parent component if callback provided
      if (onPostUpdate) {
        onPostUpdate(updatedPost);
      }

      setIsEditModalOpen(false);
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  // Check if current user is the author
  const isAuthor = React.useMemo(() => {
    return (
      // Match by email (if author_username exists and matches email)
      (post.author_username && (currentUserEmail === post.author_username || user?.email === post.author_username)) ||
      // Match by user ID (convert to string for comparison)
      (post.author_id && (currentUserId?.toString() === post.author_id.toString() || user?.id?.toString() === post.author_id.toString()))
    );
  }, [post.author_username, post.author_id, currentUserEmail, currentUserId, user?.email, user?.id]);

  const handleUserClick = (username: string) => {
    navigate(`/user-profile/${username}`);
  };

 

  return (
    <>
      <div className="flex w-full flex-col items-center p-5 mb-6 rounded-xl bg-[#ffffff]">
        <div className="flex flex-col gap-7 self-stretch">
          <div className="flex justify-between items-start">
          <ClickableUser
              displayNameSlug={post.author_display_name_slug ?? ''}
              profilePicUrl={post.author_profile_pic_url}
              displayName={post.author_name || post.author_display_name || post.author_username || 'Unknown User'}
              onUserClick={(slug) => navigate(`/user-profile/${slug}`)}
              size="medium"
            />

            {isAuthor && (
              <div className="relative">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical size={20} />
                </button>

                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <button 
                      onClick={() => { 
                        setShowOptions(false); 
                        handlePostEdit(post); 
                      }} 
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <Edit size={16} /> <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => { 
                        setShowOptions(false); 
                        handlePostDelete(post); 
                      }} 
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 size={16} /> <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
            {post.content}
          </Text>

          {renderMedia()}

          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLike}>
              {isLiking ? (
                <svg className="animate-spin h-4 w-4 text-[#750015]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <img
                  src={hasLiked ? "/images/vectors/like_filled.svg" : "/images/vectors/like.svg"}
                  alt="Like"
                  className="h-[20px] w-[20px]"
                />
              )}
              <span>{likeCount}</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowComments(true)}>
              <Img src="/images/vectors/vers.svg" alt="Comment" className="h-[20px] w-[20px]" />
              <Text as="p" className="text-[14px] font-normal">{post.comment_count}</Text>
            </div>

            <div className="flex items-center gap-2">
              <Img src="/images/vectors/revers.svg" alt="Share" className="h-[20px] w-[20px]" />
              <Text as="p" className="text-[14px] font-normal">{post.share_count}</Text>
            </div>
            <Img src="/images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
          </div>

          <CommentSection open={showComments} onClose={() => setShowComments(false)} postId={post.id} />
        </div>
      </div>

      {isEditModalOpen && editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPost(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
