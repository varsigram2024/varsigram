import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { useSignUp } from "../auth/SignUpContext";

const levels = ["100", "200", "300", "400", "500"];

interface AcademicLevelProps {
  onNext: () => void;
  onBack: () => void;
}

export const AcademicLevel = ({ onNext, onBack }: AcademicLevelProps) => {
  const { updateSignUpData } = useSignUp();
  const [formData, setFormData] = useState({
    year: "",
  });

  const academicYears = [
    "100 Level",
    "200 Level",
    "300 Level",
    "400 Level",
    "500 Level",
    "600 Level"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSignUpData({
      year: formData.year,
    });
    console.log('Academic level stored:', formData);
    onNext();
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Level
            </label>
            <select
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
            >
              <option value="">Select your level</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Complete Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
