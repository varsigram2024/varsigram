// CLEANED AND FIXED: components/Common5.tsx

import React from "react";
import { Text, Img } from "./..";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  deanof?: React.ReactNode;
  p138kfollowers?: React.ReactNode;
}

export default function Common5({
  className = "",
  deanof = "Dean of Students Affairs",
  p138kfollowers = "13.8K followers",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${className} flex flex-1 items-center justify-center self-stretch sm:flex-col`}
    >
      <div className="flex flex-1 flex-col items-start gap-1 sm:self-stretch">
        <div className="flex items-center gap-1.5 self-stretch">
          <Text as="p" className="text-[16px] font-normal">
            {deanof}
          </Text>
          <Img src="images/ing_material_symbol.svg" alt="Verified" className="h-[16px] w-[16px] self-end" />
        </div>
        <Text as="p" className="text-[14px] font-medium text-[#adacb2]">
          {p138kfollowers}
        </Text>
      </div>

      <Text
        as="p"
        className="flex items-center justify-center rounded bg-[#750015] px-3.5 py-0.5 text-[16px] font-normal text-white"
      >
        Follow
      </Text>
    </div>
  );
}