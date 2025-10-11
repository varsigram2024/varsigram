/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-left": "slide-left 0.5s ease-out forwards",
        "slide-right": "slide-right 0.5s ease-out forwards",
        // Hero image slide-in (up and right)
        'hero-slide-in-1': 'heroSlideIn1 1s ease-out forwards',
        'hero-slide-in-2': 'heroSlideIn2 1s ease-out forwards 0.3s', // Staggered
        // Image stack bounce and sway
        'image-bounce-1': 'bounce 4s infinite 2s',
        'image-sway-1': 'sway 8s ease-in-out infinite',
        'image-sway-2': 'sway 8s ease-in-out infinite 0.5s reverse',
        // Floating badges (Engage section)
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slow-delay': 'float 6s ease-in-out infinite 0.5s',
        // Pulse for CTA
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        heroSlideIn1: {
          '0%': { transform: 'translateY(100px) rotate(-5deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        },
        heroSlideIn2: {
          '0%': { transform: 'translateY(100px) translateX(100px) rotate(5deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      screens: {
        xs: "430px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
