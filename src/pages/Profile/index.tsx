import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import WhoToFollowSidePanel from "../../components/whoToFollowSidePanel/index.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";
import Posts from "../../components/Posts/index.tsx";
import { useAuth } from "../../auth/AuthContext";

// Add interface for props
interface ProfileProps {
  onComplete: (page: string) => void;
  username?: string;
}

interface Post {
  id: string;
  slug: string;
  author_username: string;
  content: string;
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  author_profile_pic_url: string;
  image_url?: string;
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

// Update component to accept props
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from URL
  const [searchBarValue, setSearchBarValue] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { user: loggedInUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileUser, setProfileUser] = useState<any>(null); // Local state for viewed user

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  // Fetch profile data for the username in the URL
  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!username || !token) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`https://api.varsigram.com/api/v1/profile/${username}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        // The structure is { profile_type, profile }
        setProfileUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setProfileUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileUser();
  }, [username, token]);

  // Fetch posts for the viewed user
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileUser || !profileUser.profile || !token) return;
      setIsLoading(true);
      try {
        // Use user id from profileUser.profile.user.id
        const userId = profileUser.profile.user?.id;
        if (!userId) return;
        const response = await axios.get(`https://api.varsigram.com/api/v1/posts/user/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserPosts();
  }, [profileUser, token]);

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
      const filename = `profile_pictures/${profileUser?.profile?.user?.id}/${timestamp}_${file.name}`;
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, filename);
      
      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Upload result:', uploadResult);
      
      // Get the download URL
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadUrl);

      // Update the user's profile with the new image URL
      const endpoint = profileUser?.profile?.user?.account_type === 'organization' 
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
      if (profileUser && profileUser.profile) {
        const updatedUser = {
          ...profileUser.profile.user,
          profile_pic_url: downloadUrl
        };
        console.log('Updating user context with:', updatedUser);
        // Assuming you have a function to update the user context
        // updateUser(updatedUser);

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
      
      console.log('Full API Response:', response.data);
      
      if (profileUser && response.data) {
        const { profile_type, profile } = response.data;
        console.log('Profile Type:', profile_type);
        console.log('Profile Data:', profile);
        
        if (profile_type === 'organization') {
          const userData = {
            id: profile.user.id,
            email: profile.user.email,
            fullName: profile.organization_name,
            username: profile.user.username,
            profile_pic_url: profile.profile_pic_url,
            account_type: 'organization' as const,
            bio: profile.bio,
            organization_name: profile.organization_name,
          };
          // Assuming you have a function to update the user context
          // updateUser(userData);
        } else {
          const userData = {
            id: profile.user.id,
            email: profile.user.email,
            fullName: profile.name,
            username: profile.user.username,
            profile_pic_url: profile.profile_pic_url,
            account_type: 'student' as const,
            bio: profile.bio,
            faculty: profile.faculty,
            department: profile.department,
            year: profile.year,
            religion: profile.religion,
            phone_number: profile.phone_number,
            sex: profile.sex,
            university: profile.university,
            date_of_birth: profile.date_of_birth,
          };
          // Assuming you have a function to update the user context
          // updateUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again later.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Debug: log the profileUser object
  console.log('Profile page profileUser:', profileUser);

  // Helper to get display name
  const getDisplayName = () => {
    if (!profileUser || !profileUser.profile) return 'User';
    if (profileUser.profile_type === 'organization') {
      return profileUser.profile.organization_name || profileUser.profile.user?.display_name || 'User';
    }
    return profileUser.profile.user?.display_name || profileUser.profile.name || 'User';
  };

  // Helper to get bio
  const getBio = () => {
    if (!profileUser || !profileUser.profile) return 'Add bio';
    return profileUser.profile.user?.bio || profileUser.profile.bio || 'Add bio';
  };

  // Helper to get profile picture
  const getProfilePic = () => {
    if (!profileUser || !profileUser.profile) return 'images/user.png';
    return profileUser.profile.user?.profile_pic_url || profileUser.profile.profile_pic_url || 'images/user.png';
  };

  // Helper to get verified status
  const isVerified = () => {
    if (!profileUser || !profileUser.profile) return false;
    return !!profileUser.profile.user?.is_verified;
  };

  // Helper to get following/followers count
  const getFollowingCount = () => {
    if (!profileUser || !profileUser.profile) return 0;
    return profileUser.profile.following_count || 0;
  };
  const getFollowersCount = () => {
    if (!profileUser || !profileUser.profile) return 0;
    return profileUser.profile.followers_count || 0;
  };

  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-100">
      <div className="flex w-full items-start justify-center bg-white">
        <Sidebar1 />

        <div className="flex w-full lg:w-[85%] items-start justify-center h-auto flex-row">
          <div className="lg:mt-[0px] w-full flex lg:flex-1 flex-col lg:h-[100vh] max-h-full items-center lg:items-end md:gap-[70px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-0 md:px-5 gap-[35px]">
            {/* Cover photo section */}
            <div className="flex w-[92%] justify-end rounded-[20px] pb-2 bg-[#f6f6f6] md:w-full">
              <div className="flex w-full flex-col self-stretch gap-2.5">
                <div className="flex flex-col items-center justify-center gap-2 rounded-tl-[20px] rounded-tr-[20px] bg-[#750015] p-10 sm:p-5">
                  <Img src="images/cover-photo-bg.svg" alt="Add Cover" className="h-[60px] w-[60px]" />
                  <Text as="h4" className="text-[28px] font-semibold text-white md:text-[26px] sm:text-[24px]">
                    Add a Cover Photo
                  </Text>
                </div>
                <div className="relative ml-4 mt-[-46px] w-[120px] h-[120px] rounded-[50%] border-[5px] border-[#ffdbe2] bg-white">
                  {loggedInUser?.username === username ? (
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
                              src={getProfilePic()}
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
                      src={getProfilePic()}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* University name and stats */}
                <div className="mx-3.5 ml-4 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-[7px]">
                    <Heading size="h3_semibold" as="h1" className="text-[28px] font-semibold md:text-[26px] sm:text-[24px]">
                      {getDisplayName()}
                    </Heading>
                    {isVerified() && (
                        <Img 
                          src="images/vectors/verified.svg" 
                          alt="Verified" 
                          className="h-[16px] w-[16px]" 
                        />
                      )}
                  </div>
                  <Text as="p" className="text-[16px] font-normal text-gray-600">
                    {getBio()}
                  </Text>
                  <div className="flex flex-wrap gap-6">
                    {profileUser?.profile_type === 'organization' && (
                      <Text as="p" className="text-[16px] font-normal">
                        <span className="font-semibold">{getFollowersCount()}</span> Followers
                      </Text>
                    )}
                    <Text as="p" className="text-[16px] font-normal">
                      <span className="font-semibold">{getFollowingCount()}</span> Following
                    </Text>
                  </div>
                  <Text as="p" className="hidden text-[12px] font-normal text-black">
                    Followed by Mahmud and 1,000 others
                  </Text>
                </div>
              </div>
              <div className="h-px bg-[#d9d9d9]" />
            </div>

            {/* Posts Section */}
            {profileUser?.profile?.user?.username && token && (
              <Posts
                posts={posts}
                setPosts={setPosts}
                token={token}
                currentUser={{ username: profileUser.profile.user.username }}
              />
            )}
          </div>

          {/* Profile Side Panel */}
          <div className="hidden lg:flex flex-col max-w-[35%] gap-8 mt-[72px] mb-8">
                <div className="rounded-[32px] border border-solid border-[#d9d9d9] bg-white">
                  <ProfileOrganizationSection />
                </div>
                <div className="rounded-[32px] border border-solid overflow-hidden h-[60vh] border-[#d9d9d9] bg-white px-[22px] py-5">
                   <WhoToFollowSidePanel /> 
                </div>
            </div>
            
        </div>

        <BottomNav onComplete={handleNavigation} currentPage="user-profile" />
      </div>
    </div>
  );
}
