import { useState } from "react";
import { Button } from "../components/Button";
import { useSignUp } from "../auth/SignUpContext";

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

  const faculties = [
    "College of Medicine",
    "Faculty of Arts",
    "Faculty of Education",
    "Faculty of Engineering",
    "Faculty of Environmental Sciences",
    "Faculty of Law",
    "Faculty of Management Sciences",
    "Faculty of Pharmacy",
    "Faculty of Sciences",
    "Faculty of Social Sciences"
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

  const facultyDepartments: { [faculty: string]: string[] } = {
    "College of Medicine": ["Medicine and Surgery", "Physiotheraphy", "Radiography", "Anatomy", "Medical Laboratory Science", "Pharmacology", "Physiology", "Dentistry", "Nursing Science"],

    "Faculty of Arts": ["Creative Arts", "French", "Russian", "German", "History & Strategic Studies", "Linguistics/Igbo", "Linguistics/Yoryba", "Linguistics", "Chinese", "Christian Religious Studies", "Islamic Religious Studies", "English", "Philosophy"],

    "Faculty of Education": [ "Adult Education",
      "Education Economics",
      "Business Education",
      "Education Islamic Religious Studies",
      "Education Igbo",
      "Education English",
      "Early Childhood Education",
      "Education Yoruba",
      "Education French",
      "Education History",
      "Education Christian Religious Studies",
      "Education Geography",
      "Educational Administration",
      "Educational Foundations",
      "Health Education",
      "Human Kinetics Education",
      "Education Biology",
      "Education Chemistry",
      "Education Home Economics",
      "Integrated Science Education",
      "Education Mathematics",
      "Education Physics",
      "Technology Education",
      "Special Education"],

    "Faculty of Engineering": [
      "Biomedical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Computer Engineering",
      "Electrical & Electronics Engineering",
      "Mechanical Engineering",
      "Metallurgical & Materials Engineering",
      "Petroleum & Gas Engineering",
      "Surveying & Geoinformatics Engineering",
      "Systems Engineering"
    ],
    
    "Faculty of Environmental Sciences": ["Architecture", "Building", "Estate Management", "Quantity Surveying", "Urban and Regional Planning"],

    "Faculty of Law": ["Law"],

    "Faculty of Management Sciences": [
      "Accounting",
      "Actuarial Science",
      "Banking & Finance",
      "Business Administration",
      "IRPM",
      "Insurance",
      "Taxation",
      "Procurement"
    ],
    
    "Faculty of Pharmacy": ["Pharmacy"],

    "Faculty of Sciences": [
      "Biochemistry",
      "Biostatistics",
      "Botany",
      "Cell Biology & Genetics",
      "Chemistry",
      "Computer Science",
      "Data Science",
      "Environmental Standards",
      "Geology",
      "Geophysics",
      "Marine Biology",
      "Fishery",
      "Mathematics",
      "Industrial Mathematics",
      "Statistics",
      "Microbiology",
      "Physics",
      "Zoology"
    ],
    
    "Faculty of Social Sciences": [
      "Economics",
      "Economics & Development Studies",
      "Geography",
      "Meteorology & Climate Science",
      "Mass Communication",
      "Library & Information Science",
      "Political Science",
      "Psychology",
      "Public Administration",
      "Social Work",
      "Sociology",
      "Social Standard"
    ]
  };

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
