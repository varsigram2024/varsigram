
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import ProfileOrganizationSection from "./ProfilepageOrganizationSection.tsx";
import { PostSkeleton } from "../../components/PostSkeleton";
import BottomNav from "../../components/BottomNav/index.tsx";
import { useAuth } from "../../auth/AuthContext";
import WhoToFollowSidePanel from "../../components/whoToFollowSidePanel/index.tsx";
import LinksModal from "../../modals/LinksModal/index.tsx";
import { Button } from "../../components/Button/index.tsx";
import { Post } from "../../components/Post/index.tsx";
import { uploadProfilePicture } from "../../utils/fileUpload.ts";
import { Pencil, Save, Share, Users, X, Linkedin, Twitter, Instagram, Globe, Share2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Add interface for props
interface ProfilepageOrganizationProps {
  onComplete: (page: string) => void;
}

interface ProfilePost {
  id: string;
  slug: string;
  author_id: string;
  author_username: string;
  author_name: string; // Make sure this is always string, not string | undefined
  author_display_name: string;
  author_display_name_slug: string;
  author_profile_pic_url: string;
  content: string;
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  media_urls: string[];
  trending_score: number;
  last_engagement_at: string;
  comments?: Comment[];
  is_shared?: boolean;
  original_post?: ProfilePost;
}

interface Comment {
  id: string;
  author_username: string;
  content: string;
  timestamp: string;
  author_profile_pic_url: string;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_pic_url: string;
  bio: string;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  account_type: "student" | "organization";
  name?: string;
  organization_name?: string;
  faculty?: string;
  department?: string;
  year?: string;
  religion?: string;
  phone_number?: string;
  sex?: string;
  university?: string;
  date_of_birth?: string;
  display_name_slug: string;
  exclusive?: boolean;
}

// Add the missing interface
interface FollowerFollowingUser {
  id: number;
  user?: {
    id: number;
    email: string;
    username: string;
    profile_pic_url: string;
    bio: string;
    is_verified: boolean;
  };
  name?: string;
  organization_name?: string;
  faculty?: string;
  department?: string;
  display_name_slug: string;
  account_type: "student" | "organization";
  profile_pic_url?: string;
  email?: string;
  username?: string;
  bio?: string;
  is_verified?: boolean;
}

interface SocialLinks {
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
}

// Update component to accept props
export default function Profile() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [posts, setPosts] = useState<ProfilePost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, token, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { display_name_slug } = useParams();
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Added hook
  const [followers, setFollowers] = useState<FollowerFollowingUser[]>([]);
  const [following, setFollowing] = useState<FollowerFollowingUser[]>([]);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  
  // Add missing state variables
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [currentUserFollowing, setCurrentUserFollowing] = useState<FollowerFollowingUser[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
  linkedin_url: null,
  twitter_url: null,
  instagram_url: null,
  website_url: null
});


  // Update modal handlers to use requireAuth
  const handleOpenFollowers = () => {
    if (!requireAuth('view followers')) return;
    setShowFollowersModal(true);
    fetchFollowers();
  };

  const handleOpenFollowing = () => {
    if (!requireAuth('view following')) return;
    setShowFollowingModal(true);
    fetchFollowing();
  };

  const handleFollowInModal = async (targetUserId: number, targetUserType: "student" | "organization", isCurrentlyFollowing: boolean) => {
    if (!requireAuth('follow users')) return;
    
    if (!user || !token) return;

    try {
      const payload = {
        follower_type: user.account_type,
        follower_id: user.id,
        followee_type: targetUserType,
        followee_id: targetUserId
      };

      if (isCurrentlyFollowing) {
        await axios.post(
          `${API_BASE_URL}/users/unfollow/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Unfollowed successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/users/follow/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Followed successfully");
      }

      // Refresh the lists and current user's following
      if (showFollowersModal) fetchFollowers();
      if (showFollowingModal) fetchFollowing();
      fetchCurrentUserFollowing();
      
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };


  const handleNavigateToProfile = (displayNameSlug: string) => {
    navigate(`/user-profile/${displayNameSlug}`);
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  };

  const handleShareProfile = async () => {
    if (!userProfile) return;

    const profileUrl = `${window.location.origin}/user-profile/${userProfile.display_name_slug}`;
    const shareText = `Check out ${userProfile.name || userProfile.organization_name || userProfile.username}'s profile on Varsigram!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${userProfile.name || userProfile.organization_name || userProfile.username}'s Profile`,
          text: shareText,
          url: profileUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard!');
      } else {
        alert(`Share this profile: ${profileUrl}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share profile');
      }
    }
  };


const fetchUserPoints = async () => {
  if (!token || !userProfile) return;
  
  setIsLoadingPoints(true);
  try {
    // Use the new API endpoint with user ID in the URL
    const response = await axios.get(
      `${API_BASE_URL}/profile/points/${userProfile.id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("📊 User points response (new API):", response.data);
    
    // Extract total_points_received from the new response structure
    setTotalPoints(response.data.total_points_received || 0);
  } catch (error: any) {
    console.error("❌ Error fetching user points:", {
      error: error.response?.data,
      status: error.response?.status,
      userId: userProfile.id
    });
    
    // If it's a 404, the user might not have any points yet
    if (error.response?.status === 404) {
      console.log("👤 User has no points yet - setting to 0");
      setTotalPoints(0);
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to view these points");
    } else {
      toast.error("Failed to load points");
    }
  } finally {
    setIsLoadingPoints(false);
  }
};


// Add this useEffect to fetch points when userProfile changes
useEffect(() => {
  if (userProfile && token) {
    fetchUserPoints();
  }
}, [userProfile, token]);


const fetchFollowers = async () => {
  if (!userProfile || !token) return;
  
  setIsLoadingFollowers(true);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/followers/`,
      {
        params: {
          followee_type: userProfile.account_type,
          followee_id: userProfile.id
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log("Followers API Response:", response.data);
    
    const processedData = response.data.map((item: any) => {
      // Extract the actual follower data (either student or organization)
      const followerData = item.follower_student || item.follower_organization;
      const accountType = item.follower_student ? 'student' : 'organization';
      
      return {
        id: followerData.id,
        name: followerData.name,
        organization_name: followerData.organization_name,
        faculty: followerData.faculty,
        department: followerData.department,
        display_name_slug: followerData.display_name_slug,
        account_type: accountType,
        // Map user data correctly
        profile_pic_url: followerData.user?.profile_pic_url,
        email: followerData.user?.email,
        username: followerData.user?.username,
        bio: followerData.user?.bio,
        is_verified: followerData.user?.is_verified
      };
    });
    
    console.log("Processed Followers Data:", processedData);
    setFollowers(processedData);
  } catch (error) {
    console.error("Error fetching followers:", error);
    toast.error("Failed to load followers");
  } finally {
    setIsLoadingFollowers(false);
  }
};



const fetchFollowing = async () => {
  if (!userProfile || !token) return;
  
  setIsLoadingFollowing(true);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/following/`,
      {
        params: {
          follower_type: userProfile.account_type,
          follower_id: userProfile.id
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    console.log("Following API Response:", response.data);
    
    const processedData = response.data.map((item: any) => {
      // Extract the actual followee data (either student or organization)
      const followeeData = item.followee_student || item.followee_organization;
      const accountType = item.followee_student ? 'student' : 'organization';
      
      return {
        id: followeeData.id,
        name: followeeData.name,
        organization_name: followeeData.organization_name,
        faculty: followeeData.faculty,
        department: followeeData.department,
        display_name_slug: followeeData.display_name_slug,
        account_type: accountType,
        // Map user data correctly
        profile_pic_url: followeeData.user?.profile_pic_url,
        email: followeeData.user?.email,
        username: followeeData.user?.username,
        bio: followeeData.user?.bio,
        is_verified: followeeData.user?.is_verified
      };
    });
    
    console.log("Processed Following Data:", processedData);
    setFollowing(processedData);
  } catch (error) {
    console.error("Error fetching following:", error);
    toast.error("Failed to load following");
  } finally {
    setIsLoadingFollowing(false);
  }
};


const fetchCurrentUserFollowing = async () => {
  if (!user || !token) return;
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/following/`,
      {
        params: {
          follower_type: user.account_type,
          follower_id: user.id
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    const processedData = response.data.map((item: any) => {
      const followeeData = item.followee_student || item.followee_organization;
      const accountType = item.followee_student ? 'student' : 'organization';
      
      return {
        id: followeeData.id,
        name: followeeData.name,
        organization_name: followeeData.organization_name,
        display_name_slug: followeeData.display_name_slug,
        account_type: accountType,
      };
    });
    
    setCurrentUserFollowing(processedData);
  } catch (error) {
    console.error("Error fetching current user's following:", error);
  }
};

// Call this when component mounts
useEffect(() => {
  if (user && token) {
    fetchCurrentUserFollowing();
  }
}, [user, token]);

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!display_name_slug) return;
      setIsLoading(true);
      try {
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const profileResponse = await axios.get(
          `${API_BASE_URL}/profile/${display_name_slug}/`,
          { headers }
        );
        const {
          profile_type,
          profile,
          is_following,
          followers_count,
          following_count,
        } = profileResponse.data;

        setUserProfile({
          id: profile.user.id,
          email: profile.user.email,
          username: profile.user.username,
          profile_pic_url: profile.user.profile_pic_url,
          bio: profile.user.bio,
          is_verified: profile.user?.is_verified || false,
          followers_count:
            typeof followers_count === "number" ? followers_count : 0,
          following_count:
            typeof following_count === "number" ? following_count : 0,
          account_type: profile_type,
          name: profile.name,
          organization_name: profile.organization_name,
          university: profile.university,
          faculty: profile.faculty,
          department: profile.department,
          year: profile.year,
          display_name_slug: profile.display_name_slug,
          exclusive: profile.exclusive,
        });
        setIsFollowing(is_following);
      } catch (error) {
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [display_name_slug, token, user?.email]);


 const requireAuth = (action: string) => {
    if (!token) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      toast.error(`Please log in to ${action}`);
      navigate('/login');
      return false;
    }
    return true;
  };



  
  const handleFollow = async () => {
    if (!requireAuth('follow users')) return;
    
    if (!userProfile || !user || !token) return;
    const follower_type = user.account_type;
    const follower_id = user.id;
    const followee_type = userProfile.account_type;
    const followee_id = userProfile.id;

    try {
      if (isFollowing) {
        await axios.post(
          `${API_BASE_URL}/users/unfollow/`,
          { follower_type, follower_id, followee_type, followee_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(false);
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                followers_count: Math.max(0, Number(prev.followers_count) - 1),
              }
            : null
        );
        toast.success("Unfollowed successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/users/follow/`,
          { follower_type, follower_id, followee_type, followee_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(true);
        setUserProfile((prev) =>
          prev
            ? { ...prev, followers_count: Number(prev.followers_count) + 1 }
            : null
        );
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  const handleClearSearch = () => setSearchBarValue("");

const handleProfilePicClick = () => {
  fileInputRef.current?.click();
};

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !userProfile) return;

  try {
    setIsUploading(true);
    const jwtToken = token;
    const public_download_url = await uploadProfilePicture(
      file,
      jwtToken,
      userProfile.account_type
    );
    toast.success("Profile picture uploaded successfully!");
    await fetchUserData();
  } catch (error: any) {
    toast.error(error.message || "Failed to upload profile picture.");
  } finally {
    setIsUploading(false);
  }
};


// In Profile component - add useEffect for debugging
useEffect(() => {
  console.log("🔄 Social links state updated:", socialLinks);
  console.log("🔍 Has social links:", hasSocialLinks());
}, [socialLinks]);

// Also add debugging to fetchUserData
const fetchUserData = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/profile/${display_name_slug}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📄 Profile API Response:", response.data);

    if (response.data && response.data.profile) {
      const { profile_type, profile, followers_count, following_count } = response.data;
      
      // Log social links from API
      console.log("🔗 Social links from profile API:", {
        linkedin: profile.user?.linkedin_url,
        twitter: profile.user?.twitter_url,
        instagram: profile.user?.instagram_url,
        website: profile.user?.website_url,
      });

      setUserProfile({
        id: profile.user.id,
        email: profile.user.email,
        username: profile.user.username,
        profile_pic_url: profile.user.profile_pic_url,
        bio: profile.user.bio,
        is_verified: profile.user?.is_verified || false,
        followers_count: typeof followers_count === "number" ? followers_count : 0,
        following_count: typeof following_count === "number" ? following_count : 0,
        account_type: profile_type,
        name: profile.name,
        organization_name: profile.organization_name,
        faculty: profile.faculty,
        department: profile.department,
        year: profile.year,
        religion: profile.religion,
        phone_number: profile.phone_number,
        sex: profile.sex,
        university: profile.university,
        date_of_birth: profile.date_of_birth,
        display_name_slug: profile.display_name_slug,
        exclusive: profile.exclusive,
      });

      // In fetchUserData - this is where social links are properly set
const updatedSocialLinks = {
  linkedin_url: profile.user?.linkedin_url || null,
  twitter_url: profile.user?.twitter_url || null,
  instagram_url: profile.user?.instagram_url || null,
  website_url: profile.user?.website_url || null,
};

console.log("🔄 Setting social links:", updatedSocialLinks);
setSocialLinks(updatedSocialLinks);
      
      console.log("🔄 Setting social links:", updatedSocialLinks);
      setSocialLinks(updatedSocialLinks);
    } else {
      setUserProfile(null);
    }
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    setUserProfile(null);
  } finally {
    setIsLoading(false);
  }
};

// In Profile component - fix hasSocialLinks
const hasSocialLinks = () => {
  return (
    (socialLinks.linkedin_url && socialLinks.linkedin_url.trim() !== '') ||
    (socialLinks.twitter_url && socialLinks.twitter_url.trim() !== '') ||
    (socialLinks.instagram_url && socialLinks.instagram_url.trim() !== '') ||
    (socialLinks.website_url && socialLinks.website_url.trim() !== '')
  );
};

const SocialLinksDisplay = () => {
  if (!hasSocialLinks()) return null;

  const socialIcons = [
    { 
      key: 'linkedin_url', 
      icon: Linkedin, 
      url: socialLinks.linkedin_url, 
      color: 'text-[#0077b5]',
      name: 'LinkedIn'
    },
    { 
      key: 'twitter_url', 
      icon: Twitter, 
      url: socialLinks.twitter_url, 
      color: 'text-[#1da1f2]',
      name: 'Twitter'
    },
    { 
      key: 'instagram_url', 
      icon: Instagram, 
      url: socialLinks.instagram_url, 
      color: 'text-[#e4405f]',
      name: 'Instagram'
    },
    { 
      key: 'website_url', 
      icon: Globe, 
      url: socialLinks.website_url, 
      color: 'text-[#750015]',
      name: 'Website'
    },
  ];

  return (
    <div className="flex items-center gap-3 mt-3">
      <Text as="span" className="text-sm text-gray-600 font-medium">
        Connect:
      </Text>
      {socialIcons.map(({ key, icon: Icon, url, color, name }) => {
        const isValidUrl = url && url.trim() !== '';
        return isValidUrl ? (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${color} group relative`}
            title={name}
          >
            <Icon size={18} />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {name}
            </div>
          </a>
        ) : null;
      })}
    </div>
  );
};

// Helper function for platform names
const getPlatformName = (platform: keyof SocialLinks): string => {
  switch (platform) {
    case 'linkedin_url': return 'LinkedIn';
    case 'twitter_url': return 'Twitter';
    case 'instagram_url': return 'Instagram';
    case 'website_url': return 'Website';
    default: return platform;
  }
};



// Update the UsersListModal component to properly check follow status
const UsersListModal = ({ 
  isOpen, 
  onClose, 
  title, 
  users, 
  isLoading, 
  onUserClick,
  onFollowClick,
  currentUserId 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: FollowerFollowingUser[];
  isLoading: boolean;
  onUserClick: (displayNameSlug: string) => void;
  onFollowClick: (userId: number, userType: "student" | "organization", isFollowing: boolean) => void;
  currentUserId?: string;
}) => {
  if (!isOpen) return null;

  // Helper function to get profile picture URL safely
  const getProfilePicUrl = (userItem: FollowerFollowingUser) => {
    const url = userItem.profile_pic_url;
    return url && url.startsWith("http") ? url : "/images/user.png";
  };

  // Helper function to get display name safely
  const getDisplayName = (userItem: FollowerFollowingUser) => {
    return userItem.name || userItem.organization_name || userItem.username || 'Unknown User';
  };

  // Helper function to check if current user is following this user
  const isCurrentUserFollowing = (userItem: FollowerFollowingUser) => {
    if (!currentUserId || !currentUserFollowing.length) return false;
    
    return currentUserFollowing.some(followingUser => 
      followingUser.id === userItem.id && 
      followingUser.account_type === userItem.account_type
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Heading size="h3_semibold" as="h2" className="text-[20px]">
            {title}
          </Heading>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-2 text-gray-300" />
              <Text>No {title.toLowerCase()} found</Text>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((userItem) => {
                const isCurrentUser = currentUserId && userItem.id.toString() === currentUserId;
                const isFollowing = isCurrentUserFollowing(userItem);
                
                return (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div 
                      className="flex items-center gap-3 flex-1"
                      onClick={() => onUserClick(userItem.display_name_slug)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Img
                          src={getProfilePicUrl(userItem)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text as="p" className="font-semibold text-gray-900 truncate">
                          {getDisplayName(userItem)}
                        </Text>
                        {userItem.account_type === "student" && userItem.faculty && (
                          <Text as="p" className="text-sm text-gray-500 truncate">
                            {userItem.faculty}
                            {userItem.department && ` • ${userItem.department}`}
                          </Text>
                        )}
                      </div>
                    </div>

                    {/* Show appropriate button based on follow status */}
                    {!isCurrentUser && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFollowClick(userItem.id, userItem.account_type, isFollowing);
                        }}
                        className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${
                          isFollowing 
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                            : "bg-[#750015] text-white hover:bg-[#a0001f]"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

 




  // Add intersection observer for infinite scrolling
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchPosts = async (startAfter: string | null = null) => {
    if (!userProfile?.id || !token) return;

    // Use different loading states for initial load vs pagination
    if (startAfter) {
      if (isLoadingMore) return; // Prevent multiple calls
      setIsLoadingMore(true);
    } else {
      if (isLoadingPosts) return; // Prevent multiple calls
      setIsLoadingPosts(true); // Use the posts-specific loading state
    }

    try {
      const params: any = { page_size: 10 };
      if (startAfter) params.start_after = startAfter;

      const response = await axios.get(
        `${API_BASE_URL}/users/${userProfile.id}/posts/`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { results, next_cursor } = response.data;

      if (Array.isArray(results) && results.length > 0) {
        if (startAfter) {
          // Append posts for pagination
          setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniquePosts: ProfilePost[] = results.filter(
              (post: ProfilePost) => !existingIds.has(post.id)
            );
            return [...prev, ...uniquePosts];
          });
        } else {
          // Replace posts for initial load
          setPosts(results as ProfilePost[]);
        }
        setNextCursor(next_cursor);
        setHasMore(!!next_cursor);
      } else {
        if (!startAfter) {
          setPosts([]);
        }
        setNextCursor(null);
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
    } finally {
      if (startAfter) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingPosts(false); // Use the posts-specific loading state
      }
    }
  };

  // Add useEffect to fetch posts when userProfile changes
  useEffect(() => {
    if (userProfile?.id && token) {
      setPosts([]);
      setNextCursor(null);
      setHasMore(true);
      setIsLoadingMore(false);
      setIsLoadingPosts(false); // Reset posts loading state
      fetchPosts();
    }
  }, [userProfile?.id, token]);

  // Add intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoadingPosts &&
          !isLoadingMore &&
          nextCursor
        ) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 0, rootMargin: "300px" }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    hasMore,
    isLoadingPosts,
    isLoadingMore,
    nextCursor,
    userProfile?.id,
    token,
  ]);

return (
  <div className="flex flex-col items-center justify-start w-full bg-gray-100 animate-fade-in">
    <div className="flex w-full items-start justify-center bg-white">
      <div className="flex w-full lg:w-[100%] items-start justify-center h-auto flex-row animate-slide-up">
        
        {/* Main Content */}
        <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px] w-full animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
            </div>
          ) : !userProfile ? (
            <div className="flex justify-center items-center h-[300px] w-full animate-fade-in">
              <Text>User not found</Text>
            </div>
          ) : (
            <>
                {/* Cover photo section */}
                <div className="flex w-[92%] justify-end rounded-[20px] pb-2 bg-[#f6f6f6] md:w-full animate-fade-in">
                  <div className="flex w-full flex-col self-stretch gap-2.5">
                    {/* Cover photo */}
                    <div
                      className="flex h-[170px] bg-[#750015]/85 sm:h-[140px] xs:h-[120px] flex-col items-center justify-center gap-2 rounded-tl-[20px] rounded-tr-[20px] p-10 sm:p-5 xs:p-3"
                      style={{
                        backgroundImage: `url(${
                          userProfile?.profile_pic_url &&
                          userProfile.profile_pic_url.startsWith("http")
                            ? userProfile.profile_pic_url
                            : "/images/cover-photo-bg.svg"
                        })`,
                        backgroundSize: "cover",
                      }}
                    >
                      {/* Optional: Add responsive text here if needed */}
                    </div>



                    {/* Profile picture and points section */}
                    <div className="flex items-start justify-between">
                      {/* Profile picture */}
                      <div className="overflow-hidden relative ml-4 mt-[-46px] sm:mt-[-40px] xs:mt-[-35px] w-[120px] h-[120px] sm:w-[100px] sm:h-[100px] xs:w-[80px] xs:h-[80px] rounded-[50%] border-[5px] sm:border-[4px] xs:border-[3px] border-[#ffdbe2] bg-white">
                        {user?.email === userProfile?.email ? (
                          <>
                            <div
                              onClick={handleProfilePicClick}
                              className="relative w-full h-full rounded-full overflow-hidden cursor-pointer group"
                            >
                              {isUploading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                  <div className="animate-spin rounded-full h-8 w-8 sm:h-6 sm:w-6 border-t-2 border-b-2 border-white"></div>
                                </div>
                              ) : (
                                <>
                                  <Img
                                    src={
                                      userProfile?.profile_pic_url &&
                                      userProfile.profile_pic_url.startsWith("http")
                                        ? userProfile.profile_pic_url
                                        : "/images/user.png"
                                    }
                                    alt="Profile Picture"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                    <Text
                                      as="p"
                                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs sm:text-[10px] xs:text-[8px] text-center px-1"
                                    >
                                      Change Photo
                                    </Text>
                                  </div>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </>
                        ) : (
                          <Img
                            src={
                              userProfile?.profile_pic_url &&
                              userProfile.profile_pic_url.startsWith("http")
                                ? userProfile.profile_pic_url
                                : "/images/user.png"
                            }
                            alt="Profile Picture"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Points badge */}
                      <div className="flex items-center gap-2 justify-center px-4 sm:px-3 xs:px-2 py-2 sm:py-1.5 xs:py-1 border rounded-2xl sm:rounded-xl xs:rounded-lg bg-white shadow-sm">
                        <svg 
                          width="15" 
                          height="12" 
                          viewBox="0 0 15 12" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="sm:w-3 sm:h-3 xs:w-2.5 xs:h-2.5"
                        >
                          <path d="M14.0964 6.76172V9.04743C14.0964 10.0379 11.7085 11.3331 8.76302 11.3331C5.8175 11.3331 3.42969 10.0379 3.42969 9.04743V7.14267" stroke="#750015" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.65234 7.34155C4.31139 8.21622 6.34949 9.03679 8.76168 9.03679C11.7072 9.03679 14.095 7.81317 14.095 6.76174C14.095 6.17127 13.343 5.52441 12.1628 5.07031" stroke="#750015" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.8112 2.95312V5.23884C11.8112 6.22932 9.42339 7.52455 6.47786 7.52455C3.53234 7.52455 1.14453 6.22932 1.14453 5.23884V2.95312" stroke="#750015" strokeLinecap="round" strokeLinejoin="round"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M6.47786 5.22721C9.42339 5.22721 11.8112 4.00359 11.8112 2.95216C11.8112 1.90073 9.42339 0.667969 6.47786 0.667969C3.53234 0.667969 1.14453 1.89997 1.14453 2.95216C1.14453 4.00359 3.53234 5.22721 6.47786 5.22721Z" stroke="#750015" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        
                        {isLoadingPoints ? (
                          <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                        ) : (
                          <h1 className='text-[#3a3a3a]/70 flex items-center gap-2 font-semibold text-[14px] sm:text-[12px] xs:text-[10px] leading-5 sm:leading-4'>
                            {totalPoints} Points
                          </h1>
                        )}
                      </div>
                    </div>



                    {/* User info and follow button */}
                    <div className="mx-3.5 ml-4 sm:mx-3 sm:ml-3 xs:mx-2 xs:ml-2 flex flex-col items-start gap-4 sm:gap-3 xs:gap-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-[7px] sm:gap-1.5 xs:gap-1">
                          <Heading
                            size="h3_semibold"
                            as="h1"
                            className="text-[28px] font-semibold md:text-[26px] sm:text-[22px] xs:text-[18px]"
                          >
                            {userProfile.name ||
                              userProfile.organization_name ||
                              userProfile.username}
                          </Heading>
                          {userProfile.account_type === "organization" &&
                            userProfile.is_verified &&
                            userProfile.exclusive && (
                              <Img
                                src="/images/vectors/verified.svg"
                                alt="Verified"
                                className="h-[16px] w-[16px] sm:h-[14px] sm:w-[14px] xs:h-[12px] xs:w-[12px]"
                              />
                            )}
                        </div>
                        
                        <button
                          onClick={handleShareProfile}
                          className="flex items-center gap-2 p-2 sm:p-1.5 xs:p-1 rounded-full transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                          title="Share Profile"
                        >
                          <Share size={18} className="sm:w-4 sm:h-4 xs:w-3.5 xs:h-3.5" />
                        </button>
                      </div>

                      {/* Additional info for students */}
                      {userProfile.account_type === "student" && (
                        <div className="flex flex-row gap-2 sm:gap-1.5 xs:gap-1 flex-wrap">
                          {userProfile.university && (
                            <Text
                              as="p"
                              className="text-[14px] sm:text-[12px] xs:text-[10px] font-normal p-1.5 px-2 sm:p-1 sm:px-1.5 xs:p-0.5 xs:px-1 rounded-[4px] bg-[#FFDBE2] text-gray-600"
                            >
                              {userProfile.university}
                            </Text>
                          )}
                          {userProfile.faculty && (
                            <Text
                              as="p"
                              className="text-[14px] sm:text-[12px] xs:text-[10px] font-normal p-1.5 px-2 sm:p-1 sm:px-1.5 xs:p-0.5 xs:px-1 rounded-[4px] bg-[#FFDBE2] text-gray-600"
                            >
                              {userProfile.faculty}
                            </Text>
                          )}
                          {userProfile.department && (
                            <Text
                              as="p"
                              className="text-[14px] sm:text-[12px] xs:text-[10px] font-normal p-1.5 px-2 sm:p-1 sm:px-1.5 xs:p-0.5 xs:px-1 rounded-[4px] bg-[#FFDBE2] text-gray-600"
                            >
                              {userProfile.department}
                            </Text>
                          )}
                        </div>
                      )}

                      {/* Bio section */}
                      <div className="flex items-center gap-2 w-full">
                        {isEditingBio ? (
                          <input
                            type="text"
                            value={bioInput}
                            onChange={(e) => setBioInput(e.target.value)}
                            className="border rounded px-2 py-1 text-[16px] sm:text-[14px] xs:text-[12px] font-normal text-gray-600 w-full max-w-md"
                            maxLength={160}
                            autoFocus
                            onBlur={async () => {
                              setIsEditingBio(false);
                              if (bioInput !== userProfile.bio) {
                                try {
                                  const payload = { user: { bio: bioInput } };
                                  await axios.patch(
                                    userProfile.account_type === "organization"
                                      ? `${API_BASE_URL}/organization/update/`
                                      : `${API_BASE_URL}/student/update/`,
                                    payload,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  await fetchUserData();
                                  toast.success("Bio updated!");
                                } catch (err: any) {
                                  toast.error("Failed to update bio");
                                }
                              }
                            }}
                          />
                        ) : (
                          <>
                            <Text
                              as="p"
                              className="text-[16px] sm:text-[14px] xs:text-[12px] font-normal text-gray-600 break-words"
                            >
                              {userProfile.bio || "No bio available"}
                            </Text>
                            {user?.email === userProfile.email && (
                              <button
                                onClick={() => {
                                  setBioInput(userProfile.bio || "");
                                  setIsEditingBio(true);
                                }}
                                className="ml-1 p-1 sm:p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
                                title="Edit bio"
                              >
                                <Pencil size={10} color="#750015" className="sm:w-2 sm:h-2" />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Follow button */}
                      {token && user?.email !== userProfile.email && (
                        <Button
                          onClick={handleFollow}
                          className={`px-6 py-2 sm:px-4 sm:py-1.5 xs:px-3 xs:py-1 rounded-full font-semibold transition-colors text-[14px] sm:text-[12px] xs:text-[11px] ${
                            isFollowing
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-[#750015] text-white hover:bg-[#a0001f]"
                          }`}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      )}

                      {/* Follow stats and social links */}
                        <div className="flex w-full items-center justify-between flex-wrap gap-3 sm:gap-2 xs:gap-1">
                          <div className="flex flex-wrap gap-6 sm:gap-4 xs:gap-3">
                            <button
                              onClick={handleOpenFollowers}
                              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              <Text as="p" className="text-[16px] sm:text-[14px] xs:text-[12px] font-normal">
                                <span className="font-semibold">
                                  {userProfile.followers_count}
                                </span>{" "}
                                Followers
                              </Text>
                            </button>
                            <button
                              onClick={handleOpenFollowing}
                              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                              <Text as="p" className="text-[16px] sm:text-[14px] xs:text-[12px] font-normal">
                                <span className="font-semibold">
                                  {userProfile.following_count}
                                </span>{" "}
                                Following
                              </Text>
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Social Links Display */}
                            <SocialLinksDisplay />
                            
                            {/* Add/Manage Links Button */}
                            <button
                              onClick={() => setIsLinksModalOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#750015] text-white hover:bg-[#a0001f] transition-colors text-[14px] sm:text-[12px] xs:text-[11px] font-medium"
                            >
                              <Share2 size={16} />
                              {hasSocialLinks() ? 'Manage Links' : 'Add Links'}
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

              {/* Posts Heading */}
              <div className="mt-4 mb-4 bg-gray-200 h-px w-[92%] md:w-full flex-col">
                <div className="text-[20px] font-semibold">
                  Posts
                  <div className="h-[3px] w-20 bg-[#750015]"></div>
                </div>
              </div>

              {/* Posts Section */}
              {!token ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Want to see posts and engage with this user?</strong>
                    <button 
                      onClick={() => {
                        sessionStorage.setItem('redirectAfterLogin', location.pathname);
                        navigate('/login');
                      }}
                      className="text-blue-600 underline ml-1"
                    >
                      Log in to view posts and follow
                    </button>
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  {isLoadingPosts && posts.length === 0 ? (
                    <div className="space-y-6 w-full animate-fade-in">
                      {[...Array(3)].map((_, idx) => (
                        <PostSkeleton key={`skeleton-${idx}`} />
                      ))}
                    </div>
                  ) : posts.length === 0 && !isLoadingPosts ? (
                    <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff] animate-fade-in">
                      <Text
                        as="p"
                        className="text-[14px] font-normal text-[#adacb2]"
                      >
                        No posts yet.
                      </Text>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6 w-full">
                        {posts.map((post, idx) => {
                          const uniqueKey = `${post.id}-${idx}`;
                          return (
                            <div
                              key={uniqueKey}
                              className="animate-slide-up mb-10"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              <Post
                                post={post}
                                onPostUpdate={(updatedPost) => {
                                  setPosts((prev) =>
                                    prev.map((p) =>
                                      p.id === updatedPost.id
                                        ? (updatedPost as ProfilePost)
                                        : p
                                    )
                                  );
                                }}
                                onPostDelete={(post) => {
                                  setPosts((prev) =>
                                    prev.filter((p) => p.id !== post.id)
                                  );
                                }}
                                onPostEdit={(post) => {
                                  // This is now handled internally by the Post component
                                }}
                                currentUserId={user?.id}
                                currentUserEmail={user?.email}
                                onClick={() => {
                                  navigate(`/posts/${post.id}`);
                                }}
                                postsData={posts}
                              />
                            </div>
                          );
                        })}

                        {/* Loading more skeleton */}
                        {isLoadingMore && (
                          <div className="space-y-6">
                            {[...Array(2)].map((_, idx) => (
                              <PostSkeleton key={`more-skeleton-${idx}`} />
                            ))}
                          </div>
                        )}

                        {/* Loading trigger for infinite scroll */}
                        <div
                          ref={loadingRef}
                          className="h-20 flex items-center justify-center mt-4"
                        >
                          {isLoadingMore && (
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]" />
                          )}
                          {!hasMore && posts.length > 0 && (
                            <div className="text-gray-500">
                              No more posts to load
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Profile Side Panel */}
        <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8 pb-20 h-[100vh] overflow-scroll scrollbar-hide animate-slide-left">
          <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white animate-fade-in">
            <ProfileOrganizationSection />
          </div>
          <div className="rounded-[32px] border border-solid h-auto max-h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5 animate-fade-in">
            <div className="overflow-hidden h-full">
              <WhoToFollowSidePanel />
            </div>
          </div>
        </div>
        
      </div>
    </div>


                      {isLinksModalOpen && (
                <LinksModal
                  isOpen={isLinksModalOpen}
                  onClose={() => setIsLinksModalOpen(false)}
                  userProfile={userProfile}
                  token={token}
                  fetchUserData={fetchUserData}
                  accountType={userProfile.account_type}
                />
              )}


    {/* Modals */}
    <UsersListModal
      isOpen={showFollowersModal}
      onClose={() => setShowFollowersModal(false)}
      title="Followers"
      users={followers}
      isLoading={isLoadingFollowers}
      onUserClick={handleNavigateToProfile}
      onFollowClick={handleFollowInModal}
      currentUserId={user?.id}
    />

    <UsersListModal
      isOpen={showFollowingModal}
      onClose={() => setShowFollowingModal(false)}
      title="Following"
      users={following}
      isLoading={isLoadingFollowing}
      onUserClick={handleNavigateToProfile}
      onFollowClick={handleFollowInModal}
      currentUserId={user?.id}
    />
  </div>
);

}