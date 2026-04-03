import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MutualFund } from '@/types/finance';

interface MutualFundsState {
  funds: MutualFund[];
  addFund: (f: Omit<MutualFund, 'id'>) => void;
  updateFund: (id: string, data: Partial<MutualFund>) => void;
  deleteFund: (id: string) => void;
}

export const useMutualFundsStore = create<MutualFundsState>()(
  persist(
    (set) => ({
      funds: [],
      addFund: (f) =>
        set((state) => ({
          funds: [...state.funds, { ...f, id: `mf_${Date.now()}` }],
        })),
      updateFund: (id, data) =>
        set((state) => ({
          funds: state.funds.map((f) => (f.id === id ? { ...f, ...data } : f)),
        })),
      deleteFund: (id) =>
        set((state) => ({
          funds: state.funds.filter((f) => f.id !== id),
        })),
    }),
    { name: 'finkar-mutualfunds-v3' }
  )
);
