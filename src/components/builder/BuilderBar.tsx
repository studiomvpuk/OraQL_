'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ChevronUp, Copy, Trash2 } from 'lucide-react'

export function BuilderBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { selections, clearSelections, calculateCombinedProbability } =
    useBuilderStore()

  if (selections.length === 0) {
    return null
  }

  const combinedProbability = calculateCombinedProbability()

  const handleExportToClipboard = () => {
    const exportText = selections
      .map((s) => `${s.marketName} - ${s.probability}%`)
      .join('\n')

    navigator.clipboard.writeText(exportText)
  }

  const handleClear = () => {
    clearSelections()
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-ink border-t border-dark-graphite">
      {/* Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full px-6 py-4 flex items-center justify-between transition-all',
          isExpanded ? 'border-b border-dark-graphite' : ''
        )}
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold text-txt-inverse-2 uppercase">
              Builder
            </p>
            <p className="text-lg font-bold text-oracle-gold">
              {selections.length} Selection{selections.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-center px-4 py-2 bg-oracle-gold/15 rounded-lg">
            <p className="text-xs font-semibold text-txt-inverse-2">Combined</p>
            <p className="text-xl font-bold text-oracle-gold">
              {Math.round(combinedProbability)}%
            </p>
          </div>
        </div>
        <ChevronUp
          className={cn(
            'w-5 h-5 text-txt-inverse-2 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-dark-charcoal border-t border-dark-graphite max-h-96 overflow-y-auto">
          {/* Selections List */}
          <div className="p-6 space-y-3">
            {selections.map((selection) => (
              <div
                key={selection.id}
                className="flex items-center justify-between px-4 py-3 bg-dark-ink rounded-lg border border-dark-graphite"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-txt-inverse truncate">
                    {selection.marketName}
                  </p>
                  <p className="text-xs text-txt-inverse-2">{selection.category}</p>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-mono font-bold text-oracle-gold">
                    {selection.probability}%
                  </p>
                  {selection.isValueBet && (
                    <p className="text-xs text-oracle-gold font-semibold">
                      Value Bet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-dark-graphite p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-txt-inverse-2 font-medium">
                Combined Probability
              </span>
              <span className="text-2xl font-bold text-oracle-gold">
                {Math.round(combinedProbability)}%
              </span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleExportToClipboard}
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleClear}
                className="flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
