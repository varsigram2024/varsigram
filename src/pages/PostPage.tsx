import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { Post as PostComponent } from "../components/Post.tsx";
import { Text } from "../components/Text";
import { Img } from "../components/Img";
import Sidebar1 from "./../components/Sidebar1/index.tsx";
import BottomNav from "./../components/BottomNav";
import ProfileOrganizationSection from "./Profilepage/ProfilepageOrganizationSection.tsx";
import WhoToFollowSidePanel from "../components/whoToFollowSidePanel/index.tsx";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from 'react-responsive';

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
}

interface Post {
  // ...same as your Post interface...
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
  // add any other fields you use
}

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
        console.log('Post data received:', res.data);
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

  useEffect(() => {
    if (!id) return;
    fetchComments();
  }, [id, token]);

  const fetchComments = async () => {
    try {
      const headers: any = {};
      if (token) headers.Authorization = `Bearer ${token}`;
  
      const res = await axios.get(`${API_BASE_URL}/posts/${id}/comments/`, { headers });
      console.log('Comments response:', res.data); // Show response on console
  
      const commentData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
  
      setComments(commentData);
    } catch (error) {
      console.error('Failed to fetch comments:', error); // Show error on console
      setComments([]);
    }
  };
  
  

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please sign up to comment");
      navigate('/welcome');
      return;
    }
    
    if (!newComment.trim()) return;
    setIsPosting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/posts/${id}/comments/create/`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsPosting(false);
    }
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

  // Main UI
  return (
    <div className={`
      ${isMobile ? 'fixed inset-0 z-[1000] bg-white flex flex-col' : ''}
      ${isModal && !isMobile ? 'fixed top-0 left-0 w-full h-full z-[1000] flex items-center justify-center bg-black bg-opacity-50' : ''}
    `}>
      {/* Sticky header for mobile */}
      <div className={`
        ${isMobile ? 'sticky top-0 z-10 bg-white flex items-center px-4 py-3 border-b' : 'hidden'}
      `}>
        <button
          className="mr-3 text-[#750015] font-medium"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          {/* <Img
            src={post?.author_profile_pic_url || "/images/user.png"}
            alt="Profile"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-semibold text-[#750015]">{post?.author_name || post?.author_display_name}</span> */}
          Vars
        </div>
      </div>

      {/* Main content */}
      <div className={`
        flex-1 w-full
        ${isMobile ? 'overflow-y-auto px-0 pb-24' : 'flex items-center justify-center min-h-screen bg-white'}
      `}>
        <div className={`
          ${isMobile ? 'w-full max-w-full px-0' : 'w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4'}
        `}>
          {/* Back button for desktop/modal */}
          {!isMobile && (
            <button
              className="flex items-center gap-2 text-[#750015] font-medium mb-4"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
              Vars
            </button>
          )}

          {/* Post */}
          <div className="mb-6">
            <PostComponent
              post={post}
              currentUserId={user?.id}
              currentUserEmail={user?.email}
              showFullContent={true}
              isPublicView={!token} // Add this prop
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
            
            <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
              <input
                className="flex-1 border rounded-full px-4 py-2"
                placeholder={token ? "Add a comment..." : "Sign up to comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isPosting || !token}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-full flex items-center justify-center min-w-[70px] ${
                  token 
                    ? 'bg-[#750015] text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!newComment.trim() || isPosting || !token}
              >
                {isPosting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </form>
            
            <div className="space-y-6">
              {comments.length === 0 ? (
                <Text>No comments yet.</Text>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 items-start">
                    <Img
                      src={comment.author_profile_pic_url || "/images/user.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Text
                          as="span"
                          className="font-semibold text-[#750015] cursor-pointer hover:underline"
                          onClick={() => {
                            if (comment.author_display_name_slug) {
                              navigate(`/user-profile/${comment.author_display_name_slug}`);
                            }
                          }}
                        >
                          {comment.author_name}
                        </Text>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <Text className="block">{comment.text}</Text>
                    </div>
                  </div>
                ))
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
