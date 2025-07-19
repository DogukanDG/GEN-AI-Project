import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthStatus, clearAuthData } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = checkAuthStatus();
  
  useEffect(() => {
    // Double-check authentication on component mount
    if (!isAuthenticated) {
      clearAuthData();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
