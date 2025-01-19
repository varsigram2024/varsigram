import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

export const PhoneVerification = () => {
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <header className="p-6">
        <Logo />
      </header>
      <div className="max-w-[467px] mx-auto mt-12">
        <h1 className="text-[32px] font-bold mb-2">Enter your Phone number</h1>
        <p className="text-base text-[#4D4D4D] mb-8">
          Input your phone number to stay connected and secure your account.
        </p>
        <div className="flex gap-3 mb-6">
          <div className="relative w-[132px]">
            <button
              className="w-full h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg"
            >
              <span className="flex items-center gap-2">
                <span className="w-6 h-6">🇳🇬</span>
                <span>{countryCode}</span>
              </span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 h-14 px-4 border border-[#B0B0B0] rounded-lg focus:outline-none focus:border-[#750015] focus:ring-1 focus:ring-[#750015]"
          />
        </div>
        <Button fullWidth>Continue</Button>
      </div>
    </div>
  );
};