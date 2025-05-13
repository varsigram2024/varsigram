// CLEANED AND FIXED: components/UserProfile2.tsx

import React from "react";
import { Heading } from "../Heading";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  userImage?: string;
  userStatus?: React.ReactNode;
  userIcon?: string;
  userName?: string;
}

export default function UserProfile2({
  className = "",
  userImage,
  userStatus,
  userIcon,
  userName,
  ...props
}: Props) {
  return (
    <div {...props} className={`${className} flex flex-col items-center gap-0.5`}>
      <div className="self-stretch rounded-[26px] border border-solid border-[#ff6682]">
        <div className="flex items-center justify-center">
          <div className="relative z-[5] h-[48px] flex-1 rounded-[24px] bg-[#5b5b5b]">
            {!!userImage && (
              <Img
                src={userImage}
                alt="Image"
                className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[48px] w-full rounded-[24px] object-cover"
              />
            )}
            {!!userStatus && (
              <Heading
                size="headingsm"
                as="p"
                className="absolute right-[-3px] text-center top-[-1.79px] m-auto h-[10px] w-[10px] rounded-[5px] bg-[#ff6682] text-[8px] font-semibold text-white"
              >
                {userStatus}
              </Heading>
            )}
            {!!userIcon && (
              <Img
                src={userIcon}
                alt="Verified Icon"
                className="absolute bottom-0 right-0 m-auto h-[14px] w-[14px]"
              />
            )}
          </div>

          
        </div>
      </div>
      <Text as="p" className="text-[12px] font-normal">
      {userName}
      </Text>
    </div>
  );
}