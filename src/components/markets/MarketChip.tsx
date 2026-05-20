'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge'

interface MarketChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  marketName: string
  line: string | number
  probability: number
  isValueBet?: boolean
  isSelected?: boolean
  variant?: 'light' | 'dark'
}

export function MarketChip({
  marketName,
  line,
  probability,
  isValueBet = false,
  isSelected = false,
  variant = 'light',
  className,
  ...props
}: MarketChipProps) {
  const isDark = variant === 'dark'

  const barPercentage = Math.min(probability, 100)

  return (
    <button
      className={cn(
        'relative w-full px-4 py-3 rounded-lg transition-all overflow-hidden',
        isDark ? 'bg-dark-charcoal border border-dark-graphite' : 'bg-warm-white border border-warm-sand',
        isSelected && 'border-oracle-gold border-2',
        className
      )}
      {...props}
    >
      {/* Probability Bar Background */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 transition-all',
          isDark ? 'bg-oracle-gold/10' : 'bg-oracle-gold/5'
        )}
        style={{ width: `${barPercentage}%` }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex-1 text-left min-w-0">
          <div
            className={cn(
              'font-semibold text-sm truncate',
              isDark ? 'text-txt-inverse' : 'text-txt-primary'
            )}
          >
            {marketName}
          </div>
          <div
            className={cn(
              'text-xs font-mono',
              isDark ? 'text-txt-inverse-2' : 'text-txt-inverse-2'
            )}
          >
            {line}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-2">
          {isValueBet && (
            <span
              className={cn(
                'text-xs font-bold px-2 py-0.5 rounded',
                isDark
                  ? 'bg-oracle-gold/20 text-oracle-gold'
                  : 'bg-oracle-gold/10 text-oracle-gold-dark'
              )}
            >
              V
            </span>
          )}
          <ProbabilityBadge
            probability={probability}
            size="sm"
            isValueBet={isValueBet}
          />
        </div>
      </div>

      {/* Selected Highlight */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-2 border-oracle-gold pointer-events-none" />
      )}
    </button>
  )
}
