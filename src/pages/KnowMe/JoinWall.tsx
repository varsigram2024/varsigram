import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/client';

export const JoinWall = () => {
  const navigate = useNavigate();
  const { wallId } = useParams<{ wallId: string }>();

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
    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

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
  };

  const removeImage = () => {
    setPicture(null);
    setPicturePreview('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!wallId) {
      setError('Invalid wall link.');
      return;
    }

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

      await api.post(`/walls/${wallId}/join/`, formData);

      // Optional reset before navigation
      setFullName('');
      setContact('');
      setInterest('');
      removeImage();

      navigate(`/knowme/wall/${wallId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            'Failed to join wall. Please try again.'
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
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
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3a3a3a]">
              Your Full Name:
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3a3a3a]">
              Contact:
            </label>
            <textarea
              rows={2}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="WhatsApp, email or social media handle"
              className="border border-gray-300 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          {/* Interest */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3a3a3a]">
              About Me:
            </label>
            <textarea
              rows={4}
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="I love meeting people, football, coding..."
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#750015]"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#3a3a3a]">
              Your Picture:
            </label>

            <input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
              aria-label="Upload profile picture"
            />

            <label
              htmlFor="picture"
              className="border border-gray-300 rounded-xl px-4 py-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
            >
              {picturePreview ? (
                <img
                  src={picturePreview}
                  alt={`${fullName || 'User'} preview`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  Click to upload (max 10MB)
                </span>
              )}
            </label>

            {picturePreview && (
              <button
                type="button"
                onClick={removeImage}
                className="text-sm text-red-600 hover:underline self-center"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoading || !fullName || !contact || !interest
            }
            className="bg-[#760016] text-white py-4 rounded-2xl font-semibold hover:bg-[#8a001c] transition disabled:bg-gray-400"
          >
            {isLoading ? 'Joining...' : 'Done'}
          </button>
        </form>
      </div>
    </div>
  );
};
