import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { uploadProfilePicture } from '../utils/fileUpload';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { API } from '../api/client';

interface ProfilePictureUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
}

export const ProfilePictureUpload = ({ onUploadComplete, currentImageUrl }: ProfilePictureUploadProps) => {
  const { updateUser, user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('File size should be less than 1MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await API.post('/profile/picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (updateUser && response.data.profile_pic_url && user) {
        updateUser({ ...user, profile_pic_url: response.data.profile_pic_url });
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Firebase Storage
      const downloadURL = await uploadProfilePicture(file);
      
      // Call the callback with the download URL
      onUploadComplete(downloadURL);
      
      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture. Please try again.');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={handleClick}
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}; 