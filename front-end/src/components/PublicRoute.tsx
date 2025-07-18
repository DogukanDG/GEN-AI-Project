import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    // If user is already authenticated, redirect to homepage
    return <Navigate to="/homepage" replace />;
  }

  // If user is not authenticated, render the public page (login/signup)
  return <>{children}</>;
};

export default PublicRoute;
