import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { StockHolding } from '@/types/finance';
import { useAuthStore } from './auth-store';

const SAMPLE_STOCKS: StockHolding[] = [
  { id: 's_1', symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 40, avgBuyPrice: 2350.50, currentPrice: 2980.20, sector: 'Energy', exchange: 'NSE', purchasedAt: '2024-01-15' },
  { id: 's_2', symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 150, avgBuyPrice: 1420.00, currentPrice: 1640.60, sector: 'Financials', exchange: 'NSE', purchasedAt: '2024-02-10' },
  { id: 's_3', symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 25, avgBuyPrice: 3280.40, currentPrice: 3920.10, sector: 'Technology', exchange: 'NSE', purchasedAt: '2023-11-05' },
  { id: 's_4', symbol: 'ZOMATO', name: 'Zomato Limited', quantity: 800, avgBuyPrice: 94.00, currentPrice: 184.25, sector: 'Consumer', exchange: 'NSE', purchasedAt: '2024-03-20' },
  { id: 's_5', symbol: 'TATAMOTORS', name: 'Tata Motors', quantity: 120, avgBuyPrice: 620.00, currentPrice: 980.50, sector: 'Automobile', exchange: 'NSE', purchasedAt: '2023-08-12' },
  { id: 's_6', symbol: 'INFY', name: 'Infosys Limited', quantity: 80, avgBuyPrice: 1380.00, currentPrice: 1540.60, sector: 'Technology', exchange: 'NSE', purchasedAt: '2024-04-01' },
];

interface StocksState {
  holdings: StockHolding[];
  isLoading: boolean;
  
  fetchHoldings: (userId?: string | null) => Promise<void>;
  addHolding: (h: Omit<StockHolding, 'id'>) => Promise<void>;
  updateHolding: (id: string, data: Partial<StockHolding>) => Promise<void>;
  deleteHolding: (id: string) => Promise<void>;
  bulkUpsertHoldings: (newHoldings: Omit<StockHolding, 'id'>[]) => Promise<void>;
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
      sector: row.sector || 'Others',
      exchange: (row.exchange || 'NSE') as StockHolding['exchange'],
      purchasedAt: row.purchased_at,
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
        sector: h.sector || 'Others',
        exchange: h.exchange || 'NSE',
        purchased_at: h.purchasedAt,
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
        sector: data[0].sector || 'Others',
        exchange: (data[0].exchange || 'NSE') as StockHolding['exchange'],
        purchasedAt: data[0].purchased_at,
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
        sector: data.sector,
        exchange: data.exchange,
        purchased_at: data.purchasedAt,
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
  
  bulkUpsertHoldings: async (newHoldings) => {
    const userId = useAuthStore.getState().user?.id;
    const currentHoldings = get().holdings;

    if (!userId) {
      // Guest Mode: Overwrite by Symbol
      const updatedHoldings = [...currentHoldings];
      
      newHoldings.forEach(nh => {
        const index = updatedHoldings.findIndex(h => h.symbol === nh.symbol);
        if (index > -1) {
          updatedHoldings[index] = { ...updatedHoldings[index], ...nh };
        } else {
          updatedHoldings.push({ ...nh, id: `guest_stk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` });
        }
      });

      set({ holdings: updatedHoldings });
      return;
    }

    // Auth Mode: Selective Upsert
    // 1. Fetch current DB state to find IDs for existing symbols
    const { data: dbData, error: fetchError } = await supabase
      .from('stocks')
      .select('id, symbol');

    if (fetchError) {
      console.error('Error fetching for upsert:', fetchError);
      return;
    }

    const symbolToIdMap = new Map((dbData || []).map(r => [r.symbol, r.id]));

    // 2. Prepare UPSERT payload
    const upsertPayload = newHoldings.map(nh => {
      const existingId = symbolToIdMap.get(nh.symbol);
      const row: any = {
        user_id: userId,
        symbol: nh.symbol,
        name: nh.name,
        quantity: nh.quantity,
        avg_buy_price: nh.avgBuyPrice,
        current_price: nh.currentPrice,
        sector: nh.sector || 'Others',
        exchange: nh.exchange || 'NSE',
        purchased_at: nh.purchasedAt || new Date().toISOString().split('T')[0],
      };
      if (existingId) row.id = existingId;
      return row;
    });

    const { error: upsertError } = await supabase
      .from('stocks')
      .upsert(upsertPayload, { onConflict: 'id' });

    if (upsertError) {
      console.error('Error during bulk upsert:', upsertError);
      return;
    }

    // 3. Refresh local state
    await get().fetchHoldings(userId);
  },
}));
