import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { StockHolding } from '@/types/finance';
import { useAuthStore } from './auth-store';

const SAMPLE_STOCKS: StockHolding[] = [
  { id: 's_1', symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 40, avgBuyPrice: 2350.50, currentPrice: 2980.20 },
  { id: 's_2', symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 150, avgBuyPrice: 1420.00, currentPrice: 1640.60 },
  { id: 's_3', symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 25, avgBuyPrice: 3280.40, currentPrice: 3920.10 },
  { id: 's_4', symbol: 'ZOMATO', name: 'Zomato Limited', quantity: 800, avgBuyPrice: 94.00, currentPrice: 184.25 },
  { id: 's_5', symbol: 'TATAMOTORS', name: 'Tata Motors', quantity: 120, avgBuyPrice: 620.00, currentPrice: 980.50 },
  { id: 's_6', symbol: 'INFY', name: 'Infosys Limited', quantity: 80, avgBuyPrice: 1380.00, currentPrice: 1540.60 },
];

interface StocksState {
  holdings: StockHolding[];
  isLoading: boolean;
  
  fetchHoldings: (userId?: string | null) => Promise<void>;
  addHolding: (h: Omit<StockHolding, 'id'>) => Promise<void>;
  updateHolding: (id: string, data: Partial<StockHolding>) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
}

export const useStocksStore = create<StocksState>((set, get) => ({
  holdings: SAMPLE_STOCKS,
  isLoading: false,

  fetchHoldings: async (providedUserId) => {
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ holdings: SAMPLE_STOCKS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('symbol', { ascending: true });

    if (error) {
      console.error('Error fetching stocks:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      symbol: row.symbol,
      name: row.name,
      quantity: Number(row.quantity),
      avgBuyPrice: Number(row.avg_buy_price),
      currentPrice: Number(row.current_price),
    }));

    set({ holdings: mapped, isLoading: false });
  },

  addHolding: async (h) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        holdings: [...state.holdings, { ...h, id: `guest_stk_${Date.now()}` }],
      }));
      return;
    }

    const { data, error } = await supabase
      .from('stocks')
      .insert([{
        user_id: userId,
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avg_buy_price: h.avgBuyPrice,
        current_price: h.currentPrice,
      }])
      .select();

    if (error) {
      console.error('Error adding stock:', error);
      return;
    }

    if (data && data[0]) {
      const newStk: StockHolding = {
        id: data[0].id,
        symbol: data[0].symbol,
        name: data[0].name,
        quantity: Number(data[0].quantity),
        avgBuyPrice: Number(data[0].avg_buy_price),
        currentPrice: Number(data[0].current_price),
      };
      set((state) => ({
        holdings: [...state.holdings, newStk],
      }));
    }
  },

  updateHolding: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        holdings: state.holdings.map((h) => (h.id === id ? { ...h, ...data } : h)),
      }));
      return;
    }

    const { error } = await supabase
      .from('stocks')
      .update({
        symbol: data.symbol,
        name: data.name,
        quantity: data.quantity,
        avg_buy_price: data.avgBuyPrice,
        current_price: data.currentPrice,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating stock:', error);
      return;
    }

    set((state) => ({
      holdings: state.holdings.map((h) => (h.id === id ? { ...h, ...data } : h)),
    }));
  },

  deleteHolding: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        holdings: state.holdings.filter((h) => h.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('stocks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting stock:', error);
      return;
    }

    set((state) => ({
      holdings: state.holdings.filter((h) => h.id !== id),
    }));
  },
}));
