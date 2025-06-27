import React from "react";
import { Text } from "./Text";
import { Button } from "./Button";

interface EditProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfilePanel: React.FC<EditProfilePanelProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ minWidth: 350 }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <Text className="text-xl font-bold">Edit Profile</Text>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>
      <div className="p-6">
        {/* Your edit profile form goes here */}
        <Text>Edit profile form goes here...</Text>
        <Button className="mt-4" onClick={onClose}>Save</Button>
      </div>
    </div>
  );
};

export default EditProfilePanel;
