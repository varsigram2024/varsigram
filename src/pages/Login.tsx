import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../components/Logo";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import  backgroundimage  from "../public/background img.png";

interface LoginProps {
  onSignUp: () => void;
}

export const Login = ({ onSignUp }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex font-['Archivo']">
      {/* Left Section */}
      <div className="w-[740px] p-8 flex flex-col">
        <Logo />
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            src={backgroundimage} // Updated to use the new image
            alt="University students"
            className="w-full h-[365px] object-cover rounded-lg mb-8 transition-transform hover:scale-[1.02] duration-300"
          />
          <h2 className="text-4xl font-semibold text-center leading-[52px]">
            Get instant access to{" "}
            <span className="text-[#750015]">communication</span>
            <br /> in your University
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-[#E6E6E699] p-12">
        <div className="max-w-[496px] mx-auto mt-12">
          <h1 className="text-[45px] font-semibold mb-8 animate-fade-in">
            Log In
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div
              className="animate-slide-up"
              style={{ animationDelay: "100ms" }}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "200ms" }}>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] transition-colors hover:text-[#750015]"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "300ms" }}>
              <Button fullWidth disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>

            <div
              className="flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: "400ms" }}>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
              <span className="text-base">OR</span>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
            </div>

            <button
              type="button"
              className="w-full h-[58px] flex items-center justify-center gap-6 border border-[#B0B0B0] rounded-lg bg-white transition-colors hover:bg-gray-50 animate-slide-up"
              style={{ animationDelay: "500ms" }}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
              <span className="text-base font-medium">
                Continue with Google
              </span>
            </button>

            <p
              className="text-center animate-slide-up"
              style={{ animationDelay: "600ms" }}>
              Already a VARSIGRAM user?{" "}
              <button
                type="button"
                onClick={onSignUp}
                className="text-[#750015] hover:underline transition-all">
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
