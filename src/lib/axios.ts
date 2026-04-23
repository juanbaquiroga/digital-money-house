import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { logoutAction } from '@/actions/auth';

const api = axios.create({
  baseURL: 'https://digitalmoney.digitalhouse.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      
      useAuthStore.getState().logout();

      try {
        await logoutAction();
      } catch {}

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
