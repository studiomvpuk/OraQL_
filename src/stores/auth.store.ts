import { create } from 'zustand';
import { api, ApiError } from '@/lib/api';
import type { User, TokenPair } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setTokens: (tokens: TokenPair) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setTokens: (tokens: TokenPair) => {
    api.setToken(tokens.accessToken);
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ user: User; tokens: TokenPair }>('/auth/login', {
        email,
        password,
      });
      get().setTokens(response.tokens);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  register: async (email: string, password: string, username: string, firstName?: string, lastName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ user: User; tokens: TokenPair }>('/auth/register', {
        email,
        password,
        username,
        firstName,
        lastName,
      });
      get().setTokens(response.tokens);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Registration failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/logout', {});
      api.setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Logout failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await api.get<User>('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      api.setToken(null);
      const message = error instanceof ApiError ? error.message : 'Failed to load user';
      set({ error: message, user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
