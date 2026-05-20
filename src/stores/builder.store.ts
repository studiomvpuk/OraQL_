import { create } from 'zustand';
import type { BuilderSelection, BuilderState } from '@/types';

interface BuilderStoreState extends BuilderState {
  add: (selection: BuilderSelection) => void;
  remove: (pickId: string) => void;
  clear: () => void;
  load: (selections: BuilderSelection[]) => void;
  exportText: () => string;
}

const calculateCombinedOdds = (selections: BuilderSelection[]): number => {
  if (selections.length === 0) return 1;
  return selections.reduce((acc, sel) => acc * sel.odds, 1);
};

const calculateCombinedProbability = (selections: BuilderSelection[]): number => {
  if (selections.length === 0) return 0;
  return selections.reduce((acc, sel) => acc * sel.probability, 1);
};

export const useBuilderStore = create<BuilderStoreState>((set) => ({
  selections: [],
  count: 0,
  combinedProbability: 0,
  combinedOdds: 1,

  load: (selections: BuilderSelection[]) => {
    set({
      selections,
      count: selections.length,
      combinedProbability: calculateCombinedProbability(selections),
      combinedOdds: calculateCombinedOdds(selections),
    });
  },

  add: (selection: BuilderSelection) => {
    set((state) => {
      const newSelections = [...state.selections, selection];
      return {
        selections: newSelections,
        count: newSelections.length,
        combinedProbability: calculateCombinedProbability(newSelections),
        combinedOdds: calculateCombinedOdds(newSelections),
      };
    });
  },

  remove: (pickId: string) => {
    set((state) => {
      const newSelections = state.selections.filter((sel) => sel.pickId !== pickId);
      return {
        selections: newSelections,
        count: newSelections.length,
        combinedProbability: calculateCombinedProbability(newSelections),
        combinedOdds: calculateCombinedOdds(newSelections),
      };
    });
  },

  clear: () => {
    set({
      selections: [],
      count: 0,
      combinedProbability: 0,
      combinedOdds: 1,
    });
  },

  exportText: () => {
    const state = create<BuilderStoreState>((set) => ({
      selections: [],
      count: 0,
      combinedProbability: 0,
      combinedOdds: 1,
      add: () => {},
      remove: () => {},
      clear: () => {},
      load: () => {},
      exportText: () => '',
    }))((state) => state);

    const { selections, count, combinedProbability, combinedOdds } = state;
    if (count === 0) return 'No selections in builder';

    const lines: string[] = ['Oracle Builder Parlay', `Picks: ${count}`, ''];

    selections.forEach((sel, idx) => {
      lines.push(`${idx + 1}. ${sel.eventTitle}`);
      lines.push(`   ${sel.label}`);
      lines.push(`   Probability: ${(sel.probability * 100).toFixed(1)}% | Odds: ${sel.odds.toFixed(2)}`);
    });

    lines.push('');
    lines.push(`Combined Probability: ${(combinedProbability * 100).toFixed(1)}%`);
    lines.push(`Combined Odds: ${combinedOdds.toFixed(2)}`);

    return lines.join('\n');
  },
}));
