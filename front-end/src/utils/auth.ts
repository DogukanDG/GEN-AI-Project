// Authentication utilities for better session management

export const clearAuthData = (): void => {
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
};

export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return false;
  }
  
  // Check token validity
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    
    if (isExpired) {
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    clearAuthData();
    return false;
  }
};

export const forceLogout = (): void => {
  clearAuthData();
  // Force redirect to login page
  window.location.href = '/';
};

export const initializeAuth = (): boolean => {
  // In development, always clear session on app start
  if (process.env.NODE_ENV === 'development') {
    clearAuthData();
    return false;
  }
  
  // In production, check auth status
  return checkAuthStatus();
};
