import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

const countryCodes = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
];

export const PhoneVerification = () => {
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Add phone verification logic here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-archivo">
      <header className="p-6">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Logo />
        </div>
      </header>

      <div className="max-w-[398px] mx-auto px-6 mt-12">
        <h1 className="text-[24px] sm:text-[32px] font-bold mb-2 animate-fade-in">
          Enter your Phone number
        </h1>
        <p className="text-base text-[#4D4D4D] mb-8 animate-slide-up">
          Input your phone number to stay connected and secure your account.
        </p>

        <div className="flex gap-3 mb-6 animate-slide-up">
          <div className="relative">
            <button
              onClick={() => setShowCountryList(!showCountryList)}
              className="w-[132px] h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6">{countryCode.flag}</span>
                <span>{countryCode.code}</span>
              </span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {showCountryList && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg z-10">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setCountryCode(country);
                      setShowCountryList(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <span className="w-6 h-6">{country.flag}</span>
                    <span>{country.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 h-14 px-4 border border-[#B0B0B0] rounded-lg focus:outline-none focus:border-[#750015] focus:ring-1 focus:ring-[#750015]"
          />
        </div>

        <Button
          fullWidth
          onClick={handleContinue}
          loading={isLoading}
          disabled={!phoneNumber}
          className="animate-slide-up">
          Continue
        </Button>
      </div>
    </div>
  );
};
