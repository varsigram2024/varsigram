import React, { useRef } from 'react';
import ReactDOM from "react-dom";
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div className="relative z-[10000] bg-white rounded-t-3xl md:rounded-lg w-full h-[90vh] md:h-auto md:max-h-[80vh] md:max-w-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            className="p-1"
            onClick={onClose}
          >
            <CloseSVG />
          </button>
          <Text className="text-lg font-bold">Create Post</Text>
          <Button
            onClick={onSubmit}
            disabled={isUploading || (!newPostContent.trim() && selectedFiles.length === 0)}
            className="px-4 py-1 text-white bg-[#750015] rounded-full hover:bg-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isUploading ? 'Posting...' : 'Post'}
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's good?"
            className="w-full p-2 border-none outline-none resize-none text-lg mb-4 min-h-[120px]"
            rows={4}
            autoFocus
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
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
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatePostModal;