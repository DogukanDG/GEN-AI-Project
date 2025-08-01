import api from './api';
import { clearAuthData, checkAuthStatus } from '../utils/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', request);
    return response.data.data;
  },

  // Register
  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', request);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  logout: () => {
    clearAuthData();
    window.location.href = '/';
  },

  isAuthenticated: (): boolean => {
    return checkAuthStatus();
  },

  getStoredUser: (): User | null => {
    if (!checkAuthStatus()) {
      return null;
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  storeAuthData: (authData: AuthResponse) => {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },

  callAdminStudio: async (): Promise<unknown> => {
    const response = await api.get('/admin/studio');
    return response.data;
  },

  // Clear all authentication data
  clearAuth: () => {
    clearAuthData();
  },
};
