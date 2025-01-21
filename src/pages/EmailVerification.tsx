import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export const EmailVerification = ({ onNext }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

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
    setTimeLeft(30);
    // Add resend logic here
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      // Add verification logic here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      onNext(); // Navigate to the next page after successful verification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-archivo">
      <header className="p-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Logo />
        </div>
      </header>

      <div className="max-w-[398px] mx-auto px-6 mt-12">
        <h1 className="text-[28px] sm:text-[32px] font-semibold mb-4 animate-fade-in">
          Enter the code
        </h1>
        <p className="text-base text-[#4D4D4D] mb-8 animate-slide-up">
          Enter the 6 digit code sent to{" "}
          <span className="font-medium">myemail@gmail.com</span>
        </p>

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
            disabled={timeLeft > 0}
            className={`text-sm ${
              timeLeft > 0 ? "text-[#ADACB2]" : "text-[#750015] hover:underline"
            }`}>
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend"}
          </button>
        </div>

        <Button
          fullWidth
          onClick={handleVerify}
          loading={isLoading}
          disabled={otp.some((digit) => !digit)}
          className="animate-slide-up">
          Verify
        </Button>
      </div>
    </div>
  );
};
