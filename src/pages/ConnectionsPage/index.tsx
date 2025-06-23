import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "../../components/Input/SearchInput.tsx";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import { Input } from "../../components/Input/index.tsx";
import { Heading } from "../../components/Heading/index.tsx";
import { CloseSVG } from "../../components/Input/close.tsx";
import Sidebar1 from "../../components/Sidebar1/index.tsx";
import UserProfile1 from "../../components/UserProfile1/index.tsx";
import ProfileOrganizationSection from "../Profilepage/ProfilepageOrganizationSection.tsx";
import { Button } from "../../components/Button.tsx";
import CreateConversation from "../../modals/createCONVERSATION/index.tsx";
import BottomNav from "../../components/BottomNav/index.tsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/AuthContext';
import { ClickableUser } from "../../components/ClickableUser";

interface User {
  // Common fields
  email: string;
  display_name_slug?: string; // Always present in full profile, may be missing in search results
  is_verified?: boolean;
  is_following?: boolean;
  profile_pic_url?: string;
  username?: string;

  // Student-specific fields
  name?: string;
  faculty?: string;
  department?: string;
  year?: string;
  religion?: string;
  phone_number?: string;
  sex?: string;
  university?: string;
  date_of_birth?: string;

  // Organization-specific fields
  organization_name?: string;
}

interface FollowingItem {
  organization: {
    display_name_slug: string;
    organization_name: string;
  };
  user: {
    email: string;
    // add other fields if needed
  };
  // add other fields if needed
}

export default function Connectionspage() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      if (!token) {
        toast.error('Please login to view connections');
        return;
      }

      const usersResponse = await axios.get('https://api.varsigram.com/api/v1/users/search/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setUsers(usersResponse.data);
      console.log('who-to-follow output:', usersResponse.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'following' && token) {
      setIsFollowingLoading(true);
      axios.get('https://api.varsigram.com/api/v1/following/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setFollowing(response.data);
        console.log('Following fetched successfully:', response.data);
      })
      .catch(error => {
        console.error('Error fetching following:', error);
        setFollowing([]);
      })
      .finally(() => {
        setIsFollowingLoading(false);
      });
    }
  }, [activeTab, token]);

  const handleFollow = async (display_name_slug: string) => {
    try {
      const userSlug = display_name_slug || user?.email?.split('@')[0];
      await axios.post(
        `https://api.varsigram.com/api/v1/users/${userSlug}/follow/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.display_name_slug === display_name_slug
            ? { ...user, is_following: true }
            : user
        )
      );

      toast.success('Successfully followed user');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (display_name_slug: string) => {
    try {
      const userSlug = display_name_slug || user?.email?.split('@')[0];
      await axios.post(
        `https://api.varsigram.com/api/v1/users/${userSlug}/unfollow/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.display_name_slug === display_name_slug
            ? { ...user, is_following: false }
            : user
        )
      );

      toast.success('Successfully unfollowed user');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(`/${path}`);
  };

  const handleUserClick = (user: User) => {
    console.log('User object for navigation:', user);
    console.log('display_name_slug:', user.display_name_slug);
    console.log('username:', user.username);
    console.log('email:', user.email);
    
    // First try to get the proper display_name_slug
    const displayNameSlug = user.display_name_slug;
    
    if (displayNameSlug) {
      navigate(`/user-profile/${displayNameSlug}`);
    } else {
      // If display_name_slug is not in the response, we need to fetch it first
      axios.get(`https://api.varsigram.com/api/v1/users/search/?email=${user.email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        const userData = response.data[0]; // Assuming the first result is the user we want
        if (userData?.display_name_slug) {
          navigate(`/user-profile/${userData.display_name_slug}`);
        } else {
          toast.error('User profile not found');
        }
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user profile');
      });
    }
  };

  const filteredUsers = users; // For "Who to Follow" tab

  const fetchFollowers = async (displayNameSlug: string) => {
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

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="mt-[0px] lg:mt-[0px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch overflow-scroll scrollbar-hide"> 
          <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
           

          <div className="mt-5 lg:hidden flex flex-row justify-between">
              <div 
                  onClick={() => {
                    const displayNameSlug = user?.display_name_slug || user?.username || user?.email?.split('@')[0];
                    navigate(`/user-profile/${displayNameSlug}`);
                  }}  
                  className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img 
                  src={user?.profile_pic_url || "images/user.png"} 
                  alt="Profile" 
                  className="h-[32px] w-[32px] rounded-[50%]" 
                />
              </div>

              <div>
                <Text className="font-semibold text-xl">Connections</Text>
              </div>

              <div>
                <Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />
              </div>

            </div>


            <div className="lg:mt-5 flex justify-between">
              <div 
                className={`flex px-3 cursor-pointer ${activeTab === 'forYou' ? 'border-b-2 border-solid border-[#750015]' : ''}`}
                onClick={() => setActiveTab('forYou')}
              >
                <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'forYou' ? '' : '!text-[#adacb2]'}`}>
                Who to Follow
                </Text>
              </div>
              <div 
                className={`flex border-b-2 border-solid px-1.5 cursor-pointer ${activeTab === 'following' ? 'border-[#750015]' : 'border-transparent'}`}
                onClick={() => setActiveTab('following')}
              >
                <Text as="p" className={`text-[14px] font-medium md:text-[22px] ${activeTab === 'following' ? '' : '!text-[#adacb2]'}`}>
                  Following
                </Text>
              </div>
            </div>
          


            

            

            

            <div className="relative w-full">
              {isLoading && activeTab === 'forYou' ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : activeTab === 'forYou' ? (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                  {filteredUsers.map((user) => {
                    console.log('Full user object:', user);
                    return (
                      <div key={user.email} className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0">
                        <div 
                          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleUserClick(user)}
                        >
                          <Img
                            src="images/user.png"
                            alt={user.name || user.organization_name || user.email}
                            className="h-[48px] w-[48px] rounded-[50%]"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Text className="font-semibold hover:underline">
                                {user.name || user.organization_name || user.email}
                              </Text>
                              <Img
                                src="images/vectors/verified.svg"
                                alt="verified"
                                className="h-[16px] w-[16px]"
                              />
                            </div>
                            <Text className="text-sm text-gray-500">{user.email}</Text>
                            {(user.department || user.faculty) && (
                              <Text className="text-sm text-gray-500">
                                {user.department && `${user.department}`}
                                {user.department && user.faculty && ' • '}
                                {user.faculty && `${user.faculty}`}
                              </Text>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            user.is_following
                              ? handleUnfollow(user.display_name_slug)
                              : handleFollow(user.display_name_slug);
                          }}
                          className={`px-4 py-2 rounded-full transition-colors ${
                            user.is_following 
                              ? 'bg-gray-400 text-gray-600 hover:bg-gray-200' 
                              : 'bg-[#750015] text-white hover:bg-[#8c0019]'
                          }`}
                        >
                          {user.is_following ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : isFollowingLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                  {following.length === 0 ? (
                    <Text>No accounts followed yet.</Text>
                  ) : (
                    following.map((item: FollowingItem, idx) => (
                      <div
                        key={item.organization?.display_name_slug || idx}
                        className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                          <Img
                            src="images/user.png"
                            alt={item.organization?.organization_name || "Organization"}
                            className="h-[48px] w-[48px] rounded-[50%]"
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Text className="font-semibold hover:underline">
                                {item.organization?.organization_name || "No name"}
                              </Text>
                            </div>
                            <Text className="text-sm text-gray-500">
                              {item.user?.email || "No email"}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        


      </div>


      <BottomNav />
    </div>
  );
}