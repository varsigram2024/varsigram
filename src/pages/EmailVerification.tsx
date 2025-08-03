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
        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="text-[#750015] text-sm hover:underline block"
          >
            Already verified? Sign in
          </button>
          
          {/* Complaint Link */}
          <div className="pt-2 border-t border-gray-200">
            <a
              href="https://chat.whatsapp.com/EGY8l7P0ZqT6DIrXp8YgAx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#750015] text-sm hover:underline flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Having issues? Contact support
            </a>
          </div>
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
