import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatProbability(prob: number): string { return `${(prob * 100).toFixed(1)}%`; }
export function getProbabilityTier(prob: number): 'high' | 'mid' | 'low' {
  if (prob >= 0.75) return 'high';
  if (prob >= 0.50) return 'mid';
  return 'low';
}
export function formatKickoff(isoDate: string): string {
  const date = new Date(isoDate);
  if (isToday(date)) return `Today, ${format(date, 'HH:mm')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'HH:mm')}`;
  return format(date, 'EEE d MMM, HH:mm');
}
export function formatKickoffRelative(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
}
export function getSportLabel(sport: string): string {
  const labels: Record<string, string> = { FOOTBALL: 'Football', BASKETBALL: 'Basketball', TENNIS: 'Tennis', CRICKET: 'Cricket', BASEBALL: 'Baseball', HOCKEY: 'Hockey' };
  return labels[sport] || sport;
}
export function getSportIcon(sport: string): string {
  const icons: Record<string, string> = { FOOTBALL: 'circle-dot', BASKETBALL: 'circle', TENNIS: 'circle-dot' };
  return icons[sport] || 'trophy';
}
export function formatCategory(category: string): string {
  const labels: Record<string, string> = { MATCH_RESULT: 'Match Result', GOALS: 'Goals', CORNERS: 'Corners', CARDS: 'Cards', PLAYER: 'Player Props', HALFTIME: 'Half Time', HANDICAP: 'Handicap', SPECIAL: 'Specials' };
  return labels[category] || category;
}
