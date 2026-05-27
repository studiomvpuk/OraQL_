'use client';

import { cn, formatProbability, getProbabilityTier } from '@/lib/utils';

interface ProbabilityGaugeProps {
  probability: number;
  confidence?: number;
  isValueBet?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProbabilityGauge({
  probability,
  confidence,
  isValueBet,
  size = 'md',
  showLabel = true,
  className,
}: ProbabilityGaugeProps) {
  const tier = getProbabilityTier(probability);
  const pct = Math.min(Math.max(probability * 100, 0), 100);

  const barHeight = size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-3.5';

  const barColor = isValueBet
    ? 'bg-oracle-gold'
    : tier === 'high'
      ? 'bg-emerald-500'
      : tier === 'mid'
        ? 'bg-amber-500'
        : 'bg-warm-stone';

  const showConfidenceWarning = confidence !== undefined && confidence < 0.5;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Top row: percentage and optional value bet label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'font-mono font-semibold',
              size === 'sm' ? 'text-caption' : size === 'md' ? 'text-body-sm' : 'text-body',
              isValueBet
                ? 'text-oracle-gold-dark'
                : tier === 'high'
                  ? 'text-emerald-600'
                  : tier === 'mid'
                    ? 'text-amber-600'
                    : 'text-warm-stone',
            )}
          >
            {formatProbability(probability)}
          </span>
          {isValueBet && (
            <span className="inline-flex items-center rounded-full bg-oracle-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-oracle-gold-dark">
              Value
            </span>
          )}
        </div>
      )}

      {/* Gauge bar */}
      <div className={cn('w-full rounded-full bg-warm-cream overflow-hidden', barHeight)}>
        <div
          className={cn('rounded-full transition-all duration-500 ease-out', barHeight, barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Confidence warning */}
      {showConfidenceWarning && (
        <span className="text-[10px] text-amber-600 italic">
          Low confidence — limited data
        </span>
      )}
    </div>
  );
}
