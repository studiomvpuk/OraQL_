'use client';

import { useEffect, useState } from 'react';
import { Layers, X, Copy, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { cn, formatProbability, formatKickoff } from '@/lib/utils';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import { Button } from '@/components/ui/Button';
import { useBuilderStore } from '@/stores/builder.store';
import Link from 'next/link';

export default function BuilderPage() {
  const { selections, count, combinedProbability, load, remove, clear, exportText, isLoading } =
    useBuilderStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    try {
      const text = await exportText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-0">
      {/* Header Section - Dark Surface with Confidence Display */}
      <div className="relative overflow-hidden bg-dark-ink px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Decorative background letter */}
        <div className="pointer-events-none absolute inset-0 hidden items-start justify-end overflow-hidden sm:flex">
          <span className="absolute -right-12 -top-20 font-display text-[300px] leading-none text-white/[0.04]">
            B
          </span>
        </div>

        <div className="relative z-10">
          {/* Title and Selection Count */}
          <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
            <Layers className="h-6 w-6 flex-shrink-0 text-oracle-gold sm:h-7 sm:w-7" />
            <div className="flex-1">
              <h1 className="font-display text-2xl tracking-tight text-txt-inverse sm:text-display-md">
                Bet Builder
              </h1>
            </div>
            {count > 0 && (
              <span className="flex-shrink-0 rounded-full bg-warm-cream px-3 py-1.5 font-mono text-body-sm font-bold text-txt-secondary sm:py-2">
                {count}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mb-6 max-w-2xl text-body-sm text-txt-inverse-2 sm:mb-8 sm:text-body">
            Your multi-match strategy. Add picks from different events, review the combined probability, and export when ready.
          </p>

          {/* Combined Probability and Actions */}
          {count > 0 && (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
              {/* Probability Display - Largest Element */}
              <div className="flex-1">
                <p className="mb-2 text-caption text-txt-inverse-2">Combined Probability</p>
                <p className="font-mono text-3xl font-bold text-oracle-gold sm:text-display-sm">
                  {formatProbability(combinedProbability)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <Button variant="gold" onClick={handleExport} className="flex-1 sm:flex-none">
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Export'}
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-txt-inverse-2 hover:bg-danger/10 hover:text-danger sm:flex-none"
                  onClick={() => clear()}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selections Section - Warm Light Surface */}
      {isLoading ? (
        <div className="bg-warm-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-oracle-md bg-warm-cream/40" />
            ))}
          </div>
        </div>
      ) : count > 0 ? (
        <div className="bg-warm-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="space-y-3">
            {selections.map((s, idx) => (
              <div
                key={s.id}
                className="group flex flex-wrap items-center gap-3 rounded-oracle-md border border-warm-sand bg-white p-4 transition-all duration-200 hover:border-oracle-gold hover:shadow-sm sm:flex-nowrap sm:gap-4 sm:p-5"
              >
                {/* Selection Number Badge */}
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warm-cream font-mono text-body-sm font-bold text-txt-secondary">
                  {idx + 1}
                </span>

                {/* Event Information */}
                <div className="order-3 min-w-0 flex-[1_0_100%] sm:order-none sm:flex-1">
                  <p className="truncate font-display text-heading tracking-tight text-txt-primary">
                    {s.market.event.homeTeam.shortName || s.market.event.homeTeam.name} vs{' '}
                    {s.market.event.awayTeam.shortName || s.market.event.awayTeam.name}
                  </p>
                  <p className="mt-1 text-body-sm text-txt-secondary">
                    {s.market.name}
                    <span className="mx-2 text-warm-stone">·</span>
                    <span className="break-words">{s.market.event.league.name}</span>
                    <span className="mx-2 text-warm-stone">·</span>
                    {formatKickoff(s.market.event.kickoffAt)}
                  </p>
                </div>

                {/* Probability Badge */}
                <ProbabilityBadge
                  probability={s.market.probability}
                  isValueBet={s.market.isValueBet}
                />

                {/* Remove Button — always visible on mobile, hover-revealed on desktop */}
                <button
                  onClick={() => remove(s.market.id)}
                  className="ml-auto flex-shrink-0 rounded-md p-2 text-txt-tertiary transition-all duration-200 hover:bg-danger/10 hover:text-danger sm:ml-0 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Remove selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-warm-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-center justify-center rounded-oracle-lg border-2 border-dashed border-warm-stone py-12 text-center sm:py-16">
            <Sparkles className="mb-6 h-12 w-12 text-warm-taupe" />
            <h3 className="mb-3 font-display text-xl tracking-tight text-txt-primary sm:text-display-sm">
              Your builder is empty
            </h3>
            <p className="mb-8 max-w-md px-4 text-body-sm text-txt-secondary sm:text-body">
              Browse today&apos;s fixtures and OraQL_ Picks, then add selections to build your multi-match strategy.
            </p>
            <Link href="/dashboard">
              <Button variant="primary">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
