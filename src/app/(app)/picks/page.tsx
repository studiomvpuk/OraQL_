'use client';

import { useState, useEffect } from 'react';
import { PickCard } from '@/components/PickCard';
import { Skeleton } from '@/components/Skeleton';
import { Filter } from 'lucide-react';

interface Pick {
  id: string;
  eventId: string;
  market: string;
  selection: string;
  probability: number;
  odds: number;
  reasoning: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
}

export default function PicksPage() {
  const [sport, setSport] = useState('all');
  const [minProbability, setMinProbability] = useState(0.5);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredPicks, setFilteredPicks] = useState<Pick[]>([]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      const mockPicks: Pick[] = [
        {
          id: 'pick-1',
          eventId: 'event-1',
          market: 'Moneyline',
          selection: 'Kansas City Chiefs',
          probability: 0.72,
          odds: 1.65,
          reasoning: 'Strong offensive momentum with 3-game winning streak.',
          sport: 'nfl',
          homeTeam: 'Kansas City Chiefs',
          awayTeam: 'Denver Broncos',
          league: 'NFL',
          startTime: '2024-12-15T20:20:00Z',
        },
        {
          id: 'pick-2',
          eventId: 'event-2',
          market: 'Over/Under',
          selection: 'Over 47.5',
          probability: 0.68,
          odds: 1.91,
          reasoning: 'Both teams averaging 25+ points in last 5 games.',
          sport: 'nfl',
          homeTeam: 'Buffalo Bills',
          awayTeam: 'Miami Dolphins',
          league: 'NFL',
          startTime: '2024-12-16T13:00:00Z',
        },
        {
          id: 'pick-3',
          eventId: 'event-3',
          market: 'Moneyline',
          selection: 'Los Angeles Lakers',
          probability: 0.61,
          odds: 2.1,
          reasoning: 'Home court advantage with key players returning from injury.',
          sport: 'nba',
          homeTeam: 'Los Angeles Lakers',
          awayTeam: 'Boston Celtics',
          league: 'NBA',
          startTime: '2024-12-16T22:30:00Z',
        },
        {
          id: 'pick-4',
          eventId: 'event-4',
          market: 'Spread',
          selection: 'Boston Celtics -4.5',
          probability: 0.55,
          odds: 1.95,
          reasoning: 'Strong recent form with 5 consecutive wins.',
          sport: 'nba',
          homeTeam: 'Boston Celtics',
          awayTeam: 'New York Knicks',
          league: 'NBA',
          startTime: '2024-12-17T20:00:00Z',
        },
      ];

      setPicks(mockPicks);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter picks
  useEffect(() => {
    let filtered = picks;

    if (sport !== 'all') {
      filtered = filtered.filter((p) => p.sport === sport);
    }

    filtered = filtered.filter((p) => p.probability >= minProbability);

    setFilteredPicks(filtered);
  }, [picks, sport, minProbability]);

  const sports = [
    { value: 'all', label: 'All Sports', count: picks.length },
    {
      value: 'nfl',
      label: 'NFL',
      count: picks.filter((p) => p.sport === 'nfl').length,
    },
    {
      value: 'nba',
      label: 'NBA',
      count: picks.filter((p) => p.sport === 'nba').length,
    },
    {
      value: 'nhl',
      label: 'NHL',
      count: picks.filter((p) => p.sport === 'nhl').length,
    },
    {
      value: 'mlb',
      label: 'MLB',
      count: picks.filter((p) => p.sport === 'mlb').length,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[#faf8f3] border-b border-[#e5dfd6] py-8 relative overflow-hidden">
        <div className="absolute top-4 right-20 deco-letter warm">P</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold text-[#1a1815] mb-2">OraQL_ Picks</h1>
          <p className="text-[#3a3530] font-light">Browse all available betting recommendations</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-[#f9f7f3] border-b border-[#e5dfd6] sticky top-0 z-40 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {/* Sport Filter */}
            <div>
              <label className="text-sm font-medium text-[#1a1815] block mb-3">Sport</label>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {sports.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSport(s.value)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      sport === s.value
                        ? 'bg-[#1a1815] text-[#f9f7f3]'
                        : 'bg-white border-2 border-[#e5dfd6] text-[#1a1815] hover:border-[#d4a574]'
                    }`}
                  >
                    {s.label} ({s.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Probability Threshold */}
            <div>
              <label className="text-sm font-medium text-[#1a1815] block mb-3 flex items-center gap-2">
                <Filter size={16} />
                Minimum Confidence: {(minProbability * 100).toFixed(0)}%
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minProbability * 100}
                  onChange={(e) => setMinProbability(parseInt(e.target.value) / 100)}
                  className="flex-1 h-2 bg-[#e5dfd6] rounded-lg appearance-none cursor-pointer accent-[#d4a574]"
                />
                <div className="text-right">
                  <span className="text-lg font-mono font-bold text-[#d4a574]">
                    {(minProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Picks Grid */}
      <section className="bg-[#f9f7f3] py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : filteredPicks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-[#3a3530] font-light mb-4">No picks match your criteria</p>
              <button
                onClick={() => {
                  setSport('all');
                  setMinProbability(0.5);
                }}
                className="px-6 py-2 bg-[#1a1815] text-[#f9f7f3] rounded-lg hover:bg-[#2a2520] transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPicks.map((pick) => (
                <PickCard
                  key={pick.id}
                  pick={pick}
                  variant="light"
                  showEvent={{
                    homeTeam: pick.homeTeam,
                    awayTeam: pick.awayTeam,
                    league: pick.league,
                  }}
                />
              ))}
            </div>
          )}

          {/* Results Info */}
          {!loading && filteredPicks.length > 0 && (
            <div className="mt-8 text-center text-[#3a3530] font-light">
              Showing {filteredPicks.length} of {picks.length} picks
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
