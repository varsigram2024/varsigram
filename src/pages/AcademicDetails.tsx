import { useState } from "react";
import { Button } from "../components/Button";
import { useSignUp } from "../auth/SignUpContext";
import { faculties, facultyDepartments } from "../constants/academic";

interface AcademicDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export const AcademicDetails = ({ onNext, onBack }: AcademicDetailsProps) => {
  const { updateSignUpData, signUpData } = useSignUp();
  const [formData, setFormData] = useState({
    university: "",
    faculty: "",
    department: "",
  });
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");

  const universities = [
    "University of Lagos"
  ];

  // const departments = [
  //   "Computer Science",
  //   "Electrical Engineering",
  //   "Mechanical Engineering",
  //   "Civil Engineering",
  //   "Chemical Engineering",
  //   "Mathematics",
  //   "Physics",
  //   "Chemistry",
  //   "Biology",
  //   "Business Administration",
  //   "Economics",
  //   "Psychology",
  //   "Sociology",
  //   "Political Science",
  //   "History",
  //   "English",
  //   "Philosophy"
  // ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSignUpData({
      student: {
        ...signUpData.student,
        university: formData.university,
        faculty: formData.faculty,
        department: formData.department,
      }
    });
    console.log('Academic details stored:', formData);
    onNext();
  };

  return (
    <div className="max-w-[398px] mx-auto">
      <h1 className="text-[36px] sm:text-[45px] font-semibold mb-2 sm:mb-8">
        Academic Details
      </h1>
      <p className="text-sm text-[#3A3A3A] mb-8">
        Tell us about your academic background
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University
          </label>
          <select
            value={formData.university}
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
            className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
          >
            <option value="">Select your university</option>
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faculty
          </label>
          <select
            value={selectedFaculty}
            onChange={(e) => {
              setSelectedFaculty(e.target.value);
              setFormData({ ...formData, faculty: e.target.value });
            }}
            className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
          >
            <option value="">Select Faculty</option>
            {faculties.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#750015]"
          >
            <option value="">Select Department</option>
            {(facultyDepartments[selectedFaculty] || []).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onBack}
            variant="secondary"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
