import { useNavigate } from 'react-router-dom';
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export const Welcome = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen w-full bg-[#750015] flex flex-col font-archivo">
      <header className="p-2 sm:p-8">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <img src="/images/varsigramlogowhite.png" className="w-10 h-10 lg:w-16 lg:h-16" alt="Welcome" />
            <h2 className="text-xl hidden lg:block text-end font-bold text-white">Varsigram</h2>
          </div>

          <div>
            <p className="text-xs lg:text-xl text-end font-bold text-white">Linkedin</p>
          </div>

          <div>
            <h2 className="text-xs lg:text-xl text-end font-bold text-white">Instagram</h2>
          </div>
          <div>
            <h2 className="text-xs lg:text-xl text-end font-bold text-white">X</h2>
          </div>
          <div>
            <Button
              variant="secondary"
              onClick={handleSignUp}
              fullWidth
              className="w-auto sm:w-auto hover:bg-white hover:text-[#750015] text-xs lg:text-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex gap-8 flex-col w-full items-center justify-center">
        <div className="text-center space-y-5 animate-fade-in max-w-[89%] lg:max-w-[65%] w-full">
          <div className="">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mobile-slide-up"> <br />
              Get your hands on the most verified information on campus with Varsigram
            </h1>
          </div>

          <div>
            <p className="text-white text-xs">
              Access real-time information on Varsigram to stay up to date on campus news, directly from verified sources. 
              Connect with other students across various departments and faculties, and showcase your talent.
            </p>
          </div>

          <div
            className="space-y-5 sm:space-y-0 sm:space-x-4 lg:space-x-9 mobile-slide-up"
            style={{ animationDelay: "200ms" }}>
            <Button
              onClick={handleSignUp}
              fullWidth
              className="sm:w-auto text-[#750015] bg-white border-2 hover:bg-transparent hover:text-white transition-all duration-300"
              variant="secondary"
              color="pink_900">
              Sign Up Now
            </Button>

            <Button
              onClick={handleLogin}
              fullWidth
              className="sm:w-auto bg-transparent border hover:bg-white hover:text-[#750015] transition-all duration-300">
              Log In
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center w-full">
          <img src="/images/welcomeframe.png" className="w-[80%]" alt="Welcome" />
        </div>
      </div>
    </div>
  );
};
