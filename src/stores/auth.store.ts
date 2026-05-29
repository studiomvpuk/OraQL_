'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User, TokenPair } from '@/types';

interface AuthResponse {
  user: User;
  tokenPair: TokenPair;
  requires2FA?: boolean;
  message?: string;
}

interface MeResponse {
  user: User;
}

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

function persistTokens(tokens: TokenPair) {
  api.setToken(tokens.accessToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem('oracle_refresh', tokens.refreshToken);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    if (res.requires2FA) {
      throw new Error('Two-factor authentication is required for this account.');
    }
    persistTokens(res.tokenPair);
    set({ user: res.user, isAuthenticated: true, isLoading: false });
  },

  register: async (data) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    persistTokens(res.tokenPair);
    set({ user: res.user, isAuthenticated: true, isLoading: false });
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
      // api.get will auto-refresh if the access token is expired (401 → tryRefresh)
      const res = await api.get<MeResponse>('/auth/me');
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      // Only clear tokens on auth errors (401/403), not on network failures
      if (err?.status === 401 || err?.status === 403) {
        api.setToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('oracle_refresh');
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      } else {
        // Network error or server error — keep tokens, just set not loading
        // User may reconnect later without re-authenticating
        set({ isLoading: false });
      }
    }
  },

  setTokens: (tokens) => {
    persistTokens(tokens);
  },
}));
