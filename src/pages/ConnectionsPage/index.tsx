import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

interface User {
  email: string;
  name?: string;
  organization_name?: string;
  department?: string;
  faculty?: string;
  is_verified: boolean;
  is_following: boolean;
}

interface ConnectionspageProps {
  onComplete: (page: string) => void;
}

export default function Connectionspage({ onComplete }: ConnectionspageProps) {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const fetchUsers = async () => {
    let usersResponse;
    try {
      if (!token) {
        toast.error('Please login to view connections');
        return;
      }

      // First get all users
      usersResponse = await axios.get('https://api.varsigram.com/api/v1/users/search/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Get current user's email from the first user in the response
      const currentUserEmail = usersResponse.data[0]?.email;
      if (!currentUserEmail) {
        setUsers(usersResponse.data);
        return;
      }

      // Then get the current user's following list
      const followingResponse = await axios.get(`https://api.varsigram.com/api/v1/users/${currentUserEmail}/following/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Create a set of followed usernames for quick lookup
      const followingSet = new Set(followingResponse.data.map((user: any) => user.email));

      // Mark users as followed if they're in the following list
      const usersWithFollowingStatus = usersResponse.data.map((user: any) => ({
        ...user,
        is_following: followingSet.has(user.email)
      }));

      setUsers(usersWithFollowingStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (usersResponse) {
        setUsers(usersResponse.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleFollow = async (email: string) => {
    try {
      const username = email.split('@')[0];

      await axios.post(
        `https://api.varsigram.com/api/v1/users/${username}/follow/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Update the users list to mark the user as followed
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.email === email 
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

  const handleUnfollow = async (email: string) => {
    try {
      const username = email.split('@')[0];

      await axios.delete(
        `https://api.varsigram.com/api/v1/users/${username}/unfollow/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Update the users list to mark the user as unfollowed
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.email === email 
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

  const filteredUsers = activeTab === 'following' 
    ? users.filter(user => user.is_following)
    : users;

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto overflow-hidden">
      <Sidebar1 onComplete={onComplete} currentPage="connections" />

      <div className="flex w-full lg:w-[85%] items-start justify-center h-[100vh] flex-row">
        <div className="mt-[0px] lg:mt-[0px] flex flex-1 items-center justify-center gap-[45px] md:flex-col md:self-stretch overflow-scroll scrollbar-hide"> 
          <div className="w-full md:w-full lg:mt-[30px] flex lg:flex-1 flex-col lg:h-[100vh] max-h-full md:gap-[35px] lg:overflow-auto scrollbar-hide sm:gap-[52px] px-3 md:px-5 gap-[35px] pb-20 lg:pb-0">
           

          <div className="mt-5 lg:hidden flex flex-row justify-between">
              <div 
                  onClick={() => onComplete('user-profile')} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img src="images/user-image.png" alt="File" className="h-[32px] w-[32px] rounded-[50%]" />
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
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
                  {filteredUsers.map((user) => (
                    <div key={user.email} className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <Img
                          src="images/user.png"
                          alt={user.name || user.organization_name || user.email}
                          className="h-[48px] w-[48px] rounded-[50%]"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Text className="font-semibold">{user.name || user.organization_name || user.email}</Text>
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
                        onClick={() => user.is_following ? handleUnfollow(user.email) : handleFollow(user.email)}
                        className={`px-4 py-2 rounded-full transition-colors ${
                          user.is_following 
                            ? 'bg-gray-400 text-gray-600 hover:bg-gray-200' 
                            : 'bg-[#750015] text-white hover:bg-[#8c0019]'
                        }`}
                      >
                        {user.is_following ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        


      </div>


      <BottomNav onComplete={onComplete} currentPage="connections" />
    </div>
  );
}
