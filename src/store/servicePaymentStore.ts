import { create } from "zustand";
import { Card, Company, Transaction } from "@/types";

interface ServicePaymentState {
  selectedService: Company | null;
  accountNumber: string;
  selectedCard: Card | null;
  paidWithBalance: boolean;
  lastTransaction: Transaction | null;
  error: string | null;
  setSelectedService: (service: Company | null) => void;
  setAccountNumber: (num: string) => void;
  setSelectedCard: (card: Card | null) => void;
  setPaidWithBalance: (val: boolean) => void;
  setLastTransaction: (tx: Transaction | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useServicePaymentStore = create<ServicePaymentState>((set) => ({
  selectedService: null,
  accountNumber: "",
  selectedCard: null,
  paidWithBalance: false,
  lastTransaction: null,
  error: null,
  setSelectedService: (service) => set({ selectedService: service }),
  setAccountNumber: (num) => set({ accountNumber: num }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  setPaidWithBalance: (val) => set({ paidWithBalance: val }),
  setLastTransaction: (tx) => set({ lastTransaction: tx }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      selectedService: null,
      accountNumber: "",
      selectedCard: null,
      paidWithBalance: false,
      lastTransaction: null,
      error: null,
    }),
}));
