import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "./ProfilepageOrganizationSection.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";
import { useAuth } from "../../auth/AuthContext";
import WhoToFollowSidePanel from "../../components/whoToFollowSidePanel/index.tsx";
import { ClickableUser } from "../../components/ClickableUser";
import { Button } from "../../components/Button/index.tsx";
import { Post } from "../../components/Post.tsx/index.tsx";
import { uploadProfilePicture } from '../../utils/fileUpload.ts';
import { Pencil, Save } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Add interface for props
interface ProfilepageOrganizationProps {
  onComplete: (page: string) => void;
}

interface Post {
  id: string;
  slug: string;
  author_id: string;
  author_username: string;
  author_name: string;
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
  original_post?: Post;
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
  account_type: 'student' | 'organization';
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

// const makeProfilePicUrl = (url: string) => {
//   if (!url) return "/images/user.png";
//   if (url.startsWith("http")) return url; console.log(url)
//   return `https://storage.googleapis.com/versigram-pd.firebasestorage.app/${url}`;
// };

// Update component to accept props
export default function Profile() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, token, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { display_name_slug } = useParams(); // Change from username to display_name_slug
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!display_name_slug || !token) return;
      setIsLoading(true);
      try {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/profile/${display_name_slug}/`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const { profile_type, profile, is_following, followers_count, following_count } = profileResponse.data;
    
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

  const handleFollow = async () => {
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
        setUserProfile(prev => prev
          ? { ...prev, followers_count: Math.max(0, Number(prev.followers_count) - 1) }
          : null
        );
        toast.success('Unfollowed successfully');
      } else {
        await axios.post(
          `${API_BASE_URL}/users/follow/`,
          { follower_type, follower_id, followee_type, followee_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFollowing(true);
        setUserProfile(prev => prev
          ? { ...prev, followers_count: Number(prev.followers_count) + 1 }
          : null
        );
        toast.success('Followed successfully');
      }
    } catch (error) {
      toast.error('Failed to update follow status');
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
      const public_download_url = await uploadProfilePicture(file, jwtToken, userProfile.account_type);
      toast.success('Profile picture uploaded successfully!');
      await fetchUserData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/profile/${display_name_slug}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.profile) {
        const { profile_type, profile, followers_count, following_count } = response.data;
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
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!userProfile || !token) return;
    axios.get(
      `${API_BASE_URL}/users/following/?follower_type=${userProfile.account_type}&follower_id=${userProfile.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      console.log('/following/ on user-profile page:', response.data);
      setFollowing(response.data);
    })
    .catch(error => {
      console.error('Error fetching /following/ on user-profile page:', error);
    });
  }, [userProfile, token]);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userProfile) return;
      // now safe to use userProfile.account_type
    };
    if (token && userProfile?.organization_name) {
      fetchFollowers();
    }
  }, [token, userProfile?.organization_name]);

  useEffect(() => {
    console.log("Followers array:", followers);
  }, [followers]);

  const fetchPosts = async () => {
    if (!userProfile?.id || !token) return;
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userProfile.id}/posts/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  // Add useEffect to fetch posts when userProfile changes
  useEffect(() => {
    if (userProfile?.id && token) {
      fetchPosts();
    }
  }, [userProfile?.id, token]);

  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-100">
      <div className="flex w-full items-start justify-center bg-white">
        <Sidebar1 />

        <div className="flex w-full lg:w-[85%] items-start justify-center h-auto flex-row">
          <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px] w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
              </div>
            ) : !userProfile ? (
              <div className="flex justify-center items-center h-[300px] w-full">
                <Text>User not found</Text>
              </div>
            ) : (
              <>
                {/* Cover photo section */}
                <div className="flex w-[92%] justify-end rounded-[20px] pb-2 bg-[#f6f6f6] md:w-full">
                  <div className="flex w-full flex-col self-stretch gap-2.5">
                    <div className="flex h-[170px] flex-col items-center justify-center gap-2 rounded-tl-[20px] rounded-tr-[20px] p-10 sm:p-5" style={{ backgroundImage: `url(${userProfile?.profile_pic_url && userProfile.profile_pic_url.startsWith('http') ? userProfile.profile_pic_url : '/images/cover-photo-bg.svg'})`, backgroundSize: 'cover' }}>
                      {/* <Text as="h4" className="text-[28px] font-semibold text-white md:text-[26px] sm:text-[24px]">
                        {userProfile.organization_name || 'User Profile'}
                      </Text> */}
                    </div>
                    <div className="overflow-hidden relative ml-4 mt-[-46px] w-[120px] h-[120px] rounded-[50%] border-[5px] border-[#ffdbe2] bg-white">
                      {user?.email === userProfile?.email ? (
                        <>
                          <div 
                            onClick={handleProfilePicClick}
                            className="relative w-full h-full rounded-full overflow-hidden cursor-pointer group"
                          >
                            {isUploading ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                              </div>
                            ) : (
                              <>
                                <Img
                                  src={
                                    userProfile?.profile_pic_url && userProfile.profile_pic_url.startsWith('http')
                                      ? userProfile.profile_pic_url
                                      : "/images/user.png"
                                  }
                                  alt="Profile Picture"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                  <Text as="p" className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                        <>
                          <Img
                            src={
                              userProfile?.profile_pic_url && userProfile.profile_pic_url.startsWith('http')
                                ? userProfile.profile_pic_url
                                : "/images/user.png"
                            }
                            alt="Profile Picture"
                            className="w-full h-full object-cover"
                          />
                        </>
                      )}
                    </div>

                    {/* User info and follow button */}
                    <div className="mx-3.5 ml-4 flex flex-col items-start gap-4">
                      <div className="flex items-center gap-[7px]">
                        <Heading size="h3_semibold" as="h1" className="text-[28px] font-semibold md:text-[26px] sm:text-[24px]">
                          {userProfile.name || userProfile.organization_name || userProfile.username}
                        </Heading>
                        {userProfile.account_type === "organization" &&
                         userProfile.is_verified &&
                         userProfile.exclusive && (
                          <Img 
                            src="/images/vectors/verified.svg" 
                            alt="Verified" 
                            className="h-[16px] w-[16px]" 
                          />
                        )}
                      </div>


                          {/* Additional info for students */}
                      {userProfile.account_type === 'student' && (
                        <div className="flex flex-row gap-2">
                          {userProfile.university && (
                            <Text as="p" className="text-[14px] font-normal p-1.5 px-2 rounded-[4px] bg-[#FFDBE2] text-gray-600">
                              {userProfile.university}
                            </Text>
                          )}
                          {userProfile.faculty && (
                            <Text as="p" className="text-[14px] font-normal p-1.5 px-2 rounded-[4px] bg-[#FFDBE2] text-gray-600">
                              {userProfile.faculty}
                            </Text>
                          )}
                          {userProfile.department && (
                            <Text as="p" className="text-[14px] font-normal p-1.5 px-2 rounded-[4px] bg-[#FFDBE2] text-gray-600">
                               {userProfile.department}
                            </Text>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {isEditingBio ? (
                          <>
                            <input
                              type="text"
                              value={bioInput}
                              onChange={e => setBioInput(e.target.value)}
                              className="border rounded px-2 py-1 text-[16px] font-normal text-gray-600"
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
                                      { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                    await fetchUserData();
                                    toast.success("Bio updated!");
                                  } catch (err: any) {
                                    console.error("Failed to update bio", err?.response?.data || err);
                                    toast.error("Failed to update bio");
                                  }
                                }
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <Text as="p" className="text-[16px] font-normal text-gray-600">
                              {userProfile.bio || 'No bio available'}
                            </Text>
                            {user?.email === userProfile.email && (
                              <button
                                onClick={() => {
                                  setBioInput(userProfile.bio || "");
                                  setIsEditingBio(true);
                                }}
                                className="ml-1 p-1 hover:bg-gray-200 rounded"
                                title="Edit bio"
                              >
                                <Pencil size={10} color="#750015" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Follow button - only show if not viewing own profile */}
                      {user?.email !== userProfile.email && (
                        <Button
                          onClick={handleFollow}
                          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                            isFollowing
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "bg-[#750015] text-white hover:bg-[#a0001f]"
                          }`}
                        >
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      )}

                        <div className="flex flex-wrap gap-6">
                          <Text as="p" className="text-[16px] font-normal">
                            <span className="font-semibold">{userProfile.followers_count}</span> Followers
                          </Text>
                          <Text as="p" className="text-[16px] font-normal">
                            <span className="font-semibold">{userProfile.following_count}</span> Following
                          </Text>
                        </div>

                    
                    </div>
                  </div>
                  <div className="h-px bg-[#d9d9d9]" />
                </div>

                {/* Posts Section */}
                {!user?.is_verified ? (
                  <div className="w-full flex flex-col items-center justify-center bg-yellow-50 border border-yellow-300 rounded-lg p-4 my-4">
                    <Text className="text-yellow-800 font-semibold mb-2">
                      Kindly go to SETTINGS to Verify your Email, in order to engage with content. THANK YOU!!!
                    </Text>
                    <Button
                      onClick={() => navigate("/settings/email-verification")}
                      className="bg-[#750015] text-white px-4 py-2 rounded"
                    >
                      Go to Email Verification
                    </Button>
                  </div>
                ) : (
                  (userProfile.display_name_slug || userProfile.email) && token && (
                    <div className="w-full">
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
                  )
                )}
              </>
            )}
          </div>

          {/* Profile Side Panel */}
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
    </div>
  );
}
