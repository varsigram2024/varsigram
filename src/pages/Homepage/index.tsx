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
import EditPostModal from "../../components/EditPostModal";
import { ClickableUser } from "../../components/ClickableUser";
import WhoToFollowSidePanel from '../../components/whoToFollowSidePanel/index.tsx';

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

interface User {
  id: string;
  email: string;
  fullName: string;
  profile_pic_url?: string;
  author_profile_pic_url: string;
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://api.varsigram.com/api/v1/posts/', {
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

    if (token) {
      fetchPosts();
    }
  }, [token]);

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
      
      // First, upload all images to Firebase Storage
      const mediaUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          return getDownloadURL(snapshot.ref);
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

      const response = await axios.post('https://api.varsigram.com/api/v1/posts/', postData, {
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

  const handlePostDelete = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const handlePostEdit = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (editedContent: string) => {
    if (!editingPost) return;

    if (!editingPost.slug) {
      console.error('Post slug is missing:', editingPost);
      toast.error('Cannot edit post: missing post identifier');
      return;
    }

    if (!token) {
      toast.error('Please login to edit posts');
      return;
    }

    try {
      const response = await axios.put(
        `https://api.varsigram.com/api/v1/posts/${editingPost.slug}/`,
        {
          content: editedContent,
        },
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
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  // Debug: log the user object
  console.log('Homepage user:', user);

  if (isLoading || isAuthLoading) {
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
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
        <div className="hidden lg:flex items-center justify-between">
          <div 
            onClick={() => handleNavigation('user-profile')} 
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
                onClick={() => handleNavigation('user-profile')} 
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img 
                  src={user?.profile_pic_url || "images/user.png"} 
                  alt="Profile" 
                  className="h-[32px] w-[32px] rounded-[50%]" 
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

            

            {!isCreatePostOpen ? (
              <div 
                className="lg:mt-0 flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsCreatePostOpen(true)}
              >
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full text-[20px] font-normal text-[#adacb2] bg-transparent border-none outline-none focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreatePostOpen(true);
                  }}
                  readOnly
                />
                <div className="flex flex-1 justify-end items-center gap-6 px-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="cursor-pointer"
                  >
                    <Img src="images/vectors/image.svg" alt="Image" className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px]" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full p-4 bg-white rounded-[28px] shadow-sm">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-2 text-[20px] font-normal text-gray-800 bg-transparent border-none outline-none focus:outline-none resize-none"
                  rows={3}
                />
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                        >
                          <CloseSVG />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      disabled={selectedFiles.length >= 5}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    {selectedFiles.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {selectedFiles.length}/5 images
                      </span>
                    )}
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
                      disabled={isUploading || (!newPostContent.trim() && selectedFiles.length === 0)}
                      className="px-4 py-2 text-white bg-[#750015] rounded-lg hover:bg-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          <div className="relative w-full">
            <div 
              className={`transition-all duration-300 ease-in-out ${activeTab === 'forYou' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}
            >
              {activeTab === 'forYou' && (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Post 
                      key={post.id} 
                      post={post} 
                      onPostUpdate={handlePostUpdate}
                      onPostDelete={handlePostDelete}
                      onPostEdit={handlePostEdit}
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
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                  <Text as="p" className="text-[14px] font-normal text-[#adacb2]">
                    Coming soon...
                  </Text>
                </div>
              )}
            </div>
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
    </div>
  );
}
