import React, { useEffect, useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import debounce from "lodash/debounce";
import { useAuth } from '../../auth/AuthContext';
import { Post } from '../../components/Post.tsx';
import axios from 'axios';
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  faculty?: string;
  department?: string;
  exclusive?: boolean;
  // Add these properties that might exist in the actual user object
  user_faculty?: string;
  user_department?: string;
  user_exclusive?: boolean;
}

interface SearchResult {
  users: {
    id: string;
    email: string;
    fullName: string;
    profile_pic_url?: string;
    display_name_slug?: string;
    bio?: string;
    type: 'student' | 'organization';
  }[];
  posts: Post[];
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
 
  // Use context instead of local state
  const {
    feedPosts, setFeedPosts,
    feedNextCursor, setFeedNextCursor,
    feedHasMore, setFeedHasMore,
    feedScroll, setFeedScroll,
    isFeedLoading, setIsFeedLoading,
    lastFeedFetch, setLastFeedFetch,
    
    officialPosts, setOfficialPosts,
    officialNextCursor, setOfficialNextCursor,
    officialHasMore, setOfficialHasMore,
    officialScroll, setOfficialScroll,
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
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Add state to track if this is the first load
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const scrollRestoredRef = useRef(false);
  const postsRenderedRef = useRef(false);

  // Get current posts based on active tab
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

  // Update the fetchPosts function to use context
  const fetchPosts = async (type: 'feed' | 'official', startAfter: string | null = null) => {
    if (!token || (type === 'feed' ? isFeedLoading : isOfficialLoading)) return;

    // Check if we should skip fetching (data is fresh)
    const now = Date.now();
    const lastFetch = type === 'feed' ? lastFeedFetch : lastOfficialFetch;
    const shouldSkip = lastFetch && (now - lastFetch) < 5 * 60 * 1000; // 5 minutes cache
    
    if (shouldSkip && !startAfter) {
      return; // Skip if data is fresh and we're not paginating
    }

    if (type === 'feed') {
      setIsFeedLoading(true);
    } else {
      setIsOfficialLoading(true);
    }

    try {
      const endpoint = type === 'feed' ? '/posts/' : '/official/';

      const params: any = { 
        page_size: 10,
        start_after: startAfter
      };
      
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params,
      });

      const { results, next_cursor } = response.data;
      
      if (Array.isArray(results) && results.length > 0) {
        if (type === 'feed') {
          setFeedPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter(post => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          });
          setFeedNextCursor(next_cursor);
          setFeedHasMore(!!next_cursor);
          setLastFeedFetch(now);
        } else {
          setOfficialPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter(post => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          });
          setOfficialNextCursor(next_cursor);
          setOfficialHasMore(!!next_cursor);
          setLastOfficialFetch(now);
        }
      }
    } catch (error) {
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

  // Update loadMorePosts to properly use the cursor
  const loadMorePosts = async () => {
    if (currentIsLoading || !currentHasMore) return;

    const type = activeTab === 'forYou' ? 'feed' : 'official';
    const cursor = activeTab === 'forYou' ? feedNextCursor : officialNextCursor;

    try {
      await fetchPosts(type, cursor);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    }
  };

  // Initial load based on active tab - only if no data exists
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

  // Infinite scroll for feed container
  useEffect(() => {
    const container = postsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 300 &&
        currentHasMore && !currentIsLoading
      ) {
        loadMorePosts();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentHasMore, currentIsLoading, loadMorePosts]);

  // Set first load to false after initial render
  useEffect(() => {
    if (currentPosts.length > 0) {
      setTimeout(() => {
        setIsFirstLoad(false);
      }, 100);
    }
  }, [currentPosts.length]);

  // Improved scroll restoration
  useEffect(() => {
    const container = postsContainerRef.current;
    if (!container) return;

    const savedScroll = activeTab === 'forYou' ? feedScroll : officialScroll;
    
    // Only restore scroll if we have posts, haven't restored yet, and posts are rendered
    if (savedScroll > 0 && currentPosts.length > 0 && !scrollRestoredRef.current && postsRenderedRef.current) {
      // If it's not the first load, restore immediately
      // If it's the first load, wait for animation
      const delay = isFirstLoad ? 600 : 100;
      
      setTimeout(() => {
        requestAnimationFrame(() => {
          container.scrollTop = savedScroll;
          scrollRestoredRef.current = true;
        });
      }, delay);
    }
  }, [activeTab, feedScroll, officialScroll, currentPosts.length, isFirstLoad]);

  // Track when posts are rendered
  useEffect(() => {
    if (currentPosts.length > 0) {
      setTimeout(() => {
        postsRenderedRef.current = true;
      }, 100);
    }
  }, [currentPosts.length]);

  // Reset flags when tab changes
  useEffect(() => {
    scrollRestoredRef.current = false;
    postsRenderedRef.current = false;
  }, [activeTab]);

  // Save scroll position on unmount
  useEffect(() => {
    return () => {
      const container = postsContainerRef.current;
      if (container) {
        const currentScroll = container.scrollTop;
        if (activeTab === 'forYou') {
          setFeedScroll(currentScroll);
        } else {
          setOfficialScroll(currentScroll);
        }
      }
    };
  }, [activeTab, setFeedScroll, setOfficialScroll]);

  const handlePostClick = (postId: string) => {
    // Save scroll position before navigating
    const container = postsContainerRef.current;
    if (container) {
      const currentScroll = container.scrollTop;
      if (activeTab === 'forYou') {
        setFeedScroll(currentScroll);
      } else {
        setOfficialScroll(currentScroll);
      }
    }
    navigate(`/posts/${postId}`, { state: { backgroundLocation: location } });
  };

  // Remove the conflicting useLayoutEffect for scroll restoration
  // The useEffect above handles it better

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

      const mediaUrls = await Promise.all(
        selectedFiles.map(file => uploadPostMedia(file, token))
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

      // Create a complete post object with all required fields
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

      // Add to feed posts and refresh if needed
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

    if (!token) {
      toast.error('Please login to delete posts');
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/posts/${post.id}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
     
      setFeedPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
      setOfficialPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
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
    setError(null);
    if (activeTab === 'forYou') {
      setFeedPosts([]);
      setFeedNextCursor(null);
      setFeedHasMore(true);
      await fetchPosts('feed', null);
    } else {
      setOfficialPosts([]);
      setOfficialNextCursor(null);
      setOfficialHasMore(true);
      await fetchPosts('official');
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const params: any = {};
      if (searchType !== 'all') params.type = searchType;
      if (searchFaculty) params.faculty = searchFaculty;
      if (searchDepartment) params.department = searchDepartment;
      if (searchQuery.trim()) params.query = searchQuery.trim();

      const usersResponse = await axios.get(
        `${API_BASE_URL}/users/search/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      const mappedUsers = usersResponse.data.map((user: any, idx: number) => {
        if (user.name) {
          return {
            id: user.display_name_slug || user.email || idx,
            email: user.email,
            fullName: user.name,
            profile_pic_url: user.profile_pic_url || "",
            display_name_slug: user.display_name_slug,
            type: "student",
            faculty: user.faculty,
            department: user.department,
          };
        } else if (user.organization_name) {
          return {
            id: user.display_name_slug || user.email || idx,
            email: user.email,
            fullName: user.organization_name,
            profile_pic_url: user.profile_pic_url || "",
            display_name_slug: user.display_name_slug,
            type: "organization",
          };
        }
        return null;
      }).filter(Boolean);

      mappedUsers.sort((a, b) =>
        a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
      );

      setSearchResults({
        users: mappedUsers,
        posts: [],
      });
    } catch (error) {
      console.error("Search error:", error);
      toast.error('Failed to fetch search results');
      setSearchResults({ users: [], posts: [] });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      handleSearch();
    }
  }, [searchType, searchFaculty, searchDepartment]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, searchType, searchFaculty, searchDepartment]);

  const debouncedSearch = useMemo(() => debounce(handleSearch, 400), [handleSearch]);

  return (
    <div className={`flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto ${isFirstLoad ? 'animate-fade-in' : ''}`}>
      <Sidebar1 />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row animate-slide-up">
        <div 
          className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col md:gap-[35px] sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0"
          ref={postsContainerRef}
          style={{ 
            overflowY: 'auto',
            height: '100vh',
            maxHeight: 'calc(100vh - 120px)',
            paddingBottom: '20px',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth' // CHANGE: Add smooth scrolling
          }}
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

            <div className='flex flex-row justify-between'>
              <div
                onClick={() => handleNavigation('settings')}
                className="hover:opacity-80 transition-opacity cursor-pointer mr-2"
              >
               <Img src="images/settings-icon.svg" alt="File" className="h-[24px] w-[24px]" />
              </div>
           
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
                  // Add unique composite key
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
                
                {/* Loading trigger */}
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

        <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide animate-slide-left">
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

      <BottomNav />
      

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center md:items-center justify-center p-2 md:p-4"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
            setSearchResults({ users: [], posts: [] });
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
                  }}
                >
                  <Img src="images/vectors/x.svg" alt="Close" className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  className="flex-1 text-lg border-none outline-none"
                  placeholder="Search Varsigram..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    className="text-[#750015] font-medium"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    Search
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                <select
                  className="border rounded px-2 py-1"
                  value={searchType}
                  onChange={e => setSearchType(e.target.value as any)}
                >
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
              </div>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {isSearching ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="p-4">
                  {/* Users Section */}
                  {searchResults.users.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">People</h3>
                      <div className="space-y-4">
                        {searchResults.users.map((user) => (
                          <div key={user.id} className="flex flex-col gap-1 cursor-pointer" onClick={() => {
                            if (user.display_name_slug) {
                              navigate(`/user-profile/${user.display_name_slug}`);
                              setIsSearchOpen(false);
                            }
                          }}>
                            <div className="font-semibold">{user.fullName}</div>
                            {user.type === "student" && (
                              <div className="text-xs text-gray-500">
                                {user.faculty} {user.department && `- ${user.department}`}
                              </div>
                            )}
                            {user.type === "organization" && (
                              <div className="text-xs text-gray-500">Organization</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts Section */}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Posts</h3>
                      <div className="space-y-4">
                        {searchResults.posts.map((post) => (
                          <Post
                            key={post.id}
                            post={post}
                            onPostUpdate={handlePostUpdate}
                            onPostDelete={handlePostDelete}
                            onPostEdit={handlePostEdit}
                            currentUserId={user?.id}
                            currentUserEmail={user?.email}
                            onClick={() => {
                              const currentScroll = activeTab === 'forYou' ? feedScroll : officialScroll;
                              sessionStorage.setItem('homepageScroll', currentScroll.toString());
                              navigate(`/posts/${post.id}`, { state: { backgroundLocation: location } });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && 
                   !isSearching && 
                   searchResults.users.length === 0 && 
                   searchResults.posts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}