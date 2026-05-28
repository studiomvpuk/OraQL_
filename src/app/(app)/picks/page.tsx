'use client';

import { useState, useEffect } from 'react';
import { Star, Filter, Sparkles } from 'lucide-react';
import { PickCard } from '@/components/picks/PickCard';
import { api } from '@/lib/api';
import type { Pick, Sport } from '@/types';

export default function PicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [sport, setSport] = useState<Sport>('FOOTBALL');
  const [minProb, setMinProb] = useState(0.55);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPicks();
  }, [sport, minProb]);

  async function loadPicks() {
    setIsLoading(true);
    try {
      const data = await api.get<Pick[]>(
        `/picks/top?sport=${sport}&minProbability=${minProb}&limit=30`,
      );
      setPicks(data);
    } catch {
      //
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
      {/* Header — Warm cream surface with decorative texture */}
      <div className="relative overflow-hidden rounded-oracle-lg bg-warm-cream p-5 sm:p-8">
        <span className="absolute -right-8 -top-20 hidden font-display text-8xl font-bold text-warm-sand opacity-[0.06] sm:block">
          P
        </span>
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-3">
            <Star className="h-5 w-5 fill-oracle-gold text-oracle-gold sm:h-6 sm:w-6" />
            <h1 className="font-display text-2xl tracking-tight text-dark-ink sm:text-display-md">
              OraQL_ Picks
            </h1>
          </div>
          <p className="max-w-xl text-body-sm text-txt-secondary sm:text-body">
            Today's highest-confidence predictions ranked by probability.
            Every pick includes a transparent explanation of the reasoning.
          </p>
        </div>
      </div>

      {/* Filters — Sport pills and probability threshold */}
      <div className="space-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-txt-tertiary" />
          <span className="text-body-sm font-medium text-txt-secondary">Filters:</span>
        </div>

        {/* Sport pills */}
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(['FOOTBALL', 'BASKETBALL', 'TENNIS'] as Sport[]).map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-body-sm font-medium transition-all ${
                sport === s
                  ? 'bg-warm-white text-txt-primary shadow-soft'
                  : 'bg-warm-cream text-txt-secondary hover:bg-warm-sand'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <span className="hidden h-5 w-px bg-warm-stone sm:block" aria-hidden="true" />

        {/* Probability threshold */}
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[0.55, 0.65, 0.75].map((p) => (
            <button
              key={p}
              onClick={() => setMinProb(p)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 font-mono text-body-sm font-medium transition-all ${
                minProb === p
                  ? 'bg-warm-white text-txt-primary shadow-soft'
                  : 'bg-warm-cream text-txt-secondary hover:bg-warm-sand'
              }`}
            >
              ≥ {(p * 100).toFixed(0)}%
            </button>
          ))}
        </div>
      </div>

      {/* Picks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-oracle-md bg-warm-cream" />
          ))}
        </div>
      ) : picks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((pick) => (
            <PickCard key={pick.id} pick={pick} variant="light" showEvent />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-oracle-lg border border-dashed border-warm-stone bg-warm-cream py-16 text-center sm:py-20">
          <Sparkles className="mb-3 h-10 w-10 text-warm-taupe" />
          <p className="mb-2 text-body text-txt-secondary">
            No picks above {(minProb * 100).toFixed(0)}% for {sport.toLowerCase()} today.
          </p>
          <p className="text-body-sm text-txt-tertiary">
            Try lowering the threshold or switching sports.
          </p>
        </div>
      )}
    </div>
  );
}
