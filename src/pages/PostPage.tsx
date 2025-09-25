import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { Post as PostComponent } from "../components/Post.tsx";
import { Text } from "../components/Text";
import { Img } from "../components/Img";
import { toast } from "react-hot-toast";
import { ArrowLeft, MoreVertical, Edit, Trash2, MessageSquare } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author_username: string;
  author_id: string;
  post_id: string;
  author_profile_pic_url?: string;
  author_display_name?: string;
  author_display_name_slug?: string;
  profile_pic_url?: string;
  display_name_slug?: string;
  author_name?: string;
  parent_comment_id?: string;
  reply_count?: number;
  replies?: Comment[];
  author_faculty?: string;
  author_department?: string;
  author_exclusive?: boolean;
}

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
  author_display_name_slug?: string;
  author_name?: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onCommentUpdate: (commentId: string, newText: string) => void;
  onCommentDelete: (commentId: string) => void;
  navigate: (path: string) => void;
  onStartReply: (commentId: string, authorName: string) => void;
  postId: string;
  depth?: number;
}

// CommentItem component defined outside of PostPage
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  currentUserId, 
  onCommentUpdate, 
  onCommentDelete,
  navigate,
  onStartReply,
  postId,
  depth = 0
}) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showOptions, setShowOptions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const replies = comment.replies || [];
  const maxDepth = 5;

  // Fix the author comparison
  const isAuthor = currentUserId && comment.author_id && 
    currentUserId.toString() === comment.author_id.toString();

  // Get the correct profile picture URL
  const profilePicUrl = comment.author_profile_pic_url || comment.profile_pic_url || "/images/user.png";
  
  // Get the correct author name
  const authorName = comment.author_display_name || comment.author_name || comment.author_username;
  
  // Get the correct display name slug
  const displayNameSlug = comment.author_display_name_slug || comment.display_name_slug;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.text);
    setShowOptions(false);
  };

  const handleSave = async () => {
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onCommentUpdate(comment.id, editText);
      setIsEditing(false);
    } catch (error) {
      // Error is already handled in the parent function
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
    setShowOptions(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onCommentDelete(comment.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error is already handled in the parent function
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-3 items-start">
        <Img
          src={profilePicUrl}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Text
              as="span"
              className="font-semibold text-[#750015] cursor-pointer hover:underline"
              onClick={() => {
                if (displayNameSlug) {
                  navigate(`/user-profile/${displayNameSlug}`);
                }
              }}
            >
              {authorName}
            </Text>
            <span className="text-xs text-gray-400">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 resize-none"
              rows={3}
              disabled={isUpdating}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!editText.trim() || isUpdating}
                className="px-3 py-1 bg-[#750015] text-white rounded text-sm disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={`comment-${comment.id}`} className="comment-container mb-4">
      <div className="flex gap-3 items-start">
        <Img
          src={profilePicUrl}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Text
                as="span"
                className="font-semibold text-[#750015] cursor-pointer hover:underline"
                onClick={() => {
                  if (displayNameSlug) {
                    navigate(`/user-profile/${displayNameSlug}`);
                  }
                }}
              >
                {authorName}
              </Text>
              <span className="text-xs text-gray-400">
                {new Date(comment.timestamp).toLocaleString()}
              </span>
            </div>
            {isAuthor && (
              <div className="relative">
                <button 
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-1 hover:bg-gray-100 rounded-full comment-options"
                  disabled={isDeleting}
                >
                  <MoreVertical size={16} />
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <button 
                      onClick={handleEdit}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-gray-100 text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Text className="block">{comment.text}</Text>
          
          {/* Action buttons */}
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => onStartReply(comment.id, authorName)}
              className="text-sm text-[#750015] flex items-center gap-1"
            >
              <MessageSquare size={14} /> Reply
            </button>

            {/* View replies button */}
            {replies.length > 0 && (
              <button 
                onClick={toggleReplies}
                className="text-sm text-[#750015] flex items-center gap-1"
              >
                {showReplies ? 'Hide' : 'View'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies section */}
      {showReplies && depth < maxDepth && (
        <div className={` mt-2 border-l-2 border-gray-200`}>
          {replies.length > 0 ? (
            replies.map((reply) => (
              <CommentItem 
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onCommentUpdate={onCommentUpdate}
                onCommentDelete={onCommentDelete}
                navigate={navigate}
                onStartReply={onStartReply}
                postId={postId}
                depth={depth + 1}
              />
            ))
          ) : (
            <Text className="text-gray-500 text-sm">No replies yet</Text>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={32} className="text-red-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Delete Comment
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main PostPage component
export default function PostPage({ isModal = false }) {
  const { id } = useParams<{ id: string }>();
  const { token, user, isLoading: authLoading } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [scrollToComment, setScrollToComment] = useState<string | null>(null);
  const [highlightComment, setHighlightComment] = useState<string | null>(null);

  // Add pagination state for comments
  const [commentsNextCursor, setCommentsNextCursor] = useState<string | null>(null);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { scrollToComment, highlightComment } = location.state;
      if (scrollToComment) {
        setScrollToComment(scrollToComment);
      }
      if (highlightComment) {
        setHighlightComment(highlightComment);
      }
    }
  }, [location.state]);

  // Scroll to comment when comments are loaded
  useEffect(() => {
    if (scrollToComment && comments.length > 0) {
      const commentElement = document.getElementById(`comment-${scrollToComment}`);
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        commentElement.classList.add('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        setTimeout(() => {
          commentElement.classList.remove('bg-yellow-50', 'border-l-4', 'border-yellow-400');
        }, 3000);
        
        setScrollToComment(null);
      }
    }
  }, [scrollToComment, comments]);

  // Add a media query for mobile
  const isMobile = window.innerWidth <= 640;

  useEffect(() => {
    if (!id) {
      setError("Post ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Allow public access to posts
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    axios
      .get(`${API_BASE_URL}/posts/${id}/`, { headers })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error('Failed to load post:', err);
        if (err.response?.status === 404) {
          setError("Post not found");
        } else {
          setError("Failed to load post");
        }
        toast.error("Failed to load post");
      })
      .finally(() => setIsLoading(false));
  }, [id, token]);

  // Updated fetchComments to handle nested replies properly
  const fetchComments = async (startAfter: string | null = null) => {
    if (isLoadingComments) return;
    
    setIsLoadingComments(true);
    try {
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const params: any = { 
        page_size: 10,
        start_after: startAfter
      };
      
      const res = await axios.get(`${API_BASE_URL}/posts/${id}/comments/`, { 
        headers,
        params 
      });
      
      const { results, next_cursor } = res.data;
      
      // Process the comments - keep the nested structure as returned by API
      const processedResults = results.map(comment => ({
        ...comment,
        replies: comment.replies || [] // Use the nested replies directly
      }));
      
      if (Array.isArray(processedResults) && processedResults.length > 0) {
        if (startAfter) {
          setComments(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const uniqueComments = processedResults.filter(comment => !existingIds.has(comment.id));
            return [...prev, ...uniqueComments];
          });
        } else {
          setComments(processedResults);
        }
        setCommentsNextCursor(next_cursor);
        setCommentsHasMore(!!next_cursor);
      } else {
        setComments([]);
        setCommentsNextCursor(null);
        setCommentsHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
      setCommentsHasMore(false);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchComments();
  }, [id, token]);

  // Load more comments function
  const loadMoreComments = async () => {
    if (isLoadingComments || !commentsHasMore) return;
    await fetchComments(commentsNextCursor);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please sign up to comment");
      navigate('/welcome');
      return;
    }
    
    const textToPost = replyingTo ? replyText : newComment;
    if (!textToPost.trim()) return;
    
    setIsPosting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/posts/${id}/comments/create/`,
        { 
          text: textToPost,
          parent_comment_id: replyingTo || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (replyingTo) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
      
      // Refresh comments to show the new comment/reply
      fetchComments();
      toast.success(replyingTo ? "Reply posted!" : "Comment posted!");
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error("Failed to add comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleStartReply = (commentId: string, authorName: string) => {
    if (!token) {
      toast.error("Please sign up to reply");
      navigate('/welcome');
      return;
    }
    
    setReplyingTo(commentId);
    setReplyText(`@${authorName} `);
  };

  const handleBack = () => {
    if (isModal) {
      navigate(-1);
    } else {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/home");
      }
    }
  };

  useEffect(() => {
    sessionStorage.setItem(`commentDraft-${id}`, newComment);
  }, [newComment, id]);

  useEffect(() => {
    const draft = sessionStorage.getItem(`commentDraft-${id}`);
    if (draft) setNewComment(draft);
  }, [id]);

  const handleCommentUpdate = async (commentId: string, newText: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${id}/comments/${commentId}/`,
        { text: newText },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the comment in the local state
      const updateCommentInTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, text: newText };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { 
              ...comment, 
              replies: updateCommentInTree(comment.replies) 
            };
          }
          return comment;
        });
      };

      setComments(prevComments => updateCommentInTree(prevComments));
      toast.success('Comment updated successfully');
    } catch (error: any) {
      console.error('Error updating comment:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to edit this comment');
      } else if (error.response?.status === 404) {
        toast.error('Comment not found');
      } else {
        toast.error('Failed to update comment');
      }
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${id}/comments/${commentId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Remove the comment from local state
      const removeCommentFromTree = (comments: Comment[]): Comment[] => {
        return comments.filter(comment => {
          if (comment.id === commentId) {
            return false;
          }
          if (comment.replies && comment.replies.length > 0) {
            comment.replies = removeCommentFromTree(comment.replies);
          }
          return true;
        });
      };

      setComments(prevComments => removeCommentFromTree(prevComments));
      toast.success('Comment deleted successfully');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this comment');
      } else if (error.response?.status === 404) {
        toast.error('Comment not found');
      } else {
        toast.error('Failed to delete comment');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-gray-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate('/home')}
          className="bg-[#750015] text-white px-4 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!post) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Post not found.</div>;
  }

  return (
    <div className={`
      ${isMobile ? 'fixed inset-0 z-[1000] bg-white flex flex-col' : ''}
      ${isModal && !isMobile ? 'fixed top-0 left-0 w-full h-full z-[1000] flex items-center justify-center bg-black bg-opacity-50' : ''}
    `}>
      {/* <div className={`
        ${isMobile ? 'sticky top-0 z-10 bg-white flex items-center px-4 py-3 border-b' : 'hidden'}
      `}>
        <button
          className="mr-3 text-[#750015] font-medium"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          Vars
        </div>
      </div> */}

      {/* Main content */}
      <div className={`
        ${isMobile ? 'flex-1 w-full overflow-y-auto px-0 pb-24' : 'w-full h-full overflow-y-auto'}
        ${isModal && !isMobile ? 'max-h-[90vh] overflow-y-auto' : ''}
      `}>
        <div className={`
          ${isMobile ? 'w-full px-0' : 'w-full max-w-2xl mx-auto bg-white p-4'}
          ${isModal && !isMobile ? 'rounded-xl shadow-lg' : ''}
        `}>
          
          {/* {!isMobile && (
            <button
              className="flex items-center gap-2 text-[#750015] font-medium mb-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
              Vars
            </button>
          )} */}

          {/* Post */}
          <div className="mb-6">
            <PostComponent
              post={post}
              currentUserId={user?.id}
              currentUserEmail={user?.email}
              showFullContent={true}
              isPublicView={!token}
            />
          </div>

          {/* Comments */}
          <div className="bg-white p-5">
            <Text as="h3" className="text-lg font-semibold mb-4">Comments</Text>
            
            {/* Show sign-up prompt for unauthenticated users */}
            {!token && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Want to join the conversation?</strong> 
                  <button 
                    onClick={() => navigate('/welcome')}
                    className="text-blue-600 underline ml-1"
                  >
                    Sign up to comment and like posts
                  </button>
                </p>
              </div>
            )}
            
            <form onSubmit={handleAddComment} className="flex gap-2 mb-6 bg-gray-50 p-4 rounded-lg">
              <input
                className="flex-1 border rounded-lg px-4 py-2"
                placeholder={token ? "Add a comment..." : "Sign up to comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isPosting || !token}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg flex items-center justify-center min-w-[70px] ${
                  token 
                    ? 'bg-[#750015] text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!newComment.trim() || isPosting || !token}
              >
                {isPosting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-1"></div>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </form>

            {replyingTo && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-[#750015]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">Replying to a comment</span>
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel reply
                  </button>
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={isPosting}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#750015] text-white rounded-lg min-w-[70px] disabled:opacity-50"
                    disabled={!replyText.trim() || isPosting}
                  >
                    {isPosting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      "Reply"
                    )}
                  </button>
                </form>
              </div>
            )}
            
            <div className="space-y-6">
              {comments.length === 0 && !isLoadingComments ? (
                <Text>No comments yet.</Text>
              ) : (
                <>
                  {comments.map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      currentUserId={user?.id}
                      onCommentUpdate={handleCommentUpdate}
                      onCommentDelete={handleCommentDelete}
                      navigate={navigate}
                      onStartReply={handleStartReply}
                      postId={id || ''}
                      depth={0}
                    />
                  ))}
                  
                  {/* Load more comments button */}
                  {commentsHasMore && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={loadMoreComments}
                        disabled={isLoadingComments}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      >
                        {isLoadingComments ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
                            Loading...
                          </div>
                        ) : (
                          'Load more comments'
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Loading indicator */}
                  {isLoadingComments && comments.length > 0 && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#750015]"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close button for modal on desktop */}
      {isModal && !isMobile && (
        <button 
          onClick={handleBack}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          style={{ zIndex: 1002 }}
        >
          ✕
        </button>
      )}
    </div>
  );
}