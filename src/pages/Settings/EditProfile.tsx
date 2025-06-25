import React from "react";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Sidebar1 from "../../components/Sidebar1";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-start justify-center bg-[#f6f6f6] min-h-screen relative">
      <Sidebar1 />
      <div className="flex flex-col w-full lg:w-[85%] p-6">
        <Text className="text-2xl font-bold mb-6">Edit Profile</Text>
        {/* Your edit profile form goes here */}
        <Text>Edit profile form goes here...</Text>
        <Button className="mt-4" onClick={() => navigate(-1)}>Back</Button>
      </div>
      <BottomNav />
    </div>
  );
}
