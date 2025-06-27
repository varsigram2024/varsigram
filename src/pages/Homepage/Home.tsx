// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import { Post } from '../../components/Post.tsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Post {
  id: string;
  content: string;
  author_username: string;
  slug: string;
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  author_profile_pic_url: string;
  media_urls?: string[];
}

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/`,
        { content: newPost },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/feed/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Feed</h1>
      
      {/* Post Creation Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015] resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newPost.trim()}
            className="bg-[#750015] text-white px-6 py-2 rounded-lg hover:bg-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};