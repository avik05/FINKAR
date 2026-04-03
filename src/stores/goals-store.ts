import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal } from '@/types/finance';

interface GoalsState {
  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
}

const GOAL_COLORS = ['#00FF9C', '#3b82f6', '#a855f7', '#f97316', '#ec4899', '#14b8a6', '#eab308'];

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (g) =>
        set((state) => ({
          goals: [...state.goals, { ...g, id: `goal_${Date.now()}`, color: g.color || GOAL_COLORS[state.goals.length % GOAL_COLORS.length] }],
        })),
      updateGoal: (id, data) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...data } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      contributeToGoal: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) } : g
          ),
        })),
    }),
    { name: 'finkar-goals' }
  )
);
