// CLEANED AND FIXED: components/Input.tsx

import React from "react";

export type InputProps = Partial<
  Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> & {
    label?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    className?: string;
  }
>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name,
      placeholder,
      type = "text",
      label,
      prefix,
      suffix,
      onChange,
      ...restProps
    },
    ref
  ) => {
    return (
      <label className={className}>
        {!!label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
        <div className="flex w-full items-center gap-2 border-gray-300 rounded px-3 py-2">
          {!!prefix && <span className="shrink-0">{prefix}</span>}
          <input
            ref={ref}
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className="flex-1 border-none bg-transparent focus:outline-none"
            {...restProps}
          />
          {!!suffix && <span className="shrink-0">{suffix}</span>}
        </div>
      </label>
    );
  }
);

Input.displayName = "Input";

export { Input };
