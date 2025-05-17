// CLEANED AND FIXED: components/Common2.tsx

import React from "react";
import { Text, Img } from "./..";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  p146kone?: string;
  p146k?: React.ReactNode;
}

export default function Common2({
  className = "",
  p146kone = "images/img_material_symbol_pink_900.svg",
  p146k = "14.6K",
  ...props
}: Props) {
  return (
    <div {...props} className={`${className} flex items-center gap-2`}>
      <div className="flex items-center gap-1">
        <Img src={p146kone} alt="146k" className="h-[24px] w-[24px]" />
        <Text as="p" className="text-[14px] font-normal">
          {p146k}
        </Text>
      </div>
      <Text as="p" className="text-[14px] font-normal">
        Likes
      </Text>
    </div>
  );
}