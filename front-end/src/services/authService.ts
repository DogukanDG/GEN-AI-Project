import api from './api';

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

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store auth data
  storeAuthData: (authData: AuthResponse) => {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }
};
