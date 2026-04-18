import api from "@/lib/axios";
import { Account, Transaction } from "@/types";

export const accountService = {
  getAccount: async (): Promise<Account> => {
    const response = await api.get<Account>("/api/account");
    return response.data;
  },
  
  getActivity: async (accountId: number): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/api/accounts/${accountId}/activity`);
    return response.data;
  }
};
