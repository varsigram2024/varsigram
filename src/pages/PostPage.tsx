import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { Post as PostComponent } from "../components/Post.tsx";
import { Text } from "../components/Text";
import { Img } from "../components/Img";
import Sidebar1 from "./../components/Sidebar1/index.tsx";
import BottomNav from "./../components/BottomNav";
import { toast } from "react-hot-toast";

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

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    axios
      .get(`${API_BASE_URL}/posts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPost(res.data))
      .catch(() => toast.error("Failed to load post"))
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20 text-gray-500">Post not found.</div>;
  }

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 mb-8 mx-auto">
            <PostComponent
              post={post}
              currentUserId={user?.id}
              currentUserEmail={user?.email}
            />
          </div>
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 mx-auto">
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
      <BottomNav />
    </div>
  );
}
