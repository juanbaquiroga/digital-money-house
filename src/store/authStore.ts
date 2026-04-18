import { create } from 'zustand';
import { getSessionToken } from '@/actions/auth';

interface AuthState {
  token: string | null;
  loginEmail: string | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  setLoginEmail: (email: string) => void;
  logout: () => void;
  hydrateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  loginEmail: null,
  isHydrated: false,

  setToken: (token) => set({ token }),
  setLoginEmail: (email) => set({ loginEmail: email }),
  logout: () => set({ token: null, loginEmail: null, isHydrated: false }),

  hydrateSession: async () => {
    // Avoid re-hydrating if already done
    if (get().isHydrated && get().token) return;
    try {
      const token = await getSessionToken();
      set({ token, isHydrated: true });
    } catch {
      set({ token: null, isHydrated: true });
    }
  },
}));
