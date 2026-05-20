'use client'

import { cn } from '@/lib/utils'

interface ProbabilityBadgeProps {
  probability: number
  size?: 'sm' | 'md' | 'lg'
  isValueBet?: boolean
}

export function getProbabilityTier(
  probability: number
): 'high' | 'mid' | 'low' {
  if (probability >= 65) return 'high'
  if (probability >= 45) return 'mid'
  return 'low'
}

export function formatProbability(probability: number): string {
  return `${Math.round(probability)}%`
}

export function ProbabilityBadge({
  probability,
  size = 'md',
  isValueBet = false,
}: ProbabilityBadgeProps) {
  const tier = getProbabilityTier(probability)

  const tierColors = {
    high: 'prob-high',
    mid: 'prob-mid',
    low: 'prob-low',
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-bold',
  }

  const baseClass = isValueBet ? 'prob-value' : tierColors[tier]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-mono',
        baseClass,
        sizeStyles[size]
      )}
    >
      {formatProbability(probability)}
    </span>
  )
}
