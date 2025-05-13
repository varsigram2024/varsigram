// CLEANED AND FIXED: components/UserProfile1.tsx

import React from "react";
import { Button } from "../Button/index";
import { Img } from "../Img";
import { Text } from "../Text";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  userTitle?: React.ReactNode;
  userFollowers?: React.ReactNode;
  userImage?: string;
}

export default function UserProfile1({
  className = "",
  userTitle,
  userFollowers,
  userImage,
  ...props
}: Props) {
  return (
    <div {...props} className={`${className} flex flex-1 items-center justify-center self-stretch`}>
      <div className="flex flex-1 items-start">
        <div className="flex flex-col items-start gap-1 self-center">
          {!!userTitle && (
            <Text as="p" className="text-[16px] font-normal">
              {userTitle}
            </Text>
          )}
          {!!userFollowers && (
            <Text as="p" className="text-[14px] font-medium text-[#adacb2]">
              {userFollowers}
            </Text>
          )}
        </div>
        {!!userImage && (
          <Img src={userImage} alt="Image" className="h-[16px] w-[16px]" />
        )}
      </div>

      <Button variant="fill" shape="round" className="min-w-[78px] rounded px-3.5">
        Follow
      </Button>
    </div>
  );
}
