import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";

const levels = ["100", "200", "300", "400", "500"];

export const AcademicLevel = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { setCurrentPage } = useAuth();

  const handleContinue = () => {
    if (selectedLevel) {
      // Navigate to the next page in your registration flow
      setCurrentPage("profile-setup"); // Or whatever your next page is called
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="p-6">
        <Logo />
      </header>
      <div className="max-w-[599px] mx-auto mt-12 p-12 bg-[#E6E6E699] rounded-t-[20px]">
        <h1 className="text-[32px] font-bold mb-2">
          Enter your academic details
        </h1>
        <p className="text-base text-[#4D4D4D] mb-[52px]">Select your level</p>

        <div className="space-y-6">
          <div className="relative z-50">
            <button
              className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}>
              <span className="text-base">{selectedLevel || "Level"}</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedLevel(level);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-0">
            <Button
              fullWidth
              onClick={handleContinue}
              disabled={!selectedLevel}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
