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
  const { token, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!id) {
      setError("Post ID is required");
      setIsLoading(false);
      return;
    }
    
    if (!token) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    axios
      .get(`${API_BASE_URL}/posts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Post data received:', res.data);
        setPost(res.data);
      })
      .catch((err) => {
        console.error('Failed to load post:', err);
        if (err.response?.status === 404) {
          setError("Post not found");
        } else if (err.response?.status === 401) {
          setError("Authentication required");
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
    // eslint-disable-next-line
  }, [id, token]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/posts/${id}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
    } catch {
      setComments([]);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
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
    return <div className="text-center py-20 text-gray-500">Post not found.</div>;
  }

  return (
    <div
      style={
        isModal
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }
          : {}
      }
    >
      {/* Overlay for modal: clicking it closes the modal */}
      {isModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
          onClick={handleBack}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        />
      )}
      {/* Modal content */}
      <div
        style={
          isModal
            ? {
                background: "#fff",
                borderRadius: 8,
                padding: 24,
                maxWidth: 600,
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                zIndex: 1001,
                position: "relative",
              }
            : {}
        }
        onClick={isModal ? (e) => e.stopPropagation() : undefined}
      >
        <div className="flex w-full items-start justify-center bg-[#ffff] min-h-screen relative h-auto overflow-hidden">
          <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
            <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
              <button
                className="flex items-center gap-2 text-[#750015] font-medium mb-4"
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
              <div className="w-full max-w-2xl bg-white p-2 mb-1 mx-auto">
                <PostComponent
                  post={post}
                  currentUserId={user?.id}
                  currentUserEmail={user?.email}
                  showFullContent={true}
                />
              </div>
              <div className="w-full max-w-2xl bg-white p-2 mx-auto">
                <Text as="h3" className="text-lg font-semibold mb-4">Comments</Text>
                <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                  <input
                    className="flex-1 border rounded-full px-4 py-2"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isPosting}
                  />
                  <button
                    type="submit"
                    className="bg-[#750015] text-white px-4 py-2 rounded-full flex items-center justify-center min-w-[70px]"
                    disabled={!newComment.trim() || isPosting}
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
                        {/* <Img
                          src={comment.author_profile_pic_url || "/images/user.png"}
                          alt="Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        /> */}
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
        </div>
        {isModal && (
          <button 
            onClick={handleBack}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            style={{ zIndex: 1002 }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
