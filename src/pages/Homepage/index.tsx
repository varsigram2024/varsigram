import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Post } from '../../components/Post.tsx';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "../../components/Input/SearchInput.tsx";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import { Button } from "../../components/Button";
import CreateConversation from "../../modals/createCONVERSATION";
import BottomNav from "../../components/BottomNav";
import { LogOut } from "lucide-react";
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config.ts';
import { uploadPostMedia } from '../../utils/fileUpload';
import { ClickableUser } from "../../components/ClickableUser";
import WhoToFollowSidePanel from '../../components/whoToFollowSidePanel/index.tsx';
import CreatePostModal from '../../components/CreatePostModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  author_name?: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  profile_pic_url?: string;
  author_profile_pic_url: string;
  display_name_slug?: string;
}

export default function Homepage() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user, logout, isLoading: isAuthLoading } = useAuth();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isFeedLoading, setIsFeedLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
        console.log('Posts:', response.data); // Log the fetched posts
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchPosts();
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'following' && token) {
      setIsFeedLoading(true);
      axios.get(`${API_BASE_URL}/feed/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setFeedPosts(response.data);
        console.log('Feed posts:', response.data);
      })
      .catch(error => {
        console.error('Error fetching feed:', error);
        setFeedPosts([]);
      })
      .finally(() => {
        setIsFeedLoading(false);
      });
    }
  }, [activeTab, token]);

  const handleClearSearch = () => setSearchBarValue("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Limit to 5 files
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && selectedFiles.length === 0) {
      toast.error('Please enter some content or select at least one image');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload all images using signed URL logic
      const mediaUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          return uploadPostMedia(file, token);
        })
      );

      // Then create the post with the media URLs
      const postData = {
        content: newPostContent,
        author_username: user?.email || '',
        author_profile_pic_url: user?.profile_pic_url || null,
        media_urls: mediaUrls,
        timestamp: new Date().toISOString(),
        like_count: 0,
        comment_count: 0,
        share_count: 0,
        has_liked: false,
        trending_score: 0,
        last_engagement_at: null,
        author_display_name: user?.fullName ? user.fullName.split(' ')[0] : user?.username || 'Unknown User'
      };

      const response = await axios.post(`${API_BASE_URL}/posts/`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setSelectedFiles([]);
      setIsCreatePostOpen(false);
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPost = () => {
    setNewPostContent('');
    setSelectedFiles([]);
    setIsCreatePostOpen(false);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };
  

  const handlePostDelete = async (post: Post) => {
    console.log('Deleting post:', post);
    if (!post.id) {
      toast.error('Cannot delete post: missing post identifier');
      return;
    }

    if (!token) {
      toast.error('Please login to delete posts');
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${post.id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handlePostEdit = (post: Post) => {
    setEditingPost(post);
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
      await axios.put(
        `${API_BASE_URL}/posts/${editingPost.id}/`,
        { content: editedContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id 
            ? { ...post, content: editedContent }
            : post
        )
      );

      setIsEditModalOpen(false);
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  const handlePostLikeUpdate = (postId: string, like_count: number, has_liked: boolean) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, like_count, has_liked }
          : post
      )
    );
  };

  const handleLike = async (post: Post) => {
    // Save previous state for revert
    const prevLikeCount = post.like_count;
    const prevHasLiked = post.has_liked;

    // Optimistically update UI
    handlePostLikeUpdate(
      post.id,
      post.has_liked ? post.like_count - 1 : post.like_count + 1,
      !post.has_liked
    );

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sync with backend response
      handlePostLikeUpdate(post.id, response.data.like_count, response.data.has_liked);
    } catch (error) {
      // Revert on error
      handlePostLikeUpdate(post.id, prevLikeCount, prevHasLiked);
      console.error("Failed to like/unlike post:", error);
    }
  };


  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    try {
      const publicUrl = await uploadPostMedia(file, token);
      // Add this URL to your post's media_urls array
      setMediaUrls(prev => [...prev, publicUrl]);
    } catch (error) {
      toast.error("Failed to upload media.");
    }
  };

  // Debug: log the user object
  console.log('Homepage user:', user);

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
        <div className="hidden lg:flex items-center justify-between">
          <div 
            onClick={() => {
              if (user?.display_name_slug) {
                navigate(`/user-profile/${user.display_name_slug}`);
              } else {
                toast.error("Profile link unavailable");
              }
            }}  
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Text as="p" className="text-[24px] font-medium md:text-[22px]">
              Welcome back, {user?.fullName || 'User'} 👋
            </Text>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
        <div className="lg:mt-5 flex justify-between">
          <div 
            className={`flex px-3 cursor-pointer ${activeTab === 'forYou' ? 'border-b-2 border-solid border-[#750015]' : ''}`}
            onClick={() => setActiveTab('forYou')}
          >
            <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'forYou' ? '' : '!text-[#adacb2]'}`}>
              For you
            </Text>
          </div>
          <div 
            className={`flex border-b-2 border-solid px-1.5 cursor-pointer ${activeTab === 'following' ? 'border-[#750015]' : 'border-transparent'}`}
            onClick={() => setActiveTab('following')}
          >
            <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'following' ? '' : '!text-[#adacb2]'}`}>
              Following
            </Text>
          </div>
        </div>
          


            <div className="mt-5 lg:hidden flex flex-row justify-between items-center">
              <div 
                onClick={() => {
                  if (user?.display_name_slug) {
                    navigate(`/user-profile/${user.display_name_slug}`);
                  } else {
                    toast.error("Profile link unavailable");
                  }
                }} 
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img 
                  src={user?.profile_pic_url || "images/user.png"} 
                  alt="Profile" 
                  className="h-[32px] w-[32px] rounded-[50%]" 
                  onClick={() => {
                    if (user?.display_name_slug) {
                      navigate(`/user-profile/${user.display_name_slug}`);
                    } else {
                      toast.error("Profile link unavailable");
                    }
                  }}
                />
              </div>

              <div>
                <Text className="font-semibold text-xl">Varsigram</Text>
              </div>

        

              <div className='flex flex-row justify-between'>
                  <div 
                    onClick={() => handleNavigation('settings')} 
                    className="hover:opacity-80 transition-opacity cursor-pointer mr-2"
                  >
                   <Img src="images/settings-icon.svg" alt="File" className="h-[24px] w-[24px]" />
                  </div>
                
                <button
                  onClick={logout}
                  className="text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            

            {isCreatePostOpen && (
              <CreatePostModal
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                isUploading={isUploading}
                onClose={handleCancelPost}
                onSubmit={handleCreatePost}
                handleFileChange={handleFileChange}
                handleRemoveFile={handleRemoveFile}
              />
            )}

            {!isCreatePostOpen && (
              <div 
                className="lg:mt-0 flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <input
                  type="text"
                  value={newPostContent}
                  placeholder="Create a vars..."
                  className="w-full text-[20px] font-normal text-[#adacb2] bg-transparent border-none outline-none focus:outline-none"
                  readOnly
                />
                <div className="flex flex-1 justify-end items-center gap-6 px-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreatePostOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Img src="images/vectors/image.svg" alt="Image" className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px]" />
                  </button>
                </div>
              </div>
            )}

          <div className="w-full post-section">
            {(isLoading || isAuthLoading) && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
              </div>
            )}

            {error && !isLoading && !isAuthLoading && (
              <div className="flex justify-center items-center py-20">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}

            {!isLoading && !isAuthLoading && !error && (
              <>
                <div 
                  className={`transition-all duration-300 ease-in-out ${activeTab === 'forYou' ? 'opacity-100' : 'opacity-0'}`}
                >
                  {activeTab === 'forYou' && (
                    <div className="space-y-6 w-full">
                      {posts.map((post) => (
                        <Post 
                          key={post.id} 
                          post={post} 
                          onPostUpdate={(updatedPost) => {
                            setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
                          }}
                          onPostDelete={(post) => {
                            setPosts(prev => prev.filter(p => p.id !== post.id));
                          }}
                          onPostEdit={(post) => {
                            // This is now handled internally by the Post component
                          }}
                          currentUserId={user?.id}
                          currentUserEmail={user?.email}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div 
                    className={`transition-all duration-300 ease-in-out ${activeTab === 'following' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}
                  >
                  {activeTab === 'following' && (
                    <div className="space-y-6">
                      {isFeedLoading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                        </div>
                      ) : feedPosts.length === 0 ? (
                        <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                          <Text as="p" className="text-[14px] font-normal text-[#adacb2]">
                            No posts in your feed yet.
                          </Text>
                        </div>
                      ) : (
                        feedPosts.map((post) => (
                          <Post 
                            key={post.id} 
                            post={post} 
                            onPostUpdate={(updatedPost) => {
                              setFeedPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
                            }}
                            onPostDelete={(post) => {
                              setFeedPosts(prev => prev.filter(p => p.id !== post.id));
                            }}
                            onPostEdit={(post) => {
                              // This is now handled internally by the Post component
                            }}
                            currentUserId={user?.id}
                            currentUserEmail={user?.email}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide">
          <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white">
            <ProfileOrganizationSection />
          </div>
          
          <div className="rounded-[32px] border border-solid h-auto max-h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5">
            <div className="overflow-hidden h-full">
              <WhoToFollowSidePanel />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />

      
    </div>
  );
}
