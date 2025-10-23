// components/PostSkeleton/index.tsx
import React from "react";

export const PostSkeleton: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center p-5 mb-6 rounded-xl bg-[#ffffff]">
      <div className="flex flex-col gap-7 self-stretch">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>

        {/* Divider */}
        <div className="h-[0.6px] w-92 bg-gray-300"></div>

        {/* Content Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Media Skeleton */}
        <div className="grid grid-cols-2 gap-2">
          <div className="h-48 bg-gray-300 rounded-lg"></div>
          <div className="h-48 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};