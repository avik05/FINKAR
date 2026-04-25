import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth-store';

export interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number; // annual %
  tenureMonths: number;
  startDate: string;
  color?: string;
}

interface LoansState {
  loans: Loan[];
  isLoading: boolean;
  
  fetchLoans: (userId?: string | null) => Promise<void>;
  addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
  updateLoan: (id: string, updates: Partial<Omit<Loan, 'id'>>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
}

export const useLoansStore = create<LoansState>()(
  persist(
    (set, get) => ({
      loans: [],
      isLoading: false,

      fetchLoans: async (providedUserId) => {
        const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
        if (!userId) return;

        set({ isLoading: true });
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching loans:', error);
          set({ isLoading: false });
          return;
        }

        const mapped = (data || []).map(row => ({
          id: row.id,
          name: row.name,
          principal: Number(row.principal),
          interestRate: Number(row.interest_rate),
          tenureMonths: Number(row.tenure_months),
          startDate: row.start_date,
          color: row.color,
        }));

        set({ loans: mapped, isLoading: false });
      },

      addLoan: async (loan) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          // Guest mode
          set((state) => ({
            loans: [{ ...loan, id: `guest_loan_${Date.now()}` }, ...state.loans],
          }));
          return;
        }

        const { data, error } = await supabase
          .from('loans')
          .insert([{
            user_id: userId,
            name: loan.name,
            principal: loan.principal,
            interest_rate: loan.interestRate,
            tenure_months: loan.tenureMonths,
            start_date: loan.startDate,
            color: loan.color,
          }])
          .select();

        if (error) {
          console.error('Error adding loan:', error);
          return;
        }

        if (data?.[0]) {
          const newLoan: Loan = {
            id: data[0].id,
            name: data[0].name,
            principal: Number(data[0].principal),
            interestRate: Number(data[0].interest_rate),
            tenureMonths: Number(data[0].tenure_months),
            startDate: data[0].start_date,
            color: data[0].color,
          };
          set((state) => ({
            loans: [newLoan, ...state.loans],
          }));
        }
      },

      updateLoan: async (id, updates) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set((state) => ({
            loans: state.loans.map((l) => (l.id === id ? { ...l, ...updates } : l)),
          }));
          return;
        }

        const { error } = await supabase
          .from('loans')
          .update({
            name: updates.name,
            principal: updates.principal,
            interest_rate: updates.interestRate,
            tenure_months: updates.tenureMonths,
            start_date: updates.startDate,
            color: updates.color,
          })
          .eq('id', id);

        if (error) {
          console.error('Error updating loan:', error);
          return;
        }

        set((state) => ({
          loans: state.loans.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },

      deleteLoan: async (id) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set((state) => ({
            loans: state.loans.filter((l) => l.id !== id),
          }));
          return;
        }

        const { error } = await supabase.from('loans').delete().eq('id', id);
        if (error) {
          console.error('Error deleting loan:', error);
          return;
        }

        set((state) => ({
          loans: state.loans.filter((l) => l.id !== id),
        }));
      },
    }),
    {
      name: 'finkar-loans-storage',
    }
  )
);
