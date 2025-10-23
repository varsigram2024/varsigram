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
  onSubmit: (selectedTag: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
}

// Define available tags - Added "explore" for main feed
const POST_TAGS = [
  { value: 'explore', label: 'Explore' },
  { value: 'updates', label: 'Updates' },
  { value: 'questions', label: 'Questions' },
  { value: 'milestones', label: 'Milestones' },
  { value: 'relatable', label: 'Relatables' }
] as const;

type PostTag = typeof POST_TAGS[number]['value'];

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
  const [selectedTag, setSelectedTag] = useState<PostTag>('explore'); // Default to 'explore'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle keyboard visibility and adjust modal height
  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const isKeyboardVisible = visualViewport.height < window.screen.height * 0.7;
        setIsKeyboardOpen(isKeyboardVisible);
        
        if (isKeyboardVisible) {
          setModalHeight(`${visualViewport.height}px`);
        } else {
          setModalHeight('90vh');
        }
      }
    };

    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.tag-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedTag);
  };

  const handleTagSelect = (tag: PostTag) => {
    setSelectedTag(tag);
    setIsDropdownOpen(false);
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
        className="relative z-[10000] bg-white md:rounded-lg w-full h-auto lg:w-[50vw] shadow-2xl flex flex-col transition-all duration-200"
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
          
          <div className='flex gap-5 items-center justify-center'>
            {/* Tag Dropdown */}
                <div className="tag-dropdown relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{POST_TAGS.find(tag => tag.value === selectedTag)?.label}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {POST_TAGS.map((tag) => (
                        <button
                          key={tag.value}
                          type="button"
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedTag === tag.value ? 'bg-[#750015] text-white hover:bg-[#8c001a]' : ''
                          } first:rounded-t-lg last:rounded-b-lg`}
                          onClick={() => handleTagSelect(tag.value)}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isUploading || (!newPostContent.trim() && selectedFiles.length === 0)}
                  className="px-4 py-1 text-white bg-[#750015] rounded-full hover:bg-[#8c001a] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isUploading ? 'Posting...' : 'Post'}
                </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 flex flex-col h-[100vh] overflow-y-auto p-4">
          <textarea
            ref={textareaRef}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What did you learn today?"
            className="w-full p-2 border-none outline-none resize-none text-lg mb-4 h-full placeholder-gray-400"
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