import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "../../components/Text/index.tsx";
import { Img } from "../../components/Img/index.tsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface User {
  // Common fields
  email: string;
  display_name_slug?: string; // Always present in full profile, may be missing in search results
  is_verified?: boolean;
  is_following?: boolean;
  profile_pic_url?: string;
  username?: string;
  bio?: string;
  exclusive?: boolean;

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

  // New fields
  id: number;
  account_type: "student" | "organization";
  type?: "student" | "organization";
  user_id?: number;

  follower_count?: number;
  mutual_connections?: number;
}

interface FollowingItem {
  followee_organization?: {
    display_name_slug: string;
    organization_name: string;
    user: {
      email: string;
      profile_pic_url?: string;
      // add other fields if needed
    };
    bio?: string;
    id?: number;
  };
  followee_student?: {
    display_name_slug: string;
    name: string;
    user: {
      email: string;
      profile_pic_url?: string;
      // add other fields if needed
    };
    bio?: string;
    id?: number;
  };
  user: {
    email: string;
    profile_pic_url?: string;
    // add other fields if needed
  };
  // add other fields if needed
}

export default function Connectionspage() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'following' | 'followers'>('forYou');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState<FollowingItem[]>([]);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);


    const handleSearch = async (query: string) => {
  if (!token || !query.trim()) {
    setSearchResults([]);
    return;
  }
  
  setIsSearching(true);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/search/?query=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSearchResults(response.data.results);
  } catch (error) {
    console.error('Search error:', error);
    toast.error('Search failed');
  } finally {
    setIsSearching(false);
  }
};

  const fetchFollowing = async () => {
    if (!token || !user) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/following/?follower_type=${user.account_type}&follower_id=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowing(response.data);

  // Fetch recommended users from who-to-follow endpoint
      const usersResponse = await axios.get(`${API_BASE_URL}/who-to-follow/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Map the response according to API documentation
      const mappedUsers = usersResponse.data.map((item: any) => ({
        ...item,
        account_type: item.type,
        type: item.type,
        user_id: item.user_id,
        // ...other fields
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFollowing([]);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowers = async () => {
  if (!token || !user) return;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/followers/?followee_type=${user.account_type}&followee_id=${user.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFollowers(response.data);
  } catch (error) {
    console.error('Error fetching followers:', error);
  }
};

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetchFollowing();
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'following' && token && user) {
      setIsFollowingLoading(true);
      fetchFollowing().finally(() => setIsFollowingLoading(false));
    }
  }, [activeTab, token, user]);

  const handleFollow = async (userToFollow: User) => {
    if (!user || !token) {
      toast.error('Please login to follow users.');
      return;
    }
    try {
      const follower_type = user.account_type;
      const follower_id = user.id;
      const followee_type = userToFollow.type;
      const followee_id = userToFollow.user_id;

  // Optimistic UI update: mark user as following locally
  setUsers(prev => prev.map(u => u.user_id === userToFollow.user_id ? { ...u, is_following: true } : u));

      await axios.post(
        `${API_BASE_URL}/users/follow/`,
        { follower_type, follower_id, followee_type, followee_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully followed');
      // Remove from Who to Follow list
  setUsers(prevUsers => prevUsers.filter(u => u.user_id !== userToFollow.user_id));
  // Optionally add to following list client-side
  setFollowing(prev => [...prev, { user: { email: userToFollow.email, profile_pic_url: userToFollow.profile_pic_url }, followee_student: userToFollow.type === 'student' ? { id: userToFollow.user_id, name: userToFollow.name, display_name_slug: userToFollow.display_name_slug, user: { email: userToFollow.email, profile_pic_url: userToFollow.profile_pic_url }, bio: userToFollow.bio } : undefined, followee_organization: userToFollow.type === 'organization' ? { id: userToFollow.user_id, organization_name: userToFollow.organization_name, display_name_slug: userToFollow.display_name_slug, user: { email: userToFollow.email, profile_pic_url: userToFollow.profile_pic_url }, bio: userToFollow.bio } : undefined } as any]);
  // Optionally, you can also add to following state if you want instant UI update in "Following" tab
    } catch (error: any) {
      console.error('Follow error:', error?.response?.data || error);
  // rollback optimistic update
  setUsers(prev => prev.map(u => u.user_id === userToFollow.user_id ? { ...u, is_following: false } : u));
  toast.error('Failed to follow');
    }
  };
  
  const handleUnfollow = async (userToUnfollow: User) => {
    if (!user || !token) {
      toast.error('Please login to unfollow users.');
      return;
    }
    try {
      const follower_type = user.account_type;
      const follower_id = user.id;
      const followee_type = userToUnfollow.type || userToUnfollow.account_type;
      const followee_id = userToUnfollow.user_id;

      await axios.post(
        `${API_BASE_URL}/users/unfollow/`,
        { follower_type, follower_id, followee_type, followee_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Successfully unfollowed');
      // Remove from Following list
      setFollowing(prevFollowing =>
        prevFollowing.filter(f => {
          const followeeOrg = f.followee_organization;
          const followeeStudent = f.followee_student;
          // prefer followee.id if available, otherwise try followee.user.id
          const followeeId = followeeOrg?.id ?? followeeStudent?.id;
          return followeeId !== userToUnfollow.user_id;
        })
      );

  // Optimistic: mark user in users array as not following if present
  setUsers(prev => prev.map(u => u.user_id === userToUnfollow.user_id ? { ...u, is_following: false } : u));
    } catch (error: any) {
      console.error('Unfollow error:', error?.response?.data || error);
      toast.error('Failed to unfollow');
    }
  };

  const handleUserClick = async (user: User) => {
  const displayNameSlug = user.display_name_slug;
  if (displayNameSlug) {
    try {
      // Fetch full profile data
      const response = await axios.get(
        `${API_BASE_URL}/profile/${displayNameSlug}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Navigate with full data or use it for a preview modal
      navigate(`/user-profile/${displayNameSlug}`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    }
  } else {
    toast.error('User profile not found');
  }
};




  const followedIds = new Set(following.map(f => {
    const followeeOrg = f.followee_organization;
    const followeeStudent = f.followee_student;
    const followee = followeeOrg || followeeStudent;
    if (!followee) return null;
    return followee?.id;
  }));
  const filteredUsers = users.filter(user => !followedIds.has(user.user_id || user.id));
 

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative h-auto animate-fade-in">

      

      <div className="flex w-full lg:w-[100%] items-start justify-center h-[100vh] flex-row animate-slide-up">
        <div className="mt-[0px] lg:mt-[0px] flex flex-1 flex-col gap-[45px] md:flex-col md:self-stretch overflow-y-auto h-[100vh] scrollbar-hide">
          <div className="w-full flex-1 flex gap-5 flex-col px-4 py-4 overflow-hidden">

            <div className="mt-5 lg:hidden flex flex-row justify-between animate-fade-in">
              <div 
                  onClick={() => {
                    const displayNameSlug = user?.display_name_slug || user?.username || user?.email?.split('@')[0];
                    navigate(`/user-profile/${displayNameSlug}`);
                  }}  
                  className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Img 
                  src={user?.profile_pic_url && user?.profile_pic_url.startsWith('http')
                    ? user?.profile_pic_url
                    : "images/user.png"} 
                  alt="Profile" 
                  className="h-[32px] w-[32px] rounded-[50%]" 
                />
              </div>

              <div>
                <Text className="font-semibold text-xl">Connections</Text>
              </div>

              <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <Img src="images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />
                </div>
            </div>

            <div className="lg:mt-5 flex justify-between animate-slide-up">
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
          
            <div className="relative w-full h-full overflow-y-auto scrollbar-hide">
              {isLoading && activeTab === 'forYou' ? (
                <div className="flex justify-center items-center h-40 animate-fade-in">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : activeTab === 'forYou' ? (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff] animate-fade-in">
                  {/* Top two featured cards (department matches) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
                    {filteredUsers.slice(0, 2).map((user, idx) => (
                      <div
                        key={`featured-${user.id}-${idx}`}
                        className="bg-[#f8f8f8] rounded-[14px] p-4 shadow-sm flex flex-col items-center text-center cursor-pointer hover:opacity-90"
                        onClick={() => handleUserClick(user)}
                      >
                        <Img
                          src={user.profile_pic_url && user.profile_pic_url.startsWith('http') ? user.profile_pic_url : 'images/user.png'}
                          alt={user.organization_name || user.name || user.email}
                          className="h-[72px] w-[72px] rounded-[50%] object-cover mb-3"
                        />
                        <Text className="font-semibold text-lg">{user.organization_name || user.name}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{user.bio || 'No bio available'}</Text>
                             <Text className="text-xs text-gray-400 mt-1">
                              {user.account_type === 'organization' ? 
                                (user.exclusive ? 'Exclusive organization' : 'Verified organization') :
                                (user.department ? `${user.department} student` : 'Student')}
                            </Text>
                        <button
                          onClick={(e) => { e.stopPropagation(); user.is_following ? handleUnfollow(user) : handleFollow(user); }}
                          className={`mt-4 px-6 py-2 rounded-full transition-colors ${user.is_following ? 'bg-gray-400 text-gray-600' : 'bg-[#750015] text-white'}`}
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* See all row */}
                  <div className="w-full flex justify-center mb-4">
                    <button
                      onClick={() => setShowAll(s => !s)}
                      className="w-[95%] md:w-[90%] bg-white border rounded-full py-2 flex items-center justify-center text-sm text-gray-700"
                    >
                      {showAll ? 'Show less' : 'See all'}
                      <Img src="images/vectors/arrow-right.svg" alt="arrow" className="h-4 w-4 ml-2" />
                    </button>
                  </div>

                  {/* Other departments grid 2x2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {(showAll ? filteredUsers.slice(2) : filteredUsers.slice(2, 6)).map((user, idx) => (
                      <div
                        key={`grid-${user.id}-${idx}`}
                        className="bg-[#f8f8f8] rounded-[12px] p-4 shadow-sm flex flex-col items-center text-center relative cursor-pointer hover:opacity-90"
                        onClick={() => handleUserClick(user)}
                      >
                        {/* department badge if available in faculty/department */}
                        {user.department && (
                          <div className="absolute left-3 top-3 bg-[#f3e9e9] text-[#8b5a5a] px-2 py-1 rounded-full text-xs">
                            {`${user.department} department`}
                          </div>
                        )}
                        <Img
                          src={user.profile_pic_url && user.profile_pic_url.startsWith('http') ? user.profile_pic_url : 'images/user.png'}
                          alt={user.organization_name || user.name || user.email}
                          className="h-[64px] w-[64px] rounded-[50%] object-cover mb-3"
                        />
                        <Text className="font-semibold text-md">{user.organization_name || user.name}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{user.bio || 'No bio available'}</Text>
                                                  
                            {user.department && user.department === user?.department && (
                              <div className="text-xs text-green-600 mt-1">Same department</div>
                            )}
                            {user.faculty && user.faculty === user?.faculty && (
                              <div className="text-xs text-blue-600 mt-1">Same faculty</div>
                            )}
                            
                        <button
                          onClick={(e) => { e.stopPropagation(); user.is_following ? handleUnfollow(user) : handleFollow(user); }}
                          className={`mt-4 px-6 py-2 rounded-full transition-colors ${user.is_following ? 'bg-gray-400 text-gray-600' : 'bg-[#750015] text-white'}`}
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isFollowingLoading ? (
                <div className="flex justify-center items-center h-40 animate-fade-in">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#750015]"></div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center md:w-full p-5 mb-6 rounded-xl bg-[#ffffff] animate-fade-in">
                  {following.length === 0 ? (
                    <Text>No accounts followed yet.</Text>
                  ) : (
                    following.map((f, idx) => {
                      const followeeOrg = f.followee_organization;
                      const followeeStudent = f.followee_student;
                      const followee = followeeOrg || followeeStudent;
                      if (!followee) return null;
                      const userInfo = followeeOrg ? followeeOrg.user : followeeStudent ? followeeStudent.user : null;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between w-full py-4 border-b border-gray-100 last:border-b-0 animate-slide-up"
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              // For organizations
                              if (followeeOrg) {
                                navigate(`/user-profile/${followeeOrg.display_name_slug}`);
                              }
                              // For students
                              else if (followeeStudent) {
                                navigate(`/user-profile/${followeeStudent.display_name_slug}`);
                              }
                            }}
                          >
                            <Img
                              src={userInfo?.profile_pic_url && userInfo.profile_pic_url.startsWith('http')
                                ? userInfo.profile_pic_url
                                : "images/user.png"}
                              alt={followeeOrg?.organization_name || followeeStudent?.name || "No name"}
                              className="h-[48px] w-[48px] rounded-[50%] object-cover"
                            />
                            <div className="flex flex-col"> 
                              <div className="flex items-center gap-1">
                                <Text className="font-semibold hover:underline">
                                  {followeeOrg?.organization_name || followeeStudent?.name || "No name"}
                                </Text>
                              </div>
                              <Text className="text-sm text-gray-500">
                                {(followeeOrg?.bio || followeeStudent?.bio) ?? "No Bio"}
                              </Text>
                            </div>
                          </div>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              // Create a proper user object for unfollow
                              const id = followeeOrg?.id ?? followeeStudent?.id;
                              if (typeof id !== "number") {
                                toast.error("Invalid user id for unfollow.");
                                return;
                              }
                              const userToUnfollow = {
                                id,
                                user_id: followeeOrg?.id ?? followeeStudent?.id,
                                type: (followeeOrg ? "organization" : "student") as "organization" | "student",
                                email: userInfo?.email || "",
                                profile_pic_url: userInfo?.profile_pic_url || "",
                                account_type: (followeeOrg ? "organization" : "student") as "organization" | "student",
                                display_name_slug: followeeOrg?.display_name_slug || followeeStudent?.display_name_slug,
                                organization_name: followeeOrg?.organization_name,
                                name: followeeStudent?.name,
                                bio: followeeOrg?.bio || followeeStudent?.bio,
                              };
                              await handleUnfollow(userToUnfollow);
                            }}
                            className="px-4 py-2 rounded-full bg-gray-400 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Unfollow
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <BottomNav /> */}
    </div>
  );
}
