import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { forceLogout } from '../utils/auth';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outlined', 
  size = 'medium',
  showIcon = true 
}) => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // Clear all authentication data
      authService.clearAuth();
      
      // Force logout and redirect
      forceLogout();
      
      // Navigate to login page
      navigate('/', { replace: true });
      
      // Force page reload to clear all state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still logout
      forceLogout();
    }
  };
  
  return (
    <Button 
      onClick={handleLogout}
      variant={variant}
      size={size}
      color="secondary"
      startIcon={showIcon ? <LogoutIcon /> : null}
      sx={{ 
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.1)'
        }
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
