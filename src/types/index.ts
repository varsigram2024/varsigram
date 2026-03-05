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
    name: "Architecture",
    departments: [
      "Architecture",
      "Landscape Architecture and Urban Design",
      "Interior Architecture and Design"
    ]
  },
  {
    name: "Arts",
    departments: [
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
      "Islamic Religious Studies"
    ]
  },
  {
    name: "Basic Clinical Sciences",
    departments: [
      "Anatomic & Molecular Pathology",
      "Haematology & Blood Transfusion",
      "Medical Microbiology & Parasitology",
      "Clinical Pathology",
      "Clinical Pharmacology"
    ]
  },
  {
    name: "Basic Medical Sciences",
    departments: [
      "Anatomy",
      "Physiology",
      "Medical Biochemistry",
      "Pharmacology, Therapeutics & Toxicology"
    ]
  },
  {
    name: "Clinical Sciences",
    departments: [
      "Anaesthesia",
      "Community Health & Primary Care",
      "Medicine",
      "Obstetrics & Gynaecology",
      "Ophthalmology",
      "Paediatrics",
      "Psychiatry",
      "Radiation Biology, Radiotherapy & Radiodiagnosis"
    ]
  },
  {
    name: "Communication & Media Studies",
    departments: [
      "Mass Communication",
      "Public Relations & Advertising",
      "Journalism, Broadcasting & Media Studies"
    ]
  },
  {
    name: "Computing & Informatics",
    departments: [
      "Computer Science",
      "Intelligent Systems & Robotics",
      "Cybersecurity & Software Engineering"
    ]
  },
  {
    name: "Creative Arts",
    departments: [
      "Music & Sound Production",
      "Theatre Arts & Film Studies",
      "Fine & Applied Arts"
    ]
  },
  {
    name: "Dental Sciences",
    departments: [
      "Child Dental Health",
      "Oral & Maxillofacial Pathology/Biology",
      "Oral & Maxillofacial Surgery",
      "Preventive Dentistry",
      "Restorative Dentistry"
    ]
  },
  {
    name: "Education",
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
      "Special Education"
    ]
  },
  {
    name: "Engineering",
    departments: [
      "Biomedical Engineering",
      "Chemical Engineering",
      "Petroleum & Gas Engineering",
      "Civil & Environmental Engineering",
      "Electrical & Electronics Engineering",
      "Mechanical Engineering",
      "Metallurgical & Materials Engineering",
      "Surveying & Geoinformatics",
      "Systems Engineering",
      "Computer Engineering"
    ]
  },
  {
    name: "Environmental Sciences",
    departments: [
      "Building",
      "Estate Management",
      "Quantity Surveying",
      "Urban & Regional Planning",
      "Architecture"
    ]
  },
  {
    name: "Health Professions",
    departments: [
      "Medical Laboratory Science",
      "Nursing Science",
      "Physiotherapy",
      "Radiography"
    ]
  },
  {
    name: "Law",
    departments: [
      "Law",
      "Commercial & Industrial Law",
      "Jurisprudence & International Law",
      "Private & Property Law",
      "Public Law"
    ]
  },
  {
    name: "Life Sciences",
    departments: [
      "Biochemistry",
      "Botany",
      "Cell Biology & Genetics",
      "Marine Science",
      "Microbiology",
      "Zoology",
      "Fisheries & Aquaculture",
      "Environmental Standards",
      "Fisheries"
    ]
  },
  {
    name: "Management Sciences",
    departments: [
      "Accounting",
      "Actuarial Science & Insurance",
      "Business Administration",
      "Employment Relations & Human Resource Management",
      "Finance",
      "Industrial Relations & Personnel Management (IRPM)",
      "Taxation",
      "Procurement"
    ]
  },
  {
    name: "Pharmacy",
    departments: [
      "Pharmacy",
      "Clinical Pharmacy & Biopharmacy",
      "Pharmaceutical Chemistry",
      "Pharmaceutical Microbiology & Biotechnology",
      "Pharmaceutics & Pharmaceutical Technology",
      "Pharmacognosy"
    ]
  },
  {
    name: "Physical & Earth Sciences",
    departments: [
      "Chemistry",
      "Geology",
      "Geophysics",
      "Mathematics",
      "Physics",
      "Statistics"
    ]
  },
  {
    name: "Social Sciences",
    departments: [
      "Economics",
      "Economics & Development Studies",
      "Geography",
      "Meteorology & Climate Science",
      "Library & Information Science",
      "Political Science",
      "Psychology",
      "Social Work",
      "Sociology",
      "Public Administration",
      "Social Standard"
    ]
  }
];