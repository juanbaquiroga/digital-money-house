import { create } from 'zustand';
import { Account, User, Transaction } from '@/types';
import { accountService } from '@/services/accountService';
import { userService } from '@/services/userService';

interface ProfileState {
  account: Account | null;
  user: User | null;
  activity: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchProfileData: () => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  account: null,
  user: null,
  activity: [],
  isLoading: false,
  error: null,
  
  fetchProfileData: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch Account to get user_id & account_id
      const account = await accountService.getAccount();
      set({ account });
      
      // 2. Fetch User and Activity concurrently
      const [user, activity] = await Promise.all([
        userService.getUser(account.user_id),
        accountService.getActivity(account.id)
      ]);
      
      set({ user, activity, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching profile data:", error);
      set({ error: error.message || "Failed to load profile", isLoading: false });
    }
  },

  clearProfile: () => set({ account: null, user: null, activity: [], error: null })
}));
