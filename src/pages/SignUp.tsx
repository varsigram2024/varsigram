import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../components/Logo";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import backgroundimage from "../public/BACKGROUND IMAGE.png";

interface SignUpProps {
  onLogin: () => void;
}

export const SignUp = ({ onLogin }: SignUpProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName);
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in failed:", error);
      // Handle error
    }
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
        <div className="max-w-[497px] mx-auto mt-12">
          <h1 className="text-[45px] font-semibold mb-8 animate-fade-in">
            Sign Up
          </h1>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div
              className="animate-slide-up"
              style={{ animationDelay: "100ms" }}>
              <Input
                label="Full name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                error={errors.fullName}
              />
            </div>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "200ms" }}>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />
            </div>
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "300ms" }}>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] transition-colors hover:text-[#750015]"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "400ms" }}>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] transition-colors hover:text-[#750015]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p
              className="text-sm text-[#3A3A3A] animate-slide-up"
              style={{ animationDelay: "500ms" }}>
              By clicking continue, you are setting up a VARSIGRAM account and
              agree to our{" "}
              <a href="#" className="text-[#750015] hover:underline">
                User Agreement
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#750015] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <div
              className="animate-slide-up"
              style={{ animationDelay: "600ms" }}>
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
              style={{ animationDelay: "700ms" }}>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
              <span className="text-base">OR</span>
              <div className="flex-1 h-[1px] bg-[#BFBFBF]"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-[58px] flex items-center justify-center gap-6 border border-[#B0B0B0] rounded-lg bg-white transition-colors hover:bg-gray-50 animate-slide-up"
              style={{ animationDelay: "800ms" }}>
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
              style={{ animationDelay: "900ms" }}>
              Already a VARSIGRAM user?{" "}
              <button
                type="button"
                onClick={onLogin}
                className="text-[#750015] hover:underline transition-all">
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
