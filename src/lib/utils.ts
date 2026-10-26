import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Sri Lanka Rupees
 */
export function formatLKR(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/**
 * Format rating to display (e.g., 4.7)
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Generate star rating array
 */
export function getStarRating(rating: number): number[] {
  return [1, 2, 3, 4, 5];
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get Google Maps URL for a destination
 */
export function getGoogleMapsUrl(
  lat: number,
  lng: number,
  name?: string
): string {
  if (name) {
    return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},15z`;
  }
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Get Google Maps directions URL
 */
export function getGoogleMapsDirectionsUrl(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): string {
  return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
}

/**
 * Format entrance fee
 */
export function formatEntranceFee(fee?: {
  local?: number;
  foreign?: number;
  currency?: string;
  notes?: string;
}): string {
  if (!fee) return 'Free';
  if (!fee.local && !fee.foreign) return 'Free';
  const currency = fee.currency || 'LKR';
  const parts = [];
  if (fee.local !== undefined) parts.push(`Local: ${currency} ${fee.local}`);
  if (fee.foreign !== undefined) parts.push(`Foreign: ${currency} ${fee.foreign}`);
  return parts.join(' | ');
}

/**
 * Get province color class
 */
export const PROVINCE_COLORS: Record<string, string> = {
  Western: 'bg-primary-100 text-primary-800',
  Central: 'bg-ocean-100 text-ocean-800',
  Southern: 'bg-accent-100 text-accent-800',
  Northern: 'bg-accent-100 text-accent-800',
  Eastern: 'bg-ocean-100 text-ocean-800',
  'North Western': 'bg-primary-100 text-primary-800',
  'North Central': 'bg-ocean-100 text-ocean-800',
  Uva: 'bg-primary-100 text-primary-800',
  Sabaragamuwa: 'bg-ocean-100 text-ocean-800',
};
