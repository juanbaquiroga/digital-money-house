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
      
      const account = await accountService.getAccount();
      set({ account });

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
