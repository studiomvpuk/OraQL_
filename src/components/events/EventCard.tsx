'use client';

import Link from 'next/link';
import { Star, Clock } from 'lucide-react';
import { cn, formatKickoff } from '@/lib/utils';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const isLive = event.status === 'LIVE' || event.status === 'HALF_TIME';
  const isFinished = event.status === 'FINISHED';
  const topPick = event.picks?.[0];

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'group relative block rounded-oracle-md border bg-white p-4 pl-6 transition-all duration-normal',
        'hover:shadow-card hover:-translate-y-0.5',
        'before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:rounded-full before:bg-transparent before:transition-all before:duration-normal',
        'hover:before:bg-oracle-gold',
        isLive
          ? 'border-live/30 bg-live/[0.02]'
          : 'border-warm-sand hover:border-warm-stone',
        className,
      )}
    >
      {/* League header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-caption font-medium text-txt-tertiary">
          {event.league.name}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 text-caption font-semibold text-live">
              <span className="live-dot" />
              LIVE
            </span>
          )}
          <span className={cn(
            'flex items-center gap-1 text-caption',
            isFinished ? 'text-txt-tertiary' : 'text-txt-secondary',
          )}>
            <Clock className="h-3 w-3" />
            {formatKickoff(event.kickoffAt)}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              'truncate font-display text-heading tracking-tight',
              isFinished && 'text-txt-tertiary',
            )}>
              {event.homeTeam.shortName || event.homeTeam.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'truncate font-display text-heading tracking-tight',
              isFinished && 'text-txt-tertiary',
            )}>
              {event.awayTeam.shortName || event.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Score (if live/finished) */}
        {(isLive || isFinished) && (
          <div className="flex flex-shrink-0 flex-col items-center gap-1 px-2 sm:px-4">
            <span className="font-mono text-display-sm font-bold">
              {event.homeScore ?? '-'}
            </span>
            <span className="font-mono text-display-sm font-bold">
              {event.awayScore ?? '-'}
            </span>
          </div>
        )}

        {/* OraQL_ Pick badge */}
        {topPick && !isFinished && (
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-oracle-gold">
              <Star className="h-3.5 w-3.5 fill-oracle-gold" />
              <span className="hidden text-caption font-semibold sm:inline">Top Pick</span>
            </div>
            {topPick.market && (
              <span className="hidden max-w-[10rem] truncate text-body-sm text-txt-secondary sm:inline">
                {topPick.market.shortName || topPick.market.name}
              </span>
            )}
            <ProbabilityBadge probability={topPick.probability} size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
}
