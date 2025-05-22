// CLEANED AND FIXED: components/Button.tsx

import React from "react";

const shapes = {
  circle: "rounded-[50%]",
  round: "rounded",
} as const;

const variants = {
  fill: {
    pink_100: "bg-[#eacade]",
    pink_900: "bg-[#750015] text-[#ffffff]",
  },
  outline: {
    gray_400_01: "border-[#bebebe] border border-solid text-[#3a3a3a]",
  },
} as const;

const sizes = {
  "2x1": "h-[48px] px-3.5",
  md: "h-[28px] px-1 text-[16px]",
} as const;

type VariantType = keyof typeof variants;
type ColorType<T extends VariantType> = keyof typeof variants[T];

type ButtonProps<T extends VariantType = "outline"> = {
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  shape?: keyof typeof shapes;
  variant?: T;
  size?: keyof typeof sizes;
  color?: T extends keyof typeof variants ? keyof typeof variants[T] : never;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = <T extends VariantType = "outline">({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "outline" as T,
  size = "md",
  color = (variant === "outline" ? "gray_400_01" : "pink_100") as any,
  ...restProps
}: ButtonProps<T>) => {
  const variantClass = variant && color ? variants[variant]?.[color] ?? "" : "";
  const shapeClass = shape ? shapes[shape] : "";
  const sizeClass = size ? sizes[size] : "";

  return (
    <button
      className={`flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap font-archivo ${shapeClass} ${sizeClass} ${variantClass} ${className}`.trim()}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
