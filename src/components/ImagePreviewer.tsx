// ImagePreviewer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "./Img";

interface ImagePreviewState {
  isOpen: boolean;
  currentIndex: number;
  images: string[];
}

interface ImagePreviewerProps {
  imagePreview: ImagePreviewState;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectImage: (index: number) => void;
}

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  imagePreview,
  onClose,
  onNext,
  onPrev,
  onSelectImage
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in pixels) to trigger navigation
  const minSwipeDistance = 50;

  if (!imagePreview.isOpen || imagePreview.images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close only if clicking on the backdrop (not the image content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onPrev();
    } else if (e.key === 'ArrowRight') {
      onNext();
    }
  };

  useEffect(() => {
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imagePreview.currentIndex]);

  return createPortal(
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2"
      >
        <X size={32} />
      </button>

      {/* Navigation arrows - only show if multiple images */}
      {imagePreview.images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 hidden md:block"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-20 bg-black bg-opacity-50 rounded-full p-2 hidden md:block"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Image counter */}
      {imagePreview.images.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full z-20">
          {imagePreview.currentIndex + 1} / {imagePreview.images.length}
        </div>
      )}

      {/* Main image container with swipe support */}
      <div 
        ref={imageRef}
        className="max-w-full max-h-full flex items-center justify-center touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking image
      >
        <div className="relative max-w-full max-h-full">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          <Img
            src={imagePreview.images[imagePreview.currentIndex]}
            alt={`Post media ${imagePreview.currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {/* Thumbnail strip for multiple images */}
      {imagePreview.images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto py-2 z-20"
          onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking thumbnails
        >
          {imagePreview.images.map((url, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 w-12 h-12 border-2 rounded transition-all ${
                index === imagePreview.currentIndex 
                  ? 'border-white scale-110' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Img
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      {/* Swipe indicators for mobile */}
      {imagePreview.images.length > 1 && (
        <>
          {/* Left swipe indicator */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white opacity-70 md:hidden z-10">
            <ChevronLeft size={24} />
          </div>
          {/* Right swipe indicator */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-70 md:hidden z-10">
            <ChevronRight size={24} />
          </div>
        </>
      )}
    </div>,
    document.body
  );
};