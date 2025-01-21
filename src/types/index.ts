export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  department: string;
  gender: "male" | "female";
  religion: "islam" | "christianity";
  dateOfBirth: string;
  level: string;
}

export interface Faculty {
  name: string;
  departments: string[];
}

export const faculties: Faculty[] = [
  {
    name: "Faculty of Arts",
    departments: [
      "Creative Arts",
      "English",
      "French",
      "Russian",
      "German",
      "History & Strategic Studies",
      "Linguistics/Igbo",
      "Linguistics/Yoruba",
      "Linguistics",
      "Chinese",
      "Philosophy",
      "Christian Religious Studies",
      "Islamic Religious Studies",
    ],
  },
  {
    name: "College of Medicine",
    departments: [
      "Medicine and Surgery",
      "Physiotherapy",
      "Radiography",
      "Anatomy",
      "Medical Laboratory Science",
      "Pharmacology",
      "Physiology",
      "Dentistry",
      "Nursing Science",
    ],
  },
  {
    name: "Faculty of Education",
    departments: [
      "Adult Education",
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
      "Education Administration",
      "Education Foundations",
      "Health Education",
      "Human Kinetics Education",
      "Education Biology",
      "Education Chemistry",
      "Education Home Economics",
      "Integrated Science Education",
      "Education Mathematics",
      "Education Physics",
      "Technology Education",
      "Special Education",
    ],
  },
  {
    name: "Faculty of Engineering",
    departments: [
      "Biomedical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Computer Engineering",
      "Electrical & Electronics Engineering",
      "Mechanical Engineering",
      "Metallurgical & Materials Engineering",
      "Petroleum & Gas Engineering",
      "Surveying & Geoinformatics Engineering",
      "Systems Engineering",
    ],
  },
  {
    name: "Faculty of Environmental Science",
    departments: [
      "Architecture",
      "Building",
      "Estate Management",
      "Quantity Surveying",
      "Urban & Regional Planning",
    ],
  },
  {
    name: "Faculty of Law",
    departments: ["Law"],
  },
  {
    name: "Faculty of Management Sciences",
    departments: [
      "Accounting",
      "Actuarial Science",
      "Banking & Finance",
      "Business Administration",
      "IRPM",
      "Insurance",
      "Taxation",
      "Procurement",
    ],
  },
  {
    name: "Faculty of Pharmacy",
    departments: ["Pharmacy"],
  },
  {
    name: "Faculty of Science",
    departments: [
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
      "Zoology",
    ],
  },
  {
    name: "Faculty of Social Sciences",
    departments: [
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
      "Social Standards",
    ],
  },
];
