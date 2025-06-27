// src/auth/SignUpContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface SignUpData {
  email: string;
  password: string;
  bio: string;
  student: {
    name: string;
    faculty: string;
    department: string;
    year: string;
    religion: string;
    phone_number: string;
    sex: string;
    university: string;
    date_of_birth: string | null;
  }
}

interface SignUpContextType {
  signUpData: SignUpData;
  updateSignUpData: (data: Partial<SignUpData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSubmitting: boolean;
  submitSignUp: () => Promise<void>;
}

const defaultData: SignUpData = {
  email: '',
  password: '',
  bio: '',
  student: {
    name: '',
    faculty: '',
    department: '',
    year: '',
    religion: '',
    phone_number: '',
    sex: '',
    university: '',
    date_of_birth: null
  }
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children, signUp }: { children: React.ReactNode; signUp: (data: SignUpData) => Promise<void> }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSignUpData = (data: Partial<SignUpData>) => {
    setSignUpData((prev) => {
      const newData = { ...prev };
      
      // Handle root level fields
      if (data.email !== undefined) newData.email = data.email;
      if (data.password !== undefined) newData.password = data.password;
      if (data.bio !== undefined) newData.bio = data.bio;
      
      // Handle student fields
      if (data.student) {
        newData.student = {
          ...newData.student,
          ...data.student
        };
      }
      
      return newData;
    });
  };

  const submitSignUp = async () => {
    let requestData;
    try {
      // Transform the data to match the API's expected structure
      requestData = {
        email: signUpData.email,
        password: signUpData.password,
        student: signUpData.student
      };

      console.log('Current signUpData:', signUpData);
      console.log('Request data being sent:', requestData);

      const response = await axios.post(
        `${API_URL}/register/`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      console.error('Request data that caused error:', requestData);
      throw error;
    }
  };

  return (
    <SignUpContext.Provider value={{ 
      signUpData, 
      updateSignUpData,
      submitSignUp,
      isSubmitting,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};