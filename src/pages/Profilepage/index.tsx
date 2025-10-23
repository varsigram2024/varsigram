
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
import { Pencil, Save, Share, Users, X, Linkedin, Twitter, Instagram, Globe, Share2, MessageCircle } from "lucide-react";

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
  const isOwnProfile = user && userProfile && user.id === userProfile.id;
  

  
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
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${username}/`);
    const profileData = response.data;

    const user = profileData.profile.user;
    const email = user.email || null;
    const links = user.links || {};

    setUserProfile({
      ...profileData.profile,
      email,
      links,
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);
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
    setIsLoading(true); // Ensure loading starts
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
      linkedin_url: profile.user?.links?.linkedin_url || null,
      twitter_url: profile.user?.links?.twitter_url || null,
      instagram_url: profile.user?.links?.instagram_url || null,
      website_url: profile.user?.links?.portfolio_url || null, // renamed from portfolio_url
      whatsapp_url: profile.user?.links?.whatsapp_url || null, // ✅ new
    };
    setSocialLinks(updatedSocialLinks);



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
    (socialLinks.website_url && socialLinks.website_url.trim() !== '') ||
    (socialLinks.whatsapp_url && socialLinks.whatsapp_url.trim() !== '')
  );
};

const SocialLinksDisplay = () => {
  const email = userProfile?.email;
  const links = socialLinks;
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [removingLink, setRemovingLink] = useState<string | null>(null);

  const handleRemoveLink = async (platform: keyof SocialLinks) => {
    if (!token || !userProfile) return;

    setRemovingLink(platform);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      
      const payload: Record<string, null> = {};
      if (platform === 'website_url') {
        payload['portfolio_url'] = null;
      } else {
        payload[platform] = null;
      }

      await axios.patch(
        `${API_BASE_URL}/profile/social-links/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSocialLinks(prev => ({
        ...prev,
        [platform]: null
      }));

      await fetchUserData();
      toast.success(`${getPlatformName(platform)} link removed!`);
    } catch (error) {
      console.error('Error removing link:', error);
      toast.error('Failed to remove link');
    } finally {
      setRemovingLink(null);
    }
  };

  const getPlatformName = (platform: string): string => {
    switch (platform) {
      case 'linkedin_url': return 'LinkedIn';
      case 'twitter_url': return 'Twitter';
      case 'instagram_url': return 'Instagram';
      case 'website_url': return 'Website';
      case 'whatsapp_url': return 'WhatsApp';
      case 'email': return 'Email';
      default: return platform;
    }
  };

  const socialIcons = [
    {
      key: "email",
      name: "Email",
      url: email ? `mailto:${email}` : null,
      svg: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 xs:w-5 xs:h-5"
        >
          <path
            d="M2 4C0.895 4 0 4.895 0 6V18C0 19.105 0.895 20 2 20H22C23.105 20 24 19.105 24 18V6C24 4.895 23.105 4 22 4H2ZM22 8.236L12 13.618L2 8.236V6L12 11.382L22 6V8.236Z"
            fill="#EA4335"
          />
        </svg>
      ),
    },
    {
      key: "twitter_url",
      svg: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 xs:w-5 xs:h-5"
        >
          <mask id="mask0" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
            <path d="M0 0H20V20H0V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0)">
            <path
              d="M15.75 0.9375H18.8171L12.1171 8.61464L20 19.0632H13.8286L8.99143 12.7275L3.46286 19.0632H0.392857L7.55857 10.8489L0 0.938929H6.32857L10.6943 6.72893L15.75 0.9375ZM14.6714 17.2232H16.3714L5.4 2.68179H3.57714L14.6714 17.2232Z"
              fill="#3A3A3A"
            />
          </g>
        </svg>
      ),
      url: links.twitter_url,
      name: "Twitter",
    },
    {
      key: "linkedin_url",
      svg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 xs:w-5 xs:h-5">
          <g clipPath="url(#clip0_2978_12604)">
            <path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="white"/>
            <path d="M15.3125 0H4.6875C2.09867 0 0 2.09867 0 4.6875V15.3125C0 17.9013 2.09867 20 4.6875 20H15.3125C17.9013 20 20 17.9013 20 15.3125V4.6875C20 2.09867 17.9013 0 15.3125 0Z" fill="#3A3A3A"/>
            <path d="M14.4309 17.0066H16.7176C16.8004 17.0066 16.8799 16.9737 16.9385 16.9151C16.9971 16.8566 17.0301 16.7771 17.0301 16.6942L17.0312 11.8628C17.0312 9.33758 16.4871 7.39656 13.5361 7.39656C12.4143 7.35484 11.3564 7.93313 10.7855 8.89875C10.7828 8.90344 10.7785 8.90709 10.7734 8.90914C10.7684 8.91119 10.7628 8.91153 10.7575 8.9101C10.7523 8.90867 10.7476 8.90556 10.7443 8.90124C10.7409 8.89692 10.7391 8.89163 10.7391 8.88617V7.94219C10.7391 7.85931 10.7061 7.77982 10.6475 7.72122C10.5889 7.66261 10.5094 7.62969 10.4266 7.62969H8.25648C8.1736 7.62969 8.09412 7.66261 8.03551 7.72122C7.97691 7.77982 7.94398 7.85931 7.94398 7.94219V16.6937C7.94398 16.7766 7.97691 16.8561 8.03551 16.9147C8.09412 16.9733 8.1736 17.0062 8.25648 17.0062H10.543C10.6259 17.0062 10.7054 16.9733 10.764 16.9147C10.8226 16.8561 10.8555 16.7766 10.8555 16.6937V12.3677C10.8555 11.1445 11.0876 9.95992 12.6041 9.95992C14.099 9.95992 14.1184 11.3596 14.1184 12.447V16.6941C14.1184 16.777 14.1513 16.8565 14.2099 16.9151C14.2685 16.9737 14.348 17.0066 14.4309 17.0066ZM2.96875 4.65844C2.96875 5.58531 3.7318 6.34797 4.65875 6.34797C5.58547 6.34789 6.34805 5.58477 6.34805 4.65805C6.34789 3.73133 5.58523 2.96875 4.65844 2.96875C3.73141 2.96875 2.96875 3.73156 2.96875 4.65844ZM3.51242 17.0066H5.80203C5.88491 17.0066 5.9644 16.9737 6.023 16.9151C6.08161 16.8565 6.11453 16.777 6.11453 16.6941V7.94219C6.11453 7.85931 6.08161 7.77982 6.023 7.72122C5.9644 7.66261 5.88491 7.62969 5.80203 7.62969H3.51242C3.42954 7.62969 3.35006 7.66261 3.29145 7.72122C3.23285 7.77982 3.19992 7.85931 3.19992 7.94219V16.6941C3.19992 16.777 3.23285 16.8565 3.29145 16.9151C3.35006 16.9737 3.42954 17.0066 3.51242 17.0066Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_2978_12604">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      url: links.linkedin_url,
      name: "LinkedIn",
    },
    {
      key: "instagram_url",
      svg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 xs:w-5 xs:h-5">
          <path d="M6.5013 1.66797H13.5013C16.168 1.66797 18.3346 3.83464 18.3346 6.5013V13.5013C18.3346 14.7832 17.8254 16.0126 16.919 16.919C16.0126 17.8254 14.7832 18.3346 13.5013 18.3346H6.5013C3.83464 18.3346 1.66797 16.168 1.66797 13.5013V6.5013C1.66797 5.21942 2.17719 3.99005 3.08362 3.08362C3.99005 2.17719 5.21942 1.66797 6.5013 1.66797ZM6.33464 3.33464C5.53899 3.33464 4.77592 3.65071 4.21332 4.21332C3.65071 4.77592 3.33464 5.53899 3.33464 6.33464V13.668C3.33464 15.3263 4.6763 16.668 6.33464 16.668H13.668C14.4636 16.668 15.2267 16.3519 15.7893 15.7893C16.3519 15.2267 16.668 14.4636 16.668 13.668V6.33464C16.668 4.6763 15.3263 3.33464 13.668 3.33464H6.33464ZM14.3763 4.58464C14.6526 4.58464 14.9175 4.69438 15.1129 4.88973C15.3082 5.08508 15.418 5.35003 15.418 5.6263C15.418 5.90257 15.3082 6.16752 15.1129 6.36287C14.9175 6.55822 14.6526 6.66797 14.3763 6.66797C14.1 6.66797 13.8351 6.55822 13.6397 6.36287C13.4444 6.16752 13.3346 5.90257 13.3346 5.6263C13.3346 5.35003 13.4444 5.08508 13.6397 4.88973C13.8351 4.69438 14.1 4.58464 14.3763 4.58464ZM10.0013 5.83464C11.1064 5.83464 12.1662 6.27362 12.9476 7.05502C13.729 7.83643 14.168 8.89623 14.168 10.0013C14.168 11.1064 13.729 12.1662 12.9476 12.9476C12.1662 13.729 11.1064 14.168 10.0013 14.168C8.89623 14.168 7.83643 13.729 7.05502 12.9476C6.27362 12.1662 5.83464 11.1064 5.83464 10.0013C5.83464 8.89623 6.27362 7.83643 7.05502 7.05502C7.83643 6.27362 8.89623 5.83464 10.0013 5.83464ZM10.0013 7.5013C9.33826 7.5013 8.70238 7.76469 8.23353 8.23353C7.76469 8.70238 7.5013 9.33826 7.5013 10.0013C7.5013 10.6643 7.76469 11.3002 8.23353 11.7691C8.70238 12.2379 9.33826 12.5013 10.0013 12.5013C10.6643 12.5013 11.3002 12.2379 11.7691 11.7691C12.2379 11.3002 12.5013 10.6643 12.5013 10.0013C12.5013 9.33826 12.2379 8.70238 11.7691 8.23353C11.3002 7.76469 10.6643 7.5013 10.0013 7.5013Z" fill="#3A3A3A"/>
        </svg>
      ),
      url: links.instagram_url,
      name: "Instagram",
    },
    {
      key: "whatsapp_url",
      svg: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 xs:w-5 xs:h-5">
          <path d="M15.8737 4.09301C15.1096 3.32144 14.1995 2.70965 13.1966 2.29332C12.1937 1.87698 11.1179 1.66442 10.032 1.66801C5.48203 1.66801 1.7737 5.37635 1.7737 9.92635C1.7737 11.3847 2.15703 12.8013 2.8737 14.0513L1.707031 18.3347L6.08203 17.1847C7.29036 17.843 8.6487 18.193 10.032 18.193C14.582 18.193 18.2904 14.4847 18.2904 9.93468C18.2904 7.72635 17.432 5.65135 15.8737 4.09301ZM10.032 16.793C8.7987 16.793 7.59036 16.4597 6.53203 15.8347L6.28203 15.6847L3.68203 16.368L4.3737 13.8347L4.20703 13.5763C3.52165 12.4822 3.1578 11.2174 3.15703 9.92635C3.15703 6.14301 6.24036 3.05968 10.0237 3.05968C11.857 3.05968 13.582 3.77635 14.8737 5.07635C15.5134 5.7129 16.0203 6.47013 16.3651 7.30412C16.7098 8.13811 16.8855 9.03225 16.882 9.93468C16.8987 13.718 13.8154 16.793 10.032 16.793ZM13.7987 11.6597C13.5904 11.5597 12.5737 11.0597 12.3904 10.9847C12.1987 10.918 12.0654 10.8847 11.9237 11.0847C11.782 11.293 11.3904 11.7597 11.2737 11.893C11.157 12.0347 11.032 12.0513 10.8237 11.943C10.6154 11.843 9.9487 11.618 9.16536 10.918C8.5487 10.368 8.14036 9.69301 8.01536 9.48468C7.8987 9.27635 7.9987 9.16801 8.10703 9.05968C8.1987 8.96801 8.31536 8.81801 8.41536 8.70135C8.51536 8.58468 8.55703 8.49301 8.6237 8.35968C8.69036 8.21801 8.65703 8.10135 8.60703 8.00135C8.55703 7.90135 8.14036 6.88468 7.9737 6.46801C7.80703 6.06801 7.63203 6.11801 7.50703 6.10968H7.10703C6.96536 6.10968 6.7487 6.15968 6.55703 6.36801C6.3737 6.57635 5.84036 7.07635 5.84036 8.09301C5.84036 9.10968 6.58203 10.093 6.68203 10.2263C6.78203 10.368 8.14036 12.4513 10.207 13.343C10.6987 13.5597 11.082 13.6847 11.382 13.7763C11.8737 13.9347 12.3237 13.9097 12.682 13.8597C13.082 13.8013 13.907 13.3597 14.0737 12.8763C14.2487 12.393 14.2487 11.9847 14.1904 11.893C14.132 11.8013 14.007 11.7597 13.7987 11.6597Z" fill="#3A3A3A"/>
        </svg>
      ),
      url: links.whatsapp_url,
      name: "WhatsApp",
    },
    {
      key: "website_url",
      svg: (
        <svg
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 xs:w-5 xs:h-5"
        >
          <path
            d="M16.5 4.25H12.75V1.75C12.75 1.41848 12.6183 1.10054 12.3839 0.866116C12.1495 0.631696 11.8315 0.5 11.5 0.5H6.5C6.16848 0.5 5.85054 0.631696 5.61612 0.866116C5.3817 1.10054 5.25 1.41848 5.25 1.75V4.25H1.5C1.16848 4.25 0.850537 4.3817 0.616116 4.61612C0.381696 4.85054 0.25 5.16848 0.25 5.5V14.25C0.25 14.5815 0.381696 14.8995 0.616116 15.1339C0.850537 15.3683 1.16848 15.5 1.5 15.5H16.5C16.8315 15.5 17.1495 15.3683 17.3839 15.1339C17.6183 14.8995 17.75 14.5815 17.75 14.25V5.5C17.75 5.16848 17.6183 4.85054 17.3839 4.61612C17.1495 4.3817 16.8315 4.25 16.5 4.25ZM6.5 1.75H11.5V4.25H6.5V1.75ZM1.5 14.25V5.5H16.5V14.25H1.5Z"
            fill="#3A3A3A"
          />
        </svg>
      ),
      url: links.website_url,
      name: "Website",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 xs:gap-3">
      {socialIcons.map(({ key, svg, url, name }) =>
        url && url.trim() ? (
          <div 
            key={key}
            className="relative group"
            onMouseEnter={() => setHoveredLink(key)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <div className="relative">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-2 xs:px-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-sm"
                title={name}
              >
                {svg}
              </a>
              
              {/* Remove button - only show for own profile */}
              {isOwnProfile && (
                    <div className={`
                      absolute -top-2 -right-2 transition-all duration-200
                      ${hoveredLink === key ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                    `}>
                      <button
                        onClick={() => handleRemoveLink(key as keyof SocialLinks)}
                        disabled={removingLink === key}
                        className="w-3 h-3 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 hover:shadow-xl"
                        title={`Remove ${name}`}
                      >
                        {removingLink === key ? (
                          <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3"
                            className="xs:w-4 xs:h-4"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}

            </div>

            {/* Platform name tooltip */}
            <div className={`
              absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
              px-2 text-xs text-white bg-gray-800 rounded 
              transition-all duration-200 pointer-events-none
              ${hoveredLink === key ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}>
              {name}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        ) : null
      )}
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
          ) : userProfile ? (
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
                    <div className="flex items-start pr-4 justify-between">
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

                         {/* Social Links Section */}
                          <div className="">
                            {isOwnProfile ? (
                              hasSocialLinks() ? (
                                <div className="flex flex-col gap-2 xs:gap-3">
                                  <div className="flex flex-row items-center gap-1.5 xs:gap-2">
                                    <SocialLinksDisplay />
                                    <button
                                      onClick={() => setIsLinksModalOpen(true)}
                                      className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                                      title="Edit links"
                                    >
                                      <Pencil size={12} className="xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setIsLinksModalOpen(true)}
                                  className="flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-[#750015] text-white hover:bg-[#a0001f] transition-colors text-xs xs:text-sm"
                                >
                                  <span>Add Social Links</span>
                                </button>
                              )
                            ) : (
                              hasSocialLinks() && (
                                <div className="">
                                  <SocialLinksDisplay />
                                </div>
                              )
                            )}
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
                  <div className="h-[3px] w-14 bg-[#750015]"></div>
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
            ) : (
              <div className="flex justify-center items-center h-[300px] w-full animate-fade-in">
                <Text>User not found</Text>
              </div>
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