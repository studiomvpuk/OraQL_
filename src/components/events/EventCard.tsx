'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProbabilityBadge } from '@/components/ui/ProbabilityBadge'

interface EventCardProps {
  id: string
  leagueName: string
  homeTeam: string
  awayTeam: string
  kickoffTime: string
  isLive?: boolean
  score?: {
    home: number
    away: number
  }
  topPick?: {
    probability: number
    isValueBet?: boolean
  }
}

export function formatKickoff(kickoffTime: string): string {
  const date = new Date(kickoffTime)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function EventCard({
  id,
  leagueName,
  homeTeam,
  awayTeam,
  kickoffTime,
  isLive = false,
  score,
  topPick,
}: EventCardProps) {
  return (
    <Link href={`/events/${id}`}>
      <div className="relative bg-warm-white border border-warm-sand rounded-lg p-4 hover:border-oracle-gold transition-colors cursor-pointer overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-oracle-gold before:opacity-0 hover:before:opacity-100 before:transition-opacity">
        {/* League and Live Indicator */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-txt-inverse-2 uppercase tracking-wide">
            {leagueName}
          </span>
          {isLive && (
            <div className="flex items-center gap-1.5">
              <span className="live-dot w-2 h-2 bg-danger rounded-full animate-pulse" />
              <span className="text-xs font-bold text-danger">LIVE</span>
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-txt-primary">{homeTeam}</span>
            {score && <span className="font-bold text-lg">{score.home}</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-txt-primary">{awayTeam}</span>
            {score && <span className="font-bold text-lg">{score.away}</span>}
          </div>
        </div>

        {/* Kickoff Time or Score */}
        <div className="text-sm text-txt-inverse-2 mb-4">
          {isLive ? 'In Progress' : formatKickoff(kickoffTime)}
        </div>

        {/* Top Pick Badge */}
        {topPick && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-oracle-gold-dark">Top Pick</span>
            <ProbabilityBadge
              probability={topPick.probability}
              size="sm"
              isValueBet={topPick.isValueBet}
            />
          </div>
        )}
      </div>
    </Link>
  )
}
