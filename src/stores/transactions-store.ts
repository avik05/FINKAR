import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types/finance';

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Travel',
  'Subscriptions',
  'Investments',
  'Income',
  'Other',
] as const;

interface TransactionsState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ ...tx, id: `tr_${Date.now()}` }, ...state.transactions],
        })),
      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    { name: 'finkar-transactions-v3' }
  )
);
