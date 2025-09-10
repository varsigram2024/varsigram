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
        </div>

        <div className="flex items-center justify-center w-full animate-scaleIn delay-1000" style={{ 
          WebkitAnimationPlayState: 'running',
          animationPlayState: 'running'
        }}>
          <img 
            src="/images/welcomeframe.png" 
            className="w-[80%] animate-float hover:scale-105 transition-transform duration-500" 
            alt="Welcome"
            style={{ 
              WebkitAnimationPlayState: 'running',
              animationPlayState: 'running'
            }}
          />
        </div>
      </div>
    </div>
  );
};