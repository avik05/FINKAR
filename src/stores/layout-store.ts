import { create } from 'zustand';

interface LayoutState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open: boolean) => set({ isMobileMenuOpen: open }),
  dateRange: "This Month",
  setDateRange: (range: string) => set({ dateRange: range }),
}));
