import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { logoutAction } from '@/actions/auth';

const api = axios.create({
  baseURL: 'https://digitalmoney.digitalhouse.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: inject token ────────────────────────────────────────
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

// ── Response Interceptor: catch 401 → purge session → redirect ───────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Purge client state
      useAuthStore.getState().logout();

      // Delete server-side cookie
      try {
        await logoutAction();
      } catch {
        // Server action may fail if already logged out — ignore
      }

      // Force hard redirect to login (works from any context)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
