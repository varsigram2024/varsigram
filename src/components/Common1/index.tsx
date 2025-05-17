// CLEANED AND FIXED: components/Common1.tsx

import React from "react";
import { Img, Text } from "./..";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  universityof?: string;
  duration?: React.ReactNode;
  universityof1?: string;
  universityof2?: string;
  line363one?: boolean;
  p146kone?: string;
  p146k?: React.ReactNode;
  p21kone?: string;
  p21k?: React.ReactNode;
  p3kone?: string;
  p3ktwo?: React.ReactNode;
  p146kthree?: string;
}

export default function Common1({
  className = "",
  universityof,
  duration,
  universityof1,
  universityof2,
  line363one,
  p146kone,
  p146k,
  p21kone,
  p21k,
  p3kone,
  p3ktwo,
  p146kthree,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={`${className} flex flex-1 flex-col self-stretch rounded-[24px] bg-white p-4`}
    >
      <div className="ml-2 flex flex-col gap-6 self-stretch sm:ml-0">
        <div className="flex items-start">
          <div className="flex flex-1 items-start self-center">
            <div className="flex w-[56%] items-center gap-4 self-center">
              <div className="w-[20%] rounded-[32px] bg-[#e6e6e699] px-1 py-2">
                {!!universityof && (
                  <Img
                    src={universityof}
                    alt="University of"
                    className="h-[48px] w-full object-cover sm:h-auto"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col items-start justify-center">
                {!!universityof && (
                  <Text as="p" className="text-[28px] font-medium sm:text-[23px]">
                    {universityof}
                  </Text>
                )}
                {!!duration && (
                  <Text as="p" className="text-[16px] font-normal text-[#adacb2] sm:text-[13px]">
                    {duration}
                  </Text>
                )}
              </div>
            </div>
            {!!universityof1 && (
              <Img src={universityof1} alt="University Icon" className="mt-2.5 h-[24px] w-[24px]" />
            )}
          </div>
          {!!universityof2 && (
            <Img src={universityof2} alt="University Avatar" className="h-[36px] w-[36px]" />
          )}
        </div>
        {!!line363one && <div className="h-px bg-[#d9d9d9]" />}
      </div>

      <Text
        size="body_large_regular"
        as="p"
        className="mt-7 w-full text-[20px] font-normal leading-[30px] sm:w-full sm:text-[17px]"
      >
        The University management has decided to improve and renovate its hostels, ensuring comfortability of all
        students. The University has decided to improve and renovate its hostels, ensuring comfortability of all
        students.
      </Text>

      <div className="my-7 h-px self-stretch bg-[#d9d9d9]" />

      <div className="my-3.5 ml-6 mr-4 flex justify-center self-stretch sm:mx-0">
        <div className="flex items-center">
          {!!p146kone && <Img src={p146kone} alt="146k" className="h-[32px] w-[32px]" />}
          {!!p146k && <Text as="p" className="text-[14px] font-normal">{p146k}</Text>}
        </div>

        <div className="flex items-center gap-1 px-14 md:px-5">
          {!!p21kone && <Img src={p21kone} alt="21k" className="h-[32px] w-[32px]" />}
          {!!p21k && <Text as="p" className="text-[14px] font-normal">{p21k}</Text>}
        </div>

        <div className="flex flex-1 items-center pl-[62px] pr-14 md:px-5">
          {!!p3kone && <Img src={p3kone} alt="3k" className="h-[32px] w-[32px]" />}
          {!!p3ktwo && <Text as="p" className="text-[14px] font-normal">{p3ktwo}</Text>}
        </div>

        {!!p146kthree && <Img src={p146kthree} alt="146k+" className="h-[32px] w-[32px]" />}
      </div>
    </div>
  );
}