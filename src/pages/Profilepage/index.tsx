import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "./ProfilepageOrganizationSection.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";
import Posts from "../../components/Posts/index.tsx";
import { useAuth } from "../../auth/AuthContext";

// Add interface for props
interface ProfilepageOrganizationProps {
  onComplete: (page: string) => void;
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
export default function ProfilepageOrganizationPage({ onComplete }: ProfilepageOrganizationProps) {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        console.log('Fetching posts for user:', user?.id);
        const response = await axios.get(`https://api.varsigram.com/api/v1/posts/user/${user?.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Posts response:', response.data);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        toast.error('Failed to fetch posts. Please try again later.');
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id && token) {
      console.log('User ID and token available:', { userId: user.id, hasToken: !!token });
      fetchUserPosts();
    } else {
      console.log('Missing user ID or token:', { userId: user?.id, hasToken: !!token });
      setIsLoading(false);
    }
  }, [user?.id, token]);

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
      
      console.log('Full API Response:', response.data);
      
      if (updateUser && response.data) {
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
          updateUser(userData);
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
          updateUser(userData);
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

  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-100">
      <div className="flex w-full items-start justify-center bg-white">
        <Sidebar1 onComplete={onComplete} currentPage="user-profile" />

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
                          src={user?.profile_pic_url || 'images/user.png'}
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
                </div>

                {/* University name and stats */}
                <div className="mx-3.5 ml-4 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-[7px]">
                    <Heading size="h3_semibold" as="h1" className="text-[28px] font-semibold md:text-[26px] sm:text-[24px]">
                    {user?.username || user?.fullName || 'User'}
                    </Heading>
                    {user?.is_verified && (
                        <Img 
                          src="images/vectors/verified.svg" 
                          alt="Verified" 
                          className="h-[16px] w-[16px]" 
                        />
                      )}
                  </div>
                  <Text as="p" className="text-[16px] font-normal text-gray-600">
                    {user?.bio || 'Add bio'}
                  </Text>
                  <div className="flex flex-wrap gap-6">
                    {user?.account_type === 'organization' && (
                      <Text as="p" className="text-[16px] font-normal">
                        <span className="font-semibold">{user?.followers_count || 0}</span> Followers
                      </Text>
                    )}
                    <Text as="p" className="text-[16px] font-normal">
                      <span className="font-semibold">{user?.following_count || 0}</span> Following
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
            {user?.username && token && (
              <Posts
                posts={posts}
                setPosts={setPosts}
                token={token}
                currentUser={{ username: user.username }}
              />
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
                    {/* <UserProfile1 />
                    <UserProfile1 /> */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-start gap-[7px]">
                          <Text as="p" className="text-[16px] font-normal">
                            Faculty of Arts Student<br />Association
                          </Text>
                          <Img src="images/vectors/verified.svg" alt="Verified" className="h-[16px] w-[16px] mt-0.5" />
                        </div>
                        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">13.8K followers</Text>
                      </div>
                      <Text as="p" className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white">
                        Follow
                      </Text>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        <BottomNav onComplete={onComplete} currentPage="user-profile" />
      </div>
    </div>
  );
}
