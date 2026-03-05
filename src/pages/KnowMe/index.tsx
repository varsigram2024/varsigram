import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const KnowMe = () => {
  const navigate = useNavigate();
  const [wallCode, setWallCode] = useState('');

  const handleOpenByCode = () => {
    const normalizedCode = wallCode.trim().toUpperCase();
    if (!normalizedCode) return;
    navigate(`/knowme/wall/code/${normalizedCode}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-16 px-6">
      <div className="flex flex-col items-center mt-12 gap-6">
        <img 
          src="/images/knowme.png" 
          alt="KnowMe" 
          width="350" 
          height="280" 
          className="object-contain"
        />
      </div>

      <div className="w-full max-w-[520px] mb-10">
        <button
          onClick={() => navigate('/knowme/create-wall')}
          className="w-full bg-[#760016] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:bg-[#8a001c] transition-colors"
        >
          Create A Wall
        </button>

        <div className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={wallCode}
            onChange={(e) => setWallCode(e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase())}
            placeholder="Enter 8-letter wall code"
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
          />
          <button
            onClick={handleOpenByCode}
            disabled={!wallCode.trim()}
            className="w-full bg-white text-[#760016] border border-[#760016] py-3 rounded-2xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open Wall By Code
          </button>
        </div>
      </div>
    </div>
  );
};
