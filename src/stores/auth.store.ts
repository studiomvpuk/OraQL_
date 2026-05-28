'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User, TokenPair } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setTokens: (tokens: TokenPair) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const tokens = await api.post<TokenPair>('/auth/login', { email, password });
    api.setToken(tokens.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('oracle_refresh', tokens.refreshToken);
    }
    const user = await api.get<User>('/auth/me');
    set({ user, isAuthenticated: true, isLoading: false });
  },

  register: async (data) => {
    const tokens = await api.post<TokenPair>('/auth/register', data);
    api.setToken(tokens.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('oracle_refresh', tokens.refreshToken);
    }
    const user = await api.get<User>('/auth/me');
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('oracle_refresh');
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadUser: async () => {
    try {
      const token = api.getToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const user = await api.get<User>('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setTokens: (tokens) => {
    api.setToken(tokens.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('oracle_refresh', tokens.refreshToken);
    }
  },
}));
