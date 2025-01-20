interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1 font-archivo">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full px-4 py-3.5 rounded-lg border border-[#B0B0B0]
            focus:outline-none focus:border-[#750015] focus:ring-1 focus:ring-[#750015]
            font-archivo transition-colors
            ${error ? "border-red-500" : ""}
            ${icon ? "pr-12" : ""}
            sm:py-3 sm:text-sm
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-archivo">{error}</p>
      )}
    </div>
  );
};
