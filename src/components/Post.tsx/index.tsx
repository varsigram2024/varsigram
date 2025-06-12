// src/components/Post.tsx
import React from 'react';
import { Text } from '../Text';
import { Img } from '../Img';

interface PostProps {
  post: {
    id: string;
    author_username: string;
    content: string;
    slug: string;
    timestamp: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    has_liked: boolean;
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex w-full flex-col items-center md:w-full lg:w-full p-5 mb-6 rounded-xl bg-[#ffffff]">
      <div className="flex flex-col gap-7 self-stretch">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-5 md:flex-col">
            <div className="flex items-center">
              <div className="w-[32px] lg:w-[64px] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                <Img src="images/unilag-logo.png" alt="User Avatar" className="h-auto lg:h-[48px] w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col items-start px-4">
                <span className="flex items-center gap-1.5 self-stretch w-auto">
                  <Text as="p" className="text-[14px] font-extrabold md:text-[22px]">{post.author_username}</Text>
                  <Img src="images/vectors/verified.svg" alt="Verified Icon" className="h-[16px] w-[16px]" />
                </span>
                <Text as="p" className="mt-[-2px] text-[14px] font-normal text-[#adacb2]">
                  {formatTimestamp(post.timestamp)}
                </Text>
              </div>
            </div>
          </div>
          <div className="h-px bg-[#d9d9d9]" />
        </div>

        <Text size="body_large_regular" as="p" className="text-[12px] lg:text-[20px] font-normal leading-[30px]">
          {post.content}
        </Text>

        <div className="h-px bg-[#d9d9d9]" />

        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 lg:gap-2">
              <Img 
                src={post.has_liked ? "images/vectors/like-filled.svg" : "images/vectors/like.svg"} 
                alt="Likes" 
                className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" 
              />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">{post.like_count}</Text>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              <Img src="images/vectors/vers.svg" alt="Comments" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">{post.comment_count}</Text>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              <Img src="images/vectors/revers.svg" alt="Shares" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
              <Text as="p" className="text-[9px] lg:text-[14px] font-normal">{post.share_count}</Text>
            </div>
            <Img src="images/vectors/share.svg" alt="Share" className="h-[16px] w-[16px] lg:h-[32px] lg:w-[32px] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};