'use client';

import { useState } from 'react';
import { Layers, X, Trash2, ChevronUp, ArrowRight } from 'lucide-react';
import { cn, formatProbability } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import { useBuilderStore } from '@/stores/builder.store';
import { useRouter } from 'next/navigation';

export function BuilderBar() {
  const { selections, count, combinedProbability, remove, clear } =
    useBuilderStore();
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 animate-slide-up lg:left-64">
      {/* Expanded panel */}
      {expanded && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-dark-slate bg-dark-charcoal p-3 sm:p-4">
          <div className="mx-auto max-w-4xl space-y-2">
            {selections.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-oracle-sm bg-dark-graphite px-3 py-3 sm:px-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-txt-inverse">
                    {s.market.event.homeTeam.shortName || s.market.event.homeTeam.name} vs{' '}
                    {s.market.event.awayTeam.shortName || s.market.event.awayTeam.name}
                  </p>
                  <p className="truncate text-caption text-txt-inverse-2">
                    {formatMarket(s.market.name, s.market.line)}
                  </p>
                </div>
                <ProbabilityBadge probability={s.market.probability} size="sm" />
                <button
                  onClick={() => remove(s.market.id)}
                  className="rounded p-1 text-txt-inverse-2 transition-colors hover:bg-dark-slate hover:text-danger"
                  aria-label="Remove selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-dark-slate bg-dark-ink px-3 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left text-txt-inverse"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-oracle-sm bg-oracle-gold/20">
              <Layers className="h-5 w-5 text-oracle-gold" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-body font-semibold">
                Bet Builder
                <span className="ml-2 rounded-full bg-oracle-gold/20 px-2 py-0.5 text-caption font-bold text-oracle-gold">
                  {count}
                </span>
              </p>
              <p className="truncate text-caption text-txt-inverse-2">
                Combined: {formatProbability(combinedProbability)}
              </p>
            </div>
            <ChevronUp
              className={cn(
                'h-4 w-4 flex-shrink-0 text-txt-inverse-2 transition-transform',
                expanded && 'rotate-180',
              )}
            />
          </button>

          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              className="hidden text-txt-inverse-2 hover:bg-danger/10 hover:text-danger sm:inline-flex"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <button
              onClick={() => clear()}
              className="rounded-md p-2 text-txt-inverse-2 transition-colors hover:bg-danger/10 hover:text-danger sm:hidden"
              aria-label="Clear builder"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Button variant="gold" size="sm" onClick={() => router.push('/builder')}>
              <span className="hidden sm:inline">View Builder</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarket(name: string, line?: number | null): string {
  const labels: Record<string, string> = {
    GOALS_OVER: 'Match Goals Over',
    GOALS_UNDER: 'Match Goals Under',
    TEAM_GOALS_OVER: 'Team Goals Over',
    TEAM_GOALS_UNDER: 'Team Goals Under',
    CORNERS_OVER: 'Corners Over',
    CORNERS_UNDER: 'Corners Under',
    CARDS_OVER: 'Cards Over',
    CARDS_UNDER: 'Cards Under',
    BTTS_YES: 'Both Teams to Score',
    BTTS_NO: 'No BTTS',
    CLEAN_SHEET: 'Clean Sheet',
    MATCH_RESULT_HOME: 'Win',
    MATCH_RESULT_DRAW: 'Draw',
    MATCH_RESULT_AWAY: 'Lose',
    DOUBLE_CHANCE_WIN_OR_DRAW: 'Win or Draw',
    DOUBLE_CHANCE_NO_DRAW: 'No Draw',
    WIN_TO_NIL: 'Win to Nil',
    TEAM_TO_SCORE_YES: 'Team to Score',
    TEAM_TO_SCORE_NO: 'Team Not to Score',
    TOTAL_GOALS_ODD: 'Total Goals Odd',
    TOTAL_GOALS_EVEN: 'Total Goals Even',
    EXACT_GOALS: 'Exact Goals',
    SHOTS_OVER: 'Shots Over',
    SHOTS_UNDER: 'Shots Under',
    SHOTS_ON_TARGET_OVER: 'Shots on Target Over',
    SHOTS_ON_TARGET_UNDER: 'Shots on Target Under',
    FOULS_OVER: 'Fouls Over',
    FOULS_UNDER: 'Fouls Under',
    OFFSIDES_OVER: 'Offsides Over',
    OFFSIDES_UNDER: 'Offsides Under',
  };
  const label = labels[name] || name.replace(/_/g, ' ');
  return line != null ? `${label} ${line}` : label;
}
