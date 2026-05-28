'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Users,
  BarChart3,
  TrendingUp,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatKickoff, formatCategory, formatProbability, getProbabilityTier } from '@/lib/utils';
import { PickCard } from '@/components/picks/PickCard';
import { MarketChip } from '@/components/markets/MarketChip';
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useBuilderStore } from '@/stores/builder.store';
import type { EventDetail, Market, MarketCategory, BookmakerOdds, Lineup, MatchStat } from '@/types';

type TabId = 'markets' | 'odds' | 'lineups' | 'stats';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('markets');
  const [activeCategory, setActiveCategory] = useState<MarketCategory | 'ALL'>('ALL');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToBuilder = useBuilderStore((s) => s.add);

  useEffect(() => {
    if (eventId) loadEvent();
  }, [eventId]);

  async function loadEvent() {
    setIsLoading(true);
    try {
      const data = await api.get<EventDetail>(`/events/${eventId}`);
      setEvent(data);
    } catch {
      // handle error
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-48 animate-pulse rounded-oracle-lg bg-warm-cream" />
        <div className="h-96 animate-pulse rounded-oracle-lg bg-warm-cream" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-96 items-center justify-center px-4 text-center">
        <p className="text-txt-tertiary">Event not found.</p>
      </div>
    );
  }

  const isLive = event.status === 'LIVE' || event.status === 'HALF_TIME';
  const isFinished = event.status === 'FINISHED';

  // Group markets by category
  const categories = Array.from(new Set(event.markets.map((m) => m.category)));
  const filteredMarkets =
    activeCategory === 'ALL'
      ? event.markets
      : event.markets.filter((m) => m.category === activeCategory);

  // Group bookmaker odds by market
  const oddsByMarket = (event.bookmakerOdds || []).reduce<Record<string, BookmakerOdds[]>>(
    (acc, odd) => {
      const key = odd.line ? `${odd.marketName} (${odd.line})` : odd.marketName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(odd);
      return acc;
    },
    {},
  );

  // Tabs config
  const tabs: { id: TabId; label: string; icon: typeof BarChart3; count?: number }[] = [
    { id: 'markets', label: 'Markets', icon: TrendingUp, count: event.markets.length },
    { id: 'odds', label: 'Odds', icon: BarChart3, count: event.bookmakerOdds?.length || 0 },
    { id: 'lineups', label: 'Lineups', icon: Users, count: event.lineups?.length || 0 },
    { id: 'stats', label: 'Stats', icon: Shield, count: event.matchStats?.length || 0 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ─── Back Link ─── */}
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-body-sm text-txt-secondary transition-colors hover:text-txt-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* ─── Event Header ─── */}
      <section className="relative overflow-hidden bg-warm-cream px-4 py-6 sm:px-6 sm:py-8">
        <div
          className="pointer-events-none absolute -right-8 -top-20 hidden text-warm-sand opacity-100 sm:block"
          style={{ fontSize: '200px', fontWeight: 'bold', lineHeight: 1 }}
        >
          V
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-txt-secondary">
            <span className="font-semibold">{event.league.name}</span>
            {event.round && event.round !== 'NaN' && (
              <>
                <span className="text-warm-stone">·</span>
                <span>{event.round}</span>
              </>
            )}
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-0.5 text-caption font-semibold text-live">
                <span className="live-dot" /> LIVE
              </span>
            )}
            {isFinished && (
              <span className="rounded-full bg-warm-stone/20 px-2.5 py-0.5 text-caption font-semibold text-txt-tertiary">
                FT
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl tracking-tight text-txt-primary sm:text-3xl lg:text-display-lg">
                {event.homeTeam.name}
              </h1>
              <p className="my-2 text-body text-txt-tertiary sm:my-3">vs</p>
              <h1 className="font-display text-2xl tracking-tight text-txt-primary sm:text-3xl lg:text-display-lg">
                {event.awayTeam.name}
              </h1>
            </div>

            <div className="flex flex-col items-start gap-4 sm:items-end sm:justify-center">
              {isLive || isFinished ? (
                <div className="sm:text-right">
                  <p className="font-mono text-4xl font-bold text-txt-primary sm:text-display-xl">
                    {event.homeScore ?? 0} — {event.awayScore ?? 0}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:text-right">
                  <div className="flex items-center gap-2 text-txt-secondary sm:justify-end">
                    <Clock className="h-4 w-4" />
                    <span className="text-body-sm">{formatKickoff(event.kickoffAt)}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-2 text-txt-tertiary sm:justify-end">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-body-sm">{event.venue}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ─── Left Column: OraQL_ Picks ─── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 fill-oracle-gold text-oracle-gold flex-shrink-0" />
              <h2 className="font-display text-heading tracking-tight text-txt-primary">
                OraQL_ Picks
              </h2>
            </div>

            {event.picks.length > 0 ? (
              <div className="space-y-4">
                {event.picks.map((pick) => (
                  <PickCard key={pick.id} pick={pick} />
                ))}
              </div>
            ) : (
              <div className="rounded-oracle-md border border-dashed border-warm-stone bg-warm-white p-6 text-center">
                <p className="text-body-sm text-txt-tertiary">
                  No strong picks identified for this event.
                </p>
              </div>
            )}
          </div>

          {/* ─── Right Column: Tabbed Content ─── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 rounded-oracle-md bg-warm-cream p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-2 rounded-oracle-sm px-3 py-2.5 text-body-sm font-medium transition-all duration-200',
                      activeTab === tab.id
                        ? 'bg-warm-white text-txt-primary shadow-soft'
                        : 'text-txt-secondary hover:text-txt-primary',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {(tab.count ?? 0) > 0 && (
                      <span className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        activeTab === tab.id
                          ? 'bg-oracle-gold/15 text-oracle-gold-dark'
                          : 'bg-warm-sand text-txt-tertiary',
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Markets Tab ── */}
            {activeTab === 'markets' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory('ALL')}
                    className={cn(
                      'rounded-full px-4 py-2 text-body-sm font-medium transition-all duration-200',
                      activeCategory === 'ALL'
                        ? 'bg-warm-white text-txt-primary shadow-soft'
                        : 'bg-warm-cream text-txt-secondary hover:bg-warm-sand',
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'rounded-full px-4 py-2 text-body-sm font-medium transition-all duration-200',
                        activeCategory === cat
                          ? 'bg-warm-white text-txt-primary shadow-soft'
                          : 'bg-warm-cream text-txt-secondary hover:bg-warm-sand',
                      )}
                    >
                      {formatCategory(cat)}
                    </button>
                  ))}
                </div>

                <div className="rounded-oracle-md bg-warm-white p-4 space-y-2">
                  {filteredMarkets.length > 0 ? (
                    filteredMarkets.map((market) => (
                      <MarketChip
                        key={market.id}
                        market={market}
                        isSelected={selectedMarket?.id === market.id}
                        onClick={() => setSelectedMarket(market)}
                        variant="light"
                      />
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-body-sm text-txt-tertiary">
                        No markets available for this category.
                      </p>
                    </div>
                  )}
                </div>

                {selectedMarket && (
                  <div className="rounded-oracle-md border-2 border-oracle-gold bg-oracle-gold/[0.04] p-6 animate-fade-in space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-heading tracking-tight text-txt-primary">
                          {selectedMarket.name}
                          {selectedMarket.line != null && (
                            <span className="ml-2 text-body text-txt-secondary font-normal">
                              Line: {selectedMarket.line}
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-body-sm text-txt-secondary">
                          {formatCategory(selectedMarket.category)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ProbabilityBadge
                          probability={selectedMarket.probability}
                          isValueBet={selectedMarket.isValueBet}
                          size="lg"
                        />
                      </div>
                    </div>

                    {selectedMarket.explanation && (
                      <p className="text-body-sm text-txt-secondary leading-relaxed">
                        {selectedMarket.explanation}
                      </p>
                    )}

                    <div className="pt-2">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => addToBuilder(selectedMarket.id)}
                        className="w-full"
                      >
                        Add to Bet Builder
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Odds Tab ── */}
            {activeTab === 'odds' && (
              <div className="space-y-4">
                {Object.keys(oddsByMarket).length > 0 ? (
                  Object.entries(oddsByMarket).map(([marketKey, odds]) => (
                    <div key={marketKey} className="rounded-oracle-md bg-warm-white p-4">
                      <h3 className="mb-3 font-display text-body font-semibold tracking-tight text-txt-primary">
                        {marketKey}
                      </h3>
                      <div className="space-y-2">
                        {odds.map((odd) => (
                          <div
                            key={odd.id}
                            className="flex items-center justify-between rounded-oracle-sm bg-warm-cream px-4 py-2.5"
                          >
                            <span className="text-body-sm font-medium text-txt-primary">
                              {odd.bookmaker}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-body-sm font-semibold text-txt-primary">
                                {odd.odds.toFixed(2)}
                              </span>
                              {odd.impliedProbability != null && (
                                <span className={cn(
                                  'font-mono text-caption',
                                  getProbabilityTier(odd.impliedProbability) === 'high'
                                    ? 'text-prob-high'
                                    : getProbabilityTier(odd.impliedProbability) === 'mid'
                                      ? 'text-prob-mid'
                                      : 'text-txt-tertiary',
                                )}>
                                  {formatProbability(odd.impliedProbability)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-oracle-md border border-dashed border-warm-stone bg-warm-white p-8 text-center">
                    <BarChart3 className="mx-auto mb-3 h-8 w-8 text-txt-tertiary" />
                    <p className="text-body-sm text-txt-tertiary">
                      No bookmaker odds available yet for this event.
                    </p>
                    <p className="mt-1 text-caption text-txt-tertiary">
                      Odds are refreshed every 5 minutes for upcoming events.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Lineups Tab ── */}
            {activeTab === 'lineups' && (
              <div className="space-y-6">
                {event.lineups && event.lineups.length > 0 ? (
                  event.lineups.map((lineup) => (
                    <LineupPanel
                      key={lineup.id}
                      lineup={lineup}
                      teamName={
                        lineup.team?.name ||
                        (lineup.teamId === event.homeTeam.id
                          ? event.homeTeam.name
                          : event.awayTeam.name)
                      }
                    />
                  ))
                ) : (
                  <div className="rounded-oracle-md border border-dashed border-warm-stone bg-warm-white p-8 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-txt-tertiary" />
                    <p className="text-body-sm text-txt-tertiary">
                      Lineups not yet confirmed.
                    </p>
                    <p className="mt-1 text-caption text-txt-tertiary">
                      Lineups are typically published 60-90 minutes before kickoff.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Stats Tab ── */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                {event.matchStats && event.matchStats.length > 0 ? (
                  <StatsPanel
                    stats={event.matchStats}
                    homeTeam={event.homeTeam.name}
                    awayTeam={event.awayTeam.name}
                    homeTeamId={event.homeTeam.id}
                  />
                ) : (
                  <div className="rounded-oracle-md border border-dashed border-warm-stone bg-warm-white p-8 text-center">
                    <Shield className="mx-auto mb-3 h-8 w-8 text-txt-tertiary" />
                    <p className="text-body-sm text-txt-tertiary">
                      {isLive || isFinished
                        ? 'Match statistics are being collected.'
                        : 'Statistics will be available once the match begins.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lineup Panel Component ─── */
function LineupPanel({ lineup, teamName }: { lineup: Lineup; teamName: string }) {
  const starters = lineup.entries.filter((e) => e.isStarter);
  const subs = lineup.entries.filter((e) => !e.isStarter);

  return (
    <div className="rounded-oracle-md bg-warm-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-body font-semibold tracking-tight text-txt-primary">
          {teamName}
        </h3>
        <div className="flex items-center gap-3">
          {lineup.formation && (
            <span className="rounded-full bg-warm-cream px-3 py-1 font-mono text-caption font-semibold text-txt-secondary">
              {lineup.formation}
            </span>
          )}
          {lineup.isConfirmed && (
            <span className="rounded-full bg-prob-high/15 px-2.5 py-0.5 text-[10px] font-bold text-prob-high">
              CONFIRMED
            </span>
          )}
        </div>
      </div>

      {starters.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-txt-tertiary">
            Starting XI
          </p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {starters.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-oracle-sm bg-warm-cream px-3 py-2"
              >
                {entry.player.photoUrl ? (
                  <img
                    src={entry.player.photoUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-stone text-[10px] font-bold text-txt-inverse">
                    {(entry.player.number || entry.player.name?.charAt(0) || '?')}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-txt-primary">
                    {entry.player.name}
                  </p>
                </div>
                {entry.position && (
                  <span className="text-caption text-txt-tertiary">{entry.position}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {subs.length > 0 && (
        <div>
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-txt-tertiary">
            Substitutes
          </p>
          <div className="flex flex-wrap gap-2">
            {subs.map((entry) => (
              <span
                key={entry.id}
                className="rounded-oracle-sm bg-warm-cream px-2.5 py-1 text-caption text-txt-secondary"
              >
                {entry.player.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {starters.length === 0 && subs.length === 0 && (
        <p className="text-body-sm text-txt-tertiary">No player data available.</p>
      )}
    </div>
  );
}

/* ─── Stats Panel Component ─── */
function StatsPanel({
  stats,
  homeTeam,
  awayTeam,
  homeTeamId,
}: {
  stats: MatchStat[];
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
}) {
  const homeStat = stats.find((s) => s.team?.id === homeTeamId) || stats[0];
  const awayStat = stats.find((s) => s.team?.id !== homeTeamId) || stats[1];

  if (!homeStat || !awayStat) {
    return <p className="text-body-sm text-txt-tertiary">Incomplete statistics.</p>;
  }

  const statRows: { label: string; home: number | string; away: number | string; showBar?: boolean }[] = [
    { label: 'Goals', home: homeStat.goals, away: awayStat.goals },
    { label: 'Possession', home: `${homeStat.possession ?? 50}%`, away: `${awayStat.possession ?? 50}%`, showBar: true },
    { label: 'Shots on Target', home: homeStat.shotsOnTarget ?? '-', away: awayStat.shotsOnTarget ?? '-' },
    { label: 'Total Shots', home: homeStat.shotsTotal ?? '-', away: awayStat.shotsTotal ?? '-' },
    { label: 'Corners', home: homeStat.corners, away: awayStat.corners },
    { label: 'Yellow Cards', home: homeStat.yellowCards, away: awayStat.yellowCards },
    { label: 'Red Cards', home: homeStat.redCards, away: awayStat.redCards },
  ];

  return (
    <div className="rounded-oracle-md bg-warm-white p-5">
      {/* Team headers */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-display text-body-sm font-semibold text-txt-primary">{homeTeam}</span>
        <span className="text-caption text-txt-tertiary">vs</span>
        <span className="font-display text-body-sm font-semibold text-txt-primary">{awayTeam}</span>
      </div>

      <div className="space-y-4">
        {statRows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-body-sm font-semibold text-txt-primary">
                {row.home}
              </span>
              <span className="text-caption text-txt-tertiary">{row.label}</span>
              <span className="font-mono text-body-sm font-semibold text-txt-primary">
                {row.away}
              </span>
            </div>
            {row.showBar && typeof homeStat.possession === 'number' && (
              <div className="flex h-1.5 overflow-hidden rounded-full bg-warm-cream">
                <div
                  className="rounded-full bg-oracle-gold transition-all"
                  style={{ width: `${homeStat.possession}%` }}
                />
                <div className="flex-1 bg-warm-stone" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
