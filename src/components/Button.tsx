interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={`
        px-4 py-3.5 rounded-lg font-semibold text-lg transition-colors
        ${variant === 'primary' 
          ? 'bg-[#750015] hover:bg-[#B59BA0] text-white' 
          : 'bg-white text-[#750015] border border-[#750015]'
        }
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};