import { useNavigate } from 'react-router-dom';
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useEffect, useState } from 'react';


export const Welcome = () => {
  const navigate = useNavigate();
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect if user is on Android
    if (/Android/i.test(navigator.userAgent)) {
      setIsAndroid(true);
    }
  }, []);


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
            <h2 className="hidden text-xl font-bold text-white lg:block text-end">Varsigram</h2>
          </div>

          <div>
            <a href="https://www.linkedin.com/company/varsigram/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white lg:text-xl text-end">Linkedin</a>
          </div>

          <div>
            <a href="https://www.instagram.com/thevarsigram?igsh=YzljYTk1ODg3Zg==" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white lg:text-xl text-end">Instagram</a>
          </div>
          
          <div>
            <a href="https://x.com/thevarsigram?t=7jkCKWXhaPOe1o9Sn99SLg&s=08" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-white lg:text-xl text-end">X</a>
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

      <div className="flex flex-col items-center justify-center flex-1 w-full gap-8">
        <div className="text-center space-y-5 animate-fade-in max-w-[89%] lg:max-w-[65%] w-full">
          <div className="">
            <h1 className="text-2xl font-bold text-white lg:text-3xl mobile-slide-up"> <br />
              Get your hands on the most verified information on campus with Varsigram
            </h1>
          </div>

          <div>
            <p className="text-xs text-white">
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

          {/* ✅ Show only for Android users */}
          {isAndroid && (
            <a href="/base1.apk" download className="mt-4">
              <Button
                className="sm:w-auto bg-transparent mt-3 border hover:bg-white hover:text-[#750015] transition-all duration-300">
                Download here
              </Button>
            </a>
          )}

        </div>

        <div className="flex items-center justify-center w-full">
          <img src="/images/welcomeframe.png" className="w-[80%]" alt="Welcome" />
        </div>
      </div>
    </div>
  );
};
