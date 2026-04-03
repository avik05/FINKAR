import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  // Sign up: creates account & logs in
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  // Login: verifies password and logs in
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// We store a separate registry of all accounts (email -> hashed password) in localStorage.
// This simulates a backend credentials store purely client-side.
const ACCOUNTS_KEY = 'finkar_accounts_registry';

function getRegistry(): Record<string, { name: string; passwordHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
  } catch {
    return {};
  }
}

// Simple deterministic hash (not cryptographic, fine for demo localStorage auth)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      signup: (name, email, password) => {
        if (!name.trim() || !email.trim() || !password.trim()) {
          return { success: false, error: 'All fields are required.' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }

        const registry = getRegistry();
        const normalizedEmail = email.toLowerCase().trim();

        if (registry[normalizedEmail]) {
          return { success: false, error: 'An account with this email already exists. Please log in.' };
        }

        const passwordHash = simpleHash(password);
        registry[normalizedEmail] = { name: name.trim(), passwordHash };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(registry));

        const newUser: AuthUser = {
          id: `user_${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          createdAt: new Date().toISOString(),
        };

        set({ user: newUser, isLoggedIn: true });
        return { success: true };
      },

      login: (email, password) => {
        if (!email.trim() || !password.trim()) {
          return { success: false, error: 'Email and password are required.' };
        }

        const registry = getRegistry();
        const normalizedEmail = email.toLowerCase().trim();
        const record = registry[normalizedEmail];

        if (!record) {
          return { success: false, error: 'No account found with this email. Please sign up.' };
        }

        const passwordHash = simpleHash(password);
        if (record.passwordHash !== passwordHash) {
          return { success: false, error: 'Incorrect password. Please try again.' };
        }

        const loggedInUser: AuthUser = {
          id: `user_${simpleHash(normalizedEmail)}`,
          name: record.name,
          email: normalizedEmail,
          createdAt: new Date().toISOString(),
        };

        set({ user: loggedInUser, isLoggedIn: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
    }),
    { name: 'finkar-auth' }
  )
);
