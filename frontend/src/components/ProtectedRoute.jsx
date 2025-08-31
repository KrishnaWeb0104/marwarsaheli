import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const { authUser, isAuthCheck } = useAuthStore();
  const location = useLocation();

  // Show loading while checking authentication
  if (isAuthCheck) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!authUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;