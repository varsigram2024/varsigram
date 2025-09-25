// src/pages/SignUpForm.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import background from "../public/background img.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Input } from "../components/Input";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/Button";
import { useSignUp } from "../auth/SignUpContext";

interface SignUpFormProps {
  onNext: () => void;
  onLogin: () => void;
}

export const SignUpForm = ({ onNext, onLogin }: SignUpFormProps) => {
  const navigate = useNavigate();
  const { updateSignUpData, signUpData } = useSignUp();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleLogin = () => {
    navigate('/login');
  };
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Update context with form data
      updateSignUpData({
        email: formData.email,
        password: formData.password,
        student: {
          ...signUpData.student,
          name: formData.fullName
        }
      });
      onNext();
    } catch (error) {
      console.error("Error updating signup data:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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

      <div className="flex-1 bg-white sm:bg-[#E6E6E699] p-6 sm:p-12">
        <h1 className="text-[36px] sm:text-[45px] font-semibold mb-2 sm:mb-8 animate-fade-in">
          Create an Account
        </h1>
        <p className="text-sm text-[#3A3A3A] mb-8 animate-slide-up">
          Kindly fill in your details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
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

          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
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

          <div className="relative animate-slide-up" style={{ animationDelay: "300ms" }}>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
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

          <div className="relative animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          <p className="text-sm text-[#3A3A3A] animate-slide-up" style={{ animationDelay: "500ms" }}>
            By clicking continue, you are setting up a VARSIGRAM account and agree to our{" "}
            <a href="#" className="text-[#750015] hover:underline">User Agreement</a>{" "}
            and{" "}
            <a href="#" className="text-[#750015] hover:underline">Privacy Policy</a>.
          </p>

          <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
            <Button fullWidth loading={isLoading} type="submit">
              Continue
            </Button>
          </div>

          <p className="text-center animate-slide-up" style={{ animationDelay: "700ms" }}>
            Already a VARSIGRAM user?{" "}
            <button
              type="button"
              onClick={handleLogin}
              className="text-[#750015] hover:underline transition-all">
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};