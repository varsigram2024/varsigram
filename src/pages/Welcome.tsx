import { Logo } from '../components/Logo';
import { Button } from '../components/Button';

interface WelcomeProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const Welcome = ({ onLogin, onSignUp }: WelcomeProps) => {
  return (
    <div className="min-h-screen bg-[#750015] flex flex-col font-['Archivo']">
      <header className="p-6">
        <Logo />
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold text-white">Welcome to VARSIGRAM</h1>
          <div className="space-x-4">
            <Button 
              variant="secondary" 
              onClick={onLogin}
              className="hover:bg-white hover:text-[#750015] transition-colors duration-300"
            >
              Log In
            </Button>
            <Button 
              variant="secondary" 
              onClick={onSignUp}
              className="hover:bg-white hover:text-[#750015] transition-colors duration-300"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};