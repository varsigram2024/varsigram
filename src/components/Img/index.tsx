// CLEANED AND FIXED: components/Img.tsx

import React from "react";

export type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  className?: string;
  src?: string;
  alt?: string;
};

const Img: React.FC<React.PropsWithChildren<ImgProps>> = ({
  className = "",
  src = "defaultNoData.png",
  alt = "testImg",
  ...restProps
}) => {
  return <img className={className} src={src} alt={alt} loading="lazy" {...restProps} />;
};

export { Img };
