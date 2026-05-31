'use client';

import { useState, useEffect, useCallback } from 'react';
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
  AlertTriangle,
  Plus,
  Check,
  ChevronRight,
  X,
  Sparkles,
  Flame,
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatKickoff, formatCategory, formatProbability, getProbabilityTier } from '@/lib/utils';
import { PickCard } from '@/components/picks/PickCard';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { api } from '@/lib/api';
import { useBuilderStore } from '@/stores/builder.store';
import type {
  EventDetail,
  Market,
  MarketCategory,
  BookmakerOdds,
  Lineup,
  MatchStat,
  TeamContext,
  TeamFormEntry,
  StreakSuggestion,
} from '@/types';

type TabId = 'markets' | 'streaks' | 'odds' | 'lineups' | 'stats';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('markets');
  const [activeCategory, setActiveCategory] = useState<MarketCategory | 'ALL'>('ALL');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addToBuilder = useBuilderStore((s) => s.add);

  // Streak suggestions for this event
  const [streakSuggestions, setStreakSuggestions] = useState<StreakSuggestion[]>([]);
  const [streaksLoading, setStreaksLoading] = useState(false);

  // Team context (form + injuries) — loaded when market selected
  const [homeContext, setHomeContext] = useState<TeamContext | null>(null);
  const [awayContext, setAwayContext] = useState<TeamContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  useEffect(() => {
    if (eventId) loadEvent();
  }, [eventId]);

  // Load team context and streaks when event loads
  useEffect(() => {
    if (event && !homeContext && !contextLoading) {
      loadTeamContext();
    }
    if (event && streakSuggestions.length === 0 && !streaksLoading) {
      loadStreaks();
    }
  }, [event]);

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

  async function loadStreaks() {
    if (!event) return;
    setStreaksLoading(true);
    try {
      const res = await api.get<{ suggestions: StreakSuggestion[]; total: number }>(
        `/streaks/event/${event.id}`,
      );
      setStreakSuggestions(res.suggestions || []);
    } catch {
      // Streaks are supplementary
    }
    setStreaksLoading(false);
  }

  async function loadTeamContext() {
    if (!event) return;
    setContextLoading(true);
    try {
      const [home, away] = await Promise.all([
        api.get<TeamContext>(`/events/team/${event.homeTeam.id}/context`),
        api.get<TeamContext>(`/events/team/${event.awayTeam.id}/context`),
      ]);
      setHomeContext(home);
      setAwayContext(away);
    } catch {
      // Context is supplementary — fail silently
    }
    setContextLoading(false);
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
    { id: 'streaks', label: 'Streaks', icon: Flame, count: streakSuggestions.length },
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
              <div className="flex items-center gap-3">
                {event.homeTeam.logoUrl ? (
                  <img src={event.homeTeam.logoUrl} alt="" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-stone/20 text-xs font-bold text-txt-secondary sm:h-10 sm:w-10">
                    {event.homeTeam.shortName || event.homeTeam.name.charAt(0)}
                  </div>
                )}
                <h1 className="font-display text-2xl tracking-tight text-txt-primary sm:text-3xl lg:text-display-lg">
                  {event.homeTeam.name}
                </h1>
              </div>
              <p className="my-2 pl-11 text-body text-txt-tertiary sm:my-3 sm:pl-[52px]">vs</p>
              <div className="flex items-center gap-3">
                {event.awayTeam.logoUrl ? (
                  <img src={event.awayTeam.logoUrl} alt="" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warm-stone/20 text-xs font-bold text-txt-secondary sm:h-10 sm:w-10">
                    {event.awayTeam.shortName || event.awayTeam.name.charAt(0)}
                  </div>
                )}
                <h1 className="font-display text-2xl tracking-tight text-txt-primary sm:text-3xl lg:text-display-lg">
                  {event.awayTeam.name}
                </h1>
              </div>
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
          {/* ─── Left Column: OraQL_ Picks + Tabbed Content ─── */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* OraQL_ Picks */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 fill-oracle-gold text-oracle-gold flex-shrink-0" />
                <h2 className="font-display text-heading tracking-tight text-txt-primary">
                  OraQL_ Picks
                </h2>
              </div>
              {event.picks.length > 0 ? (
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {event.picks.map((pick) => (
                    <div key={pick.id} className="w-72 flex-shrink-0 snap-start sm:w-80">
                      <PickCard pick={pick} />
                    </div>
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
              <MarketsTab
                markets={event.markets}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                filteredMarkets={filteredMarkets}
                selectedMarket={selectedMarket}
                setSelectedMarket={setSelectedMarket}
                addToBuilder={addToBuilder}
                streakSuggestions={streakSuggestions}
              />
            )}

            {/* ── Streaks Tab ── */}
            {activeTab === 'streaks' && (
              <StreaksTab
                suggestions={streakSuggestions}
                isLoading={streaksLoading}
                addToBuilder={addToBuilder}
              />
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

          {/* ─── Right Column: Market Detail Panel (Desktop only) ─── */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 space-y-5">
              {selectedMarket ? (
                <MarketDetailPanel
                  market={selectedMarket}
                  onClose={() => setSelectedMarket(null)}
                  onAdd={() => addToBuilder(selectedMarket.id)}
                  homeTeamName={event.homeTeam.shortName || event.homeTeam.name}
                  awayTeamName={event.awayTeam.shortName || event.awayTeam.name}
                  homeContext={homeContext}
                  awayContext={awayContext}
                  contextLoading={contextLoading}
                />
              ) : (
                <div className="rounded-oracle-lg border-2 border-dashed border-warm-sand bg-warm-cream/50 p-8 text-center">
                  <TrendingUp className="mx-auto mb-4 h-10 w-10 text-warm-taupe" />
                  <h3 className="mb-2 font-display text-heading tracking-tight text-txt-secondary">
                    Market Detail
                  </h3>
                  <p className="text-body-sm text-txt-tertiary">
                    Select a market from the list to see the probability gauge, recent form, and player availability.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Bottom Sheet (< lg only) ─── */}
      {selectedMarket && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 animate-fade-in"
            onClick={() => setSelectedMarket(null)}
          />
          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-oracle-xl bg-warm-white shadow-xl animate-slide-up">
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex justify-center bg-warm-white pb-2 pt-3">
              <div className="h-1 w-10 rounded-full bg-warm-stone" />
            </div>
            <div className="px-5 pb-8">
              <MarketDetailPanel
                market={selectedMarket}
                onClose={() => setSelectedMarket(null)}
                onAdd={() => addToBuilder(selectedMarket.id)}
                homeTeamName={event.homeTeam.shortName || event.homeTeam.name}
                awayTeamName={event.awayTeam.shortName || event.awayTeam.name}
                homeContext={homeContext}
                awayContext={awayContext}
                contextLoading={contextLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Market Detail Panel — right column
   ═══════════════════════════════════════════════════════════ */
function MarketDetailPanel({
  market,
  onClose,
  onAdd,
  homeTeamName,
  awayTeamName,
  homeContext,
  awayContext,
  contextLoading,
}: {
  market: Market;
  onClose: () => void;
  onAdd: () => Promise<void>;
  homeTeamName: string;
  awayTeamName: string;
  homeContext: TeamContext | null;
  awayContext: TeamContext | null;
  contextLoading: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(async () => {
    if (adding || added) return;
    setAdding(true);
    try {
      await onAdd();
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      setAdding(false);
    }
  }, [onAdd, adding, added]);

  // Reset added state when market changes
  useEffect(() => {
    setAdded(false);
    setAdding(false);
  }, [market.id]);

  const allInjuries = [
    ...(homeContext?.injuries || []).map((inj) => ({ ...inj, team: homeTeamName })),
    ...(awayContext?.injuries || []).map((inj) => ({ ...inj, team: awayTeamName })),
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Panel Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
            {formatCategory(market.category)}
          </p>
          <h3 className="mt-1 font-display text-heading tracking-tight text-txt-primary">
            {market.shortName || market.name}
            {market.line != null && (
              <span className="ml-2 font-mono text-body font-semibold text-txt-secondary">
                {market.line}
              </span>
            )}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-txt-tertiary transition-colors hover:bg-warm-cream hover:text-txt-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Circular Probability Gauge */}
      <div className="flex justify-center rounded-oracle-md bg-warm-cream/50 py-6">
        <CircularGauge
          probability={market.probability}
          confidence={market.confidence}
          isValueBet={market.isValueBet}
          size={160}
        />
      </div>

      {/* Value Bet Highlight */}
      {market.isValueBet && market.valueGap != null && (
        <div className="flex items-center gap-3 rounded-oracle-md bg-value/10 px-4 py-3">
          <Sparkles className="h-5 w-5 flex-shrink-0 text-value" />
          <div>
            <p className="text-body-sm font-semibold text-value">Value Bet Detected</p>
            <p className="text-caption text-txt-secondary">
              Oracle probability is {formatProbability(market.valueGap)} higher than bookmaker implied odds
            </p>
          </div>
        </div>
      )}

      {/* Explanation */}
      {market.explanation && (
        <div className="space-y-2">
          <h4 className="text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
            Analysis
          </h4>
          <div className="rounded-oracle-md bg-warm-cream/50 p-4">
            {market.explanation.split(/\[Caveat\]\s*/).map((part, i) =>
              i === 0 ? (
                part ? (
                  <p key={i} className="text-body-sm text-txt-secondary leading-relaxed">
                    {part.trim()}
                  </p>
                ) : null
              ) : (
                <div
                  key={i}
                  className="mt-2 flex items-start gap-2 rounded-oracle-sm bg-oracle-gold/10 px-3 py-2 text-body-sm text-oracle-gold-dark"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span>{part.trim()}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Last 5 Matches Mini Table */}
      <div className="space-y-3">
        <h4 className="text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
          Recent Form
        </h4>
        {contextLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded bg-warm-cream" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Home team form */}
            <FormTable teamName={homeTeamName} form={homeContext?.form || []} />
            {/* Away team form */}
            <FormTable teamName={awayTeamName} form={awayContext?.form || []} />
          </div>
        )}
      </div>

      {/* Player Availability */}
      <div className="space-y-3">
        <h4 className="text-caption font-semibold uppercase tracking-widest text-txt-tertiary">
          Player Availability
        </h4>
        {contextLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-warm-cream" />
            ))}
          </div>
        ) : allInjuries.length > 0 ? (
          <div className="space-y-2">
            {allInjuries.slice(0, 8).map((inj) => (
              <div
                key={inj.id}
                className="flex items-center gap-3 rounded-oracle-sm bg-warm-cream/60 px-3 py-2"
              >
                {inj.player.photoUrl ? (
                  <img
                    src={inj.player.photoUrl}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-stone text-[10px] font-bold text-txt-inverse">
                    {inj.player.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-txt-primary">
                    {inj.player.name}
                  </p>
                  <p className="text-caption text-txt-tertiary">
                    {inj.team} · {inj.player.position || 'Player'}
                  </p>
                </div>
                <span
                  className={cn(
                    'flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    inj.severity === 'SEVERE'
                      ? 'bg-danger/15 text-danger'
                      : inj.severity === 'MODERATE'
                        ? 'bg-prob-mid/15 text-prob-mid'
                        : 'bg-warm-sand text-txt-secondary',
                  )}
                >
                  {inj.severity || 'OUT'}
                </span>
              </div>
            ))}
            {allInjuries.length > 8 && (
              <p className="text-caption text-txt-tertiary text-center">
                +{allInjuries.length - 8} more
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-oracle-sm bg-warm-cream/50 px-4 py-3 text-center">
            <p className="text-body-sm text-txt-tertiary">
              No reported injuries or suspensions
            </p>
          </div>
        )}
      </div>

      {/* Add to Builder Button */}
      <button
        onClick={handleAdd}
        disabled={adding || added}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-oracle-md px-4 py-4 text-body font-semibold transition-all duration-200',
          added
            ? 'bg-prob-high/20 text-prob-high'
            : adding
              ? 'bg-dark-charcoal text-txt-inverse-2'
              : 'bg-dark-ink text-txt-inverse hover:bg-dark-charcoal active:bg-dark-graphite',
        )}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added to Builder!
          </>
        ) : adding ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-txt-inverse-2 border-t-transparent" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            Add to Bet Builder
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Form Table (Last 5 Matches) ─── */
function FormTable({ teamName, form }: { teamName: string; form: TeamFormEntry[] }) {
  if (form.length === 0) {
    return (
      <div className="rounded-oracle-sm bg-warm-cream/50 px-3 py-2 text-center">
        <p className="text-caption text-txt-tertiary">{teamName}: No recent data</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-body-sm font-semibold text-txt-primary">{teamName}</p>
      <div className="overflow-hidden rounded-oracle-sm border border-warm-sand">
        <table className="w-full text-caption">
          <thead>
            <tr className="bg-warm-cream text-txt-tertiary">
              <th className="px-2 py-1.5 text-left font-semibold">Opponent</th>
              <th className="px-2 py-1.5 text-center font-semibold">H/A</th>
              <th className="px-2 py-1.5 text-center font-semibold">Score</th>
              <th className="px-2 py-1.5 text-center font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {form.map((m) => (
              <tr key={m.id} className="border-t border-warm-cream">
                <td className="px-2 py-1.5 text-txt-primary">{m.opponent.name}</td>
                <td className="px-2 py-1.5 text-center text-txt-secondary">{m.venue}</td>
                <td className="px-2 py-1.5 text-center font-mono font-semibold text-txt-primary">
                  {m.score}
                </td>
                <td className="px-2 py-1.5 text-center">
                  <span
                    className={cn(
                      'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                      m.result === 'W'
                        ? 'bg-prob-high/15 text-prob-high'
                        : m.result === 'L'
                          ? 'bg-danger/15 text-danger'
                          : 'bg-warm-sand text-txt-secondary',
                    )}
                  >
                    {m.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Form streak badges */}
      <div className="mt-2 flex gap-1">
        {form.map((m) => (
          <span
            key={m.id}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold',
              m.result === 'W'
                ? 'bg-prob-high/15 text-prob-high'
                : m.result === 'L'
                  ? 'bg-danger/15 text-danger'
                  : 'bg-warm-sand text-txt-secondary',
            )}
          >
            {m.result}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Markets Tab Component
   ═══════════════════════════════════════════════════════════ */
function MarketsTab({
  markets,
  categories,
  activeCategory,
  setActiveCategory,
  filteredMarkets,
  selectedMarket,
  setSelectedMarket,
  addToBuilder,
  streakSuggestions = [],
}: {
  markets: Market[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: MarketCategory | 'ALL') => void;
  filteredMarkets: Market[];
  selectedMarket: Market | null;
  setSelectedMarket: (m: Market | null) => void;
  addToBuilder: (id: string) => Promise<void>;
  streakSuggestions?: StreakSuggestion[];
}) {
  // Build a lookup of streak-backed markets for green badges
  const streakByMarket = new Map<string, StreakSuggestion>();
  for (const s of streakSuggestions) {
    const key = `${s.marketName}:${s.line ?? ''}`;
    if (!streakByMarket.has(key) || s.confidence > (streakByMarket.get(key)?.confidence ?? 0)) {
      streakByMarket.set(key, s);
    }
  }
  /**
   * Group markets by category + line into paired Over/Under rows.
   */
  const groupedSections = (() => {
    type MarketGroup = {
      label: string;
      category: string;
      line?: number;
      over?: Market;
      under?: Market;
      standalone?: Market;
    };

    const groups = new Map<string, MarketGroup>();

    filteredMarkets.forEach((m) => {
      const isOver = m.name.includes('OVER');
      const isUnder = m.name.includes('UNDER');
      const baseName = m.name.replace(/_OVER|_UNDER/, '');

      if (isOver || isUnder) {
        const key = `${baseName}|${m.line ?? ''}`;
        const existing = groups.get(key) || {
          label: `${formatCategory(m.category)}${m.line != null ? ` ${m.line}` : ''}`,
          category: m.category,
          line: m.line,
        };
        if (isOver) existing.over = m;
        if (isUnder) existing.under = m;
        groups.set(key, existing);
      } else {
        const key = `standalone|${m.id}`;
        groups.set(key, {
          label: m.shortName || m.name,
          category: m.category,
          standalone: m,
        });
      }
    });

    return Array.from(groups.values());
  })();

  // Group the paired rows by category
  const byCat = new Map<string, typeof groupedSections>();
  groupedSections.forEach((g) => {
    const cat = g.category;
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat)!.push(g);
  });

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
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
            onClick={() => setActiveCategory(cat as MarketCategory)}
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

      {/* Markets grouped by category */}
      {filteredMarkets.length === 0 && streakSuggestions.length > 0 ? (
        (() => {
          // Group streak suggestions into Over/Under pairs like real markets
          const streakGroups = new Map<string, { over?: StreakSuggestion; under?: StreakSuggestion; standalone?: StreakSuggestion; line?: number }>();
          for (const s of streakSuggestions) {
            const isOver = s.marketName.includes('OVER');
            const isUnder = s.marketName.includes('UNDER');
            const baseName = s.marketName.replace('_OVER', '').replace('_UNDER', '');
            const key = `${baseName}:${s.line ?? 'none'}`;

            if (isOver || isUnder) {
              const existing = streakGroups.get(key) || { line: s.line ?? undefined };
              if (isOver) existing.over = s;
              else existing.under = s;
              streakGroups.set(key, existing);
            } else {
              streakGroups.set(`standalone:${s.marketName}:${s.line}`, { standalone: s });
            }
          }

          return (
            <div className="space-y-3">
              {Array.from(streakGroups.entries()).map(([key, group]) => {
                if (group.standalone) {
                  const s = group.standalone;
                  return (
                    <div key={key} className="flex w-full items-center gap-3 rounded-oracle-md border border-warm-sand bg-white px-4 py-3">
                      <span className="flex-1 truncate text-body-sm font-medium text-txt-primary">
                        {formatStreakMarketName(s.marketName)}
                        {s.line != null && <span className="ml-1 font-mono text-txt-secondary">{s.line}</span>}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-prob-high/15 px-2 py-0.5 text-[10px] font-bold text-prob-high">
                        <Flame className="h-2.5 w-2.5" /> STREAK
                      </span>
                      <span className={cn(
                        'font-mono text-body-sm font-semibold',
                        getProbabilityTier(s.confidence) === 'high' ? 'text-prob-high' :
                        getProbabilityTier(s.confidence) === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
                      )}>
                        {formatProbability(s.confidence)}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={key} className="space-y-2">
                    {group.line != null && (
                      <p className="text-caption font-medium text-txt-secondary pl-1">Line {group.line}</p>
                    )}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {group.over && (
                        <div className="flex w-full items-center gap-3 rounded-oracle-md border border-warm-sand bg-white px-4 py-3">
                          <span className="flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-prob-high/15 text-prob-high">OVER</span>
                          <span className="flex-1 truncate text-body-sm font-medium text-txt-primary">
                            {formatStreakMarketName(group.over.marketName)}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-prob-high/15 px-2 py-0.5 text-[10px] font-bold text-prob-high">
                            <Flame className="h-2.5 w-2.5" /> STREAK
                          </span>
                          <span className={cn(
                            'font-mono text-body-sm font-semibold',
                            getProbabilityTier(group.over.confidence) === 'high' ? 'text-prob-high' :
                            getProbabilityTier(group.over.confidence) === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
                          )}>
                            {formatProbability(group.over.confidence)}
                          </span>
                        </div>
                      )}
                      {group.under && (
                        <div className="flex w-full items-center gap-3 rounded-oracle-md border border-warm-sand bg-white px-4 py-3">
                          <span className="flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600">UNDER</span>
                          <span className="flex-1 truncate text-body-sm font-medium text-txt-primary">
                            {formatStreakMarketName(group.under.marketName)}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-prob-high/15 px-2 py-0.5 text-[10px] font-bold text-prob-high">
                            <Flame className="h-2.5 w-2.5" /> STREAK
                          </span>
                          <span className={cn(
                            'font-mono text-body-sm font-semibold',
                            getProbabilityTier(group.under.confidence) === 'high' ? 'text-prob-high' :
                            getProbabilityTier(group.under.confidence) === 'mid' ? 'text-prob-mid' : 'text-txt-tertiary',
                          )}>
                            {formatProbability(group.under.confidence)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      ) : filteredMarkets.length === 0 ? (
        <div className="rounded-oracle-md bg-warm-white py-8 text-center">
          <p className="text-body-sm text-txt-tertiary">No markets available for this category.</p>
        </div>
      ) : (
        Array.from(byCat.entries()).map(([cat, groups]) => (
          <div key={cat} className="space-y-3">
            {/* Category header */}
            <h3 className="text-body-xs font-mono uppercase tracking-widest text-txt-tertiary font-semibold">
              {formatCategory(cat)}
            </h3>

            {/* Market rows */}
            <div className="space-y-2">
              {groups.map((group, gi) => {
                if (group.standalone) {
                  const m = group.standalone;
                  const isSelected = selectedMarket?.id === m.id;
                  const mStreak = streakByMarket.get(`${m.name}:${m.line ?? ''}`);
                  return (
                    <MarketRow
                      key={m.id}
                      market={m}
                      isSelected={isSelected}
                      onClick={() => setSelectedMarket(isSelected ? null : m)}
                      streak={mStreak}
                    />
                  );
                }

                // Over/Under pair — side by side
                return (
                  <div key={`pair-${gi}`} className="space-y-2">
                    <p className="text-caption font-medium text-txt-secondary pl-1">
                      Line {group.line}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {group.over && (
                        <MarketRow
                          market={group.over}
                          isSelected={selectedMarket?.id === group.over.id}
                          onClick={() =>
                            setSelectedMarket(
                              selectedMarket?.id === group.over!.id ? null : group.over!,
                            )
                          }
                          direction="OVER"
                          streak={streakByMarket.get(`${group.over.name}:${group.over.line ?? ''}`)}
                        />
                      )}
                      {group.under && (
                        <MarketRow
                          market={group.under}
                          isSelected={selectedMarket?.id === group.under.id}
                          onClick={() =>
                            setSelectedMarket(
                              selectedMarket?.id === group.under!.id ? null : group.under!,
                            )
                          }
                          direction="UNDER"
                          streak={streakByMarket.get(`${group.under.name}:${group.under.line ?? ''}`)}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ─── Market Row — clickable, selects into detail panel ─── */
function MarketRow({
  market,
  isSelected,
  onClick,
  direction,
  streak,
}: {
  market: Market;
  isSelected: boolean;
  onClick: () => void;
  direction?: 'OVER' | 'UNDER';
  streak?: StreakSuggestion;
}) {
  const tier = getProbabilityTier(market.probability);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-oracle-md border px-4 py-3 text-left transition-all duration-200',
        isSelected
          ? 'border-oracle-gold bg-oracle-gold/[0.06] shadow-soft'
          : streak
            ? 'border-prob-high/30 bg-prob-high/[0.03] hover:border-prob-high/50 hover:shadow-soft'
            : 'border-warm-sand bg-white hover:border-warm-stone hover:shadow-soft',
      )}
    >
      {/* Direction badge */}
      {direction && (
        <span
          className={cn(
            'flex-shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            direction === 'OVER'
              ? 'bg-prob-high/15 text-prob-high'
              : 'bg-blue-100 text-blue-600',
          )}
        >
          {direction}
        </span>
      )}

      {/* Name */}
      <span className="flex-1 truncate text-body-sm font-medium text-txt-primary">
        {market.shortName || market.name}
      </span>

      {/* Streak badge */}
      {streak && (
        <span className="group/streak relative flex-shrink-0">
          <span className="flex items-center gap-1 rounded-full bg-prob-high/15 px-2 py-0.5 text-[10px] font-bold text-prob-high">
            <Flame className="h-2.5 w-2.5" />
            STREAK
          </span>
          <span className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 w-56 rounded-oracle-sm bg-dark-ink px-3 py-2 text-[11px] leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/streak:opacity-100">
            {streak.summary}
            <span className="absolute right-4 top-full border-4 border-transparent border-t-dark-ink" />
          </span>
        </span>
      )}

      {/* Value badge */}
      {market.isValueBet && (
        <span className="rounded-full bg-value/15 px-2 py-0.5 text-[10px] font-bold text-value">
          VALUE
        </span>
      )}

      {/* Probability */}
      <span
        className={cn('font-mono text-body-sm font-semibold', {
          'text-prob-high': tier === 'high',
          'text-prob-mid': tier === 'mid',
          'text-txt-tertiary': tier === 'low',
        })}
      >
        {formatProbability(market.probability)}
      </span>

      {/* Arrow indicator */}
      <ChevronRight
        className={cn(
          'h-4 w-4 flex-shrink-0 transition-colors',
          isSelected ? 'text-oracle-gold' : 'text-txt-tertiary',
        )}
      />
    </button>
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

/* ═══════════════════════════════════════════════════════════
   Streaks Tab Component
   ═══════════════════════════════════════════════════════════ */
function StreaksTab({
  suggestions,
  isLoading,
  addToBuilder,
}: {
  suggestions: StreakSuggestion[];
  isLoading: boolean;
  addToBuilder: (id: string) => Promise<void>;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-oracle-md bg-warm-cream" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-oracle-md border border-dashed border-warm-stone bg-warm-white p-8 text-center">
        <Flame className="mx-auto mb-3 h-8 w-8 text-txt-tertiary" />
        <p className="text-body-sm text-txt-tertiary">
          No active streaks found for this match.
        </p>
        <p className="mt-1 text-caption text-txt-tertiary">
          Streaks are detected from patterns across recent matches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-body-sm text-txt-secondary">
        {suggestions.length} streak-backed {suggestions.length === 1 ? 'suggestion' : 'suggestions'} for this match, ranked by confidence.
      </p>

      <div className="space-y-3">
        {suggestions.map((s) => (
          <StreakSuggestionCard
            key={`${s.streakId}-${s.marketName}`}
            suggestion={s}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Streak Suggestion Card ─── */
function StreakSuggestionCard({ suggestion }: { suggestion: StreakSuggestion }) {
  const confTier = getProbabilityTier(suggestion.confidence);
  const validationColors: Record<string, string> = {
    HIGH: 'bg-prob-high/15 text-prob-high',
    MEDIUM: 'bg-prob-mid/15 text-prob-mid',
    LOW: 'bg-danger/15 text-danger',
    UNKNOWN: 'bg-warm-sand text-txt-secondary',
  };

  return (
    <div className="rounded-oracle-md border border-warm-sand bg-white p-4 transition-all duration-200 hover:border-warm-stone hover:shadow-soft">
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Flame className="h-4 w-4 flex-shrink-0 text-oracle-gold" />
            <span className="font-display text-body font-semibold tracking-tight text-txt-primary">
              {formatStreakMarketName(suggestion.marketName)}
              {suggestion.line != null && (
                <span className="ml-1 font-mono text-body-sm text-txt-secondary">{suggestion.line}</span>
              )}
            </span>
            {suggestion.validationLevel && suggestion.validationLevel !== 'UNKNOWN' && (
              <span className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                validationColors[suggestion.validationLevel] || validationColors.UNKNOWN,
              )}>
                {suggestion.validationLevel}
              </span>
            )}
          </div>
        </div>

        <span className={cn(
          'flex-shrink-0 rounded-full px-3 py-1 font-mono text-body-sm font-bold',
          confTier === 'high' ? 'bg-prob-high/15 text-prob-high' :
          confTier === 'mid' ? 'bg-prob-mid/15 text-prob-mid' : 'bg-warm-sand text-txt-secondary',
        )}>
          {(suggestion.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Summary */}
      <p className="mb-3 text-body-sm text-txt-secondary leading-relaxed">
        {suggestion.summary}
      </p>

      {/* Validation details */}
      {suggestion.validationDetails && suggestion.validationDetails.totalKeyPlayers > 0 && (
        <div className="mb-3 flex items-center gap-2 text-caption text-txt-tertiary">
          <Shield className="h-3 w-3" />
          <span>
            {suggestion.validationDetails.availableKeyPlayers}/{suggestion.validationDetails.totalKeyPlayers} key players available
          </span>
          {suggestion.validationDetails.missingPlayers.length > 0 && (
            <span className="text-danger">
              (Missing: {suggestion.validationDetails.missingPlayers.slice(0, 3).join(', ')}{suggestion.validationDetails.missingPlayers.length > 3 ? '...' : ''})
            </span>
          )}
        </div>
      )}

      {/* Probability bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex h-2 overflow-hidden rounded-full bg-warm-cream">
            <div
              className={cn(
                'rounded-full transition-all',
                confTier === 'high' ? 'bg-prob-high' :
                confTier === 'mid' ? 'bg-prob-mid' : 'bg-warm-stone',
              )}
              style={{ width: `${Math.min(suggestion.confidence * 100, 100)}%` }}
            />
          </div>
        </div>
        <span className="text-caption text-txt-tertiary">
          {formatProbability(suggestion.probability ?? suggestion.confidence)}
        </span>
      </div>
    </div>
  );
}

function formatStreakMarketName(name: string): string {
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
