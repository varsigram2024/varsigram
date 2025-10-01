// ImagePreviewer.tsx
import React from 'react';
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
  if (!imagePreview.isOpen || imagePreview.images.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={32} />
      </button>

      {/* Navigation arrows - only show if multiple images */}
      {imagePreview.images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Image counter */}
      {imagePreview.images.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
          {imagePreview.currentIndex + 1} / {imagePreview.images.length}
        </div>
      )}

      {/* Main image */}
      <div className="max-w-full max-h-full flex items-center justify-center">
        <Img
          src={imagePreview.images[imagePreview.currentIndex]}
          alt={`Post media ${imagePreview.currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnail strip for multiple images */}
      {imagePreview.images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto py-2">
          {imagePreview.images.map((url, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 w-12 h-12 border-2 rounded ${
                index === imagePreview.currentIndex 
                  ? 'border-white' 
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
    </div>,
    document.body
  );
};