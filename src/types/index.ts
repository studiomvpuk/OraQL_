// ─── OraQL_ Frontend Type Definitions ───
// Mirrors the backend Prisma models for type safety.

export type Sport = 'FOOTBALL' | 'BASKETBALL' | 'TENNIS' | 'CRICKET' | 'BASEBALL' | 'HOCKEY';

export type EventStatus =
  | 'SCHEDULED'
  | 'LINEUP_CONFIRMED'
  | 'LIVE'
  | 'HALF_TIME'
  | 'FINISHED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'SUSPENDED';

export type MarketCategory =
  | 'MATCH_RESULT'
  | 'GOALS'
  | 'CORNERS'
  | 'CARDS'
  | 'PLAYER'
  | 'HALFTIME'
  | 'HANDICAP'
  | 'SPECIAL';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  preferredSports: Sport[];
  timezone: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  league?: League;
}

export interface League {
  id: string;
  name: string;
  country?: string;
  logoUrl?: string;
  eventCount?: number;
  streakCount?: number;
}

export interface Event {
  id: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  sport: Sport;
  status: EventStatus;
  kickoffAt: string;
  venue?: string;
  round?: string;
  homeScore?: number;
  awayScore?: number;
  picks?: PickSummary[];
}

export interface BookmakerOdds {
  id: string;
  bookmaker: string;
  marketName: string;
  line?: number;
  odds: number;
  impliedProbability?: number;
  lastUpdatedAt: string;
}

export interface EventDetail extends Event {
  markets: Market[];
  picks: Pick[];
  lineups: Lineup[];
  matchStats: MatchStat[];
  bookmakerOdds: BookmakerOdds[];
}

export interface Market {
  id: string;
  category: MarketCategory;
  name: string;
  shortName?: string;
  line?: number;
  probability: number;
  confidence: number;
  impliedProbability?: number;
  valueGap?: number;
  isValueBet: boolean;
  explanation?: string;
  explanationFactors?: Record<string, unknown>;
  probabilityUpdatedAt: string;
}

export interface Pick {
  id: string;
  rank: number;
  probability: number;
  confidence: number;
  explanation?: string;
  market: Market;
  event?: Event;
}

export interface PickSummary {
  id: string;
  rank: number;
  probability: number;
  market: {
    name: string;
    shortName?: string;
    category: MarketCategory;
  };
}

export interface Lineup {
  id: string;
  teamId: string;
  team?: Team;
  formation?: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  entries: LineupEntry[];
}

export interface LineupEntry {
  id: string;
  player: {
    id: string;
    name: string;
    position?: string;
    number?: number;
    photoUrl?: string;
  };
  isStarter: boolean;
  position?: string;
}

export interface MatchStat {
  id: string;
  team: Team;
  goals: number;
  shotsTotal?: number;
  shotsOnTarget?: number;
  possession?: number;
  corners: number;
  yellowCards: number;
  redCards: number;
}

export interface BuilderSelection {
  id: string;
  market: Market & { event: Event };
  addedProbability: number;
  createdAt: string;
}

export interface BuilderState {
  selections: BuilderSelection[];
  count: number;
  combinedProbability: number;
}

export interface TeamFormEntry {
  id: string;
  opponent: { name: string; id: string };
  venue: 'H' | 'A';
  score: string;
  result: 'W' | 'D' | 'L';
  kickoffAt: string;
  league: string;
}

export interface TeamInjury {
  id: string;
  type: string;
  severity?: string;
  description?: string;
  startDate: string;
  expectedReturn?: string;
  player: {
    id: string;
    name: string;
    position?: string;
    number?: number;
    photoUrl?: string;
  };
}

export interface TeamContext {
  form: TeamFormEntry[];
  injuries: TeamInjury[];
}

export interface SportSummary {
  sport: Sport;
  eventCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Streak Types ───

export type VenueFilter = 'ALL' | 'HOME' | 'AWAY';
export type ValidationLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface Streak {
  id: string;
  teamId: string;
  team?: Team;
  marketName: string;
  line?: number;
  venueFilter: VenueFilter;
  windowSize: number;
  streakLength: number;
  hitRate: number;
  confidence: number;
  isActive: boolean;
  lastMatchDate?: string;
  streakMatches?: StreakMatch[];
}

export interface StreakMatch {
  id: string;
  matchDate: string;
  opponent?: string;
  venue?: string;
  result: boolean;
  statValue?: number;
}

export interface ScoredStreak extends Streak {
  /** Flat fields returned by scoreAndRankStreaks API */
  teamName: string;
  teamLogoUrl: string | null;
  leagueName: string | null;
  qualityScore: number;
  recencyScore: number;
  summary: string;
}

export interface StreakSuggestion {
  streakId: string;
  teamId: string;
  marketName: string;
  line?: number;
  confidence: number;
  /** May be absent — backend returns streakBoost, not probability */
  probability?: number;
  streakBoost?: number;
  summary: string;
  validationLevel?: ValidationLevel;
  validationSummary?: string;
  validationDetails?: {
    availableKeyPlayers: number;
    totalKeyPlayers: number;
    missingPlayers: string[];
  };
}

export interface TicketLeg {
  eventId: string;
  marketId: string | null;
  teamName: string;
  teamLogoUrl: string | null;
  leagueName: string;
  leagueCountry: string | null;
  opponent: string;
  kickoffAt: string;
  marketName: string;
  line: number | null;
  probability: number;
  confidence: number;
  streakId: string;
  streakSummary: string;
  validationLevel?: string;
}

export interface SuggestedTicket {
  id: string;
  legs: TicketLeg[];
  combinedProbability: number;
  averageConfidence: number;
  averageHitRate: number;
  diversityScore: number;
  qualityScore: number;
  summary: string;
}

export interface StreakStats {
  totalStreaks: number;
  activeStreaks: number;
  averageHitRate: number | null;
  averageStreakLength: number | null;
  averageConfidence: number | null;
}
