import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import debounce from "lodash/debounce";
import { useAuth } from '../../auth/AuthContext';
import { Post } from '../../components/Post.tsx';
import axios from 'axios';
import { Link, useNavigate, useLocation, ScrollRestoration } from "react-router-dom";

import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import BottomNav from "../../components/BottomNav";
import { toast } from 'react-hot-toast';
import { uploadPostMedia } from '../../utils/fileUpload';
import WhoToFollowSidePanel from '../../components/whoToFollowSidePanel/index.tsx';
import CreatePostModal from '../../components/CreatePostModal';
import { faculties, facultyDepartments } from "../../constants/academic";
import { useFeed } from '../../context/FeedContext';
import { useNotification } from '../../context/NotificationContext';


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
  author_display_name_slug?: string;
  account_type?: string;
  is_verified?: boolean;
  exclusive?: boolean;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  profile_pic_url?: string;
  author_profile_pic_url: string;
  display_name_slug?: string;
  faculty?: string;
  department?: string;
  exclusive?: boolean;
  user_faculty?: string;
  user_department?: string;
  user_exclusive?: boolean;
}

interface SearchResult {
  type: 'student' | 'organization';
  email: string;
  display_name_slug: string;
  faculty?: string;
  department?: string;
  name?: string;
  organization_name?: string;
  exclusive?: boolean;
}

const useIntersectionObserver = (
  callback: () => void,
  options = { threshold: 0, rootMargin: '300px' }
) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        callback();
      }
    }, options);

    const currentElement = observerRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [callback, options.threshold, options.rootMargin]);

  return observerRef;
};

export default function Homepage() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [activeTab, setActiveTab] = useState<'forYou' | 'official'>('forYou');
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
  const [feedPage, setFeedPage] = useState(1);
  const [feedSessionId, setFeedSessionId] = useState<string | null>(null);


  const {
    feedPosts, setFeedPosts,
    feedNextCursor, setFeedNextCursor,
    feedHasMore, setFeedHasMore,
    isFeedLoading, setIsFeedLoading,
    lastFeedFetch, setLastFeedFetch,
    officialPosts, setOfficialPosts,
    officialNextCursor, setOfficialNextCursor,
    officialHasMore, setOfficialHasMore,
    isOfficialLoading, setIsOfficialLoading,
    lastOfficialFetch, setLastOfficialFetch,
  } = useFeed();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({ users: [], posts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'student' | 'organization'>('all');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');

  const currentPosts = useMemo(() => {
    return activeTab === 'forYou' ? feedPosts : officialPosts;
  }, [activeTab, feedPosts, officialPosts]);

  const currentHasMore = useMemo(() => {
    return activeTab === 'forYou' ? feedHasMore : officialHasMore;
  }, [activeTab, feedHasMore, officialHasMore]);

  const currentNextCursor = useMemo(() => {
    return activeTab === 'forYou' ? feedNextCursor : officialNextCursor;
  }, [activeTab, feedNextCursor, officialNextCursor]);

  const currentIsLoading = useMemo(() => {
    return activeTab === 'forYou' ? isFeedLoading : isOfficialLoading;
  }, [activeTab, isFeedLoading, isOfficialLoading]);




const fetchPosts = async (type: 'feed' | 'official', startAfter: string | null = null) => {
  if (!token || (type === 'feed' ? isFeedLoading : isOfficialLoading)) return;

  const now = Date.now();
  const lastFetch = type === 'feed' ? lastFeedFetch : lastOfficialFetch;
  const shouldSkip = lastFetch && (now - lastFetch) < 5 * 60 * 1000;

  if (shouldSkip && !startAfter) {
    return;
  }

  if (type === 'feed') {
    setIsFeedLoading(true);
  } else {
    setIsOfficialLoading(true);
  }

  try {
    const endpoint = type === 'feed' ? '/feed/' : '/official/';

    // Different parameters for feed vs official
    const params: any = {
      page_size: 10,
    };
    
    if (type === 'feed') {
      params.page = feedPage;
      if (feedSessionId) {
        params.session_id = feedSessionId;
      }
    } else {
      params.start_after = startAfter;
    }

    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    });

    // Log the response to see the actual structure
    console.log(`${type} response:`, response.data);

    let results, nextPageInfo;

    if (type === 'feed') {
      // For feed, check if the response has the expected structure
      results = response.data.results || [];
      nextPageInfo = {
        session_id: response.data.session_id,
        has_next: response.data.has_next
      };
    } else {
      // For official, use the existing structure
      results = response.data.results;
      nextPageInfo = {
        next_cursor: response.data.next_cursor
      };
    }

    if (Array.isArray(results) && results.length > 0) {
      if (type === 'feed') {
        setFeedPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniquePosts = results.filter(post => !existingIds.has(post.id));
          return [...prev, ...uniquePosts];
        });
        
        // Update feed-specific state
        if (nextPageInfo.session_id) {
          setFeedSessionId(nextPageInfo.session_id);
        }
        setFeedHasMore(nextPageInfo.has_next);
        setFeedPage(prev => prev + 1);
        setLastFeedFetch(now);
      } else {
        setOfficialPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniquePosts = results.filter(post => !existingIds.has(post.id));
          return [...prev, ...uniquePosts];
        });
        setOfficialNextCursor(nextPageInfo.next_cursor);
        setOfficialHasMore(!!nextPageInfo.next_cursor);
        setLastOfficialFetch(now);
      }
    } else if (Array.isArray(results) && results.length === 0) {
      // No more posts
      if (type === 'feed') {
        setFeedHasMore(false);
      } else {
        setOfficialHasMore(false);
      }
    }
  } catch (error) {
    console.error(`Error fetching ${type} posts:`, error);
    if (type === 'feed') setFeedHasMore(false);
    else setOfficialHasMore(false);
  } finally {
    if (type === 'feed') {
      setIsFeedLoading(false);
    } else {
      setIsOfficialLoading(false);
    }
  }
};

  const loadMorePosts = async () => {
  if (currentIsLoading || !currentHasMore) return;

  if (activeTab === 'forYou') {
    await fetchPosts('feed', null);
  } else {
    await fetchPosts('official', officialNextCursor);
  }
};

  useEffect(() => {
    if (!token) return;

    if (activeTab === 'forYou' && feedPosts.length === 0) {
      fetchPosts('feed', null);
    } else if (activeTab === 'official' && officialPosts.length === 0) {
      fetchPosts('official', null);
    }
  }, [activeTab, token]);

  const loadMoreCallback = useCallback(() => {
    if (!currentIsLoading && currentHasMore && token) {
      loadMorePosts();
    }
  }, [currentIsLoading, currentHasMore, token, currentPosts.length, loadMorePosts]);

  const loadingRef = useIntersectionObserver(loadMoreCallback);

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`, { state: { backgroundLocation: location } });
  };

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

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
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

      if (!token) {
        throw new Error('Authentication token is missing.');
      }
      const mediaUrls = await Promise.all(
        selectedFiles.map(file => uploadPostMedia(file, token as string))
      );

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
        author_display_name: user?.fullName || 'Unknown User',
        author_name: user?.fullName || 'Unknown User',
        author_display_name_slug: user?.display_name_slug || '',
        author_faculty: (user as any)?.faculty || '',
        author_department: (user as any)?.department || '',
        author_exclusive: (user as any)?.exclusive || false
      };

      const response = await axios.post(`${API_BASE_URL}/posts/`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const completePost = {
        ...response.data,
        author_display_name: user?.fullName || 'Unknown User',
        author_name: user?.fullName || 'Unknown User',
        author_display_name_slug: user?.display_name_slug || '',
        author_faculty: (user as any)?.faculty || '',
        author_department: (user as any)?.department || '',
        author_exclusive: (user as any)?.exclusive || false,
        author_profile_pic_url: user?.profile_pic_url || null
      };

      setFeedPosts(prev => [completePost, ...prev]);

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
    setFeedPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setOfficialPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = async (post: Post) => {
    if (!post.id) {
      toast.error('Cannot delete post: missing post identifier');
      return;
    }

    setFeedPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
    setOfficialPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
  };

  const handlePostEdit = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (editedContent: string) => {
    if (!editingPost || !editingPost.id || !token) return;

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

      const updatedPost = { ...editingPost, content: editedContent };
      handlePostUpdate(updatedPost);

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
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, like_count, has_liked }
          : post
      )
    );
    setOfficialPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, like_count, has_liked }
          : post
      )
    );
  };

  const handleLike = async (post: Post) => {
    const prevLikeCount = post.like_count;
    const prevHasLiked = post.has_liked;

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
      handlePostLikeUpdate(post.id, response.data.like_count, response.data.has_liked);
    } catch (error) {
      handlePostLikeUpdate(post.id, prevLikeCount, prevHasLiked);
      console.error("Failed to like/unlike post:", error);
    }
  };

  const refreshPosts = async () => {
  if (activeTab === 'forYou') {
    setFeedPosts([]);
    setFeedPage(1);
    setFeedSessionId(null);
    setFeedHasMore(true);
    await fetchPosts('feed', null);
  } else {
      setOfficialPosts([]);
      setOfficialNextCursor(null);
      setOfficialHasMore(true);
      await fetchPosts('official');
    }
  };

  // Update the handleSearch function
const handleSearch = async () => {
  // Don't search if no criteria provided
  if (!searchQuery.trim() && !searchFaculty && !searchDepartment) {
    setSearchResults({ users: [], posts: [] });
    toast.error('Please provide at least one search criteria');
    return;
  }

  setIsSearching(true);
  try {
    const params: any = {};
    
    // Use the correct parameter names expected by the API
    if (searchQuery.trim()) params.query = searchQuery.trim();
    if (searchFaculty) params.faculty = searchFaculty;
    if (searchDepartment) params.department = searchDepartment;
    
    // The API doesn't have a 'type' parameter - it searches both by default
    // Remove the type parameter as it's not supported

    const response = await axios.get(
      `${API_BASE_URL}/users/search/`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    console.log('Search response:', response.data); // Debug log

    // Map the response data correctly
    const mappedUsers = response.data.map((user: SearchResultUser, idx: number) => {
      // For students
      if (user.type === 'student' && user.name) {
        return {
          id: user.display_name_slug || user.email || `student-${idx}`,
          email: user.email,
          fullName: user.name,
          display_name_slug: user.display_name_slug,
          type: 'student' as const,
          faculty: user.faculty,
          department: user.department,
        };
      }
      // For organizations
      else if (user.type === 'organization' && user.organization_name) {
        return {
          id: user.display_name_slug || user.email || `org-${idx}`,
          email: user.email,
          fullName: user.organization_name,
          display_name_slug: user.display_name_slug,
          type: 'organization' as const,
          exclusive: user.exclusive,
        };
      }
      return null;
    }).filter(Boolean);

    // Sort alphabetically
    mappedUsers.sort((a: any, b: any) =>
      a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
    );

    setSearchResults({
      users: mappedUsers,
      posts: [], // Posts search not implemented yet
    });

  } catch (error: any) {
    console.error("Search error:", error);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || 'Invalid search parameters';
      toast.error(errorMessage);
    } else if (error.response?.status === 401) {
      toast.error('Please login to search');
    } else {
      toast.error('Failed to fetch search results');
    }
    
    setSearchResults({ users: [], posts: [] });
  } finally {
    setIsSearching(false);
  }
};

    useEffect(() => {
      if (isSearchOpen && (searchQuery.trim() || searchFaculty || searchDepartment)) {
        const timer = setTimeout(() => {
          handleSearch();
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }, [searchType, searchFaculty, searchDepartment, isSearchOpen]);



const debouncedSearch = useMemo(() => debounce(() => {
  handleSearch();
}, 400), [searchQuery, searchType, searchFaculty, searchDepartment]);



const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchQuery(value);
  
  // Clear results if search is empty
  if (!value.trim() && !searchFaculty && !searchDepartment) {
    setSearchResults({ users: [], posts: [] });
    return;
  }
};


const handleSearchButtonClick = () => {
  if (!searchQuery.trim() && !searchFaculty && !searchDepartment) {
    toast.error('Please provide at least one search criteria');
    return;
  }
  handleSearch();
};



useEffect(() => {
  if (searchQuery.trim()) {
    debouncedSearch();
  } else {
    setSearchResults({ users: [], posts: [] }); // clear results when query is empty
  }

  return () => {
    debouncedSearch.cancel();
  };
}, [searchQuery, searchType, searchFaculty, searchDepartment]);



  const { unreadCount } = useNotification();

  return (
    <div className={`flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative]`}>
      

       <div className={`flex w-full lg:w-[100%] items-start justify-center flex-row`}>
              <div 
              className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col md:gap-[35px] sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0"
                >

          <div className="hidden lg:flex items-center justify-between animate-fade-in">
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
            <Img
              src="/images/search.svg"
              alt="Search"
              className="h-[24px] w-[24px] cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            />
            <Link to="/notifications" className="relative">
              <Img
                src="/images/vectors/bell.svg"
                alt="Notifications"
                className="h-[24px] w-[24px] text-gray-600 hover:text-blue-600 transition-colors"
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </Link>
          </div>
         
          <div className="lg:mt-5 flex justify-between animate-slide-up">
            <div
              className={`flex px-3 cursor-pointer ${activeTab === 'forYou' ? 'border-b-2 border-solid border-[#750015]' : ''}`}
              onClick={() => setActiveTab('forYou')}
            >
              <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'forYou' ? '' : '!text-[#adacb2]'}`}>
                For you
              </Text>
            </div>
            <div
              className={`flex border-b-2 border-solid px-1.5 cursor-pointer ${activeTab === 'official' ? 'border-[#750015]' : 'border-transparent'}`}
              onClick={() => setActiveTab('official')}
            >
              <Text
                as="p"
                className={`text-[14px] font-medium md:text-[22px] ${
                  activeTab === 'official' ? '' : '!text-[#adacb2]'
                }`}
              >
                Official
              </Text>
            </div>
          </div>

          <div className="mt-5 lg:hidden flex flex-row justify-between items-center animate-fade-in">
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
                src={user?.profile_pic_url || "/public/images/user.png"}
                alt="Profile"
                className="h-[32px] w-[32px] rounded-[50%]"
              />
            </div>

            <div>
              <Text className="font-semibold text-xl">Varsigram</Text>
            </div>

            <div className='flex flex-row justify-between items-center space-x-2'>
              <div
                onClick={() => handleNavigation('settings')}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
               <Img src="images/settings-icon.svg" alt="Settings" className="h-[24px] w-[24px]" />
              </div>
           
              <Link to="/notifications" className="relative">
                <Img
                  src="/images/vectors/bell.svg"
                  alt="Notifications"
                  className="h-[24px] w-[24px] text-gray-600 hover:text-blue-600 transition-colors"
                />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </Link>
           
              <Img
                src="/images/search.svg"
                alt="Search"
                className="h-[24px] w-[24px] cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              />
            </div>
          </div>

          {isCreatePostOpen && (
            <div className="animate-slide-up">
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
            </div>
          )}

          {!isCreatePostOpen && (
            <div
              className="lg:mt-0 flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors animate-fade-in"
              onClick={() => setIsCreatePostOpen(true)}
            >
              <input
                type="text"
                value={newPostContent}
                placeholder="Create a vars..."
                className="w-full text-[20px] font-normal text-[#adacb2] bg-transparent border-none outline-none focus:outline-none"
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
            {currentIsLoading && currentPosts.length === 0 && (
              <div className="flex justify-center items-center py-20 animate-fade-in">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
              </div>
            )}

            {error && !currentIsLoading && !isAuthLoading && (
              <div className="flex flex-col justify-center items-center py-20 animate-fade-in">
                <p className="text-red-500 text-center mb-4">{error}</p>
                <button
                  onClick={refreshPosts}
                  className="px-4 py-2 bg-[#750015] text-white rounded hover:bg-[#600012] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!currentIsLoading && !isAuthLoading && !error && currentPosts.length === 0 && (
              <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff] animate-fade-in">
                <Text as="p" className="text-[14px] font-normal text-[#adacb2]">
                  No {activeTab === 'forYou' ? 'posts' : 'official posts'} in your feed yet.
                </Text>
              </div>
            )}

            {!isAuthLoading && currentPosts.length > 0 && (
              <div className="space-y-6 w-full">
                {currentPosts.map((post, idx) => {
                  const uniqueKey = `${post.id}-${idx}`;
                  return (
                    <div 
                      key={uniqueKey}
                      className="animate-slide-up" 
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <Post
                        post={post}
                        onPostUpdate={handlePostUpdate}
                        onPostDelete={handlePostDelete}
                        onPostEdit={handlePostEdit}
                        currentUserId={user?.id}
                        currentUserEmail={user?.email}
                        onClick={() => handlePostClick(post.id)}
                        postsData={feedPosts}
                      />
                    </div>
                  );
                })}
                
                <div ref={loadingRef} className="h-20 flex items-center justify-center mt-4">
                  {currentIsLoading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]" />
                  )}
                  {!currentHasMore && currentPosts.length > 0 && (
                    <div className="text-gray-500">No more posts to load</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col sticky top-0 max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide animate-slide-left">
          <div className="rounded-[32px] border border-solid h-auto max-h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5 animate-fade-in">
            <div className="overflow-hidden h-full">
              <WhoToFollowSidePanel />
            </div>
          </div>

          <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white animate-fade-in">
            <ProfileOrganizationSection />
          </div>
        </div>
      </div>

      {/* <BottomNav /> */}
      

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center md:items-center justify-center p-2 md:p-4"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
            setSearchResults({ users: [], posts: [] });
            setSearchFaculty("");
            setSearchDepartment("");
            setSearchType('all');
          }}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-[32px] w-full h-full md:h-auto max-h-screen md:max-h-[80vh] overflow-y-auto shadow-lg p-4 md:p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults({ users: [], posts: [] });
                    setSearchFaculty("");
                    setSearchDepartment("");
                    setSearchType('all');
                  }}
                >
                  <Img src="images/vectors/x.svg" alt="Close" className="h-6 w-6" />
                </div>
                 <input
                          type="text"
                          className="flex-1 text-lg border-none outline-none"
                          placeholder="Search by name, faculty, or department..."
                          value={searchQuery}
                          onChange={handleSearchInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchButtonClick();
                          }}
                          autoFocus
                    />
                 <button
                    className="text-[#750015] font-medium disabled:text-gray-400"
                    onClick={handleSearchButtonClick}
                    disabled={isSearching || (!searchQuery.trim() && !searchFaculty && !searchDepartment)}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
              </div>


              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                <select
                  className="border rounded px-2 py-1"
                  value={searchType}
                  onChange={e => {
                  setSearchFaculty(e.target.value);
                  setSearchDepartment("");
              }}
            >
                  <option value="all">All</option>
                  <option value="student">Students</option>
                  <option value="organization">Organizations</option>
                </select>
                <select
                  className="border rounded px-2 py-1"
                  value={searchFaculty}
                  onChange={e => {
                    setSearchFaculty(e.target.value);
                    setSearchDepartment("");
                  }}
                >
                  <option value="">Select Faculties</option>
                  {faculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1"
                  value={searchDepartment}
                  onChange={e => setSearchDepartment(e.target.value)}
                  disabled={!searchFaculty}
                >
                  <option value="">Select Departments</option>
                  {(facultyDepartments[searchFaculty] || []).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 flex items-center">
                  {searchResults.users.length > 0 && `${searchResults.users.length} results`}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {isSearching ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="p-4">
              {searchResults.users.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {searchResults.users.length} {searchResults.users.length === 1 ? 'Result' : 'Results'}
                  </h3>
                  <div className="space-y-4">
                    {searchResults.users.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          if (user.display_name_slug) {
                            navigate(`/user-profile/${user.display_name_slug}`);
                            setIsSearchOpen(false);
                          }
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">
                            {user.type === "student" ? (
                              <>
                                {user.faculty} {user.department && `• ${user.department}`}
                              </>
                            ) : (
                              <>Organization {user.exclusive && '• Verified'}</>
                            )}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {user.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery || searchFaculty || searchDepartment ? (
                <div className="text-center py-10 text-gray-500">
                  No results found for your search criteria
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  Enter search terms or select filters to begin
                </div>
              )
              }
            </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}