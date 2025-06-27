import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const EmailVerificationBanner: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.is_verified) return null;

  return (
    <div
      className="w-full bg-yellow-100 border-b border-yellow-300 py-2 px-4 flex items-center overflow-x-auto animate-marquee"
      style={{ whiteSpace: "nowrap" }}
    >
      <span className="text-yellow-800 font-semibold mr-4">
        Please verify your email to engage with content.
      </span>
      <button
        onClick={() => navigate("/settings/email-verification")}
        className="ml-2 px-3 py-1 bg-[#750015] text-white rounded hover:bg-[#a0001f] transition"
      >
        Go to Email Verification
      </button>
    </div>
  );
};
