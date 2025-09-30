import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import debounce from "lodash/debounce";
import { useAuth } from "../../auth/AuthContext";
import { Post } from "../../components/Post.tsx";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import BottomNav from "../../components/BottomNav";
import { toast } from "react-hot-toast";
import { uploadPostMedia } from "../../utils/fileUpload";
import WhoToFollowSidePanel from "../../components/whoToFollowSidePanel/index.tsx";
import CreatePostModal from "../../components/CreatePostModal";
import { faculties, facultyDepartments } from "../../constants/academic";
import { useFeed } from "../../context/FeedContext";
import { useNotification } from "../../context/NotificationContext";

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
    type: "student" | "organization";
  }[];
  posts: Post[];
}

const useIntersectionObserver = (
  callback: () => void,
  options = { threshold: 0, rootMargin: "300px" }
) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
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
  const [activeTab, setActiveTab] = useState<"forYou" | "official">("forYou");
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

  const {
    feedPosts,
    setFeedPosts,
    feedNextCursor,
    setFeedNextCursor,
    feedHasMore,
    setFeedHasMore,
    feedScroll,
    setFeedScroll,
    isFeedLoading,
    setIsFeedLoading,
    lastFeedFetch,
    setLastFeedFetch,

    officialPosts,
    setOfficialPosts,
    officialNextCursor,
    setOfficialNextCursor,
    officialHasMore,
    setOfficialHasMore,
    officialScroll,
    setOfficialScroll,
    isOfficialLoading,
    setIsOfficialLoading,
    lastOfficialFetch,
    setLastOfficialFetch,
  } = useFeed();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    users: [],
    posts: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<
    "all" | "student" | "organization"
  >("all");
  const [searchFaculty, setSearchFaculty] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const createPostInputRef = useRef<HTMLDivElement>(null); // Ref for the original input
  const location = useLocation();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const scrollRestoredRef = useRef(false);
  const postsRenderedRef = useRef(false);

  // New state for floating input visibility
  const [isFloatingInputVisible, setIsFloatingInputVisible] = useState(false);
  const lastScrollTop = useRef(0);
  const scrollThreshold = 100; // Pixels to scroll down before showing the floating bar

  const currentPosts = useMemo(() => {
    return activeTab === "forYou" ? feedPosts : officialPosts;
  }, [activeTab, feedPosts, officialPosts]);

  const currentHasMore = useMemo(() => {
    return activeTab === "forYou" ? feedHasMore : officialHasMore;
  }, [activeTab, feedHasMore, officialHasMore]);

  const currentNextCursor = useMemo(() => {
    return activeTab === "forYou" ? feedNextCursor : officialNextCursor;
  }, [activeTab, feedNextCursor, officialNextCursor]);

  const currentIsLoading = useMemo(() => {
    return activeTab === "forYou" ? isFeedLoading : isOfficialLoading;
  }, [activeTab, isFeedLoading, isOfficialLoading]);

  const fetchPosts = async (
    type: "feed" | "official",
    startAfter: string | null = null
  ) => {
    if (!token || (type === "feed" ? isFeedLoading : isOfficialLoading)) return;

    const now = Date.now();
    const lastFetch = type === "feed" ? lastFeedFetch : lastOfficialFetch;
    const shouldSkip = lastFetch && now - lastFetch < 5 * 60 * 1000;

    if (shouldSkip && !startAfter) {
      return;
    }

    if (type === "feed") {
      setIsFeedLoading(true);
    } else {
      setIsOfficialLoading(true);
    }

    try {
      const endpoint = type === "feed" ? "/posts/" : "/official/";

      const params: any = {
        page_size: 10,
        start_after: startAfter,
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
        if (type === "feed") {
          setFeedPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniquePosts = results.filter(
              (post) => !existingIds.has(post.id)
            );
            return [...prev, ...uniquePosts];
          });
          setFeedNextCursor(next_cursor);
          setFeedHasMore(!!next_cursor);
          setLastFeedFetch(now);
        } else {
          setOfficialPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniquePosts = results.filter(
              (post) => !existingIds.has(post.id)
            );
            return [...prev, ...uniquePosts];
          });
          setOfficialNextCursor(next_cursor);
          setOfficialHasMore(!!next_cursor);
          setLastOfficialFetch(now);
        }
      }
    } catch (error) {
      if (type === "feed") setFeedHasMore(false);
      else setOfficialHasMore(false);
    } finally {
      if (type === "feed") {
        setIsFeedLoading(false);
      } else {
        setIsOfficialLoading(false);
      }
    }
  };

  const loadMorePosts = async () => {
    if (currentIsLoading || !currentHasMore) return;

    const type = activeTab === "forYou" ? "feed" : "official";
    const cursor = activeTab === "forYou" ? feedNextCursor : officialNextCursor;

    try {
      await fetchPosts(type, cursor);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    if (activeTab === "forYou" && feedPosts.length === 0) {
      fetchPosts("feed", null);
    } else if (activeTab === "official" && officialPosts.length === 0) {
      fetchPosts("official", null);
    }
  }, [activeTab, token]);

  const loadMoreCallback = useCallback(() => {
    if (!currentIsLoading && currentHasMore && token) {
      loadMorePosts();
    }
  }, [
    currentIsLoading,
    currentHasMore,
    token,
    currentPosts.length,
    loadMorePosts,
  ]);

  const loadingRef = useIntersectionObserver(loadMoreCallback);

  useEffect(() => {
    const container = postsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Logic for infinite scroll
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 300 &&
        currentHasMore &&
        !currentIsLoading
      ) {
        loadMorePosts();
      }

      // Logic for floating input visibility
      const scrollTop = container.scrollTop;
      const originalInputBottom = createPostInputRef.current?.offsetHeight || 0;
      const scrollDirection = scrollTop > lastScrollTop.current ? "down" : "up";

      if (scrollTop > originalInputBottom) {
        // Scrolled past the original input
        if (
          scrollDirection === "up" &&
          scrollTop < lastScrollTop.current + scrollThreshold
        ) {
          // Scrolled up slightly
          setIsFloatingInputVisible(true);
        } else if (scrollDirection === "down") {
          // Scrolled down further
          setIsFloatingInputVisible(false);
        }
      } else {
        // Scrolled to the top or close to it
        setIsFloatingInputVisible(false);
      }

      lastScrollTop.current = scrollTop;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentHasMore, currentIsLoading, loadMorePosts]); // Removed dependencies that cause unnecessary re-renders, kept essential ones

  // ... (rest of the component logic)

  useEffect(() => {
    if (currentPosts.length > 0) {
      setTimeout(() => {
        setIsFirstLoad(false);
      }, 100);
    }
  }, [currentPosts.length]);

  useEffect(() => {
    const container = postsContainerRef.current;
    if (!container) return;

    const savedScroll = activeTab === "forYou" ? feedScroll : officialScroll;

    if (
      savedScroll > 0 &&
      currentPosts.length > 0 &&
      !scrollRestoredRef.current &&
      postsRenderedRef.current
    ) {
      const delay = isFirstLoad ? 600 : 100;

      setTimeout(() => {
        requestAnimationFrame(() => {
          container.scrollTop = savedScroll;
          scrollRestoredRef.current = true;
        });
      }, delay);
    }
  }, [activeTab, feedScroll, officialScroll, currentPosts.length, isFirstLoad]);

  useEffect(() => {
    if (currentPosts.length > 0) {
      setTimeout(() => {
        postsRenderedRef.current = true;
      }, 100);
    }
  }, [currentPosts.length]);

  useEffect(() => {
    scrollRestoredRef.current = false;
    postsRenderedRef.current = false;
  }, [activeTab]);

  useEffect(() => {
    return () => {
      const container = postsContainerRef.current;
      if (container) {
        const currentScroll = container.scrollTop;
        if (activeTab === "forYou") {
          setFeedScroll(currentScroll);
        } else {
          setOfficialScroll(currentScroll);
        }
      }
    };
  }, [activeTab, setFeedScroll, setOfficialScroll]);

  const handlePostClick = (postId: string) => {
    const container = postsContainerRef.current;
    if (container) {
      const currentScroll = container.scrollTop;
      if (activeTab === "forYou") {
        setFeedScroll(currentScroll);
      } else {
        setOfficialScroll(currentScroll);
      }
    }
    navigate(`/posts/${postId}`, { state: { backgroundLocation: location } });
  };

  const handleClearSearch = () => setSearchBarValue("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && selectedFiles.length === 0) {
      toast.error("Please enter some content or select at least one image");
      return;
    }

    try {
      setIsUploading(true);

      const mediaUrls = await Promise.all(
        selectedFiles.map((file) => uploadPostMedia(file, token))
      );

      const postData = {
        content: newPostContent,
        author_username: user?.email || "",
        author_profile_pic_url: user?.profile_pic_url || null,
        media_urls: mediaUrls,
        timestamp: new Date().toISOString(),
        like_count: 0,
        comment_count: 0,
        share_count: 0,
        has_liked: false,
        trending_score: 0,
        last_engagement_at: null,
        author_display_name: user?.fullName || "Unknown User",
        author_name: user?.fullName || "Unknown User",
        author_display_name_slug: user?.display_name_slug || "",
        author_faculty: (user as any)?.faculty || "",
        author_department: (user as any)?.department || "",
        author_exclusive: (user as any)?.exclusive || false,
      };

      const response = await axios.post(`${API_BASE_URL}/posts/`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const completePost = {
        ...response.data,
        author_display_name: user?.fullName || "Unknown User",
        author_name: user?.fullName || "Unknown User",
        author_display_name_slug: user?.display_name_slug || "",
        author_faculty: (user as any)?.faculty || "",
        author_department: (user as any)?.department || "",
        author_exclusive: (user as any)?.exclusive || false,
        author_profile_pic_url: user?.profile_pic_url || null,
      };

      setFeedPosts((prev) => [completePost, ...prev]);

      setNewPostContent("");
      setSelectedFiles([]);
      setIsCreatePostOpen(false);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelPost = () => {
    setNewPostContent("");
    setSelectedFiles([]);
    setIsCreatePostOpen(false);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setOfficialPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDelete = async (post: Post) => {
    if (!post.id) {
      toast.error("Cannot delete post: missing post identifier");
      return;
    }

    setFeedPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
    setOfficialPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedPost = { ...editingPost, content: editedContent };
      handlePostUpdate(updatedPost);

      setIsEditModalOpen(false);
      setEditingPost(null);
      toast.success("Post updated successfully");
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  const handlePostLikeUpdate = (
    postId: string,
    like_count: number,
    has_liked: boolean
  ) => {
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, like_count, has_liked } : post
      )
    );
    setOfficialPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, like_count, has_liked } : post
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
      handlePostLikeUpdate(
        post.id,
        response.data.like_count,
        response.data.has_liked
      );
    } catch (error) {
      handlePostLikeUpdate(post.id, prevLikeCount, prevHasLiked);
      console.error("Failed to like/unlike post:", error);
    }
  };

  const refreshPosts = async () => {
    setError(null);
    if (activeTab === "forYou") {
      setFeedPosts([]);
      setFeedNextCursor(null);
      setFeedHasMore(true);
      await fetchPosts("feed", null);
    } else {
      setOfficialPosts([]);
      setOfficialNextCursor(null);
      setOfficialHasMore(true);
      await fetchPosts("official");
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const params: any = {};
      if (searchType !== "all") params.type = searchType;
      if (searchFaculty) params.faculty = searchFaculty;
      if (searchDepartment) params.department = searchDepartment;
      if (searchQuery.trim()) params.query = searchQuery.trim();

      const usersResponse = await axios.get(`${API_BASE_URL}/users/search/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const mappedUsers = usersResponse.data
        .map((user: any, idx: number) => {
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
        })
        .filter(Boolean);

      mappedUsers.sort((a, b) =>
        a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
      );

      setSearchResults({
        users: mappedUsers,
        posts: [],
      });
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
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

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 400),
    [handleSearch]
  );

  const { unreadCount } = useNotification();

  // Floating Create Post component
  const FloatingCreatePost = useMemo(() => {
    if (isCreatePostOpen) return null;

    return (
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-[#f6f6f6] border-b border-gray-200 transition-transform duration-300 ease-out 
          ${isFloatingInputVisible ? "translate-y-0" : "-translate-y-full"} 
          lg:hidden flex justify-center w-full px-5 py-3`}
        onClick={() => setIsCreatePostOpen(true)}
      >
        <div className="w-full max-w-lg flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="text"
            placeholder="Create a vars..."
            className="w-full text-[18px] font-normal text-[#adacb2] bg-transparent border-none outline-none focus:outline-none"
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
              <Img
                src="images/vectors/image.svg"
                alt="Image"
                className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px]"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }, [isFloatingInputVisible, isCreatePostOpen]);

  return (
    <div
      className={`flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto ${
        isFirstLoad ? "animate-fade-in" : ""
      }`}
    >
      <Sidebar1 />
      {FloatingCreatePost}{" "}
      {/* Render the floating input outside the scroll container */}
      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row animate-slide-up">
        <div
          className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col md:gap-[35px] sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0"
          ref={postsContainerRef}
          style={{
            overflowY: "auto",
            height: "100vh",
            maxHeight: "calc(100vh - 120px)",
            paddingBottom: "20px",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          <div className="items-center justify-between hidden lg:flex animate-fade-in">
            <div
              onClick={() => {
                if (user?.display_name_slug) {
                  navigate(`/user-profile/${user.display_name_slug}`);
                } else {
                  toast.error("Profile link unavailable");
                }
              }}
              className="transition-opacity cursor-pointer hover:opacity-80"
            >
              <Text as="p" className="text-[24px] font-medium md:text-[22px]">
                Welcome back, {user?.fullName || "User"} 👋
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
                <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </div>
              )}
            </Link>
          </div>

          <div className="flex flex-row items-center justify-between mt-5 lg:hidden animate-fade-in">
            <div
              onClick={() => {
                if (user?.display_name_slug) {
                  navigate(`/user-profile/${user.display_name_slug}`);
                } else {
                  toast.error("Profile link unavailable");
                }
              }}
              className="transition-opacity cursor-pointer hover:opacity-80"
            >
              <Img
                src={user?.profile_pic_url || "/public/images/user.png"}
                alt="Profile"
                className="h-[32px] w-[32px] rounded-[50%]"
              />
            </div>

            <div>
              <Text className="text-xl font-semibold">Varsigram</Text>
            </div>

            <div className="flex flex-row items-center justify-between space-x-2">
              <div
                onClick={() => handleNavigation("settings")}
                className="transition-opacity cursor-pointer hover:opacity-80"
              >
                <Img
                  src="images/settings-icon.svg"
                  alt="Settings"
                  className="h-[24px] w-[24px]"
                />
              </div>

              <Link to="/notifications" className="relative">
                <Img
                  src="/images/vectors/bell.svg"
                  alt="Notifications"
                  className="h-[24px] w-[24px] text-gray-600 hover:text-blue-600 transition-colors"
                />
                {unreadCount > 0 && (
                  <div className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
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

          <div className="flex justify-between lg:mt-5 animate-slide-up">
            <div
              className={`flex px-3 cursor-pointer ${
                activeTab === "forYou"
                  ? "border-b-2 border-solid border-[#750015]"
                  : ""
              }`}
              onClick={() => setActiveTab("forYou")}
            >
              <Text
                as="p"
                className={`text-[14px] font-medium md:text-[22px] ${
                  activeTab === "forYou" ? "" : "!text-[#adacb2]"
                }`}
              >
                For you
              </Text>
            </div>
            <div
              className={`flex border-b-2 border-solid px-1.5 cursor-pointer ${
                activeTab === "official"
                  ? "border-[#750015]"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("official")}
            >
              <Text
                as="p"
                className={`text-[14px] font-medium md:text-[22px] ${
                  activeTab === "official" ? "" : "!text-[#adacb2]"
                }`}
              >
                Official
              </Text>
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
              ref={createPostInputRef} // Attach ref here
              className="lg:mt-0 flex justify-center rounded-[28px] bg-[#ffffff] p-3 cursor-pointer hover:bg-gray-50 transition-colors animate-fade-in"
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
                  <Img
                    src="images/vectors/image.svg"
                    alt="Image"
                    className="lg:h-[24px] lg:w-[24px] h-[14px] w-[14px]"
                  />
                </button>
              </div>
            </div>
          )}

          <div className="w-full post-section">
            {currentIsLoading && currentPosts.length === 0 && (
              <div className="flex items-center justify-center py-20 animate-fade-in">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
              </div>
            )}

            {error && !currentIsLoading && !isAuthLoading && (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <p className="mb-4 text-center text-red-500">{error}</p>
                <button
                  onClick={refreshPosts}
                  className="px-4 py-2 bg-[#750015] text-white rounded hover:bg-[#600012] transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!currentIsLoading &&
              !isAuthLoading &&
              !error &&
              currentPosts.length === 0 && (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff] animate-fade-in">
                  <Text
                    as="p"
                    className="text-[14px] font-normal text-[#adacb2]"
                  >
                    No {activeTab === "forYou" ? "posts" : "official posts"} in
                    your feed yet.
                  </Text>
                </div>
              )}

            {!isAuthLoading && currentPosts.length > 0 && (
              <div className="w-full space-y-6">
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

                <div
                  ref={loadingRef}
                  className="flex items-center justify-center h-20 mt-4"
                >
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
            <div className="h-full overflow-hidden">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-40 md:items-center md:p-4"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
            setSearchResults({ users: [], posts: [] });
          }}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-[32px] w-full h-full md:h-auto max-h-screen md:max-h-[80vh] overflow-y-auto shadow-lg p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
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
                  <Img
                    src="images/vectors/x.svg"
                    alt="Close"
                    className="w-6 h-6"
                  />
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
              <div className="flex flex-col gap-2 mt-3 sm:flex-row sm:gap-3">
                <select
                  className="px-2 py-1 border rounded"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                >
                  <option value="student">Students</option>
                  <option value="organization">Organizations</option>
                </select>
                <select
                  className="px-2 py-1 border rounded"
                  value={searchFaculty}
                  onChange={(e) => {
                    setSearchFaculty(e.target.value);
                    setSearchDepartment("");
                  }}
                >
                  <option value="">Select Faculties</option>
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
                <select
                  className="px-2 py-1 border rounded"
                  value={searchDepartment}
                  onChange={(e) => setSearchDepartment(e.target.value)}
                  disabled={!searchFaculty}
                >
                  <option value="">Select Departments</option>
                  {(facultyDepartments[searchFaculty] || []).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {isSearching ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="p-4">
                  {searchResults.users.length > 0 && (
                    <div className="mb-6">
                      <h3 className="mb-3 text-lg font-semibold">People</h3>
                      <div className="space-y-4">
                        {searchResults.users.map((user) => (
                          <div
                            key={user.id}
                            className="flex flex-col gap-1 cursor-pointer"
                            onClick={() => {
                              if (user.display_name_slug) {
                                navigate(
                                  `/user-profile/${user.display_name_slug}`
                                );
                                setIsSearchOpen(false);
                              }
                            }}
                          >
                            <div className="font-semibold">{user.fullName}</div>
                            {user.type === "student" && (
                              <div className="text-xs text-gray-500">
                                {user.faculty}{" "}
                                {user.department && `- ${user.department}`}
                              </div>
                            )}
                            {user.type === "organization" && (
                              <div className="text-xs text-gray-500">
                                Organization
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.posts.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold">Posts</h3>
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
                              const currentScroll =
                                activeTab === "forYou"
                                  ? feedScroll
                                  : officialScroll;
                              sessionStorage.setItem(
                                "homepageScroll",
                                currentScroll.toString()
                              );
                              navigate(`/posts/${post.id}`, {
                                state: { backgroundLocation: location },
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery &&
                    !isSearching &&
                    searchResults.users.length === 0 &&
                    searchResults.posts.length === 0 && (
                      <div className="py-10 text-center text-gray-500">
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
