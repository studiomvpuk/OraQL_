'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, TrendingUp, Zap, BarChart3, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { EventCard } from '@/components/events/EventCard';
import { PickCard } from '@/components/picks/PickCard';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Event, Pick, Sport, PaginatedResponse, SportSummary } from '@/types';

export default function DashboardPage() {
  const [activeSport, setActiveSport] = useState<Sport>('FOOTBALL');
  const [events, setEvents] = useState<Event[]>([]);
  const [topPicks, setTopPicks] = useState<Pick[]>([]);
  const [sportCounts, setSportCounts] = useState<Record<string, number>>({});
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSelectedLeagues([]); // Reset league filter on sport change
    loadData();
  }, [activeSport]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [eventsRes, picksRes, summaryRes] = await Promise.all([
        api.get<PaginatedResponse<Event>>(`/events?sport=${activeSport}`),
        api.get<Pick[]>(`/picks/top?sport=${activeSport}&limit=6`),
        api.get<SportSummary[]>('/events/sports-summary'),
      ]);

      setEvents(eventsRes.data);
      setTopPicks(picksRes);
      const counts: Record<string, number> = {};
      summaryRes.forEach((s) => (counts[s.sport] = s.eventCount));
      setSportCounts(counts);
    } catch {
      // Will show empty state
    }
    setIsLoading(false);
  }

  // Extract unique leagues from events for the filter
  const leagues = useMemo(() => {
    const leagueMap = new Map<string, { id: string; name: string; eventCount: number }>();
    events.forEach((event) => {
      const existing = leagueMap.get(event.league.id || event.league.name);
      if (existing) {
        existing.eventCount++;
      } else {
        leagueMap.set(event.league.id || event.league.name, {
          id: event.league.id || event.league.name,
          name: event.league.name,
          eventCount: 1,
        });
      }
    });
    return Array.from(leagueMap.values()).sort((a, b) => b.eventCount - a.eventCount);
  }, [events]);

  // Filter events by selected leagues (empty = all)
  const filteredEvents = useMemo(() => {
    if (selectedLeagues.length === 0) return events;
    return events.filter((e) =>
      selectedLeagues.includes(e.league.id || e.league.name),
    );
  }, [events, selectedLeagues]);

  // Split into upcoming/live vs completed
  const upcomingEvents = filteredEvents.filter(
    (e) => e.status !== 'FINISHED' && e.status !== 'CANCELLED',
  );
  const completedEvents = filteredEvents.filter(
    (e) => e.status === 'FINISHED' || e.status === 'CANCELLED',
  );

  // Group upcoming events by league
  const groupedEvents = upcomingEvents.reduce(
    (acc, event) => {
      const key = event.league.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    },
    {} as Record<string, Event[]>,
  );

  // Group completed events by league
  const groupedCompleted = completedEvents.reduce(
    (acc, event) => {
      const key = event.league.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
      return acc;
    },
    {} as Record<string, Event[]>,
  );

  return (
    <div className="bg-warm-white min-h-screen">
      {/* TopBar: Warm White Sticky Header with Sport Toggle */}
      <TopBar
        activeSport={activeSport}
        onSportChange={setActiveSport}
        sportCounts={sportCounts}
      />

      <div className="relative">
        {/* ─── Section 1: Hero "Top Picks Today" (Dark Surface) ─── */}
        <section className="relative overflow-hidden bg-dark-ink px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12">
          {/* Oversized Decorative Letter - Confidence at a Glance Theme */}
          <div className="pointer-events-none absolute -right-12 -top-20 hidden font-display text-9xl leading-none tracking-tight text-white/[0.04] sm:block">
            O
          </div>

          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:gap-4">
              <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-oracle-md bg-oracle-gold/20 sm:h-12 sm:w-12">
                <Star className="h-5 w-5 fill-oracle-gold text-oracle-gold sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="mb-2 font-display text-2xl tracking-tight text-txt-inverse sm:text-3xl lg:text-display-lg">
                  Top Picks Today
                </h2>
                <p className="max-w-lg text-body-sm text-txt-inverse-2">
                  OraQL_&apos;s highest-confidence predictions across all matches
                </p>
              </div>
            </div>

            {/* Horizontal Scrollable Picks Row */}
            {isLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-56 w-72 flex-shrink-0 animate-pulse rounded-oracle-lg bg-dark-graphite/50"
                  />
                ))}
              </div>
            ) : topPicks.length > 0 ? (
              <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {topPicks.map((pick) => (
                    <Link
                      key={pick.id}
                      href={pick.event?.id ? `/events/${pick.event.id}` : '#'}
                      className="w-72 flex-shrink-0 snap-start transition-transform duration-200 hover:-translate-y-1 sm:w-80"
                    >
                      <PickCard pick={pick} variant="dark" showEvent />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Zap className="mb-4 h-12 w-12 text-dark-ash/50" />
                <p className="text-body-sm text-txt-inverse-2">
                  No picks available yet. Check back closer to kickoff.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── Section 2: "Today's Fixtures" (Warm White Surface) ─── */}
        <section className="relative bg-warm-white px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-4 flex items-center gap-3 sm:gap-4">
                <TrendingUp className="h-5 w-5 flex-shrink-0 text-oracle-gold sm:h-6 sm:w-6" />
                <h2 className="font-display text-2xl tracking-tight text-txt-primary sm:text-display-md">
                  Today's Fixtures
                </h2>
                <span className="inline-flex items-center rounded-oracle-md bg-warm-cream px-3 py-1.5 font-body text-body-sm font-semibold text-txt-secondary sm:px-4 sm:py-2">
                  {upcomingEvents.length} upcoming
                </span>
              </div>

              {/* League Filter Pill Bar */}
              {leagues.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLeagues([])}
                    className={cn(
                      'rounded-full border px-4 py-2 text-body-sm font-medium transition-all duration-200',
                      selectedLeagues.length === 0
                        ? 'border-oracle-gold bg-oracle-gold/10 text-oracle-gold-dark'
                        : 'border-warm-sand bg-warm-white text-txt-secondary hover:border-warm-stone hover:text-txt-primary',
                    )}
                  >
                    All Leagues
                  </button>
                  {leagues.map((league) => {
                    const isActive = selectedLeagues.includes(league.id);
                    return (
                      <button
                        key={league.id}
                        onClick={() => {
                          if (isActive) {
                            setSelectedLeagues(selectedLeagues.filter((id) => id !== league.id));
                          } else {
                            setSelectedLeagues([...selectedLeagues, league.id]);
                          }
                        }}
                        className={cn(
                          'rounded-full border px-4 py-2 text-body-sm font-medium transition-all duration-200',
                          isActive
                            ? 'border-oracle-gold bg-oracle-gold/10 text-oracle-gold-dark'
                            : 'border-warm-sand bg-warm-white text-txt-secondary hover:border-warm-stone hover:text-txt-primary',
                        )}
                      >
                        {league.name}
                        <span className="ml-1.5 text-caption opacity-60">
                          {league.eventCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Events Grid by League */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-32 mb-4 animate-pulse bg-warm-cream rounded" />
                    <div className="space-y-3">
                      {[1, 2].map((j) => (
                        <div
                          key={j}
                          className="h-20 animate-pulse rounded-oracle-md bg-warm-cream"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(groupedEvents).length > 0 || Object.keys(groupedCompleted).length > 0 ? (
              <div className="space-y-10">
                {/* Upcoming / Live events */}
                {Object.entries(groupedEvents).map(([league, leagueEvents]) => (
                  <div key={league}>
                    <h3 className="text-body-xs font-mono uppercase tracking-widest text-txt-tertiary mb-4 font-semibold">
                      {league}
                    </h3>
                    <div className="space-y-3">
                      {leagueEvents.map((event) => (
                        <div key={event.id} className="group relative">
                          <EventCard event={event} />
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-oracle-gold rounded-l-oracle-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-hidden="true"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Completed Section */}
                {Object.keys(groupedCompleted).length > 0 && (
                  <div className="mt-8 pt-8 border-t border-warm-sand">
                    <div className="mb-6 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-warm-stone/60" />
                      <h3 className="font-display text-lg tracking-tight text-txt-tertiary">
                        Completed
                      </h3>
                      <span className="text-body-xs text-txt-tertiary">
                        ({completedEvents.length})
                      </span>
                    </div>
                    <div className="space-y-8 opacity-60">
                      {Object.entries(groupedCompleted).map(([league, leagueEvents]) => (
                        <div key={`completed-${league}`}>
                          <h3 className="text-body-xs font-mono uppercase tracking-widest text-txt-tertiary mb-4 font-semibold">
                            {league}
                          </h3>
                          <div className="space-y-3">
                            {leagueEvents.map((event) => (
                              <div key={event.id}>
                                <EventCard event={event} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-oracle-lg border-2 border-dashed border-warm-sand py-20 text-center">
                <TrendingUp className="mb-4 h-12 w-12 text-warm-stone/40" />
                <p className="text-body text-txt-tertiary font-body">
                  No events scheduled for today. Try another sport or check tomorrow.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── Section 3: Stats/Summary Row (Warm Cream Surface) ─── */}
        {!isLoading && Object.keys(sportCounts).length > 0 && (
          <section className="relative bg-warm-cream px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              {/* Section Header */}
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <BarChart3 className="h-5 w-5 flex-shrink-0 text-oracle-gold sm:h-6 sm:w-6" />
                <h2 className="font-display text-xl tracking-tight text-txt-primary sm:text-display-sm">
                  Today's Summary
                </h2>
              </div>

              {/* Summary Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(sportCounts).map(([sport, count]) => (
                  <div
                    key={sport}
                    className="rounded-oracle-md border border-warm-sand bg-warm-white p-4 shadow-soft sm:p-6"
                  >
                    <p className="mb-2 font-mono text-body-xs font-semibold uppercase tracking-widest text-txt-secondary">
                      {sport}
                    </p>
                    <p className="font-display text-3xl tracking-tight text-txt-primary sm:text-display-xl">
                      {count}
                    </p>
                    <p className="mt-1 text-body-xs text-txt-tertiary">
                      {count === 1 ? 'Event' : 'Events'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
