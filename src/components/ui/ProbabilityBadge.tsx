import { cn, formatProbability, getProbabilityTier } from '@/lib/utils';

interface ProbabilityBadgeProps {
  probability: number;
  isValueBet?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProbabilityBadge({
  probability,
  isValueBet,
  size = 'md',
  className,
}: ProbabilityBadgeProps) {
  const tier = getProbabilityTier(probability);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-mono font-semibold',
        {
          'px-2 py-0.5 text-caption': size === 'sm',
          'px-3 py-1 text-body-sm': size === 'md',
          'px-4 py-1.5 text-body': size === 'lg',
        },
        isValueBet
          ? 'prob-value'
          : {
              'prob-high': tier === 'high',
              'prob-mid': tier === 'mid',
              'prob-low': tier === 'low',
            },
        className,
      )}
    >
      {formatProbability(probability)}
      {isValueBet && <span className="text-[10px]">VALUE</span>}
    </span>
  );
}
