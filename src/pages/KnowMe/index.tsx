import { useNavigate } from 'react-router-dom';

export const KnowMe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-16 px-6">
      <div className="flex flex-col items-center mt-12 gap-6">
        <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12.5 18c-3.314 0-6-2.91-6-6.5S9.186 5 12.5 5s6 2.91 6 6.5-2.686 6.5-6 6.5Z" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.5 27c-3.59-5.5-9.91-5.5-13.5 0" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.5 17c-2.485 0-4.5-2.239-4.5-5s2.015-5 4.5-5S27 9.239 27 12s-2.015 5-4.5 5Z" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26.5 24c-2.5-3.5-6.5-3.5-9 0" stroke="#760016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-3xl font-bold text-[#760016]">KnowMe</h1>
      </div>

      <div className="w-full max-w-[520px] mb-10">
        <button
          onClick={() => navigate('/knowme/create-wall')}
          className="w-full bg-[#760016] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:bg-[#8a001c] transition-colors"
        >
          Create A Wall
        </button>
      </div>
    </div>
  );
};
