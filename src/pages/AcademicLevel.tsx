import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { useSignUp } from "../auth/SignUpContext";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const levels = ["100", "200", "300", "400", "500"];

interface AcademicLevelProps {
  onNext: () => void;
  onBack: () => void;
}


export const AcademicLevel = ({ onNext, onBack }: AcademicLevelProps) => {
  const { updateSignUpData, submitSignUp, signUpData } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: "",
  });
  const [isYearSelected, setIsYearSelected] = useState(false);
  const navigate = useNavigate();

  const handleYearSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    setFormData({ ...formData, year: selectedYear });
    updateSignUpData({
      student: {
        ...signUpData.student,
        year: selectedYear,
      }
    });
    setIsYearSelected(true);
    console.log('Year selected and stored:', selectedYear);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.year) {
      toast.error('Please select your academic level');
      return;
    }

    setIsLoading(true);
    try {
      // Log the exact year value being sent
      console.log('Year value before update:', formData.year);
      
      // Update the context with the year
      updateSignUpData({
        student: {
          ...signUpData.student,
          year: formData.year,
        }
      });
      
      // Log the full context data
      console.log('Full context data before submission:', signUpData);
      
      await submitSignUp();
      toast.success('Sign up successful! Please log in.');
      navigate("/login");
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[398px] mx-auto">
      <h1 className="text-[36px] sm:text-[45px] font-semibold mb-2 sm:mb-8">
        Academic Level
      </h1>
      <p className="text-sm text-[#3A3A3A] mb-8">
        Select your current academic level
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Level
          </label>
          <select
            value={formData.year}
            onChange={handleYearSelect}
            className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
          >
            <option value="">Select your level</option>
            {levels.map((year) => (
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
            type="button"
            onClick={handleSubmit}
            className="flex-1"
            loading={isLoading}
            disabled={!isYearSelected}
          >
            Complete Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};