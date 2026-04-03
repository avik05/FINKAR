import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BankAccount } from '@/types/finance';

interface AccountsState {
  accounts: BankAccount[];
  addAccount: (account: Omit<BankAccount, 'id'>) => void;
  updateAccount: (id: string, data: Partial<BankAccount>) => void;
  deleteAccount: (id: string) => void;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set) => ({
      accounts: [],
      addAccount: (account) =>
        set((state) => ({
          accounts: [...state.accounts, { ...account, id: `acc_${Date.now()}` }],
        })),
      updateAccount: (id, data) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
    }),
    { name: 'finkar-accounts-v3' }
  )
);
