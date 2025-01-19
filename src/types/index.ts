export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  department: string;
  gender: 'male' | 'female';
  religion: 'islam' | 'christianity';
  dateOfBirth: string;
  level: string;
}

export interface Faculty {
  name: string;
  departments: string[];
}

export const faculties: Faculty[] = [
  {
    name: 'Faculty of Arts',
    departments: [
      'Creative Arts',
      'English',
      'French',
      'Russian',
      'German',
      'History & Strategic Studies',
      'Linguistics/Igbo',
      'Linguistics/Yoruba',
      'Linguistics',
      'Chinese',
      'Philosophy',
      'Christian Religious Studies',
      'Islamic Religious Studies'
    ]
  },
  // ... other faculties
];