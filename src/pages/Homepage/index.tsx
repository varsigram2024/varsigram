import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import debounce from "lodash/debounce";
import { useAuth } from '../../auth/AuthContext';
import { Post } from '../../components/Post/index.tsx';
import axios from 'axios';
import { Link, useNavigate, useLocation, ScrollRestoration } from "react-router-dom";
import { PostSkeleton } from '../../components/PostSkeleton/index.tsx';
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
  tags?: string; // Update from 'tag' to 'tags' to match backend
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

interface SearchResultUser {
  type: 'student' | 'organization';
  email: string;
  faculty?: string;
  department?: string;
  name?: string;
  organization_name?: string;
  display_name_slug: string;
  exclusive?: boolean;
}

interface SearchApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SearchResultUser[];
}

// Update your SearchResult interface to match what you're actually using
interface SearchResult {
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    display_name_slug: string;
    type: 'student' | 'organization';
    faculty?: string;
    department?: string;
    exclusive?: boolean;
  }>;
  posts: any[]; // You can define this properly if needed
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
  const [activeTab, setActiveTab] = useState<'forYou' | 'official' | 'questions' | 'relatable' | 'updates' | 'milestones'>('forYou');
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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [questionsPosts, setQuestionsPosts] = useState<Post[]>([]);
  const [questionsNextCursor, setQuestionsNextCursor] = useState<string | null>(null);
  const [questionsHasMore, setQuestionsHasMore] = useState<boolean>(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(false);
  const [lastQuestionsFetch, setLastQuestionsFetch] = useState<number>(0);

  const [relatablePosts, setRelatablePosts] = useState<Post[]>([]);
  const [relatableNextCursor, setRelatableNextCursor] = useState<string | null>(null);
  const [relatableHasMore, setRelatableHasMore] = useState<boolean>(true);
  const [isRelatableLoading, setIsRelatableLoading] = useState<boolean>(false);
  const [lastRelatableFetch, setLastRelatableFetch] = useState<number>(0);

  const [updatesPosts, setUpdatesPosts] = useState<Post[]>([]);
  const [updatesNextCursor, setUpdatesNextCursor] = useState<string | null>(null);
  const [updatesHasMore, setUpdatesHasMore] = useState<boolean>(true);
  const [isUpdatesLoading, setIsUpdatesLoading] = useState<boolean>(false);
  const [lastUpdatesFetch, setLastUpdatesFetch] = useState<number>(0);

  const [milestonesPosts, setMilestonesPosts] = useState<Post[]>([]);
  const [milestonesNextCursor, setMilestonesNextCursor] = useState<string | null>(null);
  const [milestonesHasMore, setMilestonesHasMore] = useState<boolean>(true);
  const [isMilestonesLoading, setIsMilestonesLoading] = useState<boolean>(false);
  const [lastMilestonesFetch, setLastMilestonesFetch] = useState<number>(0);



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
  const [searchResults, setSearchResults] = useState<{users: any[], posts: any[]}>({ 
    users: [], 
    posts: [] 
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'student' | 'organization'>('all');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');

const currentPosts = useMemo(() => {
  switch (activeTab) {
    case 'forYou': return feedPosts;
    case 'official': return officialPosts;
    case 'questions': return questionsPosts;
    case 'relatable': return relatablePosts;
    case 'updates': return updatesPosts;
    case 'milestones': return milestonesPosts;
    default: return feedPosts;
  }
}, [activeTab, feedPosts, officialPosts, questionsPosts, relatablePosts, updatesPosts, milestonesPosts]);


const currentHasMore = useMemo(() => {
  switch (activeTab) {
    case 'forYou': return feedHasMore;
    case 'official': return officialHasMore;
    case 'questions': return questionsHasMore;
    case 'relatable': return relatableHasMore;
    case 'updates': return updatesHasMore;
    case 'milestones': return milestonesHasMore;
    default: return feedHasMore;
  }
}, [activeTab, feedHasMore, officialHasMore, questionsHasMore, relatableHasMore, updatesHasMore, milestonesHasMore]);





const currentNextCursor = useMemo(() => {
  switch (activeTab) {
    case 'forYou': return feedNextCursor;
    case 'official': return officialNextCursor;
    case 'questions': return questionsNextCursor;
    case 'relatable': return relatableNextCursor;
    case 'updates': return updatesNextCursor;
    case 'milestones': return milestonesNextCursor;
    default: return feedNextCursor;
  }
}, [activeTab, feedNextCursor, officialNextCursor, questionsNextCursor, relatableNextCursor, updatesNextCursor, milestonesNextCursor]);




const currentIsLoading = useMemo(() => {
  switch (activeTab) {
    case 'forYou': return isFeedLoading;
    case 'official': return isOfficialLoading;
    case 'questions': return isQuestionsLoading;
    case 'relatable': return isRelatableLoading;
    case 'updates': return isUpdatesLoading;
    case 'milestones': return isMilestonesLoading;
    default: return isFeedLoading;
  }
}, [activeTab, isFeedLoading, isOfficialLoading, isQuestionsLoading, isRelatableLoading, isUpdatesLoading, isMilestonesLoading]);




const fetchPosts = async (type: 'feed' | 'official', startAfter: string | null = null) => {
  if (!token || (type === 'feed' ? isFeedLoading : isOfficialLoading)) return;

  const now = Date.now();
  const lastFetch = type === 'feed' ? lastFeedFetch : lastOfficialFetch;
  
  // Only skip if we're not paginating (no startAfter) and it's been less than 5 minutes
  const shouldSkip = lastFetch && (now - lastFetch) < 5 * 60 * 1000 && !startAfter;

  if (shouldSkip) {
    return;
  }

  if (type === 'feed') {
    setIsFeedLoading(true);
  } else {
    setIsOfficialLoading(true);
  }

   try {
    const endpoint = type === 'feed' ? '/feed/' : '/official/';
    const params: any = {
      page_size: 10,
    };
    
    if (startAfter) {
      params.start_after = startAfter;
    }
    
    if (type === 'feed' && feedSessionId && !startAfter) {
      params.session_id = feedSessionId;
    }

    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    });

    console.log(`${type} response:`, response.data);

    let results, nextCursor, sessionId;

    if (type === 'feed') {
      results = response.data.results || [];
      sessionId = response.data.session_id;
      nextCursor = response.data.next_cursor;
      
      if (!nextCursor && results.length >= 10) {
        nextCursor = results[results.length - 1]?.id || null;
      }
    } else {
      results = response.data.results || [];
      nextCursor = response.data.next_cursor;
    }

    // Ensure all posts have the tags field properly set
    results = results.map((post: Post) => ({
      ...post,
      tags: post.tags || '', // Ensure tags field exists, default to empty string
    }));

    if (Array.isArray(results) && results.length > 0) {
      if (type === 'feed') {
        setFeedPosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        
        if (sessionId && !startAfter) {
          setFeedSessionId(sessionId);
        }
        setFeedNextCursor(nextCursor);
        setFeedHasMore(!!nextCursor || results.length >= 10);
        setLastFeedFetch(now);
      } else {
        setOfficialPosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        setOfficialNextCursor(nextCursor);
        setOfficialHasMore(!!nextCursor || results.length >= 10);
        setLastOfficialFetch(now);
      }
    } else if (Array.isArray(results) && results.length === 0) {
      if (type === 'feed') setFeedHasMore(false);
      else setOfficialHasMore(false);
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


const fetchTaggedPosts = async (tag: 'questions' | 'relatable' | 'updates' | 'milestones', 
  startAfter: string | null = null) => {
  if (!token) return;

  const now = Date.now();
  
  // Map frontend tab names to backend PLURAL endpoints
  const endpointMap = {
    'questions': 'questions',    // Changed from 'question' to 'questions'
    'relatable': 'relatable',    // Keep as 'relatable' (already plural)
    'updates': 'updates',        // Changed from 'update' to 'updates'
    'milestones': 'milestones'   // Changed from 'milestone' to 'milestones'
  };
  
  const backendEndpoint = endpointMap[tag];

  switch (tag) {
    case 'questions': setIsQuestionsLoading(true); break;
    case 'relatable': setIsRelatableLoading(true); break;
    case 'updates': setIsUpdatesLoading(true); break;
    case 'milestones': setIsMilestonesLoading(true); break;
  }

  try {
    // Use the plural backend endpoint
    const endpoint = `/posts/${backendEndpoint}/`;
    const params: any = {
      page_size: 10,
    };
    
    if (startAfter) {
      params.start_after = startAfter;
    }

    console.log(`Fetching ${tag} posts from endpoint: ${endpoint}`);

    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    });

    // Ensure the response has the expected structure
    if (!response.data || !Array.isArray(response.data.results)) {
      console.error(`Invalid response structure for ${tag} posts:`, response.data);
      throw new Error(`Invalid response structure for ${tag} posts`);
    }

    console.log(`${tag} response:`, response.data);

    let results = response.data.results || [];
    const nextCursor = response.data.next_cursor;

    // Ensure all posts have the tags field properly set with the backend tag value
    results = results.map((post: Post) => ({
      ...post,
      tags: post.tags || backendEndpoint, // Use the backend tag value
    }));

    // Update state based on tag
    switch (tag) {
      case 'questions':
        setQuestionsPosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        setQuestionsNextCursor(nextCursor);
        setQuestionsHasMore(!!nextCursor || results.length >= 10);
        setLastQuestionsFetch(now);
        break;

      case 'relatable':
        setRelatablePosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        setRelatableNextCursor(nextCursor);
        setRelatableHasMore(!!nextCursor || results.length >= 10);
        setLastRelatableFetch(now);
        break;

      case 'updates':
        setUpdatesPosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        setUpdatesNextCursor(nextCursor);
        setUpdatesHasMore(!!nextCursor || results.length >= 10);
        setLastUpdatesFetch(now);
        break;

      case 'milestones':
        setMilestonesPosts(prev => {
          if (startAfter) {
            const existingIds = new Set(prev.map(p => p.id));
            const uniquePosts = results.filter((post: Post) => !existingIds.has(post.id));
            return [...prev, ...uniquePosts];
          } else {
            return results;
          }
        });
        setMilestonesNextCursor(nextCursor);
        setMilestonesHasMore(!!nextCursor || results.length >= 10);
        setLastMilestonesFetch(now);
        break;
    }

  } 
  
  catch (error) {
    console.error(`Error fetching ${tag} posts:`, error);
    switch (tag) {
      case 'questions': setQuestionsHasMore(false); break;
      case 'relatable': setRelatableHasMore(false); break;
      case 'updates': setUpdatesHasMore(false); break;
      case 'milestones': setMilestonesHasMore(false); break;
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error(`Endpoint not found: /posts/${backendEndpoint}/`);
      toast.error(`Unable to load ${tag} posts at this time`);
    } else if (axios.isAxiosError(error)) {
      console.error(`HTTP ${error.response?.status} error for ${tag} posts:`, error.response?.data);
    }
  } finally {
    switch (tag) {
      case 'questions': setIsQuestionsLoading(false); break;
      case 'relatable': setIsRelatableLoading(false); break;
      case 'updates': setIsUpdatesLoading(false); break;
      case 'milestones': setIsMilestonesLoading(false); break;
    }
  }
};

const loadMorePosts = async () => {
  if (currentIsLoading || !currentHasMore) return;

  switch (activeTab) {
    case 'forYou':
      await fetchPosts('feed', feedNextCursor);
      break;
    case 'official':
      await fetchPosts('official', officialNextCursor);
      break;
    case 'questions':
      await fetchTaggedPosts('questions', questionsNextCursor);
      break;
    case 'relatable':
      await fetchTaggedPosts('relatable', relatableNextCursor);
      break;
    case 'updates':
      await fetchTaggedPosts('updates', updatesNextCursor);
      break;
    case 'milestones':
      await fetchTaggedPosts('milestones', milestonesNextCursor);
      break;
  }
};


useEffect(() => {
  if (!token) return;

  // Refresh when switching tabs or on initial load
  switch (activeTab) {
    case 'forYou':
      if (feedPosts.length === 0 || feedNextCursor === null) {
        fetchPosts('feed', null);
      }
      break;
    case 'official':
      if (officialPosts.length === 0 || officialNextCursor === null) {
        fetchPosts('official', null);
      }
      break;
    case 'questions':
      if (questionsPosts.length === 0 || questionsNextCursor === null) {
        fetchTaggedPosts('questions', null);
      }
      break;
    case 'relatable':
      if (relatablePosts.length === 0 || relatableNextCursor === null) {
        fetchTaggedPosts('relatable', null);
      }
      break;
    case 'updates':
      if (updatesPosts.length === 0 || updatesNextCursor === null) {
        fetchTaggedPosts('updates', null);
      }
      break;
    case 'milestones':
      if (milestonesPosts.length === 0 || milestonesNextCursor === null) {
        fetchTaggedPosts('milestones', null);
      }
      break;
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
      
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size should be less than 20MB');
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

// Update the tag mapping to match backend expectations (singular for creation)
const TAG_MAPPING = {
  'explore': 'explore',
  'updates': 'update',      // Singular for backend when creating posts
  'questions': 'question',  // Singular for backend when creating posts
  'milestones': 'milestone', // Singular for backend when creating posts
  'relatable': 'relatable'  // Singular for backend when creating posts
} as const;

const handleCreatePost = async (selectedTag: string = 'explore') => {
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

    // Map frontend tag to backend expected value
    const backendTag = TAG_MAPPING[selectedTag as keyof typeof TAG_MAPPING] || 'explore';

    const postData: any = {
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
      author_exclusive: (user as any)?.exclusive || false,
      tags: backendTag, // Use the mapped backend tag value
    };

    // Always use the main posts endpoint for creation
    const endpoint = '/posts/';

    console.log('Creating post with data:', postData);

    const response = await axios.post(`${API_BASE_URL}${endpoint}`, postData, {
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
      author_profile_pic_url: user?.profile_pic_url || null,
      tags: backendTag, // Use the backend tag value
    };

    // Add the new post to the main feed (always)
    setFeedPosts(prev => [completePost, ...prev]);
    
    // Also add to the specific tag feed if we're not using "explore"
    if (selectedTag !== 'explore') {
      switch (selectedTag) {
        case 'questions':
          setQuestionsPosts(prev => [completePost, ...prev]);
          break;
        case 'relatable':
          setRelatablePosts(prev => [completePost, ...prev]);
          break;
        case 'updates':
          setUpdatesPosts(prev => [completePost, ...prev]);
          break;
        case 'milestones':
          setMilestonesPosts(prev => [completePost, ...prev]);
          break;
      }
    }

    setNewPostContent('');
    setSelectedFiles([]);
    setIsCreatePostOpen(false);
    toast.success('Post created successfully');
    
    console.log('Post created successfully:', completePost);
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    // Better error logging
    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Response status:', error.response.status);
      toast.error(`Failed to create post: ${error.response.data?.detail || error.response.statusText}`);
    } else if (error.request) {
      console.error('Request error:', error.request);
      toast.error('Failed to create post: No response from server');
    } else {
      toast.error('Failed to create post. Please try again.');
    }
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
  setQuestionsPosts(prevPosts =>
    prevPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    )
  );
  setRelatablePosts(prevPosts =>
    prevPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    )
  );
  setUpdatesPosts(prevPosts =>
    prevPosts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    )
  );
  setMilestonesPosts(prevPosts =>
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
  setQuestionsPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
  setRelatablePosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
  setUpdatesPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
  setMilestonesPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
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
  const updateFunction = (prevPosts: Post[]) =>
    prevPosts.map((post) =>
      post.id === postId
        ? { ...post, like_count, has_liked }
        : post
    );

  setFeedPosts(updateFunction);
  setOfficialPosts(updateFunction);
  setQuestionsPosts(updateFunction);
  setRelatablePosts(updateFunction);
  setUpdatesPosts(updateFunction);
  setMilestonesPosts(updateFunction);
};


  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Always show header at the top of the page
    if (currentScrollY < 100) {
      setIsHeaderVisible(true);
      setLastScrollY(currentScrollY);
      return;
    }
    
    // If scrolling down, hide header; if scrolling up, show header immediately
    if (currentScrollY > lastScrollY + 50) {
      // Scrolling down - hide header
      setIsHeaderVisible(false);
    } else if (currentScrollY < lastScrollY - 10) {
      // Scrolling up - show header immediately (even with small upward movement)
      setIsHeaderVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  // Throttle the scroll handler for better performance
  const throttledScroll = throttle(handleScroll, 100);
  
  window.addEventListener('scroll', throttledScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', throttledScroll);
  };
}, [lastScrollY]);

// Simple throttle function (add this outside your component)
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


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
  switch (activeTab) {
    case 'forYou':
      setFeedPosts([]);
      setFeedNextCursor(null);
      setFeedSessionId(null);
      setFeedHasMore(true);
      await fetchPosts('feed', null);
      break;
    case 'official':
      setOfficialPosts([]);
      setOfficialNextCursor(null);
      setOfficialHasMore(true);
      await fetchPosts('official', null);
      break;
    case 'questions':
      setQuestionsPosts([]);
      setQuestionsNextCursor(null);
      setQuestionsHasMore(true);
      await fetchTaggedPosts('questions', null);
      break;
    case 'relatable':
      setRelatablePosts([]);
      setRelatableNextCursor(null);
      setRelatableHasMore(true);
      await fetchTaggedPosts('relatable', null);
      break;
    case 'updates':
      setUpdatesPosts([]);
      setUpdatesNextCursor(null);
      setUpdatesHasMore(true);
      await fetchTaggedPosts('updates', null);
      break;
    case 'milestones':
      setMilestonesPosts([]);
      setMilestonesNextCursor(null);
      setMilestonesHasMore(true);
      await fetchTaggedPosts('milestones', null);
      break;
  }
};


  const handleSearch = async () => {
  // Don't search if no criteria provided (matches API requirement)
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
    
    // Remove the 'type' parameter as it's not supported by the API
    // The API searches both students and organizations by default

    const response = await axios.get<SearchApiResponse>(
      `${API_BASE_URL}/users/search/`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params,
      }
    );

    console.log('Search response:', response.data);

    // Map the response data correctly - the API returns results in response.data.results
    const apiResults = response.data.results || [];

    // Map the API response to your UI structure
    const mappedUsers = apiResults.map((user: SearchResultUser, idx: number) => {
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

  // Filter results by type if not 'all'
const filteredResults = searchType === 'all' 
  ? searchResults.users 
  : searchResults.users.filter(user => user.type === searchType);

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
  <div className={`flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative`}>
    <div className={`flex w-full items-start justify-center flex-row`}>
      <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col md:gap-[35px] sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
        
        {/* Header Section */}
        <div className={`sticky top-0 bg-[#f6f6f6] pt-5 pb-3 z-10 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
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
                  {unreadCount > 99 ? '*' : unreadCount}
                </div>
              )}
            </Link>
          </div>

          {/* Mobile Header */}
          <div className="mt-5 lg:hidden flex flex-row justify-between items-center animate-fade-in">
            <div
                onClick={() => handleNavigation('settings')}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
               <Img src="images/settings-icon.svg" alt="Settings" className="h-[24px] w-[24px]" />
              </div>

            <div className='flex items-center justify-center'>
              <Text className="font-semibold text-xl text-center">Varsigram</Text>
            </div>

            <div className='flex flex-row justify-between items-center space-x-2'>
             
           
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
         
          {/* Tabs */}
          <div className="lg:mt-5 mt-8 flex justify-between animate-slide-up overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between space-x-4">
              {[
                { key: 'forYou', label: 'Explore' },
                { key: 'official', label: 'Official' },
                { key: 'updates', label: 'Updates' },
                { key: 'relatable', label: 'Events' },
                { key: 'questions', label: 'Ask & Share' },
                { key: 'milestones', label: 'Milestones' },
                
              ].map((tab) => (
                <div
                  key={tab.key}
                  className={`flex px-3 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key 
                      ? 'border-b-2 border-solid border-[#750015]' 
                      : ''
                  }`}
                  onClick={() => setActiveTab(tab.key as any)}
                >
                  <Text 
                    as="p" 
                    className={`text-[14px] font-medium md:text-[16px] ${
                      activeTab === tab.key 
                        ? 'text-[#750015]' 
                        : '!text-[#adacb2]'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Create Post Section */}
        {isCreatePostOpen && (
          <div className="animate-slide-up">
            <CreatePostModal
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              isUploading={isUploading}
              onClose={handleCancelPost}
              onSubmit={handleCreatePost} // Now this passes the selected tag
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

        {/* Posts Section with Lazy Loader */}
        <div className="w-full post-section">
          {currentIsLoading && currentPosts.length === 0 && (
            <div className="space-y-6 w-full animate-fade-in">
              {[...Array(5)].map((_, idx) => (
                <PostSkeleton key={`skeleton-${idx}`} />
              ))}
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
                  No {activeTab === 'forYou' ? 'posts' : 
                      activeTab === 'questions' ? 'questions' :
                      activeTab === 'relatable' ? 'relatable posts' :
                      activeTab === 'updates' ? 'updates' :
                      activeTab === 'milestones' ? 'milestones' :
                      'official posts'} in your feed yet.
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
              
              {/* Loading more posts skeleton */}
              {currentIsLoading && currentPosts.length > 0 && (
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
                    <PostSkeleton key={`more-skeleton-${idx}`} />
                  ))}
                </div>
              )}
              
              <div ref={loadingRef} className="h-20 flex items-center justify-center mt-4">
                {currentIsLoading && currentPosts.length > 0 && (
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

      {/* Sidebar */}
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

    {/* Search Modal */}
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
                onChange={e => setSearchType(e.target.value as 'all' | 'student' | 'organization')}
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
                {filteredResults.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
                    </h3>
                    <div className="space-y-4">
                      {filteredResults.map((user) => (
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
