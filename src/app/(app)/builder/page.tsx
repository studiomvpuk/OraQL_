'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Trash2, Download } from 'lucide-react';
import { PickCard } from '@/components/PickCard';
import { useBuilderStore } from '@/store/builder';

interface BuilderPick {
  id: string;
  eventId: string;
  market: string;
  selection: string;
  probability: number;
  odds: number;
  reasoning: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
}

export default function BuilderPage() {
  const { selections, clearAll } = useBuilderStore();
  const [exporting, setExporting] = useState(false);

  // Mock selected picks for demonstration
  const [selectedPicks] = useState<BuilderPick[]>([
    {
      id: 'pick-1',
      eventId: 'event-1',
      market: 'Moneyline',
      selection: 'Kansas City Chiefs',
      probability: 0.72,
      odds: 1.65,
      reasoning: 'Strong offensive momentum with 3-game winning streak.',
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
      homeTeam: 'Buffalo Bills',
      awayTeam: 'Miami Dolphins',
      league: 'NFL',
      startTime: '2024-12-16T13:00:00Z',
    },
  ]);

  // Calculate combined probability (simplified parlay calculation)
  const combinedProbability = useMemo(() => {
    if (selectedPicks.length === 0) return 0;
    return selectedPicks.reduce((acc, pick) => acc * pick.probability, 1);
  }, [selectedPicks]);

  // Calculate combined odds (multiply all odds together)
  const combinedOdds = useMemo(() => {
    if (selectedPicks.length === 0) return 0;
    return selectedPicks.reduce((acc, pick) => acc * pick.odds, 1);
  }, [selectedPicks]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Simulate export
      const parlay = {
        selections: selectedPicks.map((p) => ({
          event: `${p.homeTeam} vs ${p.awayTeam}`,
          market: p.market,
          selection: p.selection,
          odds: p.odds,
        })),
        combinedOdds: combinedOdds.toFixed(2),
        combinedProbability: (combinedProbability * 100).toFixed(1),
        createdAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(parlay, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parlay-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-[#1a1815] text-[#f9f7f3] py-8 relative overflow-hidden">
        <div className="absolute top-4 right-20 deco-letter dark">B</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Parlay Builder</h1>
              <p className="text-[#b8b0a5] font-light">
                Build custom multi-leg bets with combined probability calculations
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#b8b0a5] font-light mb-2">Selections: {selectedPicks.length}</p>
              <p className="text-3xl font-mono font-bold text-[#d4a574]">
                {(combinedProbability * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={selectedPicks.length === 0 || exporting}
              className="flex items-center gap-2 px-6 py-2 bg-[#d4a574] text-[#1a1815] rounded-lg hover:bg-[#c99465] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              Export Parlay
            </button>
            <button
              onClick={clearAll}
              disabled={selectedPicks.length === 0}
              className="flex items-center gap-2 px-6 py-2 border-2 border-[#d4a574] text-[#d4a574] rounded-lg hover:bg-[#2a2520] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto px-6 py-8">
        {/* Left Column - Selection List */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border-2 border-[#e5dfd6] p-6">
            <h2 className="text-lg font-bold text-[#1a1815] mb-4">Selected Picks ({selectedPicks.length})</h2>

            {selectedPicks.length === 0 ? (
              <div className="py-12 text-center">
                <Sparkles className="w-12 h-12 text-[#d4a574] mx-auto mb-4 opacity-50" />
                <p className="text-[#3a3530] font-light mb-4">No picks selected yet</p>
                <a
                  href="/app/picks"
                  className="inline-block px-6 py-2 bg-[#1a1815] text-[#f9f7f3] rounded-lg hover:bg-[#2a2520] transition-colors font-medium"
                >
                  Browse Picks
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPicks.map((pick, index) => (
                  <div
                    key={pick.id}
                    className="flex items-start gap-4 p-4 bg-[#f9f7f3] rounded-lg border border-[#e5dfd6]"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-[#d4a574] text-[#1a1815] rounded font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#1a1815]">{pick.selection}</p>
                      <p className="text-sm text-[#3a3530] font-light">
                        {pick.homeTeam} vs {pick.awayTeam}
                      </p>
                      <p className="text-xs text-[#8a8077] mt-1">{pick.market}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-bold text-[#1a1815]">{pick.odds.toFixed(2)}</p>
                      <p className="text-sm font-medium text-[#d4a574]">{(pick.probability * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="col-span-1">
          <div className="space-y-4 sticky top-8">
            {/* Parlay Summary */}
            <div className="bg-white rounded-lg border-2 border-[#e5dfd6] p-6">
              <h3 className="text-lg font-bold text-[#1a1815] mb-4">Parlay Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#3a3530] text-sm font-light mb-1">Combined Odds</p>
                  <p className="text-3xl font-mono font-bold text-[#1a1815]">
                    {combinedOdds.toFixed(2)}
                  </p>
                </div>
                <div className="border-t border-[#e5dfd6] pt-4">
                  <p className="text-[#3a3530] text-sm font-light mb-1">Parlay Probability</p>
                  <p className="text-2xl font-bold text-oracle-gradient">
                    {(combinedProbability * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="border-t border-[#e5dfd6] pt-4">
                  <p className="text-[#3a3530] text-sm font-light mb-2">Potential Winnings</p>
                  <div className="space-y-2">
                    {[10, 50, 100].map((stake) => (
                      <div key={stake} className="flex items-center justify-between">
                        <span className="text-sm text-[#3a3530]">${stake} stake</span>
                        <span className="font-mono font-bold text-[#1a1815]">
                          ${(stake * combinedOdds).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Notice */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <p className="text-xs text-yellow-900 font-light">
                <span className="font-bold">Note:</span> These are AI-generated recommendations. Always do your own
                research and gamble responsibly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
