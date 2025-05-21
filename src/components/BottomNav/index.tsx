import React from "react";
import { Link } from "react-router-dom";
import { Text } from "../Text";
import { Img } from "../Img";

interface BottomNavProps {
  onComplete?: (page: string) => void;
}

export default function BottomNav({ onComplete }: BottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-between items-center">
        <a href="#" className="flex flex-col items-center">
          <Img src="images/home-icon.svg" alt="Home" className="h-[24px] w-[24px]" />
          <Text as="p" className="text-[12px] mt-1">Home</Text>
        </a>
        
        <a href="#" className="flex flex-col items-center">
          <Img src="images/connections-icon.svg" alt="Search" className="h-[24px] w-[24px]" />
          <Text as="p" className="text-[12px] mt-1">Connections</Text>
        </a>
        
        <a href="#" className="flex flex-col items-center">
          <Img src="images/chat-icon.svg" alt="Search" className="h-[24px] w-[24px]" />
          <Text as="p" className="text-[12px] mt-1">Chat</Text>
        </a>
        
        <a href="#" className="flex flex-col items-center">
          <Img src="images/resources-icon.svg" alt="Notifications" className="h-[24px] w-[24px]" />
          <Text as="p" className="text-[12px] mt-1">Notifications</Text>
        </a>
        
        <div 
          onClick={() => onComplete?.('user-profile')}
          className="flex flex-col items-center"
        >
          <Img src="images/unilag-logo.png" alt="Profile" className="h-[24px] w-[24px] rounded-full" />
          <Text as="p" className="text-[12px] mt-1">Profile</Text>
        </div>
      </div>
    </div>
  );
}
