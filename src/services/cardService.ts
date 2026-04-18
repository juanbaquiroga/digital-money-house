import api from "@/lib/axios";
import { Card, CardRequest } from "@/types";

export const cardService = {
  getCards: async (accountId: number): Promise<Card[]> => {
    const response = await api.get<Card[]>(`/api/accounts/${accountId}/cards`);
    return response.data;
  },

  getCard: async (accountId: number, cardId: number): Promise<Card> => {
    const response = await api.get<Card>(`/api/accounts/${accountId}/cards/${cardId}`);
    return response.data;
  },

  createCard: async (accountId: number, data: CardRequest): Promise<Card> => {
    const response = await api.post<Card>(`/api/accounts/${accountId}/cards`, data);
    return response.data;
  },

  deleteCard: async (accountId: number, cardId: number): Promise<void> => {
    await api.delete(`/api/accounts/${accountId}/cards/${cardId}`);
  },
};
