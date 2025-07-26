import axios from 'axios';
import type { User } from './authService';
import { clearAuthData } from '../utils/auth';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      clearAuthData();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// User CRUD API
export const userApi = {
  getAll: async (): Promise<User[]> =>
    (await api.get('/users')).data.data.users,
  getById: async (id: number): Promise<User> =>
    (await api.get(`/users/${id}`)).data.data.user,
  create: async (user: User): Promise<User> =>
    (await api.post('/users/signup', user)).data.data.user,
  update: async (id: number, user: Partial<User>): Promise<User> =>
    (await api.put(`/users/${id}`, user)).data.data.user,
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api;
