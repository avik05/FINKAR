import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Goal } from '@/types/finance';
import { useAuthStore } from './auth-store';

const SAMPLE_GOALS: Goal[] = [
  { id: 'g_1', name: 'Emergency Fund', targetAmount: 1000000, currentAmount: 850000, deadline: '2026-12-31', color: '#00FF9C' },
  { id: 'g_2', name: 'MBA Reserve', targetAmount: 2500000, currentAmount: 500000, deadline: '2027-12-31', color: '#3b82f6' },
  { id: 'g_3', name: 'Europe Summer 2026', targetAmount: 500000, currentAmount: 200000, deadline: '2026-08-15', color: '#a855f7' },
];

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  
  fetchGoals: (userId?: string | null) => Promise<void>;
  addGoal: (g: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  contributeToGoal: (id: string, amount: number) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: SAMPLE_GOALS,
  isLoading: false,

  fetchGoals: async (providedUserId) => {
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ goals: SAMPLE_GOALS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      console.error('Error fetching goals:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      name: row.name,
      targetAmount: Number(row.target_amount),
      currentAmount: Number(row.current_amount),
      deadline: row.deadline,
      category: row.category,
      color: row.color,
    }));

    set({ goals: mapped, isLoading: false });
  },

  addGoal: async (g) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        goals: [...state.goals, { ...g, id: `guest_goal_${Date.now()}` }],
      }));
      return;
    }

    const { data, error } = await supabase
      .from('goals')
      .insert([{
        user_id: userId,
        name: g.name,
        target_amount: g.targetAmount,
        current_amount: g.currentAmount,
        deadline: g.deadline,
        category: g.category,
        color: g.color,
      }])
      .select();

    if (error) {
      console.error('Error adding goal:', error);
      return;
    }

    if (data && data[0]) {
      const newGoal: Goal = {
        id: data[0].id,
        name: data[0].name,
        targetAmount: Number(data[0].target_amount),
        currentAmount: Number(data[0].current_amount),
        deadline: data[0].deadline,
        category: data[0].category,
        color: data[0].color,
      };
      set((state) => ({
        goals: [...state.goals, newGoal],
      }));
    }
  },

  updateGoal: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
      }));
      return;
    }

    const { error } = await supabase
      .from('goals')
      .update({
        name: data.name,
        target_amount: data.targetAmount,
        current_amount: data.currentAmount,
        deadline: data.deadline,
        category: data.category,
        color: data.color,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating goal:', error);
      return;
    }

    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
  },

  deleteGoal: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('goals').delete().eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }

    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },

  contributeToGoal: async (id, amount) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;

    const userId = useAuthStore.getState().user?.id;
    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);

    if (!userId) {
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, currentAmount: newAmount } : g
        ),
      }));
      return;
    }

    const { error } = await supabase
      .from('goals')
      .update({ current_amount: newAmount })
      .eq('id', id);

    if (error) {
      console.error('Error contributing to goal:', error);
      return;
    }

    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, currentAmount: newAmount } : g
      ),
    }));
  },
}));
