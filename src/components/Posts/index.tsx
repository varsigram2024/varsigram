import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CloseSVG } from '../Input/close';

interface Post {
  id: string;
  slug: string;
  author_username: string;
  content: string;
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  author_profile_pic_url: string;
  image_url?: string;
  comments?: Comment[];
  is_shared?: boolean;
  original_post?: Post;
}

interface Comment {
  id: string;
  author_username: string;
  content: string;
  timestamp: string;
  author_profile_pic_url: string;
}

interface PostsProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  token: string;
  currentUser: {
    username: string;
  };
}

export default function Posts({ posts, setPosts, token, currentUser }: PostsProps) {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingPost, setIsUploadingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState('');
  const postFileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedFile) {
      toast.error('Please enter some content or select an image');
      return;
    }

    try {
      setIsUploadingPost(true);
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.post('https://api.varsigram.com/api/v1/posts/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setSelectedFile(null);
      setIsCreatingPost(false);
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsUploadingPost(false);
    }
  };

  const handleEditPost = async (post: Post) => {
    try {
      const formData = new FormData();
      formData.append('content', editContent);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.put(`https://api.varsigram.com/api/v1/posts/${post.slug}/edit/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts(posts.map(p => p.id === post.id ? response.data : p));
      setEditingPost(null);
      setEditContent('');
      setSelectedFile(null);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error editing post:', error);
      toast.error('Failed to update post. Please try again.');
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`https://api.varsigram.com/api/v1/posts/${post.slug}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setPosts(posts.filter(p => p.id !== post.id));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleLikePost = async (post: Post) => {
    try {
      await axios.post(`https://api.varsigram.com/api/v1/posts/${post.slug}/like/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setPosts(posts.map(p => {
        if (p.id === post.id) {
          return {
            ...p,
            has_liked: !p.has_liked,
            like_count: p.has_liked ? p.like_count - 1 : p.like_count + 1,
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post. Please try again.');
    }
  };

  const handleSharePost = async (post: Post) => {
    try {
      const response = await axios.post(`https://api.varsigram.com/api/v1/posts/${post.slug}/share/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setPosts([response.data, ...posts]);
      toast.success('Post shared successfully');
    } catch (error) {
      console.error('Error sharing post:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('You have already shared this post');
      } else {
        toast.error('Failed to share post. Please try again.');
      }
    }
  };

  const handlePostFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleCancelPost = () => {
    setNewPostContent('');
    setSelectedFile(null);
    setIsCreatingPost(false);
  };

  const handleCancelEdit = () => {
    setEditContent('');
    setSelectedFile(null);
    setEditingPost(null);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-[1200px] mt-4 px-4 space-y-4">
      {/* Create Post Section */}
      <div className="flex flex-col items-center justify-start w-full">
        {!isCreatingPost ? (
          <button
            onClick={() => setIsCreatingPost(true)}
            className="flex items-center justify-center w-full p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-500">What's on your mind?</span>
          </button>
        ) : (
          <div className="flex flex-col w-full p-4 bg-white rounded-lg shadow-sm">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {selectedFile && (
              <div className="relative mt-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="max-h-48 rounded-lg"
                />
                <button
                  onClick={() => setSelectedFile(null)}
                  className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                >
                  <CloseSVG />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => postFileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={postFileInputRef}
                  onChange={handlePostFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancelPost}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={isUploadingPost || (!newPostContent.trim() && !selectedFile)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="flex flex-col w-full bg-white rounded-lg shadow-sm">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author_profile_pic_url || '/default-avatar.png'}
                  alt={post.author_username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{post.author_username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {post.author_username === currentUser.username && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingPost(post);
                      setEditContent(post.content);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post)}
                    className="p-2 text-gray-500 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Post Content */}
            {editingPost?.id === post.id ? (
              <div className="p-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                {selectedFile && (
                  <div className="relative mt-2">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                    >
                      <CloseSVG />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => postFileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="px-4 py-2 whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full max-h-96 object-cover"
                  />
                )}
              </>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikePost(post)}
                  className={`flex items-center space-x-1 ${
                    post.has_liked ? 'text-blue-500' : 'text-gray-500'
                  } hover:text-blue-500`}
                >
                  <svg className="w-5 h-5" fill={post.has_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.like_count}</span>
                </button>
                <button
                  onClick={() => {/* TODO: Implement comments */}}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comment_count}</span>
                </button>
                <button
                  onClick={() => handleSharePost(post)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>{post.share_count}</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 