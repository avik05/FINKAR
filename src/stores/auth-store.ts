import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  
  // Sign up: creates account & logs in (or waits for confirmation)
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; pending?: boolean; error?: string }>;
  // Login: verifies password and logs in
  login: (email: string, password: string) => Promise<{ success: boolean; pending?: boolean; error?: string }>;

  // Logout
  logout: () => Promise<void>;
  // Initialize: Recover session
  initialize: () => Promise<void>;
  // Delete user data and log out
  deleteAccount: () => Promise<void>;
  // Refresh user data (useful for verification check)
  refreshUser: () => Promise<boolean | void>;
  // Resend verification email
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true,

      refreshUser: async () => {
        // 1. Check if we even have a session first, to avoid "Auth session missing" noise
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No session means we can't refresh user data from server
          return false;
        }

        // 2. Force a fresh user data fetch from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          // If it's a real error (not just missing session), log it but don't crash
          if (error.message !== 'Auth session missing!') {
            console.error('Error refreshing user:', error.message);
          }
          return false;
        }

        if (user) {
          const isVerified = !!user.email_confirmed_at;
          set({
            user: {
              id: user.id,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email!,
              createdAt: user.created_at,
              avatarUrl: user.user_metadata?.avatar_url,
              isEmailVerified: isVerified,
            },
            isLoggedIn: true,
          });
          
          // Return the verification status for immediate use in UI
          return isVerified;
        }
      },

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
              isEmailVerified: !!session.user.email_confirmed_at,
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
                isEmailVerified: !!session.user.email_confirmed_at,
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
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/verify`
          }
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        if (data.user) {
          // If session is null, email confirmation is required
          const isPending = !data.session || !data.user.email_confirmed_at;
          
          set({
            user: {
              id: data.user.id,
              name: name,
              email: email,
              createdAt: data.user.created_at,
              isEmailVerified: !!data.user.email_confirmed_at,
            },
            isLoggedIn: true, // We allow "logged in" state but AuthGuard will block based on isEmailVerified
            isLoading: false,
          });
          
          return { success: true, pending: isPending };
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
              isEmailVerified: !!data.user.email_confirmed_at,
            },
            isLoggedIn: true,
            isLoading: false,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, error: 'Login failed. Please try again.' };
      },

      deleteAccount: async () => {
        await supabase.auth.signOut();
        const keysToRemove = [
          'finkar-accounts-v3',
          'finkar-transactions-v3',
          'finkar-stocks-v3',
          'finkar-mutualfunds-v3',
          'finkar-seeded-v3',
          'finkar-auth-v2',
          'finkar-auth'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        set({ user: null, isLoggedIn: false });
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isLoggedIn: false });
      },

      resendVerification: async (email: string) => {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify`
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      },
    }),
    { 
      name: 'finkar-auth-v3',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);

