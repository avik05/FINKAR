import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { BankAccount } from '@/types/finance';
import { useAuthStore } from './auth-store';

const SAMPLE_ACCOUNTS: BankAccount[] = [
  { id: 'sc_1', name: 'ICICI Savings (Salary)', type: 'Savings', balance: 425240.50 },
  { id: 'sc_2', name: 'HDFC Regalia Card', type: 'Credit', balance: -62400.20 },
  { id: 'sc_3', name: 'Investment Ledger', type: 'Savings', balance: 2850000.00 },
];

interface AccountsState {
  accounts: BankAccount[];
  isLoading: boolean;
  
  fetchAccounts: (userId?: string | null) => Promise<void>;
  addAccount: (account: Omit<BankAccount, 'id'>) => Promise<void>;
  updateAccount: (id: string, data: Partial<BankAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  accounts: SAMPLE_ACCOUNTS,
  isLoading: false,

  fetchAccounts: async (providedUserId) => {
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ accounts: SAMPLE_ACCOUNTS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching accounts:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      name: row.name,
      type: row.type as BankAccount['type'],
      balance: Number(row.balance),
    }));

    set({ accounts: mapped, isLoading: false });
  },

  addAccount: async (account) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        accounts: [...state.accounts, { ...account, id: `guest_acc_${Date.now()}` }],
      }));
      return;
    }

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert([{
        user_id: userId,
        name: account.name,
        type: account.type,
        balance: account.balance,
      }])
      .select();

    if (error) {
      console.error('Error adding account:', error);
      return;
    }

    if (data && data[0]) {
      const newAcc: BankAccount = {
        id: data[0].id,
        name: data[0].name,
        type: data[0].type as BankAccount['type'],
        balance: Number(data[0].balance),
      };
      set((state) => ({
        accounts: [...state.accounts, newAcc],
      }));
    }
  },

  updateAccount: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
      }));
      return;
    }

    const { error } = await supabase
      .from('bank_accounts')
      .update({
        name: data.name,
        type: data.type,
        balance: data.balance,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating account:', error);
      return;
    }

    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
    }));
  },

  deleteAccount: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('bank_accounts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting account:', error);
      return;
    }

    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    }));
  },
}));
