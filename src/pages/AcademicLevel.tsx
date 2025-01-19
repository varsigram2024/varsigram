import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

const levels = ['100', '200', '300', '400', '500'];

export const AcademicLevel = () => {
  const [selectedLevel, setSelectedLevel] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <header className="p-6">
        <Logo />
      </header>
      <div className="max-w-[599px] mx-auto mt-12 p-12 bg-[#E6E6E699] rounded-t-[20px]">
        <h1 className="text-[32px] font-bold mb-2">Enter your academic details</h1>
        <p className="text-base text-[#4D4D4D] mb-[52px]">
          Select your level
        </p>

        <div className="space-y-6">
          <div className="relative">
            <button
              className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
              onClick={() => {/* Add dropdown logic */}}
            >
              <span className="text-base">{selectedLevel || 'Level'}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <Button fullWidth>Continue</Button>
        </div>
      </div>
    </div>
  );
};