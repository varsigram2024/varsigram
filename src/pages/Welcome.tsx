import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import "../../src/styles/animations.css"
import mockups from '../../public/images/mockups/mockups.svg';
import featureMockup1 from '../../public/images/mockups/featureMockup1.svg';
import featureMockup2 from '../../public/images/mockups/featureMockup2.svg';
import featureMockup3 from "../../public/images/mockups/featureMockup3.svg";
import engageMockup from '../../public/images/mockups/engage_mockup.svg';
import popup1 from "../../public/images/mockups/popup1.svg";
import popup2 from "../../public/images/mockups/popup2.svg";
import opportunityMockup from "../../public/images/mockups/opportunityMockup.svg"
import firstVars from "../../public/images/mockups/firstVars.svg"
import footer from "../../public/images/mockups/footer.svg"

export const Welcome = () => {
  const navigate = useNavigate();
  const [isAndroid, setIsAndroid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) setIsAndroid(true);
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;

          if (entry.isIntersecting) {
            target.classList.add('animate-fade-in-up');

            // Re-trigger feature mockups each time
            if (target.classList.contains('features-section')) {
              const mockup1 = target.querySelector('.feature-mockup-1');
              const mockup2 = target.querySelector('.feature-mockup-2');
              mockup1?.classList.add('animate-in');
              mockup2?.classList.add('animate-in');
            }
          } else {
            // Remove animation classes on exit for replay
            if (target.classList.contains('features-section')) {
              const mockup1 = target.querySelector('.feature-mockup-1');
              const mockup2 = target.querySelector('.feature-mockup-2');
              mockup1?.classList.remove('animate-in');
              mockup2?.classList.remove('animate-in');
            }
          }
        });
      },
      { threshold: 0.3 } // triggers once 30% of section visible
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleSignUp = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

  const CTAButtons = () => (
    <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-6 lg:gap-10 mt-6 w-full">
      <Button
        onClick={handleSignUp}
        className=" bg-white text-[#91021c] border-2 hover:bg-transparent hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out z-10 transform hover:-translate-y-1"
      >
        Sign up now
      </Button>
      <Button
        onClick={handleLogin}
        className="flex gap-3 bg-transparent border hover:bg-white hover:text-[#750015] hover:scale-105 transition-all z-10"
      >
        Log In 
        <svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.48438 6.125L9.00506 6.12199" stroke="#ffff" strokeWidth="0.698645" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.72656 2.86328L8.98841 6.12212L5.72957 9.38396" stroke="#ffff" strokeWidth="0.698645" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      
    </div>
  );

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div className="bg-[#750015] min-h-screen space-y-16 w-full font-archivo overflow-hidden text-white">
     {/* Background Animation */}
      <div 
        className="absolute inset-0 w-full h-full opacity-100 animate-pulse-slow"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1440' height='1558' viewBox='0 0 1440 1558' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.05'%3E%3Cline x1='-73' y1='1321.06' x2='1654.87' y2='1321.06' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='583.225' x2='1654.87' y2='583.225' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='952.143' x2='1654.87' y2='952.143' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='214.303' x2='1654.87' y2='214.303' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1136.6' x2='1654.87' y2='1136.6' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='398.76' x2='1654.87' y2='398.76' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='767.682' x2='1654.87' y2='767.682' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='29.842' x2='1654.87' y2='29.842' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1228.83' x2='1654.87' y2='1228.83' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='490.994' x2='1654.87' y2='490.994' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='859.916' x2='1654.87' y2='859.916' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='122.072' x2='1654.87' y2='122.072' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='1044.38' x2='1654.87' y2='1044.38' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='306.533' x2='1654.87' y2='306.533' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='-73' y1='675.455' x2='1654.87' y2='675.455' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='718.885' y1='-187.043' x2='718.885' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='349.963' y1='-187.043' x2='349.963' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='1087.8' y1='-187.043' x2='1087.8' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='165.502' y1='-187.043' x2='165.502' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='903.342' y1='-187.043' x2='903.342' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='534.424' y1='-187.043' x2='534.424' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='1272.26' y1='-187.043' x2='1272.26' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='73.2713' y1='-187.043' x2='73.2713' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='811.111' y1='-187.043' x2='811.111' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='442.189' y1='-187.043' x2='442.189' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='1180.03' y1='-187.043' x2='1180.03' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='257.736' y1='-187.043' x2='257.736' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='995.576' y1='-187.043' x2='995.576' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='626.65' y1='-187.043' x2='626.65' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3Cline x1='1364.49' y1='-187.043' x2='1364.49' y2='1147.41' stroke='black' stroke-width='1.4411'/%3E%3C/g%3E%3Cg opacity='9.5'%3E%3Crect x='903.41' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.5'/%3E%3Crect x='442.258' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='533.965' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='241.109' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1179.84' y='149.402' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.25'/%3E%3Crect x='442.094' y='425.773' width='91.7061' height='90.396' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='350.551' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='350.551' y='885.672' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1088.13' y='-35.3164' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='995.422' y='-35.8086' width='91.7061' height='91.4801' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='165.832' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='-36.6328' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='-18.8906' y='-35.3242' width='93.0162' height='91.7061' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='72.8164' y='55.0742' width='93.0162' height='94.3262' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='165.832' y='239.797' width='91.7061' height='93.0162' fill='%23FFDBE2' fill-opacity='0.2'/%3E%3Crect x='1272.86' y='702.258' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3Crect x='1364.56' y='793.965' width='91.7061' height='91.7061' fill='%23FFDBE2' fill-opacity='0.15'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

       {/* Header */}
      <header 
        ref={(el) => addToRefs(el, 0)}
        className={`max-w-7xl mx-auto flex justify-between items-center py-4 sm:py-6 px-4 sm:px-6 lg:px-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="flex items-center gap-2">
          <img 
            src="/images/varsigramlogowhite.png" 
            className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 hover:scale-110" 
            alt="Varsigram logo" 
          />
          <h2 className="text-lg sm:text-xl font-bold hidden sm:block">Varsigram</h2>
        </div>
        <div className="flex items-center">
          <Button 
            onClick={handleSignUp} 
            className="bg-white text-[#750015] z-10 border-2 transition-all duration-300 hover:scale-105 active:scale-95 transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <span className='text-[#750015]'>Get Started</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        ref={(el) => addToRefs(el, 1)}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 transition-all duration-1000"
      >
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-[3.3rem] font-bold leading-snug lg:leading-[64px]">
            Be In The Conversation With A <span className="text-[#FF6682]">Vars</span>
          </h1>
          <p className="mt-4 text-white/90 text-sm sm:text-2xl lg:text-xl max-w-3xl">
            Access real-time information on Varsigram to stay up to date on campus news, directly from verified sources. Connect with other students across various departments and faculties, and showcase your talent.
          </p>
          <div className='mt-6 flex justify-center lg:justify-start'>
            <CTAButtons />
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center items-center gap-4 mt-8 lg:mt-0 animate-float-slow">
          <img 
            src={mockups} 
            alt="Varsigram app mockup" 
            className="w-full max-w-md lg:max-w-lg xl:max-w-xl transform transition-all duration-500 hover:scale-105" 
          />

           {isAndroid && (
        <a href="/base1.apk" download className="w-full sm:w-auto">
          <Button className="bg-transparent border mt-3 hover:bg-white hover:text-[#750015] z-10 w-full transition-all duration-300 hover:scale-105 active:scale-95 transform hover:-translate-y-1">
            <span className="transition-colors duration-300">Download App</span>
          </Button>
        </a>
      )}
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={(el) => {
          addToRefs(el, 2);
          if (el) el.classList.add('features-section');
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center transition-all duration-1000"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3.3rem] font-bold leading-tight sm:leading-snug lg:leading-[64px] animate-fade-in-up">
          Your Favorite University Student Platform
        </h1>
        <p className="mt-4 text-white/90 mx-auto text-sm sm:text-lg lg:text-xl xl:text-2xl lg:leading-[40px] max-w-4xl animate-fade-in-up delay-200">
          Build meaningful networks, follow top organisations, and join insightful campus conversations.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center mt-8 lg:mt-12 overflow-hidden">
          <div className="w-full max-w-lg lg:max-w-none h-auto lg:h-[600px] xl:h-[768px] flex flex-col justify-between items-center rounded-3xl lg:rounded-[60px] border-4 relative bg-[#750015]/30 lg:p-0 ">
            <div className='px-2 lg:px-4 flex flex-col items-center animate-fade-in-up'>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-4 lg:mt-10 px-2 lg:px-6 mb-4">
                Follow Organisations and Student Associations
              </h2>
              <p className="text-sm sm:text-base lg:text-lg">
                Get access verified campus updates on Varsigram by following verified organisations and student associations on campus.
              </p>
            </div>
            <div className="w-full flex justify-center items-end mt-8 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 animate-fade-in-up delay-300">
              <div className="relative w-full h-[260px] mb-[6px] lg:mb-[8px] max-w-xs lg:max-w-[420px] flex items-center justify-center">
                <img
                  src={featureMockup1}
                  alt="Feature mockup 1"
                  className="feature-mockup-1 w-[65%] sm:w-[75%] md:w-[85%] lg:w-[85%] lg:h-auto rounded-2xl shadow-lg z-10 absolute bottom-0 right-[30%]"
                />
                <img
                  src={featureMockup2}
                  alt="Feature mockup 2"
                  className="feature-mockup-2 w-[65%] sm:w-[75%] md:w-[85%] lg:w-[85%] lg:h-auto rounded-2xl shadow-xl z-20 absolute bottom-0 left-[30%]"
                />
              </div>
            </div>
          </div>

            <div className="w-full max-w-lg lg:max-w-none h-auto lg:h-[600px] xl:h-[768px] flex flex-col justify-between items-center rounded-3xl lg:rounded-[60px] border-4 relative bg-white lg:p-0 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl delay-200">
            <div className='px-2 lg:px-4 flex flex-col items-center text-[#3A3A3A] animate-fade-in-up delay-100'>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-4 lg:mt-10 px-2 lg:px-6 mb-4">
              Connect with coursemates across your faculty and beyond
              </h2>
              <p className='text-sm sm:text-base lg:text-lg max-w-xl'>
              Find and apply for the best internships, scholarships, and jobs all without leaving Varsigram.
              </p>
            </div>
            <div className="w-full flex justify-center items-center mt-8 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 animate-fade-in-up delay-400">
              <div className="relative w-full max-w-xs lg:max-w-[420px] h-48 lg:h-[260px] flex items-center justify-center">
              <img
                src={featureMockup3}
                alt="Feature mockup 3"
                className="w-[50%] md:w-[50%] lg:w-[65%] lg:h-auto max-w-xs lg:max-w-[420px] h-auto rounded-2xl shadow-lg z-10 transform transition-all duration-500 hover:-translate-y-2 left-1/2 -translate-x-1/2"
                style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)' }}
              />
              </div>
            </div>
            </div>
        </div>
      </section>




          {/* Conversation Section */}
      <section 
        ref={(el) => addToRefs(el, 3)}
        className="items-center justify-center text-white text-center py-16 sm:py-20 px-4 sm:px-6 transition-all duration-1000"
      >
        <div className="bg-[#FF6682] pink-bg flex flex-col lg:flex-row items-center justify-center lg:px-12 gap-6 lg:gap-8 pt-4 rounded-3xl lg:rounded-[45px] relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="absolute inset-0 w-full h-full pointer-events-none animate-pulse-slow">
            <svg
              className=""
              viewBox="0 0 1269 474"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            >
              <path
          opacity="0.4"
          d="M-30.5 93C-30.5 93 158.234 508.141 453.575 508.146C748.917 508.151 983.676 -353.894 1222.22 27.2691C1460.77 408.432 270.564 272.128 476.294 27.2691C682.023 -217.59 1025.24 534 1025.24 534"
          stroke="white"
          strokeWidth="30"
              />
            </svg>
          </div>
          
          <div className="flex p-4 sm:p-6 lg:p-12 flex-col text-center lg:text-left items-center lg:items-start justify-center space-y-4 lg:space-y-6 max-w-2xl z-10 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Engage vibrant and insightful conversations with a <span className='text-[#750015] animate-pulse'>Vars</span>
            </h2>
            <p className="mt-2 lg:mt-4 max-w-2xl text-sm sm:text-base">
              Gain valuable insights by joining conversations on Varsigram that talk about growth and value.
            </p>
            <div className="flex justify-center lg:justify-start animate-fade-in-up delay-200">
              <Button onClick={handleSignUp} className="bg-white text-[#750015] border-2 transition-all duration-300 hover:scale-105 active:scale-95 transform hover:-translate-y-1 text-sm sm:text-base">
                <span className="text-[#750015]">Get Started</span>
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6 lg:mt-10 z-10 w-[75%] lg:w-1/2 animate-fade-in-up delay-300">
              <div className='relative w-full h-full flex justify-center items-center'>
                <img 
                  src={engageMockup} 
                  alt="App mockup" 
                  className="w-[85%] sm:w-4/5 lg:w-1/2" 
                />
                
                <div className="w-4/5 lg:w-1/2 absolute bottom-36 xl:bottom-56 left-[-0.5rem] lg:left-10 scale-75 lg:scale-100 pointer-events-none">
                  <img
                    src={popup1}
                    alt="Popup 1"
                    className="popup-image popup-image--one w-full"
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <img
                    src={popup2}
                    alt="Popup 2"
                    className="popup-image popup-image--two w-full"
                    aria-hidden="true"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section 
        ref={(el) => addToRefs(el, 4)}
        className="bg-white text-[#750015] pt-16 sm:pt-20 px-4 sm:px-6 relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 max-w-7xl mx-auto transition-all duration-1000"
      >
        <div className="absolute inset-0 pointer-events-none animate-pulse-slow">
          <svg className='w-full h-full' width="1439" height="700" viewBox="0 0 1439 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-57 737C-57 737 475.795 87.58 700.791 87.58C925.787 87.58 740.194 577.889 974.897 553.988C1209.6 530.087 1474 7 1474 7" stroke="#FF6682" strokeWidth="30"/>
          </svg>
        </div>
        <div className="lg:w-1/2 z-10 text-center lg:text-left animate-fade-in-up">
          <h3 className="text-2xl sm:text-3xl font-bold"><span className='text-[#3a3a3a]'>Your Opportunities,</span> All in One Place</h3>
          <p className="mt-4 text-[#3a3a3a] text-sm sm:text-base">
            Find and apply for the best internships, scholarships, and jobs all without leaving Varsigram. Simple, fast, and personalized. No long messages. No stress. Just opportunities.
          </p>
          <p className="mt-2 text-sm animate-pulse">Coming Soon →</p>
        </div>
        <div className="lg:w-1/2 z-10 mt-8 lg:mt-0 animate-fade-in-up delay-200">
          <img 
            src={opportunityMockup} 
            alt="Internship mockup" 
            className="w-full max-w-md mx-auto z-10 transform transition-all duration-500" 
          />
        </div>
      </section>

      {/* Ready Section */}
      <section 
        ref={(el) => addToRefs(el, 5)}
        className="bg-[#FFDBE2] text-[#750015] pt-16 sm:pt-20 px-4 sm:px-6 relative flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-10 max-w-7xl mx-auto transition-all duration-1000"
      >
        <div className="absolute inset-0 pointer-events-none animate-pulse-slow">
          <svg className='w-full h-full' width="1439" height="700" viewBox="0 0 1439 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-57 737C-57 737 475.795 87.58 700.791 87.58C925.787 87.58 740.194 577.889 974.897 553.988C1209.6 530.087 1474 7 1474 7" stroke="#FF6682" strokeWidth="30"/>
          </svg> 
        </div>

        <div className="lg:w-1/2 z-10 mt-8 lg:mt-0 animate-fade-in-up">
          <img 
            src={firstVars} 
            alt="First Vars mockup" 
            className="w-full max-w-md mx-auto z-10 transform transition-all duration-500" 
          />
        </div>

        <div className="lg:w-1/2 z-10 text-center lg:text-left animate-fade-in-up delay-200">
          <h1 className="text-[#3a3a3a] text-2xl sm:text-3xl lg:text-4xl xl:text-[3.3rem] font-semibold leading-tight sm:leading-snug lg:leading-[64px] mb-6 lg:mb-10">
            Ready to make your <span className='text-[#750015] animate-pulse'>FIRST</span> Vars?
          </h1>
          <div className="hidden lg:flex justify-center lg:justify-start">
            <Button
              onClick={handleSignUp}
              className="bg-[#750015] hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 transform hover:-translate-y-1 z-10 text-sm sm:text-base"
            >
              <span className='text-white hover:text-[#750015] transition-colors duration-300'>Sign up now</span>
            </Button>
          </div>
          {isAndroid && (
        <a href="/base1.apk" download className="w-full sm:w-auto">
          <Button className="bg-transparent border mt-3 hover:bg-white hover:text-[#750015] z-10 w-full transition-all duration-300 hover:scale-105 active:scale-95 transform hover:-translate-y-1">
            <span className="transition-colors duration-300">Download App</span>
          </Button>
        </a>
      )}
        </div>
      </section>

      {/* Footer Section */}
<section 
  ref={(el) => addToRefs(el, 6)}
  className="w-full flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-20 transition-all duration-1000 bg-cover bg-center relative"
  style={{
    backgroundImage: `url(${footer})`,
  }}
>
  {/* Overlay for opacity */}
  <div className="absolute inset-0 bg-white bg-opacity-40"></div>
  
  <div className="max-w-7xl w-full flex items-center justify-center lg:justify-start transform transition-all duration-500 hover:scale-[1.02] relative z-10">
    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white drop-shadow-md pointer-events-none px-4 sm:px-8 animate-fade-in-up">
      Join 500+ on <span className="text-[#FF6682] mx-2 animate-pulse">Varsigram</span> today!
    </h2>
  </div>
</section>

      <style>{`
  /* Base animations */
  @keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }


  .feature-mockup-1 { transform: rotate(20deg); transition: transform 1s ease-in-out; }
  .feature-mockup-2 { transform: rotate(-20deg); transition: transform 1s ease-in-out; }
  .feature-mockup-1.animate-in,
  .feature-mockup-2.animate-in {
    transform: rotate(0deg) scale(1.05);
  }

  .popup-image {
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  transform-origin: bottom center;
  will-change: transform, opacity;
  max-width: 220px; /* adjust as needed for your layout */
  transition-timing-function: ease-in-out;
  z-index: 30;
}

/* First popup: main entrance early in the cycle */
.popup-image--one {
  bottom: 35px;
  animation: popup-one 12s infinite ease-in-out;
  animation-delay: 1.2s; /* staggers the two animations */
  animation-fill-mode: both; /* keeps computed styles during/after animation */
  z-index: 30;
}

/* Second popup: offset in x/y and delayed so they alternate */
.popup-image--two {
  left: 0;   /* small horizontal offset so they don't perfectly overlap */
  bottom: 0;  /* small vertical offset */
  animation: popup-two 6s infinite ease-in-out;
  animation-delay: 1.2s; /* staggers the two animations */
  animation-fill-mode: forwards;
  z-index: 20;
}


`}</style>
    </div>
  );
};
