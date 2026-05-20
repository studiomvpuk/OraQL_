'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { PickCard } from '@/components/PickCard';

interface Market {
  id: string;
  name: string;
  category: string;
}

interface MarketDetail {
  id: string;
  market: string;
  description: string;
  selections: string[];
  explanation: string;
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

interface Event {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  score?: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  // Mock event data
  const event: Event = {
    id: eventId,
    league: 'NFL',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Denver Broncos',
    time: '2024-12-15T20:20:00Z',
    status: 'upcoming',
  };

  const oraqlPicks: Pick[] = [
    {
      id: 'pick-1',
      eventId,
      market: 'Moneyline',
      selection: 'Kansas City Chiefs',
      probability: 0.72,
      odds: 1.65,
      reasoning: 'Strong offensive momentum with 3-game winning streak. Defensive secondary performing well.',
    },
    {
      id: 'pick-2',
      eventId,
      market: 'Over/Under',
      selection: 'Over 47.5',
      probability: 0.68,
      odds: 1.91,
      reasoning: 'Both teams averaging 25+ points in last 5 games. Weather conditions favor high scoring.',
    },
  ];

  const markets: Market[] = [
    { id: 'm-1', name: 'Moneyline', category: 'Standard' },
    { id: 'm-2', name: 'Spread', category: 'Standard' },
    { id: 'm-3', name: 'Over/Under', category: 'Totals' },
    { id: 'm-4', name: 'First Half Moneyline', category: 'Halves' },
    { id: 'm-5', name: 'Player Props', category: 'Props' },
    { id: 'm-6', name: 'Team Totals', category: 'Totals' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('Standard');
  const [selectedMarket, setSelectedMarket] = useState<MarketDetail | null>(null);

  const categories = Array.from(new Set(markets.map((m) => m.category)));

  const filteredMarkets = markets.filter((m) => m.category === selectedCategory);

  const handleSelectMarket = (market: Market) => {
    setSelectedMarket({
      id: market.id,
      market: market.name,
      description: `Detailed odds and analysis for ${market.name}`,
      selections: ['Option 1', 'Option 2', 'Option 3'],
      explanation:
        'This market offers opportunities based on recent team performance, weather conditions, and historical matchup data. Our AI model indicates strong value in this selection.',
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f7f3]">
      {/* Header with Event Info */}
      <section className="bg-[#faf8f3] border-b border-[#e5dfd6] py-8 relative overflow-hidden">
        <div className="absolute top-4 right-20 deco-letter warm">V</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1a1815] hover:text-[#d4a574] transition-colors mb-6 font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-light text-[#3a3530] mb-2">{event.league}</p>
              <h1 className="text-3xl font-bold text-[#1a1815] mb-2">
                {event.homeTeam} vs {event.awayTeam}
              </h1>
              <p className="text-[#3a3530] font-light">
                {new Date(event.time).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right">
                <p className="text-sm text-[#3a3530] font-light mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {event.status === 'live' && <div className="live-dot" />}
                  <p className="text-lg font-bold text-[#1a1815] capitalize">{event.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - OraQL Picks */}
            <div>
              <h2 className="text-xl font-bold text-[#1a1815] mb-4">OraQL_ Picks</h2>
              <div className="space-y-4">
                {oraqlPicks.map((pick) => (
                  <PickCard key={pick.id} pick={pick} variant="light" />
                ))}
              </div>
            </div>

            {/* Right Column - All Markets */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-[#1a1815] mb-4">All Markets</h2>

              {/* Category Filters */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#1a1815] text-[#f9f7f3]'
                        : 'bg-white border-2 border-[#e5dfd6] text-[#1a1815] hover:border-[#d4a574]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Markets Grid */}
              {selectedMarket ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border-2 border-[#e5dfd6] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#1a1815]">{selectedMarket.market}</h3>
                      <button
                        onClick={() => setSelectedMarket(null)}
                        className="text-[#3a3530] hover:text-[#1a1815] transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-light text-[#3a3530] mb-2">Explanation</p>
                        <p className="text-[#1a1815] font-light">{selectedMarket.explanation}</p>
                      </div>

                      <div>
                        <p className="text-sm font-light text-[#3a3530] mb-3">Available Selections</p>
                        <div className="space-y-2">
                          {selectedMarket.selections.map((selection, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-[#f9f7f3] border border-[#e5dfd6] rounded-lg hover:border-[#d4a574] transition-colors cursor-pointer"
                            >
                              <span className="text-[#1a1815] font-medium">{selection}</span>
                              <button className="flex items-center gap-1 px-3 py-1 bg-[#d4a574] text-white rounded hover:bg-[#c99465] transition-colors text-sm font-medium">
                                <Plus size={14} />
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredMarkets.map((market) => (
                    <button
                      key={market.id}
                      onClick={() => handleSelectMarket(market)}
                      className="p-4 bg-white rounded-lg border-2 border-[#e5dfd6] hover:border-[#d4a574] transition-colors text-left"
                    >
                      <h4 className="font-bold text-[#1a1815] mb-1">{market.name}</h4>
                      <p className="text-sm text-[#3a3530] font-light">View odds and details</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
