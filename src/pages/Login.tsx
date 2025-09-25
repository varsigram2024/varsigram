import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import background from "../public/background img.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, signInWithGoogle } = useAuth();

  // Pre-fill email if coming from email verification
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  // Show success message if coming from verification
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting login with:", formData);
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      console.error("Login failed:", error);
      
    } finally {
      setIsLoading(false);
    }
    try {
  await login(formData.email, formData.password);
  // ✅ Trigger popup ONLY after login
  sessionStorage.setItem("justLoggedIn", "true");
  navigate("/home"); // or wherever you redirect after login
} catch (error) {
  console.error("Login failed:", error);
}

  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-archivo">
      {/* Mobile Header */}
      <div className="sm:hidden p-6 flex items-center">
      <a href="/welcome" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </a>
      </div>

      {/* Desktop Left Section */}
      <div className="hidden sm:flex w-auto p-8 flex-col">
        <a href="/welcome"><Logo /></a>
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            src={background}
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

      {/* Right Section / Mobile Main Content */}
      <div className="flex-1 bg-white sm:bg-[#E6E6E699] p-6 sm:p-12">
        <div className="max-w-[398px] mx-auto sm:mt-12">
          <h1 className="text-[36px] sm:text-[45px] font-semibold mb-2 sm:mb-8 animate-fade-in">
            Log In
          </h1>
          <p className="text-sm text-[#3A3A3A] mb-8 animate-slide-up">
            Log in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div
              className="animate-slide-up"
              style={{ animationDelay: "100ms" }}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "200ms" }}>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>
<div className="flex justify-between">             
  <div
    className="mt-4 animate-slide-up"
    style={{ animationDelay: "250ms" }}>
    <Link to="https://chat.whatsapp.com/EGY8l7P0ZqT6DIrXp8YgAx?mode=ems_copy_c" className="text-sm text-[#750015] hover:underline">
      Complain
    </Link>
  </div>
    
  <div
    className="mt-4 animate-slide-up"
    style={{ animationDelay: "250ms" }}>
    <Link to="/forgot-password" className="text-sm text-[#750015] hover:underline">
      Forgot Password?
    </Link>
  </div>
</div>

            <div
              className="animate-slide-up"
              style={{ animationDelay: "300ms" }}>
              <Button fullWidth loading={isLoading}>
                Log In
              </Button>
            </div>

            <div
              className="flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: "400ms" }}>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
              <span className="text-base">OR</span>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
            </div>
{/* 
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full h-[56px] sm:h-[58px] flex items-center justify-center gap-6 border border-[#B0B0B0] rounded-lg bg-white transition-all hover:bg-gray-50 active:scale-[0.98] animate-slide-up"
              style={{ animationDelay: "500ms" }}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
              <span className="text-base font-medium">
                Continue with Google
              </span>
            </button> */}

            <p
              className="text-center animate-slide-up"
              style={{ animationDelay: "600ms" }}>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={handleSignUp}
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