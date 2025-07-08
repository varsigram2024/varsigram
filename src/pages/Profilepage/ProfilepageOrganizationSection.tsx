import React, { Suspense, useState, useEffect } from "react";
import { Text } from "../../components/Text";
import { Img } from "../../components/Img";
import { Button } from "../../components/Button/index";
import { Input } from "../../components/Input/index";
import { CloseSVG } from "../../components/Input/close";
import "../../styles/style.css"
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import { ClickableUser } from "../../components/ClickableUser";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface FollowingUser {
  id: string;
  username: string;
  display_name?: string;
  profile_pic_url?: string;
  organization?: {
    display_name_slug: string;
    organization_name?: string;
  };
  user?: {
    display_name?: string;
    profile_pic_url?: string;
  };
}

export default function ProfileOrganizationSection() {
  const [searchBarValue1, setSearchBarValue1] = useState("");
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<{ account_type: string, id: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({ account_type: response.data.profile_type, id: response.data.profile.id });
      } catch (error) {
        setProfile(null);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!profile) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/following/?follower_type=${profile.account_type}&follower_id=${profile.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing(response.data);
      } catch (error) {
        setFollowing([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (token && profile) fetchFollowing();
  }, [token, profile]);

  // Filter following based on search
  const filteredFollowing = following.filter(user => {
    const searchTerm = searchBarValue1.toLowerCase();
    const displayName = user.organization?.organization_name || user.user?.display_name || user.display_name || user.username || '';
    const username = user.username || '';
    
    return displayName.toLowerCase().includes(searchTerm) || 
           username.toLowerCase().includes(searchTerm);
  });

  const handleUserClick = (user: FollowingUser) => {
    const displayNameSlug = user.organization?.display_name_slug || user.username;
    if (displayNameSlug) {
      navigate(`/user-profile/${displayNameSlug}`);
    }
  };

  return (
    <div className="mt-5 py-5 sm:px-5">
      <Input
        name="search_six"
        placeholder="Search"
        value={searchBarValue1}
        onChange={(e) => setSearchBarValue1(e.target.value)}
        prefix={<Img src="/images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
        suffix={
          searchBarValue1?.length > 0 ? (
            <CloseSVG onClick={() => setSearchBarValue1("")} fillColor="gray_800" />
          ) : null
        }
        className="ml-[2px] mr-1 flex w-full h-[48px] items-start justify-start gap-2.5 rounded-[24px] border-[2px] border-solid border-[#e6e6e699] text-[14px] text-[#3a3a3a]"
      />

      <div className="ml-5 mt-3 flex flex-col items-start gap-5 md:ml-0">
        <Text as="p" className="text-[24px] font-medium md:text-[22px]">Accounts you follow</Text>
        <div className="mb-2 self-stretch h-[30vh]">
          <div className="mr-[30px] flex flex-col gap-4 h-full md:mr-0 overflow-auto scrollbar-hide">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#750015]"></div>
              </div>
            ) : filteredFollowing.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 text-center">
                <Text as="p" className="text-[14px] font-normal text-[#adacb2]">
                  {searchBarValue1 ? 'No matching accounts found' : 'You are not following anyone yet'}
                </Text>
              </div>
            ) : (
              filteredFollowing.map((user, index) => {
                // Determine display name
                const displayName =
                  user.organization?.organization_name ||
                  user.user?.display_name ||
                  user.display_name ||
                  user.username ||
                  'Unknown User';

                // Determine profile picture
                const profilePicUrl =
                  user.organization?.profile_pic_url ||
                  user.user?.profile_pic_url ||
                  user.profile_pic_url ||
                  "/images/user.png";

                // Determine slug for navigation
                const displayNameSlug =
                  user.organization?.display_name_slug ||
                  user.user?.display_name_slug ||
                  user.display_name_slug ||
                  user.username;

                // Determine username for display (for @username)
                const atUsername =
                  user.organization?.display_name_slug ||
                  user.user?.display_name_slug ||
                  user.display_name_slug ||
                  user.username;

                return (
                  <div
                    key={`${user.id}-${index}`}
                    onClick={() => {
                      if (displayNameSlug) {
                        navigate(`/user-profile/${displayNameSlug}`);
                      }
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Img
                        src={profilePicUrl}
                        alt={displayName}
                        className="h-[40px] w-[40px] rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text as="p" className="text-[14px] font-medium text-gray-900 truncate">
                        {displayName}
                      </Text>
                      <Text as="p" className="text-[12px] font-normal text-gray-500 truncate">
                        @{atUsername}
                      </Text>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}