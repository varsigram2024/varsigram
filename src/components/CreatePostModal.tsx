import React, { useRef } from 'react';
import { Text } from './Text';
import { Button } from './Button';
import { CloseSVG } from './Input/close';

interface CreatePostModalProps {
  newPostContent: string;
  setNewPostContent: (val: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  isUploading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  newPostContent,
  setNewPostContent,
  selectedFiles,
  setSelectedFiles,
  isUploading,
  onClose,
  onSubmit,
  handleFileChange,
  handleRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 p-1"
          onClick={onClose}
        >
          <CloseSVG />
        </button>
        <Text className="text-xl font-bold mb-4">Create Post</Text>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Create a vars..."
          className="w-full p-2 border rounded-lg mb-4"
          rows={4}
        />
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                >
                  <CloseSVG />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700"
              disabled={selectedFiles.length >= 5}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            {selectedFiles.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedFiles.length}/5 images
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</Button>
            <Button
              onClick={onSubmit}
              disabled={isUploading || (!newPostContent.trim() && selectedFiles.length === 0)}
              className="px-4 py-2 text-white bg-[#750015] rounded-lg hover:bg-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;