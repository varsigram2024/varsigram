import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../Input";
import { Img } from "../Img";
import { Text } from "../Text";
import { CloseSVG } from "../Input/close";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-hot-toast";

interface User {
  email: string;
  name?: string;
  organization_name?: string;
  is_verified?: boolean;
  is_following?: boolean;
  profile_pic_url?: string;
  followers_count?: number;
}

export default function WhoToFollowSidePanel() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

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

  const handleFollow = async (email: string) => {
    try {
      const username = email.split("@")[0];
      await axios.post(
        `https://api.varsigram.com/api/v1/users/${username}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.email === email ? { ...user, is_following: true } : user
        )
      );
      toast.success("Followed!");
    } catch {
      toast.error("Failed to follow user");
    }
  };

  const handleUnfollow = async (email: string) => {
    try {
      const username = email.split("@")[0];
      await axios.delete(
        `https://api.varsigram.com/api/v1/users/${username}/unfollow/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.email === email ? { ...user, is_following: false } : user
        )
      );
      toast.success("Unfollowed!");
    } catch {
      toast.error("Failed to unfollow user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || user.organization_name || "")
        .toLowerCase()
        .includes(searchBarValue.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchBarValue.toLowerCase())
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
          filteredUsers.map((user) => (
            <div className="flex items-center justify-between" key={user.email}>
              <div className="flex flex-col">
                <div className="flex items-start gap-[7px]">
                  <Text as="p" className="text-[16px] font-normal">
                    {user.organization_name || user.name || user.email}
                  </Text>
                  {user.is_verified && (
                    <Img
                      src="/images/vectors/verified.svg"
                      alt="Verified"
                      className="h-[16px] w-[16px] mt-0.5"
                    />
                  )}
                </div>
                <Text as="p" className="text-[14px] font-medium text-[#adacb2]">
                  {user.followers_count
                    ? `${user.followers_count} followers`
                    : ""}
                </Text>
              </div>
              {user.is_following ? (
                <Text
                  as="button"
                  className="rounded bg-gray-300 px-3.5 py-0.5 text-[16px] font-normal text-black"
                  onClick={() => handleUnfollow(user.email)}
                >
                  Unfollow
                </Text>
              ) : (
                <Text
                  as="button"
                  className="rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white"
                  onClick={() => handleFollow(user.email)}
                >
                  Follow
                </Text>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
