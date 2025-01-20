import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-[#750015] flex flex-col font-archivo">
      <header className="p-6 sm:p-8">
        <div className="max-w-[391px] mx-auto sm:mx-0">
          <Logo />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="text-center space-y-6 animate-fade-in max-w-[391px] w-full">
          <h1 className="text-4xl font-bold text-white mobile-slide-up">
            Welcome to VARSIGRAM
          </h1>
          <div
            className="space-y-4 sm:space-y-0 sm:space-x-4 mobile-slide-up"
            style={{ animationDelay: "200ms" }}>
            <Button
              variant="secondary"
              onClick={onLogin}
              fullWidth
              className="sm:w-auto hover:bg-white hover:text-[#750015] transition-all duration-300">
              Log In
            </Button>
            <Button
              variant="secondary"
              onClick={onSignUp}
              fullWidth
              className="sm:w-auto hover:bg-white hover:text-[#750015] transition-all duration-300">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
