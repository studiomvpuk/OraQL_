'use client';

import { cn, formatProbability, getProbabilityTier } from '@/lib/utils';
import type { Market } from '@/types';

interface MarketChipProps {
  market: Market;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'light' | 'dark';
  className?: string;
}

export function MarketChip({
  market,
  isSelected,
  onClick,
  variant = 'light',
  className,
}: MarketChipProps) {
  const tier = getProbabilityTier(market.probability);
  const isDark = variant === 'dark';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-oracle-sm border px-4 py-3 text-left transition-all duration-normal',
        isDark
          ? [
              'border-dark-slate',
              isSelected
                ? 'bg-oracle-gold/15 border-oracle-gold/40'
                : 'bg-dark-graphite hover:bg-dark-slate',
            ]
          : [
              'border-warm-sand',
              isSelected
                ? 'bg-oracle-gold/10 border-oracle-gold/30 shadow-soft'
                : 'bg-white hover:bg-warm-cream hover:border-warm-stone',
            ],
        className,
      )}
    >
      {/* Probability bar */}
      <div className="relative h-8 w-1 overflow-hidden rounded-full bg-warm-sand">
        <div
          className={cn('absolute bottom-0 w-full rounded-full transition-all', {
            'bg-prob-high': tier === 'high',
            'bg-prob-mid': tier === 'mid',
            'bg-dark-ash': tier === 'low',
          })}
          style={{ height: `${market.probability * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'truncate text-body-sm font-medium',
          isDark ? 'text-txt-inverse' : 'text-txt-primary',
        )}>
          {market.shortName || market.name}
        </p>
        {market.line && (
          <p className={cn('text-caption', isDark ? 'text-txt-inverse-2' : 'text-txt-tertiary')}>
            Line: {market.line}
          </p>
        )}
      </div>

      {/* Probability */}
      <span className={cn(
        'font-mono text-body-sm font-semibold',
        {
          'text-prob-high': tier === 'high',
          'text-prob-mid': tier === 'mid',
          'text-txt-tertiary': tier === 'low',
        },
      )}>
        {formatProbability(market.probability)}
      </span>

      {/* Value bet indicator */}
      {market.isValueBet && (
        <span className="rounded-full bg-value/15 px-2 py-0.5 text-[10px] font-bold text-value">
          VALUE
        </span>
      )}
    </button>
  );
}
