// CLEANED AND FIXED: components/CreateConversationModal.tsx

import React from "react";
import Modal from "react-modal";
import { Heading, Img, Text, Button } from "../../components";

interface Props {
  className?: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

export default function CreateConversation({ isOpen, onRequestClose, className = "" }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      appElement={document.getElementById("root")!}
      className={`min-w-[924px] outline-none ${className}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="w-full min-w-[924px] rounded-[32px] bg-white p-8 sm:p-5">
        <div className="ml-1 flex items-center justify-between gap-5 sm:ml-0">
          <button onClick={onRequestClose}>
            <img src="images/img_x.svg" alt="Close" className="h-[36px]" />
          </button>
          <Button className="flex h-[42px] min-w-[116px] flex-row items-center justify-center rounded-[20px] bg-[#750015] px-8 text-center text-[24px] font-medium text-white sm:px-5 sm:text-[20px]">
            Post
          </Button>
        </div>

        <div className="mx-1 mt-[54px] flex items-center sm:mx-0">
          <div className="h-[24px] w-px bg-[#3a3a3a66]" />
          <Text
            size="body_large_regular"
            as="p"
            className="ml-4 self-end text-[20px] font-normal text-[#3a3a3a99] sm:text-[17px]"
          >
            What's good?
          </Text>
        </div>

        <div className="ml-1 mr-5 mt-[266px] flex items-center justify-between opacity-60 sm:mx-0">
          <div className="flex items-center">
            <Img src="images/img_image_gray_800.svg" alt="Image" className="h-[36px] w-[36px]" />
            <div className="ml-6 mt-1.5 h-[20px] w-px self-start bg-[#adacb2]" />
            <img src="images/img_camera_gray_800.svg" alt="Camera" className="ml-[22px] h-[36px] w-[36px]" />
            <div className="ml-6 mt-1.5 h-[20px] w-px self-start bg-[#adacb2]" />
            <Img src="images/img_upload_gray_800.svg" alt="Upload" className="ml-[22px] h-[36px] w-[36px]" />
          </div>
          <Heading size="headingsm" as="h1" className="text-[20px] font-light text-[#3a3a3a] sm:text-[17px]">
            1500 characters remaining
          </Heading>
        </div>
      </div>
    </Modal>
  );
}
