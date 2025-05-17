// CLEANED AND FIXED: components/Common4.tsx

import React from "react";
import { Img, Text, Heading } from "./..";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  umarabubakar?: React.ReactNode;
  ihopethisis?: React.ReactNode;
  p146k?: React.ReactNode;
  likes?: React.ReactNode;
  p21k?: React.ReactNode;
  vars?: React.ReactNode;
  p3ktwo?: React.ReactNode;
  revars?: React.ReactNode;
}

export default function Common4({
  className = "",
  umarabubakar = "Umar Abubakar",
  ihopethisis = "I hope this is done on time, so we can resume school physically.",
  p146k = "14.6K",
  likes = "Likes",
  p21k = "2.1K",
  vars = "Vars",
  p3ktwo = "3K",
  revars = "Revars",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${className} flex flex-col flex-1 self-stretch gap-2 border-t border-solid border-[#d9d9d9] py-2.5`}
    >
      <div className="flex flex-col items-start gap-1.5 self-stretch sm:gap-1.5">
        <div className="flex items-center gap-1.5 self-stretch">
          <Img
            src="images/img_ellipse_7_40x40.png"
            alt="Umar Abubakar"
            className="h-[40px] w-[40px] rounded-[20px] object-cover"
          />
          <Heading size="h3_semibold" as="h6" className="text-[20px] font-semibold text-[#3a3a3a] sm:text-[17px]">
            {umarabubakar}
          </Heading>
        </div>
        <Text as="p" className="text-[14px] font-normal">
          {ihopethisis}
        </Text>
      </div>

      <div className="flex flex-col gap-1.5 self-stretch px-4 sm:gap-1.5">
        <div className="h-[0.5px] bg-[#d9d9d9]" />

        <div className="flex justify-center gap-10">
          <div className="flex items-center gap-1">
            <Img src="images/img_material_symbol_pink_900.svg" alt="Likes" className="h-[24px] w-[24px]" />
            <Text as="p" className="text-[12px] font-normal">
              {p146k}
            </Text>
            <Text as="p" className="text-[12px] font-normal">
              {likes}
            </Text>
          </div>

          <div className="flex items-center gap-1">
            <Img src="images/img_search_pink_900.svg" alt="Views" className="h-[24px] w-[24px]" />
            <Text as="p" className="text-[12px] font-normal">
              {p21k}
            </Text>
            <Text as="p" className="text-[12px] font-normal text-black">
              {vars}
            </Text>
          </div>

          <div className="flex items-center gap-1">
            <Img src="images/img_zondicons_repost.svg" alt="Reposts" className="h-[24px] w-[24px]" />
            <Text as="p" className="text-[12px] font-normal">
              {p3ktwo}
            </Text>
            <Text as="p" className="text-[12px] font-normal text-black">
              {revars}
            </Text>
          </div>

          <Img src="images/img_mynaui_share.svg" alt="Share" className="h-[24px] w-[24px]" />
        </div>
      </div>
    </div>
  );
}
