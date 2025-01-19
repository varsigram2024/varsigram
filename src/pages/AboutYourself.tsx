import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export const AboutYourself = () => {
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <header className="p-6">
        <Logo />
      </header>
      <div className="max-w-[600px] mx-auto mt-12 p-12 bg-[#E6E6E699] rounded-t-[20px]">
        <h1 className="text-[32px] font-bold mb-2">Tell us about yourself</h1>
        <p className="text-base text-[#4D4D4D] mb-9">
          Fill in your personal details to tailor your experience just for you.
        </p>

        <div className="space-y-6">
          <div className="relative">
            <button
              className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
              onClick={() => {/* Add dropdown logic */}}
            >
              <span className="text-base">{gender || 'Gender'}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <button
              className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
              onClick={() => {/* Add dropdown logic */}}
            >
              <span className="text-base">{religion || 'Religion'}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <button
                className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
                onClick={() => {/* Add dropdown logic */}}
              >
                <span className="text-base">{day || 'Day'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <button
                className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
                onClick={() => {/* Add dropdown logic */}}
              >
                <span className="text-base">{month || 'Month'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <button
                className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white"
                onClick={() => {/* Add dropdown logic */}}
              >
                <span className="text-base">{year || 'Year'}</span>
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Button fullWidth>Continue</Button>
        </div>
      </div>
    </div>
  );
};