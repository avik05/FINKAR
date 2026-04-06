import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/finance';
import { useAuthStore } from './auth-store';

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

// Sample data for Guest Mode
const SAMPLE_TRANSACTIONS: Transaction[] = [
  // Income - Last 3 Months
  { id: 'tr_inc_3', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Tech Corp Salary', category: 'Income', amount: 215000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_inc_2', date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Tech Corp Salary', category: 'Income', amount: 215000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_inc_1', date: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Tech Corp Salary', category: 'Income', amount: 215000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },

  // Fixed Monthly Expenses (Rent)
  { id: 'tr_rent_3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Flat Rent - April', category: 'Utilities', amount: -35000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_rent_2', date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Flat Rent - March', category: 'Utilities', amount: -35000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_rent_1', date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Flat Rent - February', category: 'Utilities', amount: -35000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },

  // Monthly SIPs (Investments)
  { id: 'tr_sip_3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Mutual Fund SIP', category: 'Investments', amount: -50000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_sip_2', date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Mutual Fund SIP', category: 'Investments', amount: -50000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_sip_1', date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Mutual Fund SIP', category: 'Investments', amount: -50000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },

  // Daily Spending (Last 30 Days)
  { id: 'tr_ls_1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Zomato - Burger King', category: 'Food & Dining', amount: -850, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Amazon - Electronics', category: 'Shopping', amount: -4500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_3', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Uber - Office', category: 'Transport', amount: -420, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_4', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Starbucks Coffee', category: 'Food & Dining', amount: -650, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_5', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Netflix Subscription', category: 'Subscriptions', amount: -649, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_6', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Shell Petrol', category: 'Transport', amount: -3200, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_7', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Swiggy Gourmet', category: 'Food & Dining', amount: -1250, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_8', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Nike Store Shopping', category: 'Shopping', amount: -8500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_9', date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Apple iCloud', category: 'Subscriptions', amount: -190, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_ls_10', date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Uber - Weekend Out', category: 'Transport', amount: -780, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  
  // Additional Lifestyle Expenses to balance Savings Rate to ~35%
  { id: 'tr_add_1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'PVR Cinemas - IMAX', category: 'Entertainment', amount: -1800, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_2', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Zara Men Shopping', category: 'Shopping', amount: -14500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_3', date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'IndiGo - Goa Flight', category: 'Travel', amount: -12500, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_add_4', date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Cult.fit Gym', category: 'Health', amount: -4500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_5', date: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Amazon - Home Decore', category: 'Shopping', amount: -9800, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_6', date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Fine Dining - Taj', category: 'Food & Dining', amount: -8200, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_7', date: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Apple Music Family', category: 'Subscriptions', amount: -199, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_8', date: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Gas & Electric Bill', category: 'Utilities', amount: -4200, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_add_9', date: new Date(Date.now() - 68 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Nykaa Man Luxe', category: 'Shopping', amount: -3500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  { id: 'tr_add_10', date: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Auto Insurance Renewal', category: 'Other', amount: -18500, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_add_11', date: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Weekend Getaway Airbnb', category: 'Travel', amount: -15000, accountId: 'sc_1', accountName: 'ICICI Savings (Salary)' },
  { id: 'tr_add_12', date: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(), merchant: 'Whole Foods Grocery', category: 'Food & Dining', amount: -6500, accountId: 'sc_2', accountName: 'HDFC Regalia Card' },
  
];

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  
  fetchTransactions: (userId?: string | null) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: SAMPLE_TRANSACTIONS,
  isLoading: false,

  fetchTransactions: async (providedUserId) => {
    // Determine userId: either provided or from auth store
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ transactions: SAMPLE_TRANSACTIONS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      date: row.date,
      merchant: row.merchant,
      category: row.category,
      amount: Number(row.amount),
      accountId: row.account_id,
      accountName: row.account_name,
    }));

    set({ transactions: mapped, isLoading: false });
  },

  addTransaction: async (tx) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      // Guest mode: update local state only
      set((state) => ({
        transactions: [{ ...tx, id: `guest_tr_${Date.now()}` }, ...state.transactions],
      }));
      return;
    }

    // Real user: database operation
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        date: tx.date,
        merchant: tx.merchant,
        category: tx.category,
        amount: tx.amount,
        account_id: tx.accountId,
        account_name: tx.accountName,
      }])
      .select();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    if (data && data[0]) {
      const newTx: Transaction = {
        id: data[0].id,
        date: data[0].date,
        merchant: data[0].merchant,
        category: data[0].category,
        amount: Number(data[0].amount),
        accountId: data[0].account_id || null,
        accountName: data[0].account_name || "Unlinked",
      };
      set((state) => ({
        transactions: [newTx, ...state.transactions],
      }));
    }
  },

  updateTransaction: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
      }));
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .update({
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        date: data.date,
        account_id: data.accountId,
        account_name: data.accountName,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }

    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTransaction: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));
