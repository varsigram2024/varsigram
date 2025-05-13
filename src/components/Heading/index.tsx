import React from "react";

const sizes = {
  mobile_body_semibold: "text-[16px] font-semibold",
  h3_semibold: "text-[28px] font-semibold md:text-[26px] sm:text-[24px]",
  headingsm: "text-[8px] font-semibold",
};

export type HeadingProps = Partial<{
  className: string;
  as: keyof JSX.IntrinsicElements;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "mobile_body_semibold",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  // Check if the component is an SVG element
  const isSVG = (element: string) => {
    return ["svg", "symbol", "circle", "rect", "path"].includes(element);
  };
  return (
    <Component
      className={!isSVG(Component) ? `text-[#3a3a3a] font-['Archivo'] ${sizes[size]} ${className}`.trim() : undefined}
      {...(isSVG(Component) ? { ...restProps, className: undefined } : { ...restProps })}
    >
      {children}
    </Component>
  );
};

export { Heading };
