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
        className="text-[#750015] border-2 hover:bg-transparent hover:text-white hover:scale-105 transition-all"
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
      <div 
        className="absolute inset-0 w-full h-full opacity-45"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1440' height='1558' viewBox='0 0 1440 1558' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.09'%3E%3Cline x1='-73' y1='1321.06' x2='1654.87' y2='1321.06' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='583.225' x2='1654.87' y2='583.225' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='952.143' x2='1654.87' y2='952.143' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='214.303' x2='1654.87' y2='214.303' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1136.6' x2='1654.87' y2='1136.6' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='398.76' x2='1654.87' y2='398.76' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='767.682' x2='1654.87' y2='767.682' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='29.842' x2='1654.87' y2='29.842' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1228.83' x2='1654.87' y2='1228.83' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='490.994' x2='1654.87' y2='490.994' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='859.916' x2='1654.87' y2='859.916' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='122.072' x2='1654.87' y2='122.072' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1044.38' x2='1654.87' y2='1044.38' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='306.533' x2='1654.87' y2='306.533' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='675.455' x2='1654.87' y2='675.455' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='718.885' y1='-187.043' x2='718.885' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='349.963' y1='-187.043' x2='349.963' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1087.8' y1='-187.043' x2='1087.8' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='165.502' y1='-187.043' x2='165.502' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='903.342' y1='-187.043' x2='903.342' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='534.424' y1='-187.043' x2='534.424' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1272.26' y1='-187.043' x2='1272.26' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='73.2713' y1='-187.043' x2='73.2713' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='811.111' y1='-187.043' x2='811.111' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='442.189' y1='-187.043' x2='442.189' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1180.03' y1='-187.043' x2='1180.03' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='257.736' y1='-187.043' x2='257.736' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='995.576' y1='-187.043' x2='995.576' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='626.65' y1='-187.043' x2='626.65' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3Cline x1='1364.49' y1='-187.043' x2='1364.49' y2='1147.41' stroke='white' stroke-width='1.4411'/%3E%3C/g%3E%3Cg opacity='0.5'%3E%3Crect x='903.41' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.5'/%3E%3Crect x='442.258' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='533.965' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='241.109' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='350.551' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='350.551' y='885.672' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1088.13' y='-35.3164' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='995.422' y='-35.8086' width='91.7061' height='91.4801' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='165.832' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='-36.6328' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='-18.8906' y='-35.3242' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='239.797' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1364.56' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
        <div className="flex items-center gap-2">
          <img src="/images/varsigramlogowhite.png" className="w-10 h-10" alt="Varsigram logo" />
          <h2 className="text-xl font-bold hidden sm:block">Varsigram</h2>
        </div>
        <div className="flex items-center gap-6 text-sm sm:text-lg font-semibold">
          
          <Button onClick={handleSignUp} className=" bg-white text-[#750015] border-2 transition-all"><span className='text-[#750015]'>Get Started</span></Button>
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
          <img src="/images/mockups.png" alt="Varsigram app mockup" className="w-[65%] max-w-sm animate-float" />
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
      <section className="items-center justify-center text-white text-center py-20 px-6">
        <div className="bg-[#FF6682] pink-bg flex px-4 pt-4 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          width="1269"
          height="474"
          viewBox="0 0 1269 474"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            opacity="0.4"
            d="M-30.5 93C-30.5 93 158.234 508.141 453.575 508.146C748.917 508.151 983.676 -353.894 1222.22 27.2691C1460.77 408.432 270.564 272.128 476.294 27.2691C682.023 -217.59 1025.24 534 1025.24 534"
            stroke="white"
            strokeWidth="30"
          />
        </svg>
          </div>
          <div className="p-2 left text-left items-center justify-center z-10">
        <h2 className="text-3xl font-bold">
          Engage vibrant and insightful conversations with a Vars
        </h2>
        <p className="mt-4 max-w-2xl">
          Gain valuable insights by joining conversations on Varsigram that talk about growth and value.
        </p>
        <Button onClick={handleSignUp} className=" bg-white text-[#750015] border-2 transition-all">
          <span className="text-[#750015]">Get Started</span>
        </Button>
          </div>
          <div className="flex justify-center mt-10 z-10">
        <img src="/images/engage_mockup.png" alt="App mockup" className="w-[80%] max-w-md animate-float" />
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="bg-white text-[#750015] py-20 px-6 relative flex flex-col lg:flex-row items-center justify-center gap-10 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none z-0">
        <svg className='w-full h-full' width="1439" height="700" viewBox="0 0 1439 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-57 737C-57 737 475.795 87.58 700.791 87.58C925.787 87.58 740.194 577.889 974.897 553.988C1209.6 530.087 1474 7 1474 7" stroke="#FF6682" stroke-width="30"/>
        </svg>

          </div>
        <div className="lg:w-1/2 z-10">
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
