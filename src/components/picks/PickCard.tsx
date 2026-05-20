'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/builderStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge'
import { ChevronDown } from 'lucide-react'

interface PickCardProps {
  id: string
  rank: number
  marketName: string
  category: string
  probability: number
  isValueBet?: boolean
  explanation?: string
  variant?: 'light' | 'dark'
  featured?: boolean
}

export function PickCard({
  id,
  rank,
  marketName,
  category,
  probability,
  isValueBet = false,
  explanation,
  variant = 'light',
  featured = false,
}: PickCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { addSelection } = useBuilderStore()

  const handleAddToBuilder = () => {
    addSelection({
      id,
      marketName,
      category,
      probability,
      isValueBet,
    })
  }

  const isDark = variant === 'dark'
  const isRankOne = rank === 1

  const containerClass = cn(
    'rounded-lg p-5 transition-all',
    isDark ? 'bg-dark-charcoal' : 'bg-warm-white',
    isRankOne && !isDark && 'border-2 border-oracle-gold shadow-glow',
    !isRankOne && isDark && 'border border-dark-graphite',
    !isRankOne && !isDark && 'border border-warm-sand',
    featured && !isDark && 'overflow-hidden'
  )

  const gradientStyle = featured
    ? {
        backgroundImage:
          'linear-gradient(135deg, rgba(255, 214, 0, 0.05) 0%, rgba(255, 214, 0, 0.02) 100%)',
      }
    : {}

  return (
    <div className={containerClass} style={gradientStyle}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <span
            className={cn(
              'text-3xl font-bold',
              isRankOne && !isDark ? 'text-oracle-gold' : 'text-txt-primary'
            )}
          >
            {rank}
          </span>
          <div>
            <h3
              className={cn(
                'font-bold text-lg',
                isDark ? 'text-txt-inverse' : 'text-txt-primary'
              )}
            >
              {marketName}
            </h3>
            <p
              className={cn(
                'text-xs font-medium uppercase tracking-wide',
                isDark ? 'text-txt-inverse-2' : 'text-txt-inverse-2'
              )}
            >
              {category}
            </p>
          </div>
        </div>
        <ProbabilityBadge
          probability={probability}
          size="md"
          isValueBet={isValueBet}
        />
      </div>

      {/* Value Bet Indicator */}
      {isValueBet && (
        <div className="mb-3 inline-block px-2 py-1 bg-oracle-gold/10 rounded text-xs font-semibold text-oracle-gold-dark">
          Value Bet
        </div>
      )}

      {/* Explanation Toggle */}
      {explanation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg mb-4 transition-colors',
            isDark
              ? 'hover:bg-dark-graphite text-txt-inverse'
              : 'hover:bg-warm-white/50 text-txt-primary'
          )}
        >
          <span className="text-sm font-medium">Why this pick?</span>
          <ChevronDown
            className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
          />
        </button>
      )}

      {/* Expanded Explanation */}
      {isExpanded && explanation && (
        <div
          className={cn(
            'mb-4 p-3 rounded-lg text-sm leading-relaxed',
            isDark
              ? 'bg-dark-graphite text-txt-inverse-2'
              : 'bg-warm-white/50 text-txt-inverse-2'
          )}
        >
          {explanation}
        </div>
      )}

      {/* Add to Builder Button */}
      <Button
        variant="gold"
        size="sm"
        onClick={handleAddToBuilder}
        className="w-full"
      >
        Add to Builder
      </Button>
    </div>
  )
}
