import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  loginEmail: string | null;
  setToken: (token: string) => void;
  setLoginEmail: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      loginEmail: null,
      setToken: (token) => set({ token }),
      setLoginEmail: (email) => set({ loginEmail: email }),
      logout: () => set({ token: null, loginEmail: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
