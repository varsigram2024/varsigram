import React from "react";
import { Button } from "../Button/index";
import { Text } from "../Text";
import { Img } from "../Img";


interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  userTitle?: React.ReactNode;
  verified?: string;
  userFollowers?: React.ReactNode;
}

export default function UserProfile({
  className = "",
  userTitle = "Dean of Students Affairs",
  verified,
  userFollowers,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${className} flex flex-1 items-center justify-center self-stretch flex-row`}
    >
      <div className="flex flex-1 flex-col items-start gap-1 sm:self-stretch">
        <div className="flex items-start gap-1.5 self-stretch w-auto max-w-[80%]">
          <Text as="p" className="text-[16px] w-auto font-normal leading-tight">
            {userTitle}
          </Text>
          {!!verified && (
            <Img src={verified} alt="Verified Icon" className="h-[16px] w-[16px] mt-0.5" />
          )}
        </div>


        {!!userFollowers && (
          <Text as="p" className="text-[14px] font-medium text-[#adacb2]">
            {userFollowers}
          </Text>
        )}
      </div>
      <Button shape="round" className="min-w-[82px] rounded border px-[3px]">
        Following
      </Button>
    </div>
  );
}