import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { FaLinkedinIn, FaInstagram, FaPaperPlane } from "react-icons/fa";
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    console.log("Submitted email:", inputValue);
    setInputValue("");
  };

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
            const mockup3 = target.querySelector('.feature-mockup-3');
            mockup1?.classList.add('animate-in');
            mockup2?.classList.add('animate-in');
            mockup3?.classList.add('animate-in');
          }

          // Trigger popup animations on scroll
          if (target.classList.contains('conversation-section')) {
            const popup1 = target.querySelector('.popup-image--one');
            const popup2 = target.querySelector('.popup-image--two');
            popup1?.classList.add('animate-in');
            popup2?.classList.add('animate-in');
          }
        } else {
          // Remove animation classes on exit for replay
          if (target.classList.contains('features-section')) {
            const mockup1 = target.querySelector('.feature-mockup-1');
            const mockup2 = target.querySelector('.feature-mockup-2');
            const mockup3 = target.querySelector('.feature-mockup-3');
            mockup1?.classList.remove('animate-in');
            mockup2?.classList.remove('animate-in');
            mockup3?.classList.remove('animate-in');
          }
          
          // Remove popup animations on exit for replay
          if (target.classList.contains('conversation-section')) {
            const popup1 = target.querySelector('.popup-image--one');
            const popup2 = target.querySelector('.popup-image--two');
            popup1?.classList.remove('animate-in');
            popup2?.classList.remove('animate-in');
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
        className=" bg-white !text-[#91021c] border-2 hover:bg-transparent hover:!text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out z-10 transform hover:-translate-y-1"
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
      <Button
        onClick={() => navigate('/knowme')}
        className="bg-transparent border hover:bg-white hover:text-[#750015] hover:scale-105 transition-all z-10"
      >
        KnowMe
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
        className={`max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="flex items-center gap-2">
          <svg width="67" height="47" viewBox="0 0 67 47" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M56.765 0.911716C56.8533 0.90329 56.9422 0.900541 57.0308 0.903486C57.5942 0.924193 59.2848 1.26086 59.6953 1.53087C61.0564 2.42616 65.949 5.7654 66.8543 6.73992C66.8991 7.09533 61.8075 13.8833 61.2095 14.7002L50.5635 29.2478L43.1345 39.4056C41.8344 41.1851 38.7992 46.0284 36.7442 46.4363C35.4091 47.3546 32.4206 46.7652 31.1101 45.9648C27.3775 43.6849 25.4603 39.8162 28.2886 35.9028C30.1458 33.3332 32.0511 30.7417 33.9269 28.178L44.8447 13.2572L49.9285 6.30636C52.2557 3.12806 52.6827 1.64025 56.765 0.911716Z" fill="white"/>
              <path d="M32.4137 3.00064C32.6236 2.98821 32.8337 2.98149 33.0438 2.98048C36.3236 2.97516 38.032 4.86144 40.1231 6.97254L43.2201 10.0793C39.4153 15.263 35.2043 20.5858 31.2928 25.7159L26.919 31.4511C25.5105 33.2966 24.7179 34.7248 22.6498 35.8944C21.9842 36.1452 21.5561 36.3326 20.8386 36.4308C18.6996 36.7234 17.4007 36.1243 15.7207 34.9327C14.0282 33.7323 12.9491 32.5388 12.5376 30.4316C12.2554 28.9867 12.6329 27.0689 13.4989 25.881C17.126 20.9057 20.7746 15.9385 24.4084 10.9662L27.4401 6.80751C29.0766 4.56548 29.467 3.48899 32.4137 3.00064Z" fill="white"/>
              <path d="M7.97934 5.93301C12.7144 5.74548 17.3731 9.24299 20.8482 12.1335L14.8369 19.4656C13.8461 20.6706 12.1838 22.8128 11.0989 23.8335C8.23516 26.055 5.23761 25.8523 2.50478 23.6716C0.902919 22.3933 0.455457 21.3527 0.161703 19.3411C-0.348086 15.85 0.331052 11.9103 2.43334 9.0284C3.99184 6.98919 5.49943 6.27867 7.97934 5.93301Z" fill="white"/>
              </svg>

          <h2 className="text-lg sm:text-xl font-bold sm:block">Varsigram</h2>
        </div>
        <div className="items-center hidden lg:flex">
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
          <div className="w-full max-w-lg lg:max-w-none h-auto lg:h-[600px] xl:h-[768px] flex flex-col justify-between items-center rounded-3xl lg:rounded-[60px] border-4 relative bg-[#750015]/30 lg:p-0  overflow-hidden">
            <div className='px-2 lg:px-4 flex flex-col items-center animate-fade-in-up'>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mt-4 lg:mt-10 px-2 lg:px-6 mb-4">
                Follow Organisations and Student Associations
              </h2>
              <p className="text-sm sm:text-base lg:text-lg">
                Get access verified campus updates on Varsigram by following verified organisations and student associations on campus.
              </p>
            </div>
            <div className="w-full flex justify-center items-end mt-8 lg:mt-0 lg:absolute lg:bottom-0 lg:left-0 animate-fade-in-up delay-300">
              <div className="relative w-full h-[260px] max-w-xs lg:max-w-[420px] flex items-center justify-center">
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
                  className="feature-mockup-3 w-[50%] md:w-[50%] lg:w-[65%] lg:h-auto max-w-xs lg:max-w-[420px] h-auto rounded-2xl shadow-lg z-10 transform transition-all duration-500 hover:-translate-y-2 left-1/2 -translate-x-1/2"
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
              className="conversation-section items-center justify-center text-white text-center py-16 sm:py-20 px-4 sm:px-6 transition-all duration-1000"
            >
              <div className="bg-[#FF6682] pink-bg flex flex-col lg:flex-row items-center justify-center lg:px-12 gap-6 lg:gap-8 pt-4 rounded-3xl lg:rounded-[45px] relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                
                {/* Decorative background stroke */}
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

                {/* Left text column */}
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

                {/* Right phone + popups */}
                <div className="flex justify-center items-center mt-6 lg:mt-10 z-10 w-[75%] lg:w-1/2 animate-fade-in-up delay-300">
                  <div className="relative w-full h-full flex justify-center items-center">
                    {/* Phone mockup */}
                    <img 
                      src={engageMockup} 
                      alt="App mockup" 
                      className="w-[85%] sm:w-4/5 lg:w-1/2 relative z-10" 
                    />

                    {/* Popup overlays */}
                    <div className="w-4/5 lg:w-1/2 absolute bottom-36 xl:bottom-56 left-0 lg:left-0 z-20 scale-90 lg:scale-100 pointer-events-none">
                      <img
                        src={popup1}
                        alt="Popup 1"
                        className="popup-image popup-image--one absolute -top-12 left-0 w-[85%] max-w-xs rounded-2xl shadow-xl border border-white/20 bg-white opacity-0"
                        loading="lazy"
                      />
                      <img
                        src={popup2}
                        alt="Popup 2"
                        className="popup-image popup-image--two absolute top-12 right-6 w-[85%] max-w-xs rounded-2xl shadow-xl border border-white/20 bg-white opacity-0"
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
        className="bg-white text-[#750015] pt-16 sm:pt-20 px-4 sm:px-6 relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10 w-[100vw] mx-auto transition-all duration-1000"
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
        className="bg-[#FFDBE2] text-[#750015] pt-16 sm:pt-20 px-4 sm:px-6 relative flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-10 w-[100vw] mx-auto transition-all duration-1000"
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
          className="w-full h-[100vh] flex items-center justify-start py-12 sm:py-16 px-4 sm:px-6 lg:px-12 transition-all duration-1000 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${footer})`,
          }}
        >
          {/* Overlay for opacity */}
          <div className="absolute inset-0 bg-[#750005] bg-opacity-40"></div>
          
          <div className="max-w-7xl w-2xl flex flex-col items-start justify-start text-left transform transition-all duration-500 hover:scale-[1.02] relative z-10">
            <h2 className="text-left text-2xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white drop-shadow-md pointer-events-none animate-fade-in-up">
              Join 500+ on Varsigram today!
            </h2>

            <p className='text-left'>Learn. Connect. Grow. Inspire</p>


            <div className='mt-6 flex justify-start lg:justify-start'>
            <CTAButtons />
          </div>
          </div>
        </section>

          <section 
                className="bg-[#fff] text-[#3a3a3a] pt-16 sm:pt-20 px-4 sm:px-6 relative flex flex-col items-center justify-center max-w-[100vw] gap-8 lg:gap-10 space-y-10 mx-auto"
              >
                {/* Logo and Heading */}
                <div className="z-10 text-center flex flex-col items-center justify-center gap-4 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <svg width="85" height="60" viewBox="0 0 64 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.8142 40.3235C28.8059 38.1083 28.163 33.8738 30.3782 30.8655L48.3636 6.44121C50.9834 2.88345 55.9913 2.12312 59.5491 4.74295L64.0013 8.02142L41.2723 38.8876C39.0571 41.8959 34.8225 42.5388 31.8142 40.3235Z" fill="#750015"/>
                      <path d="M18.157 32.0453C15.2635 29.9147 14.6452 25.8419 16.7758 22.9485L27.0562 8.98768C29.676 5.42992 34.684 4.66958 38.2417 7.28941L42.2778 10.2615L27.2538 30.6642C25.1232 33.5576 21.0504 34.176 18.157 32.0453Z" fill="#750015"/>
                      <path d="M6.94957 20.7166C5.79993 19.0374 5.58672 16.8876 6.38412 15.0152L7.20593 13.0856C9.18517 8.43821 14.9826 6.85431 19.0499 9.8497L22.7724 12.5911L16.6651 20.8839C14.2323 24.1873 9.2671 24.1017 6.94957 20.7166Z" fill="#750015"/>
                    </svg>
                    <h1 className="text-[#750005] text-3xl font-semibold">Varsigram</h1>
                  </div>

                  <h1 className='text-center leading-8 text-2xl sm:text-3xl lg:text-4xl max-w-2xl font-semibold'>
                    Grow with every content you read, Inspire with <span className='text-[#750005]'>Vars</span> you create
                  </h1>
                </div>

                {/* CTA Button */}
                <div>
                  <button onClick={handleLogin} className="bg-[#750005] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a0001f] transition-all">
                    Make a Vars now
                  </button>
                </div>

                {/* Input Field with Icons */}
                <div className="w-full flex flex-col items-center justify-center gap-4 max-w-2xl animate-fade-in-up delay-200">
                <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
                  <input
                    type="email"
                    placeholder="Reach us via other social media"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full border border-[#750015] rounded-full py-3 pl-6 pr-24 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#750015] transition-all"
                  />

                  {/* Icons Section */}
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-3 text-[#750015]">
                      {inputValue.trim() ? (
                        <button
                          type="submit"
                          className="hover:scale-110 transition-transform"
                          aria-label="Send"
                        >
                          <FaPaperPlane className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <a href="https://x.com/thevarsigram?t=7jkCKWXhaPOe1o9Sn99SLg&s=08" target="_blank" rel="noopener noreferrer">
                            <img
                              src="/images/socials/twitter.svg"
                              className="hover:scale-110 transition-transform w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                              alt="Twitter"
                            />
                          </a>
                          <a href="https://www.linkedin.com/company/varsigram/" target="_blank" rel="noopener noreferrer">
                            <img
                              src="/images/socials/linkedin.svg"
                              className="hover:scale-110 transition-transform w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                              alt="LinkedIn"
                            />
                          </a>
                          <a href="https://www.instagram.com/thevarsigram?igsh=YzljYTk1ODg3Zg==" target="_blank" rel="noopener noreferrer">
                            <img
                              src="/images/socials/instagram.svg"
                              className="hover:scale-110 transition-transform w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                              alt="Instagram"
                            />
                          </a>
                        </div>
                      )}
                    </div>

                </form>

                          <p className='flex text-[#3a3a3a] items-center justify-center text-center'>
                    <span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7Z" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M3 7L12 13L21 7" stroke="#3A3A3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                    </span>varsigraminfo@gmail.com</p>
                </div>

                {/* Contact and Copyright */}
                <div className="text-center text-sm text-gray-600 space-y-1">

                  <p>© 2024 Varsigram. All rights reserved.</p>
                </div>
              </section>

<style>{`
/* Base animations */
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }

/* Updated feature mockup animations - Slide up from bottom */
.feature-mockup-1, 
.feature-mockup-2,
.feature-mockup-3 { 
  transform: translateY(100px) scale(0.9); 
  opacity: 0;
  transition: transform 1s ease-out, opacity 1s ease-out; 
}

.feature-mockup-1.animate-in,
.feature-mockup-2.animate-in,
.feature-mockup-3.animate-in {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Staggered animation delays */
.feature-mockup-1.animate-in {
  transition-delay: 0.2s;
}

.feature-mockup-2.animate-in {
  transition-delay: 0.4s;
}

.feature-mockup-3.animate-in {
  transition-delay: 0.3s;
}

/* Updated Popup Styles - Always Large and Responsive */
.popup-image {
  position: absolute;
  display: block;
  transform-origin: bottom center;
  will-change: transform, opacity;
  transition-timing-function: ease-in-out;
  z-index: 30;
  
  /* Make bolder with shadow and border */
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  border-radius: 12px;
  
  /* Consistent large sizing */
  width: auto;
  height: auto;
}

/* First popup: main entrance */
.popup-image--one {
  bottom: 35px;
  animation: popup-one 12s infinite ease-in-out;
  animation-delay: 1.2s;
  animation-fill-mode: both;
  z-index: 30;
  
  /* Large consistent sizing */
  max-width: 280px;
  width: 65vw;
  min-width: 200px;
}

/* Second popup: offset in x/y and delayed */
.popup-image--two {
  left: 15px;
  bottom: 5px;
  animation: popup-two 6s infinite ease-in-out;
  animation-delay: 1.2s;
  animation-fill-mode: forwards;
  z-index: 20;
  
  /* Large consistent sizing */
  max-width: 260px;
  width: 60vw;
  min-width: 180px;
}

/* Mobile-first responsive adjustments - Ensuring large appearance */
@media (max-width: 480px) {
  .popup-image--one {
    max-width: 220px;
    width: 55vw;
    min-width: 180px;
  }
  
  .popup-image--two {
    max-width: 200px;
    width: 50vw;
    min-width: 160px;
  }
}

@media (min-width: 481px) and (max-width: 767px) {
  .popup-image--one {
    max-width: 250px;
    width: 50vw;
  }
  
  .popup-image--two {
    max-width: 230px;
    width: 45vw;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .popup-image--one {
    max-width: 10000000px;
    width: 40vw;
  }
  
  .popup-image--two {
    max-width: 280px;
    width: 38vw;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .popup-image--one {
    max-width: 320px;
    width: 35vw;
  }
  
  .popup-image--two {
    max-width: 300px;
    width: 33vw;
  }
}

@media (min-width: 1280px) {
  .popup-image--one {
    max-width: 350px;
    width: 30vw;
  }
  
  .popup-image--two {
    max-width: 330px;
    width: 28vw;
  }
}

@media (min-width: 1536px) {
  .popup-image--one {
    max-width: 380px;
    width: 25vw;
  }
  
  .popup-image--two {
    max-width: 360px;
    width: 23vw;
  }
}

/* Popup animations */
@keyframes popup-one {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.9;
  }
  25% {
    transform: translateY(-10px) scale(1.05);
    opacity: 1;
  }
  50% {
    transform: translateY(-5px) scale(1.02);
    opacity: 0.95;
  }
  75% {
    transform: translateY(-8px) scale(1.03);
    opacity: 0.98;
  }
}

@keyframes popup-two {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  25% {
    transform: translateY(-8px) scale(1.03);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-3px) scale(1.01);
    opacity: 0.85;
  }
  75% {
    transform: translateY(-6px) scale(1.02);
    opacity: 0.88;
  }
}

/* Ensure the conversation section container has proper sizing */
.conversation-section .relative {
  min-height: 400px;
}

/* Make sure the engage mockup doesn't interfere with popup sizing */
.conversation-section img[alt="App mockup"] {
  z-index: 10;
  position: relative;
}
`}</style>
    </div>
  );
};
