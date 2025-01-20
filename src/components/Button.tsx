interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        px-4 py-3.5 rounded-lg font-semibold text-lg transition-all duration-300
        font-archivo disabled:opacity-70 disabled:cursor-not-allowed
        ${
          variant === "primary"
            ? "bg-[#750015] hover:bg-[#B59BA0] text-white active:scale-[0.98]"
            : "bg-white text-[#750015] border border-[#750015] hover:bg-[#750015] hover:text-white"
        }
        ${fullWidth ? "w-full" : ""}
        ${loading ? "cursor-wait" : ""}
        sm:text-base sm:py-3 sm:rounded-md
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
