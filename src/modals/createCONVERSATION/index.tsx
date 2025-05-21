import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Heading, Img, Text, Button } from "../../components";

interface Props {
  className?: string;
  isOpen: boolean;
  onRequestClose: () => void;
  initialText?: string;
  onTextChange?: (text: string) => void;
}

export default function CreateConversation({ 
  isOpen, 
  onRequestClose, 
  className = "",
  initialText = "",
  onTextChange
}: Props) {
  const [text, setText] = useState(initialText);
  const maxLength = 1500;

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      onTextChange?.(newText);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root")!}
      className={`outline-none ${className}`}
      overlayClassName="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      {/* Mobile Full Screen Modal */}
      <div className="w-full h-full lg:min-w-[964px] lg:rounded-[32px] bg-white p-4 sm:p-5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <button onClick={onRequestClose} className="p-2">
            <img src="images/vectors/x.svg" alt="Close" className="h-[24px] w-[24px]" />
          </button>
          <Button 
            className="flex h-[36px] min-w-[80px] flex-row items-center justify-center rounded-[20px] bg-[#750015] px-6 text-center text-[16px] font-medium text-white"
            onClick={() => {
              // Handle post submission here
              onRequestClose();
            }}
          >
            Post
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col mt-4">
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="w-[48px] h-[48px] rounded-full bg-gray-200 flex-shrink-0">
              <img 
                src="images/user-image.png" 
                alt="User Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            
            {/* Text Input Area */}
            <div className="flex-1">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="What's good?"
                className="w-full text-[16px] font-normal text-[#3a3a3a] resize-none outline-none border-none bg-transparent min-h-[120px]"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Img 
                src="images/vectors/image.svg" 
                alt="Image" 
                className="h-[24px] w-[24px] cursor-pointer" 
              />
              <div className="h-[20px] w-px bg-[#adacb2]" />
              <img 
                src="images/vectors/camera.svg" 
                alt="Camera" 
                className="h-[24px] w-[24px] cursor-pointer" 
              />
              <div className="h-[20px] w-px bg-[#adacb2]" />
              <Img 
                src="images/vectors/video.svg"
                alt="Upload" 
                className="h-[24px] w-[24px] cursor-pointer" 
              />
            </div>
            <Text className="text-[14px] font-light text-[#3a3a3a]">
              {maxLength - text.length} characters remaining
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
}