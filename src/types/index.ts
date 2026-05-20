export enum Sport {
  FOOTBALL = 'FOOTBALL',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS',
  CRICKET = 'CRICKET',
  BASEBALL = 'BASEBALL',
  HOCKEY = 'HOCKEY',
}

export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export enum MarketCategory {
  MATCH_RESULT = 'MATCH_RESULT',
  GOALS = 'GOALS',
  CORNERS = 'CORNERS',
  CARDS = 'CARDS',
  PLAYER = 'PLAYER',
  HALFTIME = 'HALFTIME',
  HANDICAP = 'HANDICAP',
  SPECIAL = 'SPECIAL',
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  logo?: string;
  sport: Sport;
}

export interface League {
  id: string;
  name: string;
  code: string;
  sport: Sport;
  country?: string;
}

export interface Event {
  id: string;
  title: string;
  sport: Sport;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  kickoffTime: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventDetail extends Event {
  stats?: MatchStat[];
  lineups?: Lineup[];
}

export interface Market {
  id: string;
  eventId: string;
  category: MarketCategory;
  name: string;
  description?: string;
  picks: Pick[];
  createdAt: string;
  updatedAt: string;
}

export interface Pick {
  id: string;
  marketId: string;
  label: string;
  odds: number;
  probability: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickSummary {
  pickId: string;
  label: string;
  probability: number;
  odds: number;
  eventId: string;
  eventTitle: string;
  category: MarketCategory;
  kickoffTime: string;
}

export interface Lineup {
  id: string;
  eventId: string;
  teamId: string;
  formation: string;
  players: LineupEntry[];
  updatedAt: string;
}

export interface LineupEntry {
  id: string;
  playerId: string;
  playerName: string;
  position: string;
  number: number;
  captain?: boolean;
}

export interface MatchStat {
  id: string;
  eventId: string;
  teamId: string;
  stat: string;
  value: number;
}

export interface BuilderSelection {
  pickId: string;
  label: string;
  probability: number;
  odds: number;
  eventId: string;
  eventTitle: string;
  category: MarketCategory;
  kickoffTime: string;
}

export interface BuilderState {
  selections: BuilderSelection[];
  count: number;
  combinedProbability: number;
  combinedOdds: number;
}

export interface SportSummary {
  sport: Sport;
  eventCount: number;
  marketCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
