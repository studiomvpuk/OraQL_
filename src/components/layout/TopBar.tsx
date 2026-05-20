'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  activeSport: 'football' | 'basketball' | 'tennis'
  onSportChange: (sport: 'football' | 'basketball' | 'tennis') => void
  sportCounts?: {
    football: number
    basketball: number
    tennis: number
  }
}

export function TopBar({ activeSport, onSportChange, sportCounts }: TopBarProps) {
  const sports = [
    { id: 'football' as const, label: 'Football⚽' },
    { id: 'basketball' as const, label: 'Basketball🏀' },
    { id: 'tennis' as const, label: 'Tennis🎾' },
  ]

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-warm-white/80 backdrop-blur-md border-b border-warm-sand">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Sport Toggle Pills */}
        <div className="flex items-center gap-2">
          {sports.map((sport) => {
            const isActive = activeSport === sport.id
            const count = sportCounts?.[sport.id] || 0

            return (
              <button
                key={sport.id}
                onClick={() => onSportChange(sport.id)}
                className={cn(
                  'px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2',
                  isActive
                    ? 'bg-warm-white text-txt-primary shadow-soft'
                    : 'text-txt-inverse-2 hover:bg-warm-white/50'
                )}
              >
                <span>{sport.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-1 rounded-full',
                      isActive
                        ? 'bg-oracle-gold/15 text-oracle-gold-dark'
                        : 'bg-gray-200/50 text-gray-600'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Date Display */}
        <div className="text-sm font-medium text-txt-inverse-2">{currentDate}</div>
      </div>
    </header>
  )
}
