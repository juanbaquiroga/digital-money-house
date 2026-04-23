import api from "@/lib/axios";
import { Account, Transaction, TransferenceRequest, TransactionRequest } from "@/types";

export const accountService = {
  getAccount: async (): Promise<Account> => {
    const response = await api.get<Account>("/api/account");
    return response.data;
  },
  
  getActivity: async (accountId: number): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(`/api/accounts/${accountId}/activity`);
    return response.data;
  },

  getTransaction: async (accountId: number, transactionId: number): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/api/accounts/${accountId}/transactions/${transactionId}`);
    return response.data;
  },

  createDeposit: async (accountId: number, data: TransferenceRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>(`/api/accounts/${accountId}/deposits`, data);
    return response.data;
  },

  createTransaction: async (accountId: number, data: TransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>(`/api/accounts/${accountId}/transactions`, data);
    return response.data;
  },
};
