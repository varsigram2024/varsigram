// ... existing code ...
import React, { useState, useEffect } from "react";
import { useViewTracking } from '../../context/viewTrackingContext';
import { useInView } from 'react-intersection-observer';
import { Text } from "../Text";
import { Img } from "../Img";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { ClickableUser } from "../ClickableUser";
import { useNavigate, useLocation } from "react-router-dom";
import CommentSection from "../CommentSection";
import { useAuth } from "../../auth/AuthContext";
import EditPostModal from "../EditPostModal";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

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
  view_count: number;
  trending_score: number;
  last_engagement_at: string | null;
  author_display_name: string;
  author_display_name_slug: string;
  author_name?: string;
  author_faculty?: string;
  author_department?: string;
  author_exclusive?: boolean;
  is_shared?: boolean;
  original_post?: Post;
  account_type: string;
  is_verified: boolean;
  exclusive: boolean;
  organization?: {
    user?: {
      is_verified: boolean;
    };
    exclusive: boolean;
    display_name_slug?: string;
    organization_name?: string;
  };
}

interface PostProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
  onPostDelete?: (post: Post) => void;
  onPostEdit?: (post: Post) => void;
  currentUserId?: string;
  currentUserEmail?: string;
  onClick?: () => void;
  showFullContent?: boolean;
  postsData?: Post[];
  isPublicView?: boolean; // Add this prop
}

const MAX_LENGTH = 250; // or use a maxHeight with CSS for a visual cutoff
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const Post: React.FC<PostProps> = ({
  post,
  onPostUpdate,
  onPostDelete,
  onPostEdit,
  currentUserId,
  currentUserEmail,
  onClick,
  showFullContent = false,
  postsData = [],
  isPublicView = false,
}) => {
  const { addToBatch } = useViewTracking();
  const [viewRef, inView] = useInView({
    threshold: 0.5, // 50% of the post is visible
    triggerOnce: true, // Only trigger once per post
  });

  useEffect(() => {
    if (inView && post.id) {
      addToBatch(post.id);
    }
  }, [inView, post.id, addToBatch]);

  const { token, user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  

  const handleShareClick = () => {
    handleWebShare();
  };

  // Helper to determine if content is long
  const isLong = post.content.length > MAX_LENGTH;
  const displayContent = expanded
    ? post.content
    : post.content.slice(0, MAX_LENGTH);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString();
  };

  const renderMedia = () => {
    if (!post.media_urls || post.media_urls.length === 0) return null;

    const mediaToShow = post.media_urls.slice(0, 4);

    // Different layouts based on number of images
    if (mediaToShow.length === 1) {
      return (
        <div className="mt-4">
          <Img
            src={mediaToShow[0]}
            alt="Post media"
            className="w-full max-h-96 object-cover rounded-lg"
          />
        </div>
      );
    } else if (mediaToShow.length === 2) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {mediaToShow.map((url, index) => (
            <Img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      );
    } else if (mediaToShow.length === 3) {
      return (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Img
            src={mediaToShow[0]}
            alt="Post media 1"
            className="w-full h-64 object-cover rounded-lg row-span-2"
          />
          <Img
            src={mediaToShow[1]}
            alt="Post media 2"
            className="w-full h-32 object-cover rounded-lg"
          />
          <Img
            src={mediaToShow[2]}
            alt="Post media 3"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      );
    } else {
      // 4 images
      return (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {mediaToShow.map((url, index) => (
            <Img
              key={index}
              src={url}
              alt={`Post media ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      );
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    if (!token) {
      toast.error("Please sign up to like posts");
      navigate("/welcome");
      return;
    }

    try {
      setIsLiking(true);
      setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
      setHasLiked((prev) => !prev);

      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
    } catch (error: any) {
      setLikeCount(post.like_count);
      setHasLiked(post.has_liked);

      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
          error.response?.data?.detail || error.response?.data?.message;

        if (status === 403 && message?.toLowerCase().includes("verify")) {
          toast.error("Please verify your email to like posts.");
        } else if (status === 401) {
          toast.error("You must be logged in to like posts.");
        } else if (message) {
          toast.error(message);
        } else {
          toast.error("Failed to update like status");
        }
      } else {
        toast.error("Failed to update like status");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handlePostDelete = async (postToDelete: Post) => {
    console.log("Post component - Deleting post:", postToDelete.id);
    console.log("Post component - Token being used:", token);
    console.log(
      "Post component - onPostDelete callback exists:",
      !!onPostDelete
    );

    if (!postToDelete.id) {
      toast.error("Cannot delete post: missing post identifier");
      return;
    }

    if (!token) {
      toast.error("Please login to delete posts");
      return;
    }

    try {
      console.log(
        "Post component - Making API call to delete post:",
        postToDelete.id
      );

      // First, make the API call
      const response = await axios.delete(
        `${API_BASE_URL}/posts/${postToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Post component - API call successful, response:",
        response.status
      );

      // Only after successful API call, call parent callback to remove from list
      if (onPostDelete) {
        console.log("Post component - Calling parent onPostDelete callback");
        onPostDelete(postToDelete);
      } else {
        console.log("Post component - No onPostDelete callback provided");
      }

      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Post component - Delete error:", error);
      console.error("Post component - Error response:", error.response?.data);
      toast.error("Failed to delete post");
      // Don't call onPostDelete here since the API call failed
    }
  };

  const handlePostEdit = (postToEdit: Post) => {
    setEditingPost(postToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (editedContent: string) => {
    if (!editingPost) return;

    if (!editingPost.id) {
      toast.error("Cannot edit post: missing post identifier");
      return;
    }

    if (!token) {
      toast.error("Please login to edit posts");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${editingPost.id}/`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  // Check if current user is the author
  const isAuthor = React.useMemo(() => {
    return (
      // Match by email (if author_username exists and matches email)
      (post.author_username &&
        (currentUserEmail === post.author_username ||
          user?.email === post.author_username)) ||
      // Match by user ID (convert to string for comparison)
      (post.author_id &&
        (currentUserId?.toString() === post.author_id.toString() ||
          user?.id?.toString() === post.author_id.toString()))
    );
  }, [
    post.author_username,
    post.author_id,
    currentUserEmail,
    currentUserId,
    user?.email,
    user?.id,
  ]);

  const handleUserClick = (username: string) => {
    navigate(`/user-profile/${username}`);
  };

  const postUrl = `${window.location.origin}/posts/${post.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWebShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post on Varsigram",
          text: post.content,
          url: postUrl,
        })
        .catch(() => toast.error("Share cancelled or failed"));
    } else {
      toast.error("Sharing not supported on this device");
    }
  };

  const handleShare = async () => {
    if (!token) {
      toast.error("Please revers posts");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/posts/${post.id}/share/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post revarsed!");
      // Optionally update share count in UI:
      if (onPostUpdate) {
        onPostUpdate({ ...post, share_count: post.share_count + 1 });
      }
    } catch (error) {
      toast.error("Failed to revars post");
    }
  };

  const isRevarsed = post.is_shared && post.original_post;

  const mappedPost = {
    ...post,
    account_type: post.organization ? "organization" : "student",
    is_verified: post.organization?.user?.is_verified ?? false,
    exclusive: post.organization?.exclusive ?? false,
    // ...other fields
  };

  const shouldShowReadMore = post.content.length > 200;

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const postPagePath = `/posts/${post.id}`;
    if (location.pathname !== postPagePath) {
      navigate(postPagePath, { state: { backgroundLocation: location } });
    } else {
      setShowComments(true);
    }
  };

  console.log("Post props in Post.tsx:", post);

  // Helper function to make links clickable
  const makeLinksClickable = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <>
    
      <div ref={viewRef}
      className="flex w-full flex-col items-center p-5 mb-6 rounded-xl bg-[#ffffff]">
        <div className="flex flex-col gap-7 self-stretch">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <Img
                  src={post.author_profile_pic_url || "/images/user.png"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover cursor-pointer"
                  onClick={() => {
                    console.log("Clicked name", post.author_display_name_slug);
                    if (post.author_display_name_slug) {
                      navigate(
                        `/user-profile/${post.author_display_name_slug}`
                      );
                    }
                  }}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold lg:text-[20px] text-[20px] text-[#750015] cursor-pointer hover:underline"
                      onClick={() => {
                        console.log(
                          "Clicked name",
                          post.author_display_name_slug
                        );
                        if (post.author_display_name_slug) {
                          navigate(
                            `/user-profile/${post.author_display_name_slug}`
                          );
                        }
                      }}
                    >
                      {post.author_name || post.author_display_name}
                    </span>
                    {post.author_exclusive && (
                      <img
                        src="/images/vectors/verified.svg"
                        alt="verified"
                        className="h-[16px] w-[16px]"
                      />
                    )}
                  </div>
                  {(post.author_faculty || post.author_department) && (
                    <Text
                      as="p"
                      className="text-[8px] lg:text-[12px] text-gray-600"
                    >
                      {post.author_faculty && post.author_department
                        ? `${post.author_faculty} • ${post.author_department}`
                        : post.author_faculty || post.author_department}
                    </Text>
                  )}
{/*                   <Text
                    as="p"
                    className="text-[9px] lg:text-[16px] text-gray-500"
                  >
                    {formatTimestamp(post.timestamp)}
                  </Text> */}
                </div>
              </div>
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

            {post.account_type === "organization" &&
              post.is_verified &&
              post.exclusive && (
                <img
                  src="/images/vectors/verified.svg"
                  alt="verified"
                  className="h-[16px] w-[16px]"
                />
              )}
          </div>
          <div className="h-[0.6px] w-92 bg-gray-300"></div>
          <Text
            as="p"
            className={`w-full text-[10px] sm:text-[10px] lg:text-[16px] font-normal text-black bg-transparent border-none outline-none focus:outline-none whitespace-pre-line break-words ${
              !expanded && isLong ? "max-h-32 overflow-hidden" : ""
            }`}
            style={{ lineHeight: "1.6" }}
          >
            {isRevarsed && (
              <div className="text-xs text-gray-500 mb-2">
                <span>
                  <b>{post.author_name || post.author_display_name}</b> revarsed
                </span>
              </div>
            )}
            {isRevarsed ? (
              <div className="border p-2 rounded bg-gray-50 whitespace-pre-line">
                <Text className="text-[12px] sm:text-[14px] lg:text-[16px]">
                  {makeLinksClickable(post.original_post?.content || "")}
                </Text>
                <div className="text-xs text-gray-400 mt-1">
                  by{" "}
                  {post.original_post?.author_name ||
                    post.original_post?.author_display_name}
                </div>
              </div>
            ) : (
              makeLinksClickable(displayContent)
            )}
            {!expanded && isLong && <span>...</span>}
          </Text>

          {/* Read more/less button */}
          {!expanded && isLong && (
            <button
              className="text-[#750015] font-semibold mt-2 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
            >
              Read more
            </button>
          )}
          {expanded && isLong && (
            <button
              className="text-[#750015] font-semibold mt-2 hover:underline"
              onClick={() => setExpanded(false)}
            >
              Show less
            </button>
          )}

          {renderMedia()}

          
          <div className="flex justify-between items-center border-t pt-4">
            {/* Like button */}
            {/* <div 
              className={`flex items-center gap-2 ${token ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`} 
              onClick={token ? handleLike : () => {
                toast.error('Please sign up to like posts');
                navigate('/welcome');
              }}
            >
              {isLiking ? (
                <svg
                  className="animate-spin h-4 w-4 text-[#750015]"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <img
                  src={
                    hasLiked
                      ? "/images/vectors/like_filled.svg"
                      : "/images/vectors/like.svg"
                  }
                  alt="Like"
                  className="h-[20px] w-[20px]"
                />
              )}
              <span>{likeCount}</span>
            </div> */}

            {/* View count */}
            <div className="flex items-center gap-2">
              <svg width="16px" height="16px" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
              </svg>
              <span>{post.view_count || 0}</span>
            </div>

            {/* Comment button */}
            <div 
              className={`flex items-center gap-2 ${token ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`} 
              onClick={token ? handleCommentClick : () => {
                toast.error('Please sign up to view comments');
                navigate('/welcome');
              }}
            >
              <Img
                src="/images/vectors/vars.svg"
                alt="Comment"
                className="h-[20px] w-[20px]"
              />
              <Text as="p" className="text-[14px] font-normal">
                {post.comment_count}
              </Text>
            </div>

            {/* Share button */}
            <div className="relative">
              <Img
                src="/images/vectors/sharearrow.svg"
                alt="Share"
                className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer"
                onClick={handleShareClick}
              />
            </div>
          </div>

          {/* Show sign-up prompt for public viewers */}
          {isPublicView && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-blue-800 text-sm font-medium">
                    Join Varsigram to like, comment, and share posts!
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    Connect with your university community
                  </p>
                </div>
                <button
                  onClick={() => navigate("/welcome")}
                  className="bg-[#750015] text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-[#5a0010] transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          <CommentSection
            open={showComments}
            onClose={() => setShowComments(false)}
            postId={post.id}
          />
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