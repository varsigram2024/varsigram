import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../Input";
import { Img } from "../Img";
import { Text } from "../Text";
import { CloseSVG } from "../Input/close";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name?: string;
  organization_name?: string;
  display_name_slug: string;
  is_verified?: boolean;
  is_following?: boolean;
  profile_pic_url?: string;
  followers_count?: number;
  // Optionally, add type: 'student' | 'organization';
}

export default function WhoToFollowSidePanel() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user } = useAuth();
  const [loadingName, setLoadingName] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!user) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://api.varsigram.com/api/v1/who-to-follow/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    const usersWithoutName = users.filter(user => !user.name && !user.organization_name);
    if (usersWithoutName.length > 0) {
      console.warn("Users without name or organization_name:", usersWithoutName);
    }
  }, [users]);

  const handleFollow = async (userToFollow: User) => {
    setLoadingName(userToFollow.display_name_slug);
    const requestBody = {
      follower_type: user?.account_type,
      follower_id: Number(user?.id),
      followee_type: userToFollow.organization_name ? "organization" : "student",
      followee_id: userToFollow.id,
    };
    console.log("Follow request body:", requestBody);
    try {
      await axios.post(
        "https://api.varsigram.com/api/v1/users/follow/",
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.filter((u) => u.id !== userToFollow.id));
      toast.success("Followed!");
    } catch (error: any) {
      if (error.response) {
        console.error("Follow error response:", error.response.data);
        toast.error(error.response.data?.error || "Failed to follow user");
      } else {
        console.error("Follow error:", error);
        toast.error("Failed to follow user");
      }
    } finally {
      setLoadingName(null);
    }
  };

  const handleUnfollow = async (user: User) => {
    try {
      await axios.post(
        "https://api.varsigram.com/api/v1/users/unfollow/",
        {
          follower_type: user.organization_name ? "organization" : "student",
          follower_id: user.id,
          followee_type: user.organization_name ? "organization" : "student",
          followee_id: user.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Unfollowed!");
    } catch (error) {
      toast.error("Failed to unfollow user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || user.organization_name || "")
        .toLowerCase()
        .includes(searchBarValue.toLowerCase())
  );

  return (
    <div className="">
      <Input
        name="search_who_to_follow"
        placeholder="Search Varsigram"
        value={searchBarValue}
        onChange={(e) => setSearchBarValue(e.target.value)}
        prefix={<Img src="/images/vectors/search.svg" alt="Search" className="h-[20px] w-[20px]" />}
        suffix={
          searchBarValue?.length > 0 ? (
            <CloseSVG onClick={() => setSearchBarValue("")} fillColor="gray_800" />
          ) : null
        }
        className="flex h-[48px] items-center rounded-[24px] border-[1.5px] border-[#e6e6e699] pl-[22px] pr-3 text-[14px] text-[#3a3a3a]"
      />

      <Text as="p" className="mt-5 text-[24px] font-medium md:text-[22px]">
        Who to follow
      </Text>
      <div className="my-3 flex flex-col gap-5 h-full overflow-auto scrollbar-hide">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          filteredUsers
            .filter(user => !!user.name || !!user.organization_name)
            .map((user) => {
              const displayName = user.organization_name || user.name || "";
              return (
                <div className="flex items-center justify-between" key={displayName}>
                  <div className="flex flex-col">
                    <div className="flex items-start gap-[7px]">
                      <Text
                        as="p"
                        className="text-[16px] font-normal cursor-pointer"
                        onClick={() => {
                          // Navigate to profile using displayName as slug
                          navigate(`/user-profile/${user.display_name_slug}`);
                        }}
                      >
                        {displayName}
                      </Text>
                      {/* {user.is_verified && (
                        <Img
                          src="/images/vectors/verified.svg"
                          alt="Verified"
                          className="h-[16px] w-[16px] mt-0.5"
                        />
                      )} */}
                    </div>
                    <Text as="p" className="text-[14px] font-medium text-[#adacb2]">
                      {user.followers_count ? `${user.followers_count} followers` : ""}
                    </Text>
                  </div>
                  {user.is_following ? (
                    <button
                      className="rounded bg-gray-300 px-3.5 py-0.5 text-[16px] font-normal text-black"
                      onClick={() => handleUnfollow(user)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white"
                      onClick={() => handleFollow(user)}
                      disabled={loadingName === user.display_name_slug}
                    >
                      {loadingName === user.display_name_slug ? "Following..." : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
