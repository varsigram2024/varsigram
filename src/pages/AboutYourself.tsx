import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { useSignUp } from "../auth/SignUpContext";

interface AboutYourselfProps {
  onNext: () => void;
  onBack: () => void;
}

const genders = ["Male", "Female", "Other"];
const religions = ["Christianity", "Islam", "Traditional", "Other"];
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
  const { updateSignUpData } = useSignUp();
  const [formData, setFormData] = useState({
    sex: "",
    religion: "",
    dateOfBirth: "",
  });
  const { setCurrentPage } = useAuth();

  const handleSkip = () => {
    setCurrentPage("academic-level");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format date to YYYY-MM-DD for backend
    const formattedDate = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : null;
    
    updateSignUpData({
      student: {
        sex: formData.sex,
        religion: formData.religion,
        date_of_birth: formattedDate,
      }
    });
    console.log('About yourself details stored:', {
      ...formData,
      dateOfBirth: formattedDate
    });
    onNext();
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.sex}
              onChange={(e) =>
                setFormData({ ...formData, sex: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
            >
              <option value="">Select your gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Religion
            </label>
            <select
              value={formData.religion}
              onChange={(e) =>
                setFormData({ ...formData, religion: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
            >
              <option value="">Select your religion</option>
              {religions.map((religion) => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
              max={new Date().toISOString().split('T')[0]} // Prevents future dates
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
