// src/components/Post.tsx
import React, { useState } from 'react';
import { Text } from '../Text';
import { Img } from '../Img';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config'; // Adjust the path to your Firebase config
import axios from 'axios';
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { ClickableUser } from '../ClickableUser';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
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
}

interface PostProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (postId: string) => void;
  onPostEdit?: (post: Post) => void;
  currentUserEmail?: string;
}

export const Post: React.FC<PostProps> = ({ 
  post, 
  onPostUpdate, 
  onPostDelete, 
  onPostEdit,
  currentUserEmail
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.like_count);
  const [localHasLiked, setLocalHasLiked] = useState(post.has_liked);
  const [showOptions, setShowOptions] = useState(false);
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

    return (
      <div className="mt-4 grid gap-2">
        {post.media_urls.map((url, index) => (
          <Img
            key={index}
            src={url}
            alt={`Post media ${index + 1}`}
            className="w-full rounded-lg max-h-[500px] object-cover"
          />
        ))}
      </div>
    );
  };

  const handleLike = async () => {
    if (isLiking) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      setIsLiking(true);
      setLocalLikeCount(prev => localHasLiked ? prev - 1 : prev + 1);
      setLocalHasLiked(prev => !prev);

      const response = await axios.post(
        `https://api.varsigram.com/api/v1/posts/${post.slug}/like/`,
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
      setLocalLikeCount(post.like_count);
      setLocalHasLiked(post.has_liked);
      toast.error('Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to delete posts');
      return;
    }

    try {
      await axios.delete(
        `https://api.varsigram.com/api/v1/posts/${post.slug}/delete/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (onPostDelete) {
        onPostDelete(post.id);
      }
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = () => {
    if (onPostEdit) {
      onPostEdit(post);
    }
  };

  const isAuthor = currentUserEmail === post.author_username;

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="flex w-full flex-col items-center md:w-full lg:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
      <div className="flex flex-col gap-7 self-stretch">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center">
              <ClickableUser
                username={post.author_username}
                profilePicUrl={post.author_profile_pic_url}
                displayName={post.author_username}
                onUserClick={handleUserClick}
                size="medium"
              />
            </div>
            
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
                        handleEdit();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        handleDelete();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-px bg-[#d9d9d9]" />
        </div>

        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
          {post.content}
        </Text>

        {renderMedia()}

        <div className="h-px bg-[#d9d9d9]" />

        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center gap-1 lg:gap-2 cursor-pointer"
              onClick={handleLike}
            >
              <Img 
                src={localHasLiked ? "images/vectors/like_filled.svg" : "images/vectors/like.svg"} 
                alt="Likes" 
                className={`h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] ${isLiking ? 'opacity-50' : ''}`}
              />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">
                {localLikeCount}
              </Text>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              <Img src="images/vectors/vers.svg" alt="Comments" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">{post.comment_count}</Text>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              <Img src="images/vectors/revers.svg" alt="Shares" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">{post.share_count}</Text>
            </div>
            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};