import { create } from "zustand";
import { Card, Transaction } from "@/types";

interface DepositState {
  amount: number;
  selectedCard: Card | null;
  lastTransaction: Transaction | null;
  setAmount: (amount: number) => void;
  setSelectedCard: (card: Card | null) => void;
  setLastTransaction: (tx: Transaction | null) => void;
  reset: () => void;
}

export const useDepositStore = create<DepositState>((set) => ({
  amount: 0,
  selectedCard: null,
  lastTransaction: null,
  setAmount: (amount) => set({ amount }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  setLastTransaction: (tx) => set({ lastTransaction: tx }),
  reset: () => set({ amount: 0, selectedCard: null, lastTransaction: null }),
}));
