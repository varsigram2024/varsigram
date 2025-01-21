import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";

interface AboutYourselfProps {
  onNext: () => void;
  onBack: () => void;
}

const genders = ["Male", "Female"];
const religions = ["Christianity", "Islam"];
const days = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

export const AboutYourself = ({ onNext, onBack }: AboutYourselfProps) => {
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const { setCurrentPage } = useAuth();

  const handleSkip = () => {
    setCurrentPage("academic-level");
  };

  const handleContinue = () => {
    if (gender && religion && day && month && year) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-white font-archivo">
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Logo />
        </div>
        <button
          onClick={handleSkip}
          className="text-[#750015] text-sm font-archivo">
          Skip
        </button>
      </header>

      <div className="max-w-[398px] mx-auto px-6 mt-12">
        <h1 className="text-[28px] font-medium mb-2 text-[#3A3A3A] animate-fade-in">
          Register your account
        </h1>
        <p className="text-sm text-[#3A3A3A] mb-8 animate-slide-up">
          Register your account on VARSIGRAM to continue
        </p>

        <div className="space-y-6">
          <div className="relative animate-slide-up">
            <button
              onClick={() =>
                setShowDropdown(showDropdown === "gender" ? null : "gender")
              }
              className="w-full h-[56px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
              <span className="text-base">{gender || "Gender"}</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showDropdown === "gender" && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10">
                {genders.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setGender(item.toLowerCase());
                      setShowDropdown(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative animate-slide-up"
            style={{ animationDelay: "100ms" }}>
            <button
              onClick={() =>
                setShowDropdown(showDropdown === "religion" ? null : "religion")
              }
              className="w-full h-[56px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
              <span className="text-base">{religion || "Religion"}</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showDropdown === "religion" && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10">
                {religions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setReligion(item.toLowerCase());
                      setShowDropdown(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex gap-4 animate-slide-up"
            style={{ animationDelay: "200ms" }}>
            <div className="relative flex-1">
              <button
                onClick={() =>
                  setShowDropdown(showDropdown === "day" ? null : "day")
                }
                className="w-full h-[40px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
                <span className="text-base">{day || "Day"}</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showDropdown === "day" && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {days.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setDay(item);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <button
                onClick={() =>
                  setShowDropdown(showDropdown === "month" ? null : "month")
                }
                className="w-full h-[40px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
                <span className="text-base">{month || "Month"}</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showDropdown === "month" && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {months.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setMonth(item);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <button
                onClick={() =>
                  setShowDropdown(showDropdown === "year" ? null : "year")
                }
                className="w-full h-[40px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
                <span className="text-base">{year || "Year"}</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showDropdown === "year" && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {years.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setYear(item);
                        setShowDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!gender || !religion || !day || !month || !year}
            className="animate-slide-up h-[56px]"
            style={{ animationDelay: "300ms" }}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
