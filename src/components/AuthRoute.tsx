import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
}

export const AuthRoute = ({ 
  children, 
  requireAuth = true, 
  requireVerification = true 
}: AuthRouteProps) => {
  const { token, user, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#750015]"></div>
      </div>
    );
  }
  
  // If auth required but no token, redirect to welcome
  if (requireAuth && !token) {
    return <Navigate to="/welcome" replace />;
  }
  
  // If verification required but user not verified, redirect to verification page
  if (requireVerification && token && user && !user.is_verified) {
    return <Navigate to="/settings/email-verification" replace />;
  }
  
  return <>{children}</>;
};