import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  
  // Sign up: creates account & logs in
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  // Login: verifies password and logs in
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  // Social Login: Google
  loginWithGoogle: () => Promise<void>;
  // Logout
  logout: () => Promise<void>;
  // Initialize: Recover session
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true,

      initialize: async () => {
        set({ isLoading: true });
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email!,
              createdAt: session.user.created_at,
              avatarUrl: session.user.user_metadata?.avatar_url,
            },
            isLoggedIn: true,
            isLoading: false,
          });
        } else {
          set({ user: null, isLoggedIn: false, isLoading: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email!,
                createdAt: session.user.created_at,
                avatarUrl: session.user.user_metadata?.avatar_url,
              },
              isLoggedIn: true,
            });
          } else {
            set({ user: null, isLoggedIn: false });
          }
        });
      },

      signup: async (name, email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              name: name,
              email: email,
              createdAt: data.user.created_at,
            },
            isLoggedIn: true,
            isLoading: false,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, error: 'Signup failed. Please try again.' };
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || email.split('@')[0],
              email: email,
              createdAt: data.user.created_at,
            },
            isLoggedIn: true,
            isLoading: false,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, error: 'Login failed. Please try again.' };
      },

      loginWithGoogle: async () => {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/dashboard',
          },
        });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isLoggedIn: false });
      },
    }),
    { 
      name: 'finkar-auth-v2',
      // We only persist a small part to avoid stale sessions vs Supabase's reliable session
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
