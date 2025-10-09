// src/pages/Welcome.tsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';

export const Welcome = () => {
  const navigate = useNavigate();
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) setIsAndroid(true);
  }, []);

  const handleSignUp = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

  const CTAButtons = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <Button
        onClick={handleSignUp}
        className="bg-white text-[#750015] border-2 hover:bg-transparent hover:text-white hover:scale-105 transition-all"
      >
        Sign Up Now
      </Button>
      <Button
        onClick={handleLogin}
        className="bg-transparent border hover:bg-white hover:text-[#750015] hover:scale-105 transition-all"
      >
        Log In
      </Button>
      {isAndroid && (
        <a href="/base1.apk" download>
          <Button className="bg-transparent border mt-3 hover:bg-white hover:text-[#750015]">
            Download App
          </Button>
        </a>
      )}
    </div>
  );

  return (
    <div className="bg-[#750015] min-h-screen w-full font-archivo overflow-hidden text-white">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
        <div className="flex items-center gap-2">
          <img src="/images/varsigramlogowhite.png" className="w-10 h-10" alt="Varsigram logo" />
          <h2 className="text-xl font-bold hidden sm:block">Varsigram</h2>
        </div>
        <div className="flex items-center gap-6 text-sm sm:text-lg font-semibold">
          <a href="https://www.linkedin.com/company/varsigram/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/thevarsigram" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://x.com/thevarsigram" target="_blank" rel="noreferrer">X</a>
          <Button onClick={handleSignUp} className="bg-white text-[#750015] hover:bg-transparent hover:text-white transition-all">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
            Be In The <span className="text-[#FF6682]">Conversation</span> With A <span className="text-[#FF6682]">Vars</span>
          </h1>
          <p className="mt-4 text-white/90">
            Access real-time campus news directly from verified sources. Connect with students across faculties and showcase your talent.
          </p>
          <CTAButtons />
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img src="/images/mockups.png" alt="Varsigram app mockup" className="w-[80%] max-w-sm animate-float" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Your Favorite University Student Platform</h2>
        <p className="mt-4 text-white/90 max-w-2xl mx-auto">
          Build meaningful networks, follow top organisations, and join insightful campus conversations.
        </p>
        <img src="/images/frame2.png" alt="Features mockup" className="mx-auto mt-10 w-[80%] max-w-3xl" />
      </section>

      {/* Conversation Section */}
      <section className=" text-white text-center py-20 px-6">
       <div className='bg-[#FF6682] flex'>
        <div>
           <h2 className="text-3xl font-bold">
          Engage vibrant and insightful conversations with a Vars</h2>
        <p className="mt-4 max-w-2xl mx-auto">
          Gain valuable insights by joining conversations on Varsigram that talk about growth and value.
        </p>
        <CTAButtons />
        </div>
        <div className="flex justify-center mt-10">
          <img src="/images/engage_mockup.png" alt="App mockup" className="w-[80%] max-w-md animate-float" />
        </div>
       </div>
      </section>

      {/* Opportunities Section */}
      <section className="bg-white text-[#750015] py-20 px-6 flex flex-col lg:flex-row items-center justify-center gap-10 max-w-7xl mx-auto">
        <div className="lg:w-1/2">
          <h3 className="text-3xl font-bold">Your Opportunities, All in One Place</h3>
          <p className="mt-4 text-[#750015]/80">
            Find and apply for the latest internships, scholarships, and jobs on Varsigram. Simple, fast, and personalized.
          </p>
          <p className="mt-2 text-sm">Coming Soon →</p>
        </div>
        <div className="lg:w-1/2">
          <img src="/images/internship_mockup.png" alt="Internship mockup" className="w-[90%] mx-auto" />
        </div>
      </section>
    </div>
  );
};
