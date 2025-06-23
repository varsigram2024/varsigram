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
import { ClickableUser } from "../../components/ClickableUser";
import { Button } from "../../components/Button/index.tsx";
import { Post } from "../../components/Post.tsx/index.tsx";

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
}

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

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!display_name_slug || !token) return;
      setIsLoading(true);
      try {
        // Use the new endpoint: /api/v1/profile/<slug:slug>
        const profileResponse = await axios.get(`https://api.varsigram.com/api/v1/profile/${display_name_slug}/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        const { profile_type, profile } = profileResponse.data;
        const isOrg = profile_type === 'organization';

        // Fetch followers and following only for organizations
        let followersArr: any[] = [];
        let followingArr: any[] = [];
        
        if (isOrg) {
          try {
            const followersRes = await axios.get(
              `https://api.varsigram.com/api/v1/users/${profile.display_name_slug}/followers/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            followersArr = followersRes.data;
            console.log("Followers array:", followersRes.data);
          } catch (err) {
            console.error('Error fetching followers:', err);
          }

          try {
            const followingRes = await axios.get(
              `https://api.varsigram.com/api/v1/users/${profile.display_name_slug}/following/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            followingArr = followingRes.data;
          } catch (err) {
            console.error('Error fetching following:', err);
          }
        }

        setFollowers(followersArr);
        setFollowing(followingArr);

        const displayName = isOrg
          ? profile.organization_name || profile.user?.display_name
          : profile.name || profile.user?.display_name;
        const bio = isOrg
          ? profile.user?.bio
          : profile.bio;

        setUserProfile({
          id: profile.user.id,
          email: profile.user.email,
          username: profile.user.username,
          profile_pic_url: profile.profile_pic_url,
          bio,
          is_verified: profile.user?.is_verified || false,
          followers_count: isOrg ? followersArr.length : 0,
          following_count: followingArr.length,
          account_type: profile_type,
          name: profile.name,
          organization_name: profile.organization_name,
          faculty: profile.faculty,
          department: profile.department,
          year: profile.year,
          display_name_slug: profile.display_name_slug,
        });

        // Check if current user is following this user (only for external profiles)
        if (user?.email !== profile.user.email) {
          try {
            const followingResponse = await axios.get(`https://api.varsigram.com/api/v1/following/`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            
            const followingList = followingResponse.data;
            const isUserFollowing = followingList.some((followedUser: any) => 
              followedUser.organization?.display_name_slug === profile.display_name_slug
            );
            setIsFollowing(isUserFollowing);
          } catch (err) {
            console.error('Error checking follow status:', err);
          }
        }

        // Fetch user's posts using the correct endpoint
        try {
          const postsResponse = await axios.get(`https://api.varsigram.com/api/v1/users/${profile.user.id}/posts/`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          
          setPosts(postsResponse.data);
          console.log('User posts fetched:', postsResponse.data);
        } catch (error) {
          console.error('Error fetching user posts:', error);
          setPosts([]);
        }

      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [display_name_slug, token, user?.email]);

  const handleFollow = async () => {
    if (!display_name_slug || !token) return;

    try {
      if (isFollowing) {
        await axios.post(`https://api.varsigram.com/api/v1/users/${display_name_slug}/unfollow/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setIsFollowing(false);
        setUserProfile(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
        toast.success('Unfollowed successfully');
      } else {
        await axios.post(`https://api.varsigram.com/api/v1/users/${display_name_slug}/follow/`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setIsFollowing(true);
        setUserProfile(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
        toast.success('Followed successfully');
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleClearSearch = () => setSearchBarValue("");

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File type:', file.type);
    console.log('File name:', file.name);
    console.log('File size:', file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `profile_pictures/${user?.id}/${timestamp}_${file.name}`;
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, filename);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Upload result:', uploadResult);
      
      // Get the download URL
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadUrl);

      // Update the user's profile with the new image URL
      const endpoint = user?.account_type === 'organization' 
        ? 'https://api.varsigram.com/api/v1/organization/update'
        : 'https://api.varsigram.com/api/v1/student/update';

      const updateResponse = await axios({
        method: 'post',
        url: endpoint,
        data: { profile_pic_url: downloadUrl },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Backend update response:', updateResponse);

      if (updateResponse.status !== 200) {
        throw new Error(updateResponse.data?.error || 'Failed to update profile');
      }

      // Update the user context with new profile picture URL
      if (updateUser && user) {
        const updatedUser = {
          ...user,
          profile_pic_url: downloadUrl
        };
        console.log('Updating user context with:', updatedUser);
        updateUser(updatedUser);

        // Refresh user data to ensure all profile information is up to date
        await fetchUserData();
      }

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.code === 'ERR_NETWORK') {
          toast.error('Network error: Please check your internet connection and try again.');
        } else if (error.response?.status === 403) {
          toast.error('Access denied: Please make sure you are logged in.');
        } else if (error.response?.status === 401) {
          toast.error('Session expired: Please log in again.');
        } else {
          toast.error(`Failed to upload profile picture: ${error.response?.data?.error || error.message}`);
        }
      } else if (error instanceof Error) {
        toast.error(`Failed to upload profile picture: ${error.message}`);
      } else {
        toast.error('Failed to upload profile picture. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('https://api.varsigram.com/api/v1/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Set userProfile from the API response
      if (response.data && response.data.profile) {
        const { profile_type, profile } = response.data;
        setUserProfile({
          id: profile.user.id,
          email: profile.user.email,
          username: profile.user.username,
          profile_pic_url: profile.profile_pic_url,
          bio: profile.bio,
          is_verified: profile.is_verified,
          followers_count: profile.followers_count,
          following_count: profile.following_count,
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
        });
      } else {
        setUserProfile(null);
      }

      // ... (your updateUser logic can stay)
    } catch (error) {
      setUserProfile(null);
      // ... (your error handling)
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
    if (!token) return;
    axios.get('https://api.varsigram.com/api/v1/following/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      console.log('/following/ on user-profile page:', response.data);
      setFollowing(response.data);
    })
    .catch(error => {
      console.error('Error fetching /following/ on user-profile page:', error);
    });
  }, [token]);

  useEffect(() => {
    const fetchFollowers = async (displayNameSlug: string) => {
      if (!displayNameSlug) {
        console.warn("No display_name_slug provided to fetchFollowers");
        setFollowers([]);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.varsigram.com/api/v1/users/${displayNameSlug}/followers/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowers(response.data);
      } catch (error) {
        setFollowers([]);
      }
    };
    if (token && userProfile?.organization_name) {
      fetchFollowers(userProfile.organization_name);
    }
  }, [token, userProfile?.organization_name]);

  useEffect(() => {
    console.log("Followers array:", followers);
  }, [followers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#750015]"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text>User not found</Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-100">
      <div className="flex w-full items-start justify-center bg-white">
        <Sidebar1 />

        <div className="flex w-full lg:w-[85%] items-start justify-center h-auto flex-row">
          <div className="lg:mt-[0px] w-full flex lg:flex-1 flex-col max-h-full items-center lg:items-end md:gap-[70px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-0 md:px-5 gap-[35px]">
            {/* Cover photo section */}
            <div className="flex w-[92%] justify-end rounded-[20px] pb-2 bg-[#f6f6f6] md:w-full">
              <div className="flex w-full flex-col self-stretch gap-2.5">
                <div className="flex flex-col items-center justify-center gap-2 rounded-tl-[20px] rounded-tr-[20px] bg-[#750015] p-10 sm:p-5">
                  <Img src="images/cover-photo-bg.svg" alt="Cover" className="h-[60px] w-[60px]" />
                  <Text as="h4" className="text-[28px] font-semibold text-white md:text-[26px] sm:text-[24px]">
                    {userProfile.organization_name || 'User Profile'}
                  </Text>
                </div>
                <div className="relative ml-4 mt-[-46px] w-[120px] h-[120px] rounded-[50%] border-[5px] border-[#ffdbe2] bg-white">
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
                              src={userProfile.profile_pic_url || 'images/user.png'}
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
                    <Img
                      src={userProfile?.profile_pic_url || "images/user.png"}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* User info and follow button */}
                <div className="mx-3.5 ml-4 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-[7px]">
                    <Heading size="h3_semibold" as="h1" className="text-[28px] font-semibold md:text-[26px] sm:text-[24px]">
                      {userProfile.name || userProfile.organization_name || userProfile.username}
                    </Heading>
                    {userProfile.is_verified && (
                      <Img 
                        src="images/vectors/verified.svg" 
                        alt="Verified" 
                        className="h-[16px] w-[16px]" 
                      />
                    )}
                  </div>
                  <Text as="p" className="text-[16px] font-normal text-gray-600">
                    {userProfile.bio || 'No bio available'}
                  </Text>
                  
                  {/* Follow button - only show if not viewing own profile */}
                  {user?.email !== userProfile.email && (
                    <Button onClick={handleFollow}>
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}

                    <div className="flex flex-wrap gap-6">
                      {userProfile?.account_type === 'organization' && (
                        <Text as="p" className="text-[16px] font-normal">
                          <span className="font-semibold">{followers.length}</span> Followers
                        </Text>
                      )}
                      <Text as="p" className="text-[16px] font-normal">
                        <span className="font-semibold">{following.length}</span> Following
                      </Text>
                    </div>

                  {/* Additional info for students */}
                  {userProfile.account_type === 'student' && (
                    <div className="flex flex-col gap-2">
                      {userProfile.faculty && (
                        <Text as="p" className="text-[14px] font-normal text-gray-600">
                          Faculty: {userProfile.faculty}
                        </Text>
                      )}
                      {userProfile.department && (
                        <Text as="p" className="text-[14px] font-normal text-gray-600">
                          Department: {userProfile.department}
                        </Text>
                      )}
                      {userProfile.year && (
                        <Text as="p" className="text-[14px] font-normal text-gray-600">
                          Year: {userProfile.year}
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="h-px bg-[#d9d9d9]" />
            </div>

            {/* Posts Section */}
            {(userProfile.display_name_slug || userProfile.email) && token && (
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
            )}
          </div>

          {/* Profile Side Panel */}
          <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8">
            <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white">
              <ProfileOrganizationSection />
            </div>
            <div className="rounded-[32px] border border-solid overflow-hidden h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5">
              <Input
                name="search_seven"
                placeholder="Search Varsigram"
                value={searchBarValue}
                onChange={(e) => setSearchBarValue(e.target.value)}
                prefix={<Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
                suffix={
                  searchBarValue?.length > 0 ? <CloseSVG onClick={handleClearSearch} fillColor="gray_800" /> : null
                }
                className="flex h-[48px] items-center rounded-[24px] border-[1.5px] border-[#e6e6e699] pl-[22px] pr-3 text-[14px] text-[#3a3a3a]"
              />

              <Text as="p" className="mt-5 text-[24px] font-medium md:text-[22px]">Who to follow</Text>
              <div className="my-3 flex flex-col gap-5 h-full overflow-auto scrollbar-hide">
                {/* Add your "Who to follow" content here */}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
