'use client';

import { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  TrendingUp,
  Trophy,
  Target,
  ChevronRight,
  Plus,
  Sparkles,
  Shield,
} from 'lucide-react';
import { cn, formatProbability, getProbabilityTier } from '@/lib/utils';
import { useBuilderStore } from '@/stores/builder.store';
import { api } from '@/lib/api';
import type { ScoredStreak, SuggestedTicket, StreakStats, League } from '@/types';

export default function StreaksPage() {
  const [streaks, setStreaks] = useState<ScoredStreak[]>([]);
  const [tickets, setTickets] = useState<SuggestedTicket[]>([]);
  const [stats, setStats] = useState<StreakStats | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingTicketId, setApplyingTicketId] = useState<string | null>(null);
  const [appliedTicketId, setAppliedTicketId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [streaksRes, ticketsRes, statsRes, leaguesRes] = await Promise.all([
        api.get<{ streaks: ScoredStreak[]; total: number }>('/streaks?limit=30'),
        api.get<{ tickets: SuggestedTicket[]; total: number }>('/streaks/tickets?limit=6'),
        api.get<StreakStats>('/streaks/stats'),
        api.get<{ leagues: League[]; total: number }>('/streaks/leagues'),
      ]);
      setStreaks(streaksRes.streaks || []);
      setTickets(ticketsRes.tickets || []);
      setStats(statsRes);
      setLeagues(leaguesRes.leagues || []);
    } catch {
      // Show empty state
    }
    setIsLoading(false);
  }

  // Client-side filter — instant, no API calls
  const filteredStreaks = selectedLeague
    ? streaks.filter((s) => s.leagueName === selectedLeague || s.team?.league?.name === selectedLeague)
    : streaks;

  // Count streaks per league (from already-loaded data)
  const streakCountByLeague = new Map<string, number>();
  for (const s of streaks) {
    const ln = s.leagueName || s.team?.league?.name;
    if (ln) streakCountByLeague.set(ln, (streakCountByLeague.get(ln) || 0) + 1);
  }

  async function applyTicket(ticket: SuggestedTicket) {
    if (applyingTicketId) return;
    setApplyingTicketId(ticket.id);
    try {
      const legsWithMarkets = ticket.legs.filter((l) => l.marketId);
      if (legsWithMarkets.length > 0) {
        await api.post('/builder/apply-suggestion', {
          legs: legsWithMarkets.map((l) => ({ marketId: l.marketId })),
        });
        // Reload builder store
        await useBuilderStore.getState().load();
      }
      setAppliedTicketId(ticket.id);
      setTimeout(() => setAppliedTicketId(null), 2500);
    } catch {
      // silently fail
    }
    setApplyingTicketId(null);
  }

  return (
    <div className="space-y-0">
      {/* ─── Hero: Streak Engine Stats ─── */}
      <section className="relative overflow-hidden bg-dark-ink px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-12 -top-20 hidden font-display text-[300px] leading-none text-white/[0.04] sm:block">
          S
        </div>

        <div className="relative z-10">
          {/* Title */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-oracle-md bg-oracle-gold/20 sm:h-12 sm:w-12">
              <Flame className="h-5 w-5 text-oracle-gold sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl tracking-tight text-txt-inverse sm:text-display-md">
                Streak Engine
              </h1>
              <p className="mt-1 text-body-sm text-txt-inverse-2">
                Repeating market patterns detected across thousands of matches
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-oracle-md bg-dark-graphite" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <StatCard
                icon={Target}
                label="Active Streaks"
                value={stats.activeStreaks.toLocaleString()}
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Hit Rate"
                value={stats.averageHitRate ? `${(stats.averageHitRate * 100).toFixed(0)}%` : '—'}
              />
              <StatCard
                icon={Flame}
                label="Avg Streak Length"
                value={stats.averageStreakLength ? stats.averageStreakLength.toFixed(1) : '—'}
              />
              <StatCard
                icon={Shield}
                label="Avg Confidence"
                value={stats.averageConfidence ? `${(stats.averageConfidence * 100).toFixed(0)}%` : '—'}
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* ─── Suggested Tickets ─── */}
      <section className="bg-warm-cream px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-oracle-gold" />
          <h2 className="font-display text-xl tracking-tight text-txt-primary sm:text-display-sm">
            Suggested Tickets
          </h2>
          {/* <span className="rounded-full bg-warm-sand px-3 py-1 text-caption font-semibold text-txt-secondary">
            AI-generated
          </span> */}
        </div>
        <p className="mb-6 max-w-2xl text-body-sm text-txt-secondary">
          Multi-leg tickets assembled from the strongest active streaks across all upcoming matches and leagues.
        </p>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-oracle-lg bg-warm-sand/50" />
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onApply={() => applyTicket(ticket)}
                isApplying={applyingTicketId === ticket.id}
                isApplied={appliedTicketId === ticket.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-oracle-lg border-2 border-dashed border-warm-stone bg-warm-white py-12 text-center">
            <Zap className="mx-auto mb-4 h-10 w-10 text-warm-taupe" />
            <p className="text-body text-txt-tertiary">
              No suggested tickets available. Check back when there are more upcoming events.
            </p>
          </div>
        )}
      </section>

      {/* ─── Top Active Streaks ─── */}
      <section className="bg-warm-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Header row: title + count */}
        <div className="mb-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-oracle-gold" />
          <h2 className="font-display text-xl tracking-tight text-txt-primary sm:text-display-sm">
            Top Active Streaks
          </h2>
          <span className="rounded-full bg-warm-cream px-3 py-1 text-caption font-semibold text-txt-secondary">
            {selectedLeague ? `${filteredStreaks.length} in league` : `${streaks.length} tracked`}
          </span>
        </div>

        {/* League filter bar */}
        {!isLoading && leagues.length > 0 && (
          <div className="mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* "All" pill */}
              <button
                onClick={() => setSelectedLeague(null)}
                className={cn(
                  'flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-caption font-semibold transition-all duration-150',
                  !selectedLeague
                    ? 'border-oracle-gold bg-oracle-gold/15 text-oracle-gold-dark'
                    : 'border-warm-sand bg-white text-txt-secondary hover:border-warm-stone hover:bg-warm-cream',
                )}
              >
                All
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  !selectedLeague ? 'bg-oracle-gold/20 text-oracle-gold-dark' : 'bg-warm-cream text-txt-tertiary',
                )}>
                  {streaks.length}
                </span>
              </button>

              {leagues.map((league) => {
                const count = streakCountByLeague.get(league.name) || 0;
                const isActive = selectedLeague === league.name;
                return (
                  <button
                    key={league.id}
                    onClick={() => setSelectedLeague(isActive ? null : league.name)}
                    className={cn(
                      'flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-caption font-semibold transition-all duration-150',
                      isActive
                        ? 'border-oracle-gold bg-oracle-gold/15 text-oracle-gold-dark'
                        : count > 0
                          ? 'border-warm-sand bg-white text-txt-secondary hover:border-warm-stone hover:bg-warm-cream'
                          : 'border-warm-sand/60 bg-warm-cream/40 text-txt-tertiary hover:border-warm-stone hover:bg-warm-cream',
                    )}
                  >
                    {league.logoUrl && (
                      <img src={league.logoUrl} alt="" className="h-4 w-4 object-contain" />
                    )}
                    <span className="max-w-[120px] truncate">{league.name}</span>
                    <span className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                      isActive ? 'bg-oracle-gold/20 text-oracle-gold-dark' :
                      count > 0 ? 'bg-warm-cream text-txt-tertiary' : 'bg-warm-sand/40 text-txt-tertiary',
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Streak list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-oracle-md bg-warm-cream" />
            ))}
          </div>
        ) : filteredStreaks.length > 0 ? (
          <div className="space-y-2">
            {filteredStreaks.map((streak, idx) => (
              <StreakRow key={streak.id} streak={streak} rank={idx + 1} />
            ))}
          </div>
        ) : selectedLeague ? (
          <div className="rounded-oracle-lg border-2 border-dashed border-warm-stone bg-warm-cream/30 py-12 text-center">
            <Target className="mx-auto mb-4 h-10 w-10 text-warm-taupe" />
            <p className="text-body font-medium text-txt-secondary">
              No active streaks for {selectedLeague}
            </p>
            <p className="mt-2 text-body-sm text-txt-tertiary">
              The streak engine hasn&apos;t detected any qualifying patterns for this league yet.
              Check back after more matches are played.
            </p>
          </div>
        ) : (
          <div className="rounded-oracle-lg border-2 border-dashed border-warm-stone py-12 text-center">
            <Flame className="mx-auto mb-4 h-10 w-10 text-warm-taupe" />
            <p className="text-body text-txt-tertiary">
              No active streaks detected yet. The streak engine runs daily at 6 AM.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-oracle-md border border-dark-slate bg-dark-charcoal p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-oracle-gold" />
        <span className="text-caption font-semibold uppercase tracking-widest text-txt-inverse-2">
          {label}
        </span>
      </div>
      <p className="font-mono text-display-sm font-bold text-txt-inverse">{value}</p>
    </div>
  );
}

/* ─── Ticket Card ─── */
function TicketCard({
  ticket,
  onApply,
  isApplying,
  isApplied,
}: {
  ticket: SuggestedTicket;
  onApply: () => void;
  isApplying: boolean;
  isApplied: boolean;
}) {
  return (
    <div className="flex flex-col rounded-oracle-lg border border-warm-sand bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-card">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-oracle-gold/15 px-2.5 py-0.5 text-caption font-bold text-oracle-gold-dark">
              {ticket.legs.length}-LEG
            </span>
            <span className="rounded-full bg-warm-cream px-2 py-0.5 text-caption font-medium text-txt-secondary">
              {new Set(ticket.legs.map((l) => l.leagueName)).size} leagues
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-heading font-bold text-prob-high">
            {formatProbability(ticket.combinedProbability)}
          </p>
          <p className="text-caption text-txt-tertiary">combined</p>
        </div>
      </div>

      {/* Legs */}
      <div className="mb-4 flex-1 space-y-2">
        {ticket.legs.map((leg, i) => (
          <div
            key={`${leg.eventId}-${leg.marketName}-${i}`}
            className="flex items-center gap-3 rounded-oracle-sm bg-warm-cream/60 px-3 py-2"
          >
            {leg.teamLogoUrl ? (
              <img src={leg.teamLogoUrl} alt="" className="h-5 w-5 flex-shrink-0 object-contain" />
            ) : (
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-warm-stone text-[8px] font-bold text-txt-inverse">
                {leg.teamName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-medium text-txt-primary">
                {leg.teamName.length > 15 ? leg.teamName.substring(0, 15) : leg.teamName}
              </p>
              <p className="truncate text-caption text-txt-tertiary">
                {shortMarketLabel(leg.marketName, leg.line)} vs {leg.opponent}
              </p>
            </div>
            <span className={cn(
              'font-mono text-caption font-semibold',
              getProbabilityTier(leg.probability) === 'high' ? 'text-prob-high' :
              getProbabilityTier(leg.probability) === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
            )}>
              {formatProbability(leg.probability)}
            </span>
          </div>
        ))}
      </div>

      {/* Quality indicators */}
      <div className="mb-4 flex items-center gap-3 text-caption text-txt-tertiary">
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {formatProbability(ticket.averageConfidence)} avg conf
        </span>
        <span className="text-warm-stone">·</span>
        <span>Q: {(ticket.qualityScore * 100).toFixed(0)}</span>
      </div>

      {/* Apply button */}
      <button
        onClick={onApply}
        disabled={isApplying || isApplied}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-oracle-md px-4 py-3 text-body-sm font-semibold transition-all duration-200',
          isApplied
            ? 'bg-prob-high/15 text-prob-high'
            : isApplying
              ? 'bg-warm-cream text-txt-tertiary'
              : 'bg-dark-ink text-txt-inverse hover:bg-dark-charcoal',
        )}
      >
        {isApplied ? (
          <>
            <Trophy className="h-4 w-4" />
            Applied to Builder!
          </>
        ) : isApplying ? (
          <>
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-txt-tertiary border-t-transparent" />
            Applying...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Apply to Builder
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Streak Row ─── */
function StreakRow({ streak, rank }: { streak: ScoredStreak; rank: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hitRateTier = getProbabilityTier(streak.hitRate);
  const confTier = getProbabilityTier(streak.confidence);
  const teamName = streak.teamName || streak.team?.name || 'Unknown Team';
  const teamLogo = streak.teamLogoUrl || streak.team?.logoUrl;
  const leagueName = streak.leagueName || streak.team?.league?.name;

  const hitCount = Math.round(streak.hitRate * streak.windowSize);

  return (
    <div className="overflow-hidden rounded-oracle-md border border-warm-sand bg-white transition-all duration-200 hover:border-warm-stone hover:shadow-soft">
      {/* Main row — clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex w-full items-center gap-3 px-4 py-3 text-left sm:gap-4"
      >
        {/* Rank */}
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-warm-cream font-mono text-caption font-bold text-txt-secondary">
          {rank}
        </span>

        {/* Team logo + info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {teamLogo && (
              <img src={teamLogo} alt="" className="h-5 w-5 object-contain" />
            )}
            <p className="truncate font-display text-body font-semibold tracking-tight text-txt-primary">
              {teamName}
            </p>
          </div>
          <p className="mt-0.5 text-caption text-txt-tertiary">
            {leagueName && (
              <>
                <span className="font-medium text-txt-secondary">{leagueName}</span>
                <span className="mx-1.5 text-warm-stone">·</span>
              </>
            )}
            {formatMarketName(streak.marketName)}
            {streak.line != null && ` ${streak.line}`}
            <span className="mx-1.5 text-warm-stone">·</span>
            {streak.venueFilter === 'ALL' ? 'All venues' : streak.venueFilter === 'HOME' ? 'Home' : 'Away'}
            <span className="mx-1.5 text-warm-stone">·</span>
            Last {streak.windowSize} matches
          </p>
        </div>

        {/* Streak length badge */}
        <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-oracle-gold/15 px-2.5 py-1">
          <Flame className="h-3 w-3 text-oracle-gold" />
          <span className="font-mono text-caption font-bold text-oracle-gold-dark">
            {streak.streakLength}
          </span>
        </div>

        {/* Hit rate */}
        <span className={cn(
          'flex-shrink-0 font-mono text-body-sm font-semibold',
          hitRateTier === 'high' ? 'text-prob-high' :
          hitRateTier === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
        )}>
          {(streak.hitRate * 100).toFixed(0)}%
        </span>

        {/* Arrow — rotates when expanded */}
        <ChevronRight className={cn(
          'h-4 w-4 flex-shrink-0 text-txt-tertiary transition-transform duration-200 group-hover:text-txt-primary',
          isExpanded && 'rotate-90',
        )} />
      </button>

      {/* Expanded detail panel */}
      {isExpanded && (
        <div className="border-t border-warm-sand bg-warm-cream/40 px-4 py-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Stat: Hit Rate */}
            <div className="rounded-oracle-sm bg-white p-3">
              <p className="mb-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">Hit Rate</p>
              <p className={cn(
                'font-mono text-heading font-bold',
                hitRateTier === 'high' ? 'text-prob-high' :
                hitRateTier === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
              )}>
                {hitCount}/{streak.windowSize}
              </p>
              <p className="mt-0.5 text-caption text-txt-tertiary">
                {(streak.hitRate * 100).toFixed(1)}% success rate
              </p>
            </div>

            {/* Stat: Confidence */}
            <div className="rounded-oracle-sm bg-white p-3">
              <p className="mb-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">Confidence</p>
              <p className={cn(
                'font-mono text-heading font-bold',
                confTier === 'high' ? 'text-prob-high' :
                confTier === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
              )}>
                {(streak.confidence * 100).toFixed(0)}%
              </p>
              <p className="mt-0.5 text-caption text-txt-tertiary">
                Quality score: {(streak.qualityScore * 100).toFixed(0)}
              </p>
            </div>

            {/* Stat: Streak Info */}
            <div className="rounded-oracle-sm bg-white p-3">
              <p className="mb-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">Streak</p>
              <p className="font-mono text-heading font-bold text-oracle-gold-dark">
                {streak.streakLength} consecutive
              </p>
              <p className="mt-0.5 text-caption text-txt-tertiary">
                Window: {streak.windowSize} matches
              </p>
            </div>
          </div>

          {/* Summary */}
          {streak.summary && (
            <p className="mt-3 rounded-oracle-sm bg-white px-3 py-2 text-body-sm text-txt-secondary">
              {streak.summary}
            </p>
          )}

          {/* League */}
          {leagueName && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-caption font-semibold uppercase tracking-widest text-txt-tertiary">League</span>
              <span className="text-body-sm font-medium text-txt-primary">{leagueName}</span>
            </div>
          )}

          {/* Visual streak indicator */}
          <div className="mt-3">
            <p className="mb-2 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
              Recent Results
            </p>
            <div className="flex gap-1">
              {Array.from({ length: streak.windowSize }).map((_, i) => {
                const isHit = i < streak.streakLength;
                return (
                  <div
                    key={i}
                    className={cn(
                      'h-2 flex-1 rounded-full',
                      isHit ? 'bg-prob-high' : 'bg-warm-stone/30',
                    )}
                    title={isHit ? 'Hit' : 'Miss'}
                  />
                );
              })}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-txt-tertiary">
              <span>Most recent</span>
              <span>Oldest</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ─── */
function formatMarketName(name: string): string {
  const labels: Record<string, string> = {
    GOALS_OVER: 'Goals Over',
    GOALS_UNDER: 'Goals Under',
    TEAM_GOALS_OVER: 'Team Goals Over',
    TEAM_GOALS_UNDER: 'Team Goals Under',
    CORNERS_OVER: 'Corners Over',
    CORNERS_UNDER: 'Corners Under',
    CARDS_OVER: 'Cards Over',
    CARDS_UNDER: 'Cards Under',
    BTTS_YES: 'Both Teams to Score',
    BTTS_NO: 'No BTTS',
    CLEAN_SHEET: 'Clean Sheet',
    MATCH_RESULT_HOME: 'Home Win',
  };
  return labels[name] || name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function shortMarketLabel(marketName: string, line: number | null): string {
  const labels: Record<string, string> = {
    GOALS_OVER: `O${line}G`,
    GOALS_UNDER: `U${line}G`,
    TEAM_GOALS_OVER: `TO${line}G`,
    TEAM_GOALS_UNDER: `TU${line}G`,
    CORNERS_OVER: `O${line}C`,
    CORNERS_UNDER: `U${line}C`,
    CARDS_OVER: `O${line}Cd`,
    CARDS_UNDER: `U${line}Cd`,
    BTTS_YES: 'BTTS',
    BTTS_NO: 'NoBTTS',
    CLEAN_SHEET: 'CS',
    MATCH_RESULT_HOME: 'Win',
  };
  return labels[marketName] || marketName;
}
