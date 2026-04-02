'use client';

import { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Plus, Sparkles } from 'lucide-react';
import { cn, formatProbability, formatCategory } from '@/lib/utils';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import { Button } from '@/components/ui/Button';
import { useBuilderStore } from '@/stores/builder.store';
import type { Pick } from '@/types';

interface PickCardProps {
  pick: Pick;
  variant?: 'light' | 'dark';
  showEvent?: boolean;
  className?: string;
}

export function PickCard({
  pick,
  variant = 'light',
  showEvent = false,
  className,
}: PickCardProps) {
  const [expanded, setExpanded] = useState(false);
  const addToBuilder = useBuilderStore((s) => s.add);
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'rounded-oracle-md border p-5 transition-all duration-normal',
        isDark
          ? 'border-dark-slate bg-dark-charcoal text-txt-inverse'
          : 'border-warm-sand bg-white',
        pick.rank === 1 && !isDark && 'border-oracle-gold/30 shadow-glow',
        pick.rank === 1 && isDark && 'border-oracle-gold/40 shadow-glow',
        className,
      )}
      style={
        pick.rank === 1 && !isDark
          ? { background: 'linear-gradient(135deg, var(--color-warm-white, #FAF8F5) 0%, rgba(200,164,78,0.06) 100%)' }
          : undefined
      }
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {pick.rank === 1 && (
            <Star className="h-5 w-5 fill-oracle-gold text-oracle-gold" />
          )}
          <div>
            <p className={cn(
              'font-display text-heading tracking-tight',
              isDark ? 'text-txt-inverse' : 'text-txt-primary',
            )}>
              {pick.market.name}
            </p>
            <p className={cn(
              'text-caption',
              isDark ? 'text-txt-inverse-2' : 'text-txt-tertiary',
            )}>
              {formatCategory(pick.market.category)}
              {pick.market.isValueBet && (
                <span className="ml-2 inline-flex items-center gap-1 text-value">
                  <Sparkles className="h-3 w-3" /> Value Bet
                </span>
              )}
            </p>
          </div>
        </div>

        <ProbabilityBadge
          probability={pick.probability}
          isValueBet={pick.market.isValueBet}
          size="lg"
        />
      </div>

      {/* Event info (when showing across events) */}
      {showEvent && pick.event && (
        <div className={cn(
          'mb-3 rounded-oracle-sm px-3 py-2 text-body-sm',
          isDark ? 'bg-dark-graphite' : 'bg-warm-cream',
        )}>
          {pick.event.homeTeam.shortName || pick.event.homeTeam.name} vs{' '}
          {pick.event.awayTeam.shortName || pick.event.awayTeam.name}
          <span className={cn('ml-2', isDark ? 'text-txt-inverse-2' : 'text-txt-tertiary')}>
            {pick.event.league.name}
          </span>
        </div>
      )}

      {/* Explanation toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex w-full items-center gap-1 text-body-sm font-medium transition-colors',
          isDark
            ? 'text-txt-inverse-2 hover:text-txt-inverse'
            : 'text-txt-secondary hover:text-txt-primary',
        )}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" /> Hide reasoning
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" /> Why this pick?
          </>
        )}
      </button>

      {/* Explanation */}
      {expanded && pick.explanation && (
        <div className={cn(
          'mt-3 rounded-oracle-sm p-4 text-body-sm leading-relaxed animate-slide-up',
          isDark ? 'bg-dark-graphite text-txt-inverse-2' : 'bg-warm-cream text-txt-secondary',
        )}>
          {pick.explanation}
        </div>
      )}

      {/* Add to Builder */}
      <div className="mt-4 flex justify-end">
        <Button
          variant={isDark ? 'gold' : 'primary'}
          size="sm"
          onClick={() => addToBuilder(pick.market.id)}
        >
          <Plus className="h-4 w-4" />
          Add to Builder
        </Button>
      </div>
    </div>
  );
}
