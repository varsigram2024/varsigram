import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

export const VerifiedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show nothing or a spinner while loading user info
  if (isLoading) return null;

  // If not logged in, redirect to welcome/login
  if (!user) return <Navigate to="/welcome" replace />;

  // If not verified, redirect to email verification page
  if (!user.is_verified) {
    return <Navigate to="/settings/email-verification" replace />;
  }

  // If verified, render the children (protected page)
  return <>{children}</>;
};
