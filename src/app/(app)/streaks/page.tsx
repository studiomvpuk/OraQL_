'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  BookOpen,
  Zap,
  TrendingUp,
  Trophy,
  Target,
  ChevronRight,
  Plus,
  Sparkles,
  Shield,
  X,
  Search,
  Info,
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
  const [filteredStreaks, setFilteredStreaks] = useState<ScoredStreak[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [openLetter, setOpenLetter] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [applyingTicketId, setApplyingTicketId] = useState<string | null>(null);
  const [appliedTicketId, setAppliedTicketId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // When league selection changes, fetch from backend
  useEffect(() => {
    if (!isLoading) loadStreaksForLeague(selectedLeague);
  }, [selectedLeague]);

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
      setFilteredStreaks(streaksRes.streaks || []);
      setTickets(ticketsRes.tickets || []);
      setStats(statsRes);
      setLeagues(leaguesRes.leagues || []);
    } catch {
      // Show empty state
    }
    setIsLoading(false);
  }

  async function loadStreaksForLeague(league: string | null) {
    setIsFilterLoading(true);
    try {
      const query = league
        ? `/streaks?limit=30&league=${encodeURIComponent(league)}`
        : '/streaks?limit=30';
      const res = await api.get<{ streaks: ScoredStreak[]; total: number }>(query);
      setFilteredStreaks(res.streaks || []);
    } catch {
      setFilteredStreaks([]);
    }
    setIsFilterLoading(false);
  }

  // Real streak counts per league from the backend (not derived from loaded 30)
  const streakCountByLeague = new Map<string, number>();
  for (const l of leagues) {
    if (l.streakCount && l.streakCount > 0) {
      streakCountByLeague.set(l.name, (streakCountByLeague.get(l.name) || 0) + l.streakCount);
    }
  }

  // Group leagues by first letter for the A-Z grid
  const leaguesByLetter = new Map<string, League[]>();
  for (const league of leagues) {
    const letter = league.name.charAt(0).toUpperCase();
    const arr = leaguesByLetter.get(letter) || [];
    arr.push(league);
    leaguesByLetter.set(letter, arr);
  }

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
            <div className="flex-1">
              <h1 className="font-display text-2xl tracking-tight text-txt-inverse sm:text-display-md">
                Streak Engine
              </h1>
              <p className="mt-1 text-body-sm text-txt-inverse-2">
                Repeating market patterns detected across thousands of matches
              </p>
            </div>
            <Link
              href="/streaks/guide"
              className="flex items-center gap-1.5 rounded-oracle-md border border-white/20 bg-white/10 px-3 py-2 text-caption font-semibold text-txt-inverse transition-colors hover:bg-white/20"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Guide</span>
            </Link>
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
                tooltip="Total number of repeating patterns currently detected across all leagues and markets"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Hit Rate"
                value={stats.averageHitRate ? `${(stats.averageHitRate * 100).toFixed(0)}%` : '—'}
                tooltip="How often a streak's predicted outcome actually happened in recent matches. Higher = more reliable pattern"
              />
              <StatCard
                icon={Flame}
                label="Avg Streak Length"
                value={stats.averageStreakLength ? stats.averageStreakLength.toFixed(1) : '—'}
                tooltip="Average number of consecutive matches where the pattern held. Longer streaks suggest stronger trends"
              />
              <StatCard
                icon={Shield}
                label="Avg Confidence"
                value={stats.averageConfidence ? `${(stats.averageConfidence * 100).toFixed(0)}%` : '—'}
                tooltip="Overall engine confidence combining hit rate, streak length, and sample size. Higher = more trustworthy"
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

        {/* League filter: A-Z grid + active filter pill */}
        {!isLoading && leagues.length > 0 && (
          <div className="mb-6">
            {/* Active filter indicator */}
            {selectedLeague && (
              <div className="mb-3 flex items-center gap-2">
                <span className="text-caption font-semibold text-txt-tertiary">Filtered by:</span>
                <button
                  onClick={() => setSelectedLeague(null)}
                  className="flex items-center gap-1.5 rounded-full border border-oracle-gold bg-oracle-gold/15 px-3 py-1 text-caption font-semibold text-oracle-gold-dark transition-colors hover:bg-oracle-gold/25"
                >
                  {selectedLeague}
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* A-Z letter grid */}
            <div className="flex flex-wrap gap-1.5">
              {/* "All" square */}
              <button
                onClick={() => { setSelectedLeague(null); setOpenLetter(null); }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-oracle-sm text-caption font-bold transition-all duration-150',
                  !selectedLeague
                    ? 'bg-oracle-gold/15 text-oracle-gold-dark ring-1 ring-oracle-gold'
                    : 'bg-warm-cream text-txt-secondary hover:bg-warm-sand',
                )}
                title="Show all leagues"
              >
                All
              </button>

              {ALPHABET.map((letter) => {
                const letterLeagues = leaguesByLetter.get(letter) || [];
                const hasLeagues = letterLeagues.length > 0;
                const letterStreakCount = letterLeagues.reduce(
                  (sum, l) => sum + (streakCountByLeague.get(l.name) || 0), 0,
                );
                const hasActiveFilter = selectedLeague && letterLeagues.some((l) => l.name === selectedLeague);

                return (
                  <button
                    key={letter}
                    onClick={() => hasLeagues && setOpenLetter(letter)}
                    disabled={!hasLeagues}
                    className={cn(
                      'relative flex h-9 w-9 items-center justify-center rounded-oracle-sm font-mono text-caption font-bold transition-all duration-150',
                      hasActiveFilter
                        ? 'bg-oracle-gold/15 text-oracle-gold-dark ring-1 ring-oracle-gold'
                        : hasLeagues && letterStreakCount > 0
                          ? 'bg-white text-txt-primary ring-1 ring-warm-sand hover:bg-warm-cream hover:ring-warm-stone'
                          : hasLeagues
                            ? 'bg-warm-cream/60 text-txt-tertiary ring-1 ring-warm-sand/60 hover:bg-warm-cream hover:ring-warm-stone'
                            : 'bg-warm-cream/30 text-txt-tertiary/40 cursor-default',
                    )}
                    title={hasLeagues ? `${letterLeagues.length} league${letterLeagues.length !== 1 ? 's' : ''}` : 'No leagues'}
                  >
                    {letter}
                    {hasLeagues && letterStreakCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-oracle-gold text-[8px] font-bold text-white">
                        {letterStreakCount > 9 ? '9+' : letterStreakCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Letter modal */}
        {openLetter && (() => {
          const letterLeagueList = leaguesByLetter.get(openLetter) || [];
          const searchFiltered = modalSearch
            ? letterLeagueList.filter((l) =>
                l.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
                (l.country && l.country.toLowerCase().includes(modalSearch.toLowerCase()))
              )
            : letterLeagueList;

          return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { setOpenLetter(null); setModalSearch(''); }}>
            <div
              className="w-full max-w-md rounded-oracle-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-warm-sand px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-oracle-sm bg-oracle-gold/15 font-mono text-heading font-bold text-oracle-gold-dark">
                    {openLetter}
                  </span>
                  <div>
                    <h3 className="font-display text-body font-semibold text-txt-primary">
                      Leagues
                    </h3>
                    <p className="text-caption text-txt-tertiary">
                      {letterLeagueList.length} league{letterLeagueList.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setOpenLetter(null); setModalSearch(''); }}
                  className="rounded-oracle-sm p-1.5 text-txt-tertiary transition-colors hover:bg-warm-cream hover:text-txt-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search bar */}
              <div className="border-b border-warm-sand px-4 py-3">
                <div className="flex items-center gap-2 rounded-oracle-md bg-warm-cream px-3 py-2">
                  <Search className="h-4 w-4 flex-shrink-0 text-txt-tertiary" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search leagues..."
                    className="w-full bg-transparent text-body-sm text-txt-primary placeholder:text-txt-tertiary outline-none"
                    autoFocus
                  />
                  {modalSearch && (
                    <button onClick={() => setModalSearch('')} className="text-txt-tertiary hover:text-txt-primary">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* League list */}
              <div className="max-h-72 overflow-y-auto p-2">
                {searchFiltered.length === 0 ? (
                  <p className="px-3 py-6 text-center text-body-sm text-txt-tertiary">
                    No leagues match &ldquo;{modalSearch}&rdquo;
                  </p>
                ) : searchFiltered.map((league) => {
                  const count = league.streakCount || 0;
                  const isSelected = selectedLeague === league.name;
                  return (
                    <button
                      key={league.id}
                      onClick={() => {
                        setSelectedLeague(isSelected ? null : league.name);
                        setOpenLetter(null);
                        setModalSearch('');
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-oracle-md px-3 py-2.5 text-left transition-all duration-150',
                        isSelected
                          ? 'bg-oracle-gold/10'
                          : 'hover:bg-warm-cream',
                      )}
                    >
                      {league.logoUrl ? (
                        <img src={league.logoUrl} alt="" className="h-6 w-6 flex-shrink-0 object-contain" />
                      ) : (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warm-sand text-[10px] font-bold text-txt-inverse">
                          {league.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          'truncate text-body-sm font-medium',
                          isSelected ? 'text-oracle-gold-dark' : 'text-txt-primary',
                        )}>
                          {league.name}
                        </p>
                        {league.country && (
                          <p className="text-caption text-txt-tertiary">{league.country}</p>
                        )}
                      </div>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-caption font-semibold',
                        count > 0
                          ? 'bg-oracle-gold/15 text-oracle-gold-dark'
                          : 'bg-warm-cream text-txt-tertiary',
                      )}>
                        {count} {count === 1 ? 'streak' : 'streaks'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          );
        })()}

        {/* Streak list */}
        {isLoading || isFilterLoading ? (
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
  tooltip,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div className="rounded-oracle-md border border-dark-slate bg-dark-charcoal p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-oracle-gold" />
        <span className="text-caption font-semibold uppercase tracking-widest text-txt-inverse-2">
          {label}
        </span>
        {tooltip && (
          <Tip text={tooltip}>
            <Info className="h-3 w-3 text-txt-inverse-2/50 transition-colors hover:text-oracle-gold" />
          </Tip>
        )}
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
                <Tip text={marketGuide(leg.marketName, leg.line ?? null)}>
                  <span className="cursor-help border-b border-dotted border-warm-stone/40">{shortMarketLabel(leg.marketName, leg.line)}</span>
                </Tip>
                {' '}vs {leg.opponent}
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
        <Tip text="Quality score — combines confidence, probability, league diversity, and number of legs. Higher = stronger ticket">
          <span className="cursor-help">Q: {(ticket.qualityScore * 100).toFixed(0)}</span>
        </Tip>
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
            <Tip text={marketGuide(streak.marketName, streak.line ?? null)}>
              <span className="cursor-help border-b border-dotted border-warm-stone/50">
                {formatMarketName(streak.marketName)}
                {streak.line != null && ` ${streak.line}`}
              </span>
            </Tip>
            <span className="mx-1.5 text-warm-stone">·</span>
            <Tip text={streak.venueFilter === 'ALL' ? 'Pattern tracked across all home and away matches' : streak.venueFilter === 'HOME' ? 'Pattern only tracked in home matches' : 'Pattern only tracked in away matches'}>
              <span className="cursor-help border-b border-dotted border-warm-stone/50">
                {streak.venueFilter === 'ALL' ? 'All venues' : streak.venueFilter === 'HOME' ? 'Home' : 'Away'}
              </span>
            </Tip>
            <span className="mx-1.5 text-warm-stone">·</span>
            <Tip text={`Analysis window — how many recent matches were checked for this pattern`}>
              <span className="cursor-help border-b border-dotted border-warm-stone/50">Last {streak.windowSize} matches</span>
            </Tip>
          </p>
        </div>

        {/* Streak length badge */}
        <Tip text={`${streak.streakLength} consecutive matches where this pattern hit in a row — the current unbroken run`}>
          <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-oracle-gold/15 px-2.5 py-1">
            <Flame className="h-3 w-3 text-oracle-gold" />
            <span className="font-mono text-caption font-bold text-oracle-gold-dark">
              {streak.streakLength}
            </span>
          </div>
        </Tip>

        {/* Hit rate */}
        <Tip text={`Hit rate: ${hitCount}/${streak.windowSize} matches matched this pattern. Higher % = more consistent trend`}>
          <span className={cn(
            'flex-shrink-0 font-mono text-body-sm font-semibold',
            hitRateTier === 'high' ? 'text-prob-high' :
            hitRateTier === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
          )}>
            {(streak.hitRate * 100).toFixed(0)}%
          </span>
        </Tip>

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
              <p className="mb-1 flex items-center gap-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
                Hit Rate
                <Tip text="How many of the analysed matches matched this pattern. 10/10 = pattern hit in every match checked"><Info className="h-3 w-3 text-warm-stone" /></Tip>
              </p>
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
              <p className="mb-1 flex items-center gap-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
                Confidence
                <Tip text="Engine confidence combining hit rate, streak length, and sample size. Higher = more likely the pattern continues"><Info className="h-3 w-3 text-warm-stone" /></Tip>
              </p>
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
              <p className="mb-1 flex items-center gap-1 text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
                Streak
                <Tip text="Number of consecutive matches in a row where this pattern held without breaking"><Info className="h-3 w-3 text-warm-stone" /></Tip>
              </p>
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

/* ─── Tooltip Component ─── */
function Tip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="group/tip relative inline-flex cursor-help">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-oracle-sm bg-dark-ink px-3 py-2 text-[11px] leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100">
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-dark-ink" />
      </span>
    </span>
  );
}

/** Explains what a market abbreviation means */
function marketGuide(name: string, line: number | null): string {
  const guides: Record<string, string> = {
    GOALS_OVER: `Match must have more than ${line} total goals from both teams combined`,
    GOALS_UNDER: `Match must have fewer than ${line} total goals from both teams combined`,
    TEAM_GOALS_OVER: `This team must score more than ${line} goals in the match`,
    TEAM_GOALS_UNDER: `This team must score fewer than ${line} goals in the match`,
    CORNERS_OVER: `Match must have more than ${line} total corners from both teams`,
    CORNERS_UNDER: `Match must have fewer than ${line} total corners from both teams`,
    CARDS_OVER: `Match must have more than ${line} total cards (yellow + red) from both teams`,
    CARDS_UNDER: `Match must have fewer than ${line} total cards from both teams`,
    BTTS_YES: 'Both teams must score at least one goal each',
    BTTS_NO: 'At least one team does not score — one or both sides finish with zero goals',
    CLEAN_SHEET: 'This team concedes zero goals — the opposition does not score',
    MATCH_RESULT_HOME: 'The home team wins the match',
  };
  return guides[name] || `${formatMarketName(name)} market`;
}
