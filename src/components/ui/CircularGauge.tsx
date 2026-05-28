'use client';

import { cn, formatProbability, getProbabilityTier } from '@/lib/utils';

interface CircularGaugeProps {
  probability: number;
  confidence?: number;
  isValueBet?: boolean;
  size?: number;
  className?: string;
}

export function CircularGauge({
  probability,
  confidence,
  isValueBet,
  size = 140,
  className,
}: CircularGaugeProps) {
  const tier = getProbabilityTier(probability);
  const pct = Math.min(Math.max(probability * 100, 0), 100);

  // SVG circle math
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const strokeColor = isValueBet
    ? '#C8A44E'  // oracle-gold
    : tier === 'high'
      ? '#2ECC71' // prob-high
      : tier === 'mid'
        ? '#F0AD4E' // prob-mid
        : '#8A8A94'; // prob-low

  const bgStroke = '#F0ECE4'; // warm-cream

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgStroke}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'font-mono text-2xl font-bold',
            isValueBet
              ? 'text-oracle-gold-dark'
              : tier === 'high'
                ? 'text-prob-high'
                : tier === 'mid'
                  ? 'text-prob-mid'
                  : 'text-txt-tertiary',
          )}
        >
          {formatProbability(probability)}
        </span>
        {isValueBet && (
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-value">
            Value
          </span>
        )}
      </div>
      {/* Confidence indicator below gauge */}
      {confidence !== undefined && (
        <p className={cn(
          'mt-2 text-caption',
          confidence < 0.5 ? 'text-amber-600' : 'text-txt-tertiary',
        )}>
          {confidence < 0.5 ? 'Low confidence' : confidence >= 0.75 ? 'High confidence' : 'Medium confidence'}
        </p>
      )}
    </div>
  );
}
