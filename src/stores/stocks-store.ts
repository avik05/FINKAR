import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockHolding } from '@/types/finance';

interface StocksState {
  holdings: StockHolding[];
  addHolding: (h: Omit<StockHolding, 'id'>) => void;
  updateHolding: (id: string, data: Partial<StockHolding>) => void;
  deleteHolding: (id: string) => void;
}

export const useStocksStore = create<StocksState>()(
  persist(
    (set) => ({
      holdings: [],
      addHolding: (h) =>
        set((state) => ({
          holdings: [...state.holdings, { ...h, id: `stk_${Date.now()}` }],
        })),
      updateHolding: (id, data) =>
        set((state) => ({
          holdings: state.holdings.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),
      deleteHolding: (id) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.id !== id),
        })),
    }),
    { name: 'finkar-stocks-v3' }
  )
);
