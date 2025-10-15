// ... existing code ...
import React, { useState, useEffect } from "react";
import { useViewTracking } from '../../context/viewTrackingContext';
import { useInView } from 'react-intersection-observer';
import { Text } from "../Text";
import { Img } from "../Img";
import { PostSkeleton } from "../PostSkeleton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImagePreviewer } from "../ImagePreviewer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CommentSection from "../CommentSection";
import { useAuth } from "../../auth/AuthContext";
import EditPostModal from "../EditPostModal";
import { Link } from "react-router-dom";


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
  author_pg_id?: string; 
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
  isPublicView?: boolean;
  onRequireAuth?: () => void;
  isLoading?: boolean;
}

  // Add this interface near your other interfaces
interface ImagePreviewState {
  isOpen: boolean;
  currentIndex: number;
  images: string[];
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
  isLoading = false,
  onRequireAuth,
}) => {
    if (isLoading) {
    return <PostSkeleton />;
  }
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);


  

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



// Add this state with your other useState declarations
const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
  isOpen: false,
  currentIndex: 0,
  images: []
});

// Add these functions to handle image preview
const openImagePreview = (imageIndex: number) => {
  setImagePreview({
    isOpen: true,
    currentIndex: imageIndex,
    images: post.media_urls
  });
};

const closeImagePreview = () => {
  setImagePreview({
    isOpen: false,
    currentIndex: 0,
    images: []
  });
};

const goToNextImage = () => {
  setImagePreview(prev => ({
    ...prev,
    currentIndex: (prev.currentIndex + 1) % prev.images.length
  }));
};

const goToPrevImage = () => {
  setImagePreview(prev => ({
    ...prev,
    currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
  }));
};

const selectImage = (index: number) => {
  setImagePreview(prev => ({
    ...prev,
    currentIndex: index
  }));
};

// Add keyboard navigation for the image preview
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!imagePreview.isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        closeImagePreview();
        break;
      case 'ArrowRight':
        goToNextImage();
        break;
      case 'ArrowLeft':
        goToPrevImage();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [imagePreview.isOpen]);

  


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
          className="w-full max-h-96 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => openImagePreview(0)}
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
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openImagePreview(index)}
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
          className="w-full h-64 object-cover rounded-lg row-span-2 cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => openImagePreview(0)}
        />
        <Img
          src={mediaToShow[1]}
          alt="Post media 2"
          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => openImagePreview(1)}
        />
        <Img
          src={mediaToShow[2]}
          alt="Post media 3"
          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => openImagePreview(2)}
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
            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => openImagePreview(index)}
          />
        ))}
      </div>
    );
  }
};





// In the Post component, update the handleFollow function:

const handleFollow = async () => {
  if (!user || !token) {
    toast.error("Please login to follow users.");
    navigate("/welcome");
    return;
  }

  try {
    setIsFollowLoading(true);
    
    const follower_type = user.account_type || "student";
    const follower_id = user.id;
    const followee_type = post.account_type || "student";
    
    

    // Extract a single followee_id value
    let followee_id;
    
    if (post.author_pg_id) {
      // If author_pg_id is an array, take the first element
      if (Array.isArray(post.author_pg_id)) {
        followee_id = post.author_pg_id[0];
        console.warn("author_pg_id is an array, using first element:", followee_id);
      } else {
        followee_id = post.author_pg_id;
      }
    } else if (post.author_id) {
      // If author_id is an array, take the first element
      if (Array.isArray(post.author_id)) {
        followee_id = post.author_id[0];
        console.warn("author_id is an array, using first element:", followee_id);
      } else {
        followee_id = post.author_id;
      }
    } else {
      toast.error("Cannot follow: user information missing");
      return;
    }

    // Ensure followee_id is a number (convert if it's a string)
    if (typeof followee_id === 'string') {
      followee_id = parseInt(followee_id, 10);
      if (isNaN(followee_id)) {
        toast.error("Invalid user ID format");
        return;
      }
    }

    console.log("Final follow attempt:", {
      follower_type,
      follower_id,
      followee_type,
      followee_id
    });

    if (isFollowing) {
      // Unfollow logic
      await axios.post(
        `${API_BASE_URL}/users/unfollow/`,
        { follower_type, follower_id, followee_type, followee_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(false);
      toast.success("Unfollowed successfully");
    } else {
      // Follow logic
      await axios.post(
        `${API_BASE_URL}/users/follow/`,
        { follower_type, follower_id, followee_type, followee_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(true);
      toast.success("Followed successfully");
    }
  } catch (error: any) {
    
    
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.followee_id) {
        toast.error(`Followee ID error: ${errorData.followee_id[0]}`);
      } else {
        toast.error(errorData.detail || errorData.message || "Invalid request");
      }
    } else {
      toast.error("Failed to follow user");
    }
  } finally {
    setIsFollowLoading(false);
  }
};

// Update the follow status check useEffect:

useEffect(() => {
  const checkIfFollowing = async () => {
    if (!token || !user?.id) {
      
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/following/`,
        {
          params: {
            follower_type: user.account_type || "student",
            follower_id: user.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     

      // Extract a single author ID to compare against
      let authorIdToCheck;
      
      if (post.author_pg_id) {
        authorIdToCheck = Array.isArray(post.author_pg_id) ? post.author_pg_id[0] : post.author_pg_id;
      } else if (post.author_id) {
        authorIdToCheck = Array.isArray(post.author_id) ? post.author_id[0] : post.author_id;
      } else {
        
        setIsFollowing(false);
        return;
      }

      // Convert to number if it's a string
      if (typeof authorIdToCheck === 'string') {
        authorIdToCheck = parseInt(authorIdToCheck, 10);
      }

      const isUserFollowing = response.data.some((followingItem: any) => {
        const followeeOrg = followingItem.followee_organization;
        const followeeStudent = followingItem.followee_student;
        const followee = followeeOrg || followeeStudent;
        
        if (!followee || !followee.user?.id) return false;
        
        // Compare using the PostgreSQL user ID
        const followeeUserId = followee.user.id;
        return followeeUserId === authorIdToCheck;
      });
      
      
      setIsFollowing(!!isUserFollowing);
      
    } catch (error) {
      
      setIsFollowing(false);
    }
  };

  checkIfFollowing();
}, [token, user, post.author_pg_id, post.author_id]);








  const handleLike = async () => {
    
    if (isLiking) return;

      if (isPublicView && onRequireAuth) {
    onRequireAuth();
    return;
  }

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
    

    if (!postToDelete.id) {
      toast.error("Cannot delete post: missing post identifier");
      return;
    }

    if (!token) {
      toast.error("Please login to delete posts");
      return;
    }

    try {
      

      // First, make the API call
      const response = await axios.delete(
        `${API_BASE_URL}/posts/${postToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      

      // Only after successful API call, call parent callback to remove from list
      if (onPostDelete) {
       
        onPostDelete(postToDelete);
      } else {
        console.log("Post component - No onPostDelete callback provided");
      }

      toast.success("Post deleted successfully");
    } catch (error) {
      
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
      if (isPublicView && onRequireAuth) {
    onRequireAuth();
    return;
  }
  e.stopPropagation();
  const postPagePath = `/posts/${post.id}`;
  
  // Always navigate to the post page as a full page, not as modal
  navigate(postPagePath);
};


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
                        className="font-semibold lg:text-[20px] text-[14px] text-[#3a3a3a] cursor-pointer hover:underline"
                        onClick={() => {
                          console.log("Clicked name", post.author_display_name_slug);
                          if (post.author_display_name_slug) {
                            navigate(`/user-profile/${post.author_display_name_slug}`);
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
                      
                      {/* Add Follow Button - Only show if not the author and not already following */}
                      {!isAuthor && token && !isFollowing && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow();
                          }}
                          disabled={isFollowLoading}
                          className="ml-2 px-3 py-1 bg-[#750015] text-white text-[0.5rem] rounded-full hover:bg-[#5a0010] disabled:opacity-50 transition-colors"
                      >
                        {isFollowLoading ? "..." : "FOLLOW"}
                      </button>
                    )}
                    
                    {/* Show Following badge if already following */}
                    {!isAuthor && token && isFollowing && (
                      <span className="ml-2 px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        Following
                      </span>
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
            {/*     <Text
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
              className={`w-full text-[10px] sm:text-[10px] lg:text-[16px] font-normal text-black bg-transparent border-none outline-none focus:outline-none whitespace-pre-line break-words overflow-hidden ${
                !expanded && isLong ? "max-h-32 overflow-hidden" : ""
              }`}
              style={{ 
                lineHeight: "1.6",
                wordBreak: "break-word", // This ensures long words break
                overflowWrap: "break-word", // Alternative for better browser support
              }}
            >
              {isRevarsed && (
                <div className="text-xs text-gray-500 mb-2">
                  <span>
                    <b>{post.author_name || post.author_display_name}</b> revarsed
                  </span>
                </div>
              )}
              {isRevarsed ? (
                <div className="border p-2 rounded bg-gray-50 whitespace-pre-line break-words">
                  <Text className="text-[12px] sm:text-[14px] lg:text-[16px] break-words">
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
              {!expanded && isLong && (
                <button
                  className="text-[#750015] font-semibold mt-2 hover:underline block"
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
            </Text>



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


            {/* Point count */}
            <div className="flex items-center gap-2">
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0964 6.76172V9.04743C14.0964 10.0379 11.7085 11.3331 8.76302 11.3331C5.8175 11.3331 3.42969 10.0379 3.42969 9.04743V7.14267" stroke="#750015" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.65234 7.34155C4.31139 8.21622 6.34949 9.03679 8.76168 9.03679C11.7072 9.03679 14.095 7.81317 14.095 6.76174C14.095 6.17127 13.343 5.52441 12.1628 5.07031" stroke="#750015" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.8112 2.95312V5.23884C11.8112 6.22932 9.42339 7.52455 6.47786 7.52455C3.53234 7.52455 1.14453 6.22932 1.14453 5.23884V2.95312" stroke="#750015" stroke-linecap="round" stroke-linejoin="round"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.47786 5.22721C9.42339 5.22721 11.8112 4.00359 11.8112 2.95216C11.8112 1.90073 9.42339 0.667969 6.47786 0.667969C3.53234 0.667969 1.14453 1.89997 1.14453 2.95216C1.14453 4.00359 3.53234 5.22721 6.47786 5.22721Z" stroke="#750015" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>


              <span>{"+1"}</span>
            </div>



            {/* View count */}
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8C16.8229 8 17.599 8.15625 18.3281 8.46875C19.0573 8.78125 19.6927 9.20833 20.2344 9.75C20.776 10.2917 21.2083 10.9323 21.5312 11.6719C21.8542 12.4115 22.0104 13.1875 22 14C22 14.8333 21.8438 15.6094 21.5312 16.3281C21.2188 17.0469 20.7917 17.6823 20.25 18.2344C19.7083 18.7865 19.0677 19.2188 18.3281 19.5312C17.5885 19.8438 16.8125 20 16 20C15.1667 20 14.3906 19.8438 13.6719 19.5312C12.9531 19.2188 12.3177 18.7917 11.7656 18.25C11.2135 17.7083 10.7812 17.0729 10.4688 16.3438C10.1562 15.6146 10 14.8333 10 14C10 13.1771 10.1562 12.401 10.4688 11.6719C10.7812 10.9427 11.2083 10.3073 11.75 9.76562C12.2917 9.22396 12.9271 8.79167 13.6562 8.46875C14.3854 8.14583 15.1667 7.98958 16 8ZM16 18C16.5521 18 17.0677 17.8958 17.5469 17.6875C18.026 17.4792 18.4531 17.1927 18.8281 16.8281C19.2031 16.4635 19.4896 16.0417 19.6875 15.5625C19.8854 15.0833 19.9896 14.5625 20 14C20 13.4479 19.8958 12.9323 19.6875 12.4531C19.4792 11.974 19.1927 11.5469 18.8281 11.1719C18.4635 10.7969 18.0417 10.5104 17.5625 10.3125C17.0833 10.1146 16.5625 10.0104 16 10C15.4479 10 14.9323 10.1042 14.4531 10.3125C13.974 10.5208 13.5469 10.8073 13.1719 11.1719C12.7969 11.5365 12.5104 11.9583 12.3125 12.4375C12.1146 12.9167 12.0104 13.4375 12 14C12 14.5521 12.1042 15.0677 12.3125 15.5469C12.5208 16.026 12.8073 16.4531 13.1719 16.8281C13.5365 17.2031 13.9583 17.4896 14.4375 17.6875C14.9167 17.8854 15.4375 17.9896 16 18ZM16 0C17.4896 0 18.9688 0.182292 20.4375 0.546875C21.9062 0.911458 23.2917 1.45833 24.5938 2.1875C25.8958 2.91667 27.0729 3.80208 28.125 4.84375C29.1771 5.88542 30.0417 7.10417 30.7188 8.5C31.1354 9.36458 31.4531 10.2552 31.6719 11.1719C31.8906 12.0885 32 13.0312 32 14H30C30 12.7708 29.8125 11.6198 29.4375 10.5469C29.0625 9.47396 28.5469 8.49479 27.8906 7.60938C27.2344 6.72396 26.4531 5.93229 25.5469 5.23438C24.6406 4.53646 23.6771 3.94792 22.6562 3.46875C21.6354 2.98958 20.5469 2.625 19.3906 2.375C18.2344 2.125 17.1042 2 16 2C14.875 2 13.7448 2.125 12.6094 2.375C11.474 2.625 10.3906 2.98958 9.35938 3.46875C8.32812 3.94792 7.35938 4.53646 6.45312 5.23438C5.54688 5.93229 4.77083 6.72396 4.125 7.60938C3.47917 8.49479 2.95833 9.47396 2.5625 10.5469C2.16667 11.6198 1.97917 12.7708 2 14H0C0 13.0417 0.109375 12.1042 0.328125 11.1875C0.546875 10.2708 0.864583 9.375 1.28125 8.5C1.94792 7.125 2.80729 5.91146 3.85938 4.85938C4.91146 3.80729 6.09375 2.91667 7.40625 2.1875C8.71875 1.45833 10.1042 0.916667 11.5625 0.5625C13.0208 0.208333 14.5 0.0208333 16 0Z" fill="#750015"/>
              </svg>

              <span>{post.view_count || 0}</span>
            </div>

              {/* Comment button */}
                <div 
                  className="flex items-center gap-2 cursor-pointer" 
                  onClick={handleCommentClick}
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

       <ImagePreviewer
      imagePreview={imagePreview}
      onClose={closeImagePreview}
      onNext={goToNextImage}
      onPrev={goToPrevImage}
      onSelectImage={selectImage}
    />
    </>
  );
};