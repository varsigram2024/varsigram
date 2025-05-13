import React from "react";

const sizes = {
  mobile: "text-[16px] font-normal",
  body_large_regular: "text-[20px] font-normal",
  textlg: "text-[12px] font-normal",
};

export type TextProps = Partial<{
  className: string;
  as: keyof JSX.IntrinsicElements;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "mobile",
  ...restProps
}) => {
  const Component = as || "p";
  return (
    <Component
      className={`text-[#3a3a3a] font-['Archivo'] ${sizes[size]} ${className}`.trim()}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };