import React, { useRef, useState, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [modalHeight, setModalHeight] = useState<string>('90vh');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Handle keyboard visibility and adjust modal height
  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        // Check if keyboard is open (viewport height is significantly reduced)
        const isKeyboardVisible = visualViewport.height < window.screen.height * 0.7;
        setIsKeyboardOpen(isKeyboardVisible);
        
        if (isKeyboardVisible) {
          // When keyboard is open, make modal fit the remaining space
          setModalHeight(`${visualViewport.height}px`);
        } else {
          // When keyboard is closed, use 90vh
          setModalHeight('90vh');
        }
      }
    };

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }

    // Initial check
    handleResize();

    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Focus textarea when modal opens
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, []);

  // Handle outside click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999] h-[100vh] flex items-start md:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div 
        className="relative z-[10000] bg-white md:rounded-lg w-full h-[100vh] lg:w-[50vw] lg:h-[50vh] shadow-2xl flex flex-col transition-all duration-200"
        style={{ 
          height: modalHeight,
          maxHeight: isKeyboardOpen ? 'none' : '90vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
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

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <textarea
            ref={textareaRef}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's good?"
            className="w-full p-2 border-none outline-none resize-none text-lg mb-4 min-h-[120px] placeholder-gray-400"
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
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
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