import React from "react";
import Sidebar1 from "../../components/Sidebar1";
import BottomNav from "../../components/BottomNav";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Resources() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      
      <div className="flex flex-row-reverse w-full lg:w-[calc(100%-270px)] min-h-screen">
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[80vh]">
          <img
            src="/images/vectors/resources-icon.svg"
            alt="Resources"
            className="w-24 h-24 mb-6 opacity-80"
          />
          <Text className="text-3xl font-bold mb-2 text-gray-800">Resources</Text>
          <Text className="text-lg text-gray-500 mb-6 text-center">
            This feature is coming soon! Stay tuned for updates.
          </Text>
          <Button onClick={() => navigate("/home")}>Back to Home</Button>
        </div>
      </div>
      {/* <BottomNav /> */}
    </div>
  );
}
