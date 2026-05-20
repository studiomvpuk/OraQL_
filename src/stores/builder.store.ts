'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { BuilderState, BuilderSelection } from '@/types';

interface BuilderStore extends BuilderState {
  isLoading: boolean;
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

  load: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<BuilderState>('/builder');
      set({ ...data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  add: async (marketId) => {
    await api.post(`/builder/add/${marketId}`);
    // Reload full state for consistency
    await get().load();
  },

  remove: async (marketId) => {
    await api.delete(`/builder/remove/${marketId}`);
    await get().load();
  },

  clear: async () => {
    await api.delete('/builder/clear');
    set({ selections: [], count: 0, combinedProbability: 1 });
  },

  exportText: async () => {
    const result = await api.get<{ text: string }>('/builder/export');
    return result.text;
  },
}));
