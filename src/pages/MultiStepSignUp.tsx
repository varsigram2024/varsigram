// src/pages/MultiStepSignUp.tsx
import { useState } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { SignUpForm } from './SignUpForm';
import { PhoneVerification } from './PhoneVerification';
import { AcademicDetails } from './AcademicDetails';
import { AboutYourself } from './AboutYourself';
import { AcademicLevel } from './AcademicLevel';
import { useSignUp } from '../auth/SignUpContext';

const TOTAL_STEPS = 5;

export const MultiStepSignUp = ({ onLogin }: { onLogin: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { signUpData, updateSignUpData } = useSignUp();

  const handleNext = () => {
    console.log('Current step:', currentStep); // Debug log
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Submit all collected data
      await signUp(signUpData);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SignUpForm onNext={handleNext} onLogin={onLogin} />;
      case 2:
        return <PhoneVerification onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <AcademicDetails onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <AboutYourself onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <AcademicLevel onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <div className="max-w-fit mx-auto ">
        {renderStep()}
      </div>
    </div>
  );
};