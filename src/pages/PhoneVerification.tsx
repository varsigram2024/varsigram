import { useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useSignUp } from "../auth/SignUpContext";

const countryCodes = [
  { code: "+234", flag: "https://flagcdn.com/w40/ng.png", name: "Nigeria" },
  { code: "+233", flag: "https://flagcdn.com/w40/gh.png", name: "Ghana" },
  { code: "+27", flag: "https://flagcdn.com/w40/za.png", name: "South Africa" },
  { code: "+254", flag: "https://flagcdn.com/w40/ke.png", name: "Kenya" },
];

interface PhoneVerificationProps {
  onNext: () => void;
}

export const PhoneVerification = ({ onNext }: PhoneVerificationProps) => {
  const { updateSignUpData } = useSignUp();
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    // Simply store the phone number and move to next step
    updateSignUpData({ phoneNumber });
    console.log('Stored phone number:', phoneNumber); // Debug log
    onNext();
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
        <h1 className="text-[36px] sm:text-[45px] font-semibold mb-2 sm:mb-8">
          Phone Number
        </h1>
        <p className="text-sm text-[#3A3A3A] mb-8">
          Enter your phone number
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
          <div className="relative z-50 flex gap-3 mb-6 animate-slide-up">
            <div className="relative">
              <button
                onClick={() => setShowCountryList(!showCountryList)}
                className="w-[132px] h-14 px-4 flex items-center justify-between border border-[#B0B0B0] rounded-lg bg-white hover:border-[#750015] transition-colors">
                <span className="flex items-center gap-2">
                  <img
                    src={countryCode.flag}
                    alt={countryCode.name}
                    className="w-6 h-4 object-cover"
                  />
                  <span>{countryCode.code}</span>
                </span>
                <ChevronDown className="w-5 h-5" />
              </button>

              {showCountryList && (
                <div className="absolute top-full left-0 w-[200px] mt-1 bg-white border border-[#B0B0B0] rounded-lg shadow-lg">
                  {countryCodes.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setCountryCode(country);
                        setShowCountryList(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-6 h-4 object-cover"
                      />
                      <span className="text-sm">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={!phoneNumber}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};
