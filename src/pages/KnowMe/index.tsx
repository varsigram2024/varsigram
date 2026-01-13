import { useNavigate } from 'react-router-dom';

export const KnowMe = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-16 px-6">
      <div className="flex flex-col items-center mt-12 gap-6">
        <img src="/images/knowme.png" alt="KnowMe" width="350" height="280" className="object-contain bg-black" />
        
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
