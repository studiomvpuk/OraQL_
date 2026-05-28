'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { BuilderState } from '@/types';

interface BuilderStore extends BuilderState {
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (marketId: string) => Promise<void>;
  remove: (marketId: string) => Promise<void>;
  clear: () => Promise<void>;
  exportText: () => Promise<string>;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  selections: [],
  count: 0,
  combinedProbability: 1,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<BuilderState>('/builder');
      set({ ...data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  add: async (marketId) => {
    set({ error: null });
    try {
      // Backend returns updated BuilderState after adding
      const data = await api.post<BuilderState>(`/builder/add/${marketId}`);
      set({ ...data });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to add selection';
      set({ error: message });
      // Rethrow so UI can react
      throw err;
    }
  },

  remove: async (marketId) => {
    set({ error: null });
    try {
      const data = await api.delete<BuilderState>(`/builder/remove/${marketId}`);
      set({ ...data });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to remove selection';
      set({ error: message });
    }
  },

  clear: async () => {
    set({ error: null });
    try {
      await api.delete('/builder/clear');
      set({ selections: [], count: 0, combinedProbability: 1 });
    } catch {
      // Silently fail clear
    }
  },

  exportText: async () => {
    const result = await api.get<{ text: string }>('/builder/export');
    return result.text;
  },
}));
