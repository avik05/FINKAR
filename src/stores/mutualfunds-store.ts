import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { MutualFund } from '@/types/finance';
import { useAuthStore } from './auth-store';

const SAMPLE_FUNDS: MutualFund[] = [
  { id: 'mf_1', fund: 'Parag Parikh Flexi Cap Fund', category: 'Equity', invested: 620000, current: 845000, sipAmount: 15000, xirr: 19.8 },
  { id: 'mf_2', fund: 'UTI Nifty 50 Index Fund', category: 'Index', invested: 410000, current: 512000, sipAmount: 20000, xirr: 14.5 },
  { id: 'mf_3', fund: 'Axis Small Cap Fund', category: 'Equity', invested: 180000, current: 245000, sipAmount: 10000, xirr: 24.2 },
  { id: 'mf_4', fund: 'ICICI Prudential Technology Fund', category: 'Equity', invested: 120000, current: 138000, sipAmount: 5000, xirr: 12.8 },
];

interface MutualFundsState {
  funds: MutualFund[];
  isLoading: boolean;
  
  fetchFunds: (userId?: string | null) => Promise<void>;
  addFund: (f: Omit<MutualFund, 'id'>) => Promise<void>;
  updateFund: (id: string, data: Partial<MutualFund>) => Promise<void>;
  deleteFund: (id: string) => Promise<void>;
}

export const useMutualFundsStore = create<MutualFundsState>((set, get) => ({
  funds: SAMPLE_FUNDS,
  isLoading: false,

  fetchFunds: async (providedUserId) => {
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ funds: SAMPLE_FUNDS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('mutual_funds')
      .select('*')
      .order('fund', { ascending: true });

    if (error) {
      console.error('Error fetching mutual funds:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      fund: row.fund,
      category: row.category as MutualFund['category'],
      invested: Number(row.invested),
      current: Number(row.current),
      sipAmount: Number(row.sip_amount),
      xirr: Number(row.xirr),
    }));

    set({ funds: mapped, isLoading: false });
  },

  addFund: async (f) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        funds: [...state.funds, { ...f, id: `guest_mf_${Date.now()}` }],
      }));
      return;
    }

    const { data, error } = await supabase
      .from('mutual_funds')
      .insert([{
        user_id: userId,
        fund: f.fund,
        category: f.category,
        invested: f.invested,
        current: f.current,
        sip_amount: f.sipAmount,
        xirr: f.xirr,
      }])
      .select();

    if (error) {
      console.error('Error adding fund:', error);
      return;
    }

    if (data && data[0]) {
      const newFund: MutualFund = {
        id: data[0].id,
        fund: data[0].fund,
        category: data[0].category as MutualFund['category'],
        invested: Number(data[0].invested),
        current: Number(data[0].current),
        sipAmount: Number(data[0].sip_amount),
        xirr: Number(data[0].xirr),
      };
      set((state) => ({
        funds: [...state.funds, newFund],
      }));
    }
  },

  updateFund: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        funds: state.funds.map((f) => (f.id === id ? { ...f, ...data } : f)),
      }));
      return;
    }

    const { error } = await supabase
      .from('mutual_funds')
      .update({
        fund: data.fund,
        category: data.category,
        invested: data.invested,
        current: data.current,
        sip_amount: data.sipAmount,
        xirr: data.xirr,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating fund:', error);
      return;
    }

    set((state) => ({
      funds: state.funds.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }));
  },

  deleteFund: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        funds: state.funds.filter((f) => f.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('mutual_funds').delete().eq('id', id);

    if (error) {
      console.error('Error deleting fund:', error);
      return;
    }

    set((state) => ({
      funds: state.funds.filter((f) => f.id !== id),
    }));
  },
}));
