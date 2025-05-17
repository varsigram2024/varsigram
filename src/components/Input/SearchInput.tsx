import React from "react";

export type SearchInputProps = {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  size?: number;
};

export const SearchInput = ({
  name,
  placeholder,
  value,
  onChange,
  prefix,
  suffix,
  className = "",
  size,
}: SearchInputProps) => {
  return (
    <label className={className}>
      <div className="flex w-full items-center gap-2 border-gray-300 rounded px-3 py-2">
        {prefix && <span className="shrink-0">{prefix}</span>}
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 border-none bg-transparent focus:outline-none"
        />
        {suffix && <span className="shrink-0">{suffix}</span>}
      </div>
    </label>
  );
}; 