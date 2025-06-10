// src/components/ProgressBar.tsx
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
  }
  
  export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const progress = (currentStep / totalSteps) * 100;
  
    return (
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-[#750015] h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index + 1 <= currentStep ? 'bg-[#750015] text-white' : 'bg-gray-200'
              }`}>
                {index + 1}
              </div>
              <span className="mt-1">
                {getStepName(index + 1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const getStepName = (step: number) => {
    switch (step) {
      case 1: return 'Account';
      case 2: return 'Phone';
      case 3: return 'Academic';
      case 4: return 'About';
      case 5: return 'Level';
      default: return '';
    }
  };