'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { PickCard } from '@/components/PickCard';
import { EventCard } from '@/components/EventCard';
import { Skeleton } from '@/components/Skeleton';
import { usePicksStore } from '@/store/picks';

interface Event {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
}

interface Pick {
  id: string;
  eventId: string;
  market: string;
  selection: string;
  probability: number;
  odds: number;
  reasoning: string;
}

interface Fixture {
  event: Event;
  picks: Pick[];
}

export default function DashboardPage() {
  const [sport, setSport] = useState('nfl');
  const [loading, setLoading] = useState(true);
  const [topPicks, setTopPicks] = useState<Pick[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [stats, setStats] = useState({
    totalPicks: 0,
    winRate: 0,
    avgProbability: 0,
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      // Mock data
      setTopPicks([
        {
          id: 'pick-1',
          eventId: 'event-1',
          market: 'Moneyline',
          selection: 'Kansas City Chiefs',
          probability: 0.72,
          odds: 1.65,
          reasoning:
            'Strong offensive momentum with 3-game winning streak. Defensive secondary performing well.',
        },
        {
          id: 'pick-2',
          eventId: 'event-2',
          market: 'Over/Under',
          selection: 'Over 47.5',
          probability: 0.68,
          odds: 1.91,
          reasoning: 'Both teams averaging 25+ points in last 5 games. Weather conditions favor high scoring.',
        },
      ]);

      setFixtures([
        {
          event: {
            id: 'event-1',
            sport: 'nfl',
            league: 'NFL',
            homeTeam: 'Kansas City Chiefs',
            awayTeam: 'Denver Broncos',
            startTime: '2024-12-15T20:20:00Z',
            status: 'upcoming',
          },
          picks: [
            {
              id: 'pick-1-1',
              eventId: 'event-1',
              market: 'Moneyline',
              selection: 'Kansas City Chiefs',
              probability: 0.72,
              odds: 1.65,
              reasoning:
                'Strong offensive momentum with 3-game winning streak. Defensive secondary performing well.',
            },
          ],
        },
        {
          event: {
            id: 'event-2',
            sport: 'nfl',
            league: 'NFL',
            homeTeam: 'Buffalo Bills',
            awayTeam: 'Miami Dolphins',
            startTime: '2024-12-16T13:00:00Z',
            status: 'upcoming',
          },
          picks: [
            {
              id: 'pick-2-1',
              eventId: 'event-2',
              market: 'Over/Under',
              selection: 'Over 47.5',
              probability: 0.68,
              odds: 1.91,
              reasoning:
                'Both teams averaging 25+ points in last 5 games. Weather conditions favor high scoring.',
            },
          ],
        },
      ]);

      setStats({
        totalPicks: 847,
        winRate: 0.623,
        avgProbability: 0.65,
      });

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sport]);

  const groupedFixtures = fixtures.reduce(
    (acc, fixture) => {
      const league = fixture.event.league;
      if (!acc[league]) {
        acc[league] = [];
      }
      acc[league].push(fixture);
      return acc;
    },
    {} as Record<string, Fixture[]>
  );

  return (
    <div className="min-h-screen">
      <TopBar sport={sport} onSportChange={setSport} />

      {/* Hero Section with Top Picks */}
      <section className="bg-[#1a1815] text-[#f9f7f3] py-16 relative overflow-hidden">
        <div className="absolute top-10 right-20 deco-letter dark">O</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-2">Top Picks Today</h1>
          <p className="text-[#b8b0a5] font-light mb-8">High-confidence opportunities across today's events</p>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {topPicks.map((pick) => (
                <PickCard key={pick.id} pick={pick} variant="dark" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Today's Fixtures */}
      <section className="bg-[#f9f7f3] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1a1815] mb-8">Today's Fixtures</h2>

          {loading ? (
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-48" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedFixtures).map(([league, fixtures]) => (
                <div key={league}>
                  <h3 className="text-lg font-bold text-[#1a1815] mb-4">{league}</h3>
                  <div className="grid gap-4">
                    {fixtures.map((fixture) => (
                      <EventCard key={fixture.event.id} event={fixture.event} picks={fixture.picks} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Summary */}
      <section className="bg-[#faf8f3] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-[#e5dfd6]">
              <p className="text-[#3a3530] text-sm font-light mb-2">Total Picks Available</p>
              {loading ? (
                <Skeleton className="h-10" />
              ) : (
                <p className="text-3xl font-bold text-[#1a1815]">{stats.totalPicks}</p>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 border border-[#e5dfd6]">
              <p className="text-[#3a3530] text-sm font-light mb-2">Historical Win Rate</p>
              {loading ? (
                <Skeleton className="h-10" />
              ) : (
                <p className="text-3xl font-bold text-[#1a1815]">{(stats.winRate * 100).toFixed(1)}%</p>
              )}
            </div>
            <div className="bg-white rounded-lg p-6 border border-[#e5dfd6]">
              <p className="text-[#3a3530] text-sm font-light mb-2">Avg Confidence</p>
              {loading ? (
                <Skeleton className="h-10" />
              ) : (
                <p className="text-3xl font-bold text-oracle-gradient">{(stats.avgProbability * 100).toFixed(0)}%</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
