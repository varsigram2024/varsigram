import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';

export const JoinWall = () => {
  const navigate = useNavigate();
  const { wallId } = useParams();
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [interest, setInterest] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_SIZE) {
        setError('Image size must be less than 10MB.');
        return;
      }

      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('contact_info', contact);
      formData.append('interests', interest);
      if (picture) {
        formData.append('photo', picture);
      }

      await api.post(
  `/walls/${wallId}/join/`,
  formData,
  {
    headers: {
      'Content-Type': undefined,
    },
  }
);


      navigate(`/knowme/wall/${wallId}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Failed to join wall. Please try again.';
      setError(errorMessage);
      console.error('Join wall error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#3a3a3a] text-center">
          Join The Wall
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-base font-semibold text-[#3a3a3a]"
              htmlFor="fullName"
            >
              Your Full Name:
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-base font-semibold text-[#3a3a3a]"
              htmlFor="contact"
            >
              Contact:
            </label>
            <textarea
              id="contact"
              name="contact"
              rows={2}
              placeholder="e.g WhatsApp number, email address or social media handles."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015] resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-base font-semibold text-[#3a3a3a]"
              htmlFor="interest"
            >
              About Me:
            </label>
            <textarea
              id="interest"
              name="interest"
              rows={4}
              placeholder="I love to make new friends, play football and write codes..."
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-base font-semibold text-[#3a3a3a]"
              htmlFor="picture"
            >
              Your Picture:
            </label>
            <div className="relative">
              <input
                id="picture"
                name="picture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
              <label
                htmlFor="picture"
                className="w-full border border-gray-300 rounded-xl px-4 py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {picturePreview ? (
                  <img
                    src={picturePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8Z"
                      stroke="#9CA3AF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M32 20V44"
                      stroke="#9CA3AF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 32H44"
                      stroke="#9CA3AF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span className="text-sm text-gray-500 mt-2">
                  {picture ? picture.name : 'Click to upload'}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#760016] text-white py-4 rounded-2xl text-lg font-semibold shadow-md hover:bg-[#8a001c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Done'}
          </button>
        </form>
      </div>
    </div>
  );
};
                
