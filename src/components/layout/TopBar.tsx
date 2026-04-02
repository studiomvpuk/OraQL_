'use client';

import { Sport } from '@/types';
import { cn, getSportLabel } from '@/lib/utils';

const sports: { value: Sport; emoji: string }[] = [
  { value: 'FOOTBALL', emoji: '⚽' },
  { value: 'BASKETBALL', emoji: '🏀' },
  { value: 'TENNIS', emoji: '🎾' },
];

interface TopBarProps {
  activeSport: Sport;
  onSportChange: (sport: Sport) => void;
  sportCounts?: Record<string, number>;
}

export function TopBar({ activeSport, onSportChange, sportCounts }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-warm-sand bg-warm-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Sport Toggle */}
        <div className="flex items-center gap-1 rounded-full bg-warm-cream p-1">
          {sports.map((sport) => {
            const isActive = activeSport === sport.value;
            const count = sportCounts?.[sport.value];

            return (
              <button
                key={sport.value}
                onClick={() => onSportChange(sport.value)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-body-sm font-medium transition-all duration-normal',
                  isActive
                    ? 'bg-warm-white text-txt-primary shadow-soft'
                    : 'text-txt-secondary hover:text-txt-primary',
                )}
              >
                <span>{sport.emoji}</span>
                <span>{getSportLabel(sport.value)}</span>
                {count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-caption font-semibold',
                      isActive
                        ? 'bg-oracle-gold/15 text-oracle-gold-dark'
                        : 'bg-warm-sand text-txt-secondary',
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: date, search, etc. */}
        <div className="flex items-center gap-4">
          <span className="text-body-sm text-txt-tertiary">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
