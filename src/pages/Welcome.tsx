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
    <div className="min-h-screen w-full bg-[#750015] flex flex-col font-archivo relative overflow-hidden">
      {/* SVG Grid Pattern Background */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1440' height='1558' viewBox='0 0 1440 1558' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.09'%3E%3Cline x1='-73' y1='1321.06' x2='1654.87' y2='1321.06' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='583.225' x2='1654.87' y2='583.225' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='952.143' x2='1654.87' y2='952.143' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='214.303' x2='1654.87' y2='214.303' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1136.6' x2='1654.87' y2='1136.6' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='398.76' x2='1654.87' y2='398.76' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='767.682' x2='1654.87' y2='767.682' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='29.842' x2='1654.87' y2='29.842' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1228.83' x2='1654.87' y2='1228.83' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='490.994' x2='1654.87' y2='490.994' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='859.916' x2='1654.87' y2='859.916' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='122.072' x2='1654.87' y2='122.072' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1044.38' x2='1654.87' y2='1044.38' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='306.533' x2='1654.87' y2='306.533' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='675.455' x2='1654.87' y2='675.455' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='718.885' y1='-187.043' x2='718.885' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='349.963' y1='-187.043' x2='349.963' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1087.8' y1='-187.043' x2='1087.8' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='165.502' y1='-187.043' x2='165.502' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='903.342' y1='-187.043' x2='903.342' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='534.424' y1='-187.043' x2='534.424' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1272.26' y1='-187.043' x2='1272.26' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='73.2713' y1='-187.043' x2='73.2713' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='811.111' y1='-187.043' x2='811.111' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='442.189' y1='-187.043' x2='442.189' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1180.03' y1='-187.043' x2='1180.03' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='257.736' y1='-187.043' x2='257.736' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='995.576' y1='-187.043' x2='995.576' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='626.65' y1='-187.043' x2='626.65' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1364.49' y1='-187.043' x2='1364.49' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3C/g%3E%3Cg opacity='0.5'%3E%3Crect x='903.41' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.5'/%3E%3Crect x='442.258' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='533.965' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='241.109' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='350.551' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='350.551' y='885.672' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1088.13' y='-35.3164' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='995.422' y='-35.8086' width='91.7061' height='91.4801' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='165.832' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='-36.6328' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='-18.8906' y='-35.3242' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='239.797' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1364.56' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }

          .animate-fadeInDown {
            animation: fadeInDown 0.8s ease-out;
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.8s ease-out;
          }

          .animate-slideInRight {
            animation: slideInRight 0.8s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.8s ease-out;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-pulse-subtle {
            animation: pulse 2s ease-in-out infinite;
          }

          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          .delay-100 {
            animation-delay: 0.1s;
          }

          .delay-200 {
            animation-delay: 0.2s;
          }

          .delay-300 {
            animation-delay: 0.3s;
          }

          .delay-400 {
            animation-delay: 0.4s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }

          .delay-600 {
            animation-delay: 0.6s;
          }

          .delay-700 {
            animation-delay: 0.7s;
          }

          .delay-800 {
            animation-delay: 0.8s;
          }

          /* Initially hide animated elements */
          .animate-fadeInUp,
          .animate-fadeInDown,
          .animate-slideInLeft,
          .animate-slideInRight,
          .animate-scaleIn {
            opacity: 0;
            animation-fill-mode: forwards;
          }

          /* Hover effects */
          .hover-lift:hover {
            transform: translateY(-2px);
            transition: transform 0.3s ease;
          }

          .hover-glow:hover {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            transition: box-shadow 0.3s ease;
          }
        `}</style>

        <header className="p-2 sm:p-8 animate-fadeInDown">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center animate-slideInLeft delay-100 hover-lift">
              <img 
                src="/images/varsigramlogowhite.png" 
                className="w-10 h-10 lg:w-16 lg:h-16 animate-pulse-subtle" 
                alt="Welcome" 
              />
              <h2 className="hidden text-xl font-bold text-white lg:block text-end animate-shimmer">
                Varsigram
              </h2>
            </div>

            <div className="animate-slideInRight delay-200 hover-lift">
              <a 
                href="https://www.linkedin.com/company/varsigram/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-white lg:text-xl text-end hover:text-blue-300 transition-colors duration-300"
              >
                Linkedin
              </a>
            </div>

            <div className="animate-slideInRight delay-300 hover-lift">
              <a 
                href="https://www.instagram.com/thevarsigram?igsh=YzljYTk1ODg3Zg==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-white lg:text-xl text-end hover:text-pink-300 transition-colors duration-300"
              >
                Instagram
              </a>
            </div>

            <div className="animate-slideInRight delay-400 hover-lift">
              <a 
                href="https://x.com/thevarsigram?t=7jkCKWXhaPOe1o9Sn99SLg&s=08" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-bold text-white lg:text-xl text-end hover:text-blue-400 transition-colors duration-300"
              >
                X
              </a>
            </div>

            <div className="animate-slideInRight delay-500">
              <Button
                variant="secondary"
                onClick={handleSignUp}
                fullWidth
                className="w-auto sm:w-auto hover:bg-white hover:text-[#750015] text-xs lg:text-xl transition-all duration-300 hover-glow hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center flex-1 w-full gap-8">
          <div className="text-center space-y-5 animate-fadeInUp delay-300 max-w-[89%] lg:max-w-[65%] w-full">
            <div className="animate-scaleIn delay-400">
              <h1 className="text-2xl font-bold text-white lg:text-3xl"> 
                <br />
                <span className="inline-block animate-fadeInUp delay-500">
                  Be In The 
                  <span className="text-[#FF6682] animate-pulse"> Conversation</span> With A  
                  <span className="text-[#FF6682] animate-bounce"> Vars</span>
                </span>
              </h1>
            </div>

            <div className="space-y-5 sm:space-y-0 sm:space-x-4 lg:space-x-9 animate-fadeInUp delay-800">
              <Button
                onClick={handleSignUp}
                fullWidth
                className="sm:w-auto text-[#750015] bg-white border-2 hover:bg-transparent hover:text-white transition-all duration-300 hover:scale-105 hover-glow transform"
                variant="secondary"
                color="pink_900"
              >
                Sign Up Now
              </Button>

              <Button
                onClick={handleLogin}
                fullWidth
                className="sm:w-auto bg-transparent border hover:bg-white hover:text-[#750015] transition-all duration-300 hover:scale-105 hover-glow transform"
              >
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

          <div className="flex items-center justify-center w-full overflow-hidden animate-scaleIn delay-1000" style={{ 
            WebkitAnimationPlayState: 'running',
            animationPlayState: 'running'
          }}>
            <img 
              src="/images/welcomeframe.png" 
              className="w-[85%] h-[120%] animate-float hover:scale-105 transition-transform duration-500" 
              alt="Welcome"
              style={{ 
                WebkitAnimationPlayState: 'running',
                animationPlayState: 'running'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};