import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { faculties } from "../types";
import { useAuth } from "../auth/AuthContext";

interface AcademicDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export const AcademicDetails = ({ onNext, onBack }: AcademicDetailsProps) => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const { setCurrentPage } = useAuth();

  const departments =
    faculties.find((f) => f.name === selectedFaculty)?.departments || [];

  const handleSkip = () => {
    setCurrentPage("about-yourself");
  };

  const handleContinue = () => {
    if (selectedFaculty && selectedDepartment) {
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
              onClick={() => setShowFacultyDropdown(!showFacultyDropdown)}
              className="w-full h-[56px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
              <span className="text-base">{selectedFaculty || "Faculty"}</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showFacultyDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {faculties.map((faculty) => (
                  <button
                    key={faculty.name}
                    onClick={() => {
                      setSelectedFaculty(faculty.name);
                      setSelectedDepartment("");
                      setShowFacultyDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {faculty.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative animate-slide-up"
            style={{ animationDelay: "100ms" }}>
            <button
              onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
              disabled={!selectedFaculty}
              className="w-full h-[56px] px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="text-base">
                {selectedDepartment || "Department"}
              </span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showDepartmentDropdown && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {departments.map((department) => (
                  <button
                    key={department}
                    onClick={() => {
                      setSelectedDepartment(department);
                      setShowDepartmentDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {department}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!selectedFaculty || !selectedDepartment}
            className="animate-slide-up h-[56px]"
            style={{ animationDelay: "200ms" }}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
