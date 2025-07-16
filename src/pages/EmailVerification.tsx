import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { sendOtp, verifyOtp } from "../services/API";
import { toast } from "react-toastify";

const SignupProgress = () => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
        <span className="ml-2 text-sm text-gray-600">Account Created</span>
      </div>
      <div className="w-8 h-1 bg-gray-300"></div>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-[#750015] rounded-full flex items-center justify-center text-white text-sm">2</div>
        <span className="ml-2 text-sm font-medium text-[#750015]">Verify Email</span>
      </div>
      <div className="w-8 h-1 bg-gray-300"></div>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm">3</div>
        <span className="ml-2 text-sm text-gray-600">Welcome!</span>
      </div>
    </div>
  </div>
);

export const EmailVerification = () => {
  const navigate = useNavigate();
  const { token, user, refreshUserProfile } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const sentRef = useRef(false);
  const [userCredentials, setUserCredentials] = useState<{email: string, password: string} | null>(null);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Get credentials from sessionStorage (set during signup)
  useEffect(() => {
    const credentials = sessionStorage.getItem('signup_credentials');
    if (credentials) {
      setUserCredentials(JSON.parse(credentials));
    }
  }, []);

  // Send OTP on component mount
  useEffect(() => {
    if (token && !sentRef.current) {
      sentRef.current = true;
      sendOtpToUser();
    }
  }, [token]);

  // Timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const sendOtpToUser = async () => {
    try {
      await sendOtp(token || "");
      toast.success(`OTP sent to ${user?.email}`);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setIsResending(true);
    try {
      await sendOtp(token || "");
      setTimeLeft(30);
      toast.success(`OTP resent to ${user?.email}`);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (otp.some(digit => !digit)) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const code = otp.join("");
      await verifyOtp(code, token || "");
      
      // Force profile refresh here
      await refreshUserProfile();

      // Show success state
      setIsVerified(true);
      toast.success("Email verified successfully!");
      
      // Wait a moment for user to see success, then auto-login
      setTimeout(() => {
        navigate("/home");
      }, 1500); // 1.5 second delay to show success
      
    } catch (err: any) {
      console.error('Verification failed:', err);
      toast.error("Invalid OTP. Please check your code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-archivo">
      <header className="p-6">
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate("/settings")}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Logo />
        </div>
      </header>

      <div className="max-w-[398px] mx-auto px-6 mt-12">
        <SignupProgress />
        
        <h1 className="text-[28px] sm:text-[32px] font-semibold mb-4 animate-fade-in">
          Enter the code
        </h1>
        
        <p className="text-base text-[#4D4D4D] mb-8 animate-slide-up">
          Enter the 6 digit code sent to{" "}
          <span className="font-medium text-[#750015]">{user?.email || "your email"}</span>
        </p>

        {/* Email Troubleshooting Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">Can't find the email?</p>
              <ul className="text-blue-700 text-xs space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you're checking the correct email</li>
                <li>• Wait a few minutes for delivery</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6 animate-slide-up">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[44px] h-[40px] text-xl text-center border rounded-lg focus:border-[#750015] focus:ring-1 focus:ring-[#750015] focus:outline-none transition-colors"
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending}
            className={`text-sm transition-colors ${
              timeLeft > 0 || isResending
                ? "text-[#ADACB2] cursor-not-allowed"
                : "text-[#750015] hover:underline cursor-pointer"
            }`}
          >
            {isResending ? (
              "Sending..."
            ) : timeLeft > 0 ? (
              `Resend in ${timeLeft}s`
            ) : (
              "Resend code"
            )}
          </button>
        </div>

        <Button
          fullWidth
          onClick={handleVerify}
          loading={isLoading || isAutoLoggingIn}
          disabled={otp.some((digit) => !digit) || isLoading || isAutoLoggingIn}
          className="animate-slide-up"
        >
          {isLoading ? "Verifying..." : isAutoLoggingIn ? "Logging you in..." : "Verify Email"}
        </Button>

        {/* Alternative Actions */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-[#750015] text-sm hover:underline"
          >
            Already verified? Sign in
          </button>
        </div>
      </div>

      {isVerified && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Email Verified!</h3>
            <p className="text-green-600">Logging you in...</p>
          </div>
        </div>
      )}
    </div>
  );
};
