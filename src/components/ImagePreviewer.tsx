// ImagePreviewer.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Download, Play } from "lucide-react";
import { Img } from "./Img";
import { motion, AnimatePresence } from "framer-motion";

interface ImagePreviewState {
  isOpen: boolean;
  currentIndex: number;
  media: string[];
}

interface ImagePreviewerProps {
  imagePreview: ImagePreviewState;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
}

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

export const ImagePreviewer: React.FC<ImagePreviewerProps> = ({
  imagePreview,
  onClose,
  onNext,
  onPrev,
  onSelect,
}) => {
  const { isOpen, currentIndex, media } = imagePreview;
  if (!isOpen || !media || media.length === 0) return null;

  const currentUrl = media[currentIndex];
  const currentIsVideo = isVideoUrl(currentUrl);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onNext, onPrev]);

  const downloadMedia = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = isVideoUrl(url) ? "mp4" : "jpg";
      a.href = blobUrl;
      a.download = `media-${currentIndex + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("download failed", err);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Container */}
          <motion.div
            className="relative z-10 max-w-[90vw] max-h-[90vh] w-full flex flex-col items-center"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white px-3 py-2 bg-gradient-to-b from-black/40 to-transparent rounded-t-xl">
              <div className="text-sm bg-black/30 px-3 py-1 rounded-full">
                {currentIndex + 1} / {media.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadMedia(currentUrl)}
                  className="p-2 bg-black/30 rounded-lg hover:bg-black/50 transition"
                >
                  <Download size={18} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 bg-black/30 rounded-lg hover:bg-black/50 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MEDIA DISPLAY */}
            <div className="flex items-center justify-center w-full bg-transparent p-4">
              <div className="relative w-full max-w-5xl max-h-[75vh] flex items-center justify-center">

                {currentIsVideo ? (
                  <video
                    src={currentUrl}
                    controls
                    autoPlay={false}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <Img
                    src={currentUrl}
                    alt="media"
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                  />
                )}

                {/* Navigation arrows */}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={onPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:scale-105"
                    >
                      <ChevronLeft size={28} />
                    </button>

                    <button
                      onClick={onNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 text-white hover:scale-105"
                    >
                      <ChevronRight size={28} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}
            {media.length > 1 && (
              <div className="w-full overflow-x-auto py-2 px-3">
                <div className="inline-flex gap-2 items-center">
                  {media.map((url, i) => {
                    const isVid = isVideoUrl(url);
                    return (
                      <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={`flex-shrink-0 relative w-20 h-14 rounded-lg overflow-hidden ring-2 ${
                          i === currentIndex ? "ring-white scale-105" : "ring-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {isVid ? (
                          <>
                            <video src={url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Play size={18} className="text-white/90" />
                            </div>
                          </>
                        ) : (
                          <Img src={url} className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ImagePreviewer;
