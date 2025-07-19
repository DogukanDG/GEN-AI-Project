import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthStatus } from '../utils/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = checkAuthStatus();
  
  if (isAuthenticated) {
    // If user is already authenticated, redirect to homepage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Redirect based on user role
      if (userData.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/homepage" replace />;
      }
    }
    return <Navigate to="/homepage" replace />;
  }

  // If user is not authenticated, render the public page (login/signup)
  return <>{children}</>;
};

export default PublicRoute;
