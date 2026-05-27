'use client';

import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StalenessIndicatorProps {
  lastUpdatedAt: string | Date | null;
  className?: string;
}

function getTimeSince(date: Date): { label: string; isStale: boolean; isWarning: boolean } {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 5) {
    return { label: 'Just updated', isStale: false, isWarning: false };
  }
  if (diffMins < 30) {
    return { label: `${diffMins}m ago`, isStale: false, isWarning: false };
  }
  if (diffMins < 60) {
    return { label: `${diffMins}m ago`, isStale: false, isWarning: true };
  }
  if (diffHours < 24) {
    return { label: `${diffHours}h ago`, isStale: true, isWarning: true };
  }
  return { label: `${Math.floor(diffHours / 24)}d ago`, isStale: true, isWarning: true };
}

export function StalenessIndicator({ lastUpdatedAt, className }: StalenessIndicatorProps) {
  if (!lastUpdatedAt) {
    return (
      <div className={cn('flex items-center gap-1.5 text-caption text-amber-600', className)}>
        <AlertTriangle className="h-3 w-3" />
        <span>No data timestamp</span>
      </div>
    );
  }

  const date = lastUpdatedAt instanceof Date ? lastUpdatedAt : new Date(lastUpdatedAt);
  const { label, isStale, isWarning } = getTimeSince(date);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-caption',
        isStale
          ? 'text-red-500'
          : isWarning
            ? 'text-amber-600'
            : 'text-txt-tertiary',
        className,
      )}
    >
      {isStale ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      <span>{label}</span>
      {isStale && (
        <span className="text-[10px] italic">(may be outdated)</span>
      )}
    </div>
  );
}
