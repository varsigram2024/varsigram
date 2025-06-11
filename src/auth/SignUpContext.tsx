// src/auth/SignUpContext.tsx
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  university: string;
  department: string;
  faculty: string;
  year: string;
  religion: string;
  sex: string;
  dateOfBirth: string | null;
  bio: string;
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
  fullName: '',
  phoneNumber: '',
  university: '',
  department: '',
  faculty: '',
  year: '',
  religion: '',
  sex: '',
  dateOfBirth: null,
  bio: ''
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children, signUp }: { children: React.ReactNode; signUp: (data: SignUpData) => Promise<void> }) => {
  const [signUpData, setSignUpData] = useState<SignUpData>(defaultData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSignUpData = (data: Partial<SignUpData>) => {
    console.log('Updating signup data with:', data); // Debug log
    setSignUpData(prev => {
      const newData = { ...prev, ...data };
      console.log('New signup data:', newData); // Debug log
      return newData;
    });
  };

  const submitSignUp = async () => {
    try {
      setIsSubmitting(true);
      console.log('Submitting final signup data:', signUpData); // Debug log
      await signUp(signUpData);
      console.log('Signup completed successfully'); // Debug log
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignUpContext.Provider value={{ 
      signUpData, 
      updateSignUpData,
      submitSignUp,
      isSubmitting 
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