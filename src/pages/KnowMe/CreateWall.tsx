import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

export const CreateWall = () => {
  const navigate = useNavigate();
  const [wallName, setWallName] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [wallId, setWallId] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/walls/', {
        name: wallName,
        description: about,
        creator_email: email,
      });
      
      setWallId(response.data.id);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create wall. Please try again.');
      console.error('Wall creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = () => {
    // Use actual wall ID from backend
    const wallLink = `${window.location.origin}/knowme/join/${wallId}`;
    if (navigator.share) {
      navigator.share({
        title: wallName,
        text: about,
        url: wallLink,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(wallLink);
      alert('Link copied to clipboard!');
    }
  };

  const handleGoToWall = () => {
    // Navigate to wall using actual wall ID from backend
    navigate(`/knowme/wall/${wallId}`);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-6">
        <div className="w-full max-w-xl flex flex-col items-center gap-8">
          {/* Success Icon */}
          <div className="w-52 h-52 rounded-full bg-[#760016] flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 65 L45 85 L100 35" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-[#760016] text-center">
            Your wall has been successfully created
          </h1>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleShareLink}
              className="flex-1 bg-white text-[#760016] border-2 border-[#760016] py-4 rounded-2xl text-lg font-semibold hover:bg-[#760016] hover:text-white transition-colors"
            >
              Share link
            </button>
            <button
              onClick={handleGoToWall}
              className="flex-1 bg-[#760016] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:bg-[#8a001c] transition-colors"
            >
              Go To Wall
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#3a3a3a]">Create Your Wall</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-[#3a3a3a]" htmlFor="wallName">Wall Name</label>
            <input
              id="wallName"
              name="wallName"
              type="text"
              placeholder="e.g 100 level Economics Students"
              value={wallName}
              onChange={(e) => setWallName(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-[#3a3a3a]" htmlFor="about">About</label>
            <textarea
              id="about"
              name="about"
              rows={4}
              placeholder="What's the purpose of this wall"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-[#3a3a3a]" htmlFor="email">Your email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#760016] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:bg-[#8a001c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : "I'm Done"}
          </button>
        </form>
      </div>
    </div>
  );
};
