import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token); // Save token to localStorage
        } else {
          localStorage.removeItem('token'); // Remove token from localStorage
        }
        set({ token });
      },
      logout: () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);