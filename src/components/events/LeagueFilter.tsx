'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface League {
  id: string;
  name: string;
  eventCount: number;
}

interface LeagueFilterProps {
  leagues: League[];
  selectedLeagues: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function LeagueFilter({
  leagues,
  selectedLeagues,
  onSelectionChange,
}: LeagueFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allSelected = selectedLeagues.length === 0; // empty = all leagues

  function toggleLeague(leagueId: string) {
    if (selectedLeagues.includes(leagueId)) {
      const next = selectedLeagues.filter((id) => id !== leagueId);
      onSelectionChange(next);
    } else {
      onSelectionChange([...selectedLeagues, leagueId]);
    }
  }

  function selectAll() {
    onSelectionChange([]);
  }

  const label = allSelected
    ? 'All Leagues'
    : selectedLeagues.length === 1
      ? leagues.find((l) => l.id === selectedLeagues[0])?.name || '1 league'
      : `${selectedLeagues.length} leagues`;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-oracle-md border px-3 py-2 text-body-sm font-medium transition-all',
          isOpen
            ? 'border-oracle-gold bg-oracle-gold/10 text-oracle-gold-dark'
            : 'border-warm-sand bg-warm-white text-txt-secondary hover:border-warm-stone hover:text-txt-primary',
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-oracle-lg border border-warm-sand bg-warm-white shadow-elevated">
          {/* "All Leagues" option */}
          <button
            onClick={selectAll}
            className={cn(
              'flex w-full items-center justify-between px-4 py-3 text-body-sm border-b border-warm-cream transition-colors',
              allSelected
                ? 'font-semibold text-oracle-gold-dark bg-oracle-gold/5'
                : 'text-txt-secondary hover:bg-warm-cream/50',
            )}
          >
            <span>All Leagues</span>
            {allSelected && <Check className="h-4 w-4 text-oracle-gold" />}
          </button>

          {/* League list */}
          <div className="max-h-60 overflow-y-auto py-1">
            {leagues.map((league) => {
              const isSelected = selectedLeagues.includes(league.id);
              return (
                <button
                  key={league.id}
                  onClick={() => toggleLeague(league.id)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-2.5 text-body-sm transition-colors',
                    isSelected
                      ? 'bg-oracle-gold/5 text-txt-primary font-medium'
                      : 'text-txt-secondary hover:bg-warm-cream/50 hover:text-txt-primary',
                  )}
                >
                  <span className="truncate">{league.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-caption text-txt-tertiary">
                      ({league.eventCount})
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-oracle-gold" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Clear selection */}
          {!allSelected && (
            <button
              onClick={selectAll}
              className="flex w-full items-center justify-center gap-1.5 border-t border-warm-cream px-4 py-2.5 text-caption text-txt-tertiary hover:text-txt-secondary transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear filter</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
