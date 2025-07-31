// src/context/FeedContext.tsx
import React, { createContext, useContext, useState } from "react";

interface Post {
  id: string;
  author_id: string;
  author_username: string;
  author_profile_pic_url: string | null;
  content: string;
  slug: string;
  media_urls: string[];
  timestamp: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  has_liked: boolean;
  trending_score: number;
  last_engagement_at: string | null;
  author_display_name: string;
  author_name?: string;
}

interface FeedContextType {
  // Feed posts
  feedPosts: Post[];
  setFeedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  feedNextCursor: string | null;
  setFeedNextCursor: React.Dispatch<React.SetStateAction<string | null>>;
  feedHasMore: boolean;
  setFeedHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  feedScroll: number;
  setFeedScroll: React.Dispatch<React.SetStateAction<number>>;
  
  // Official posts
  officialPosts: Post[];
  setOfficialPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  officialNextCursor: string | null;
  setOfficialNextCursor: React.Dispatch<React.SetStateAction<string | null>>;
  officialHasMore: boolean;
  setOfficialHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  officialScroll: number;
  setOfficialScroll: React.Dispatch<React.SetStateAction<number>>;
  
  // Loading states
  isFeedLoading: boolean;
  setIsFeedLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isOfficialLoading: boolean;
  setIsOfficialLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Last fetch timestamps
  lastFeedFetch: number | null;
  setLastFeedFetch: React.Dispatch<React.SetStateAction<number | null>>;
  lastOfficialFetch: number | null;
  setLastOfficialFetch: React.Dispatch<React.SetStateAction<number | null>>;
}

const FeedContext = createContext<FeedContextType | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  // Feed posts state
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [feedNextCursor, setFeedNextCursor] = useState<string | null>(null);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const [feedScroll, setFeedScroll] = useState(0);
  const [isFeedLoading, setIsFeedLoading] = useState(false);
  const [lastFeedFetch, setLastFeedFetch] = useState<number | null>(null);
  
  // Official posts state
  const [officialPosts, setOfficialPosts] = useState<Post[]>([]);
  const [officialNextCursor, setOfficialNextCursor] = useState<string | null>(null);
  const [officialHasMore, setOfficialHasMore] = useState(true);
  const [officialScroll, setOfficialScroll] = useState(0);
  const [isOfficialLoading, setIsOfficialLoading] = useState(false);
  const [lastOfficialFetch, setLastOfficialFetch] = useState<number | null>(null);

  return (
    <FeedContext.Provider value={{
      feedPosts, setFeedPosts,
      feedNextCursor, setFeedNextCursor,
      feedHasMore, setFeedHasMore,
      feedScroll, setFeedScroll,
      isFeedLoading, setIsFeedLoading,
      lastFeedFetch, setLastFeedFetch,
      
      officialPosts, setOfficialPosts,
      officialNextCursor, setOfficialNextCursor,
      officialHasMore, setOfficialHasMore,
      officialScroll, setOfficialScroll,
      isOfficialLoading, setIsOfficialLoading,
      lastOfficialFetch, setLastOfficialFetch,
    }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}
