import { useMemo } from 'react';
import type { SearchFilters, Destination } from '@/types';
import { DESTINATIONS } from '@/data/destinations';
import { calculateDistance } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

function isOpenInSriLanka(hours: Destination['openingHours'] | undefined): boolean {
  if (!hours) return false;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const weekday = parts.find((part) => part.type === 'weekday')?.value;
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday ?? '');
  const schedule = (dayIndex >= 0 ? hours[DAY_KEYS[dayIndex]] : undefined) ?? hours.notes;
  if (!schedule || !Number.isFinite(hour) || !Number.isFinite(minute)) return false;
  if (/24\s*hours|open\s*24|open\s+at\s+all\s+times/i.test(schedule)) return true;
  const matches = [...schedule.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|–|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/gi)];
  const toMinutes = (h: string, m?: string, meridiem?: string) => {
    let value = Number(h) % 12;
    if (meridiem?.toLowerCase() === 'pm') value += 12;
    return value * 60 + Number(m ?? 0);
  };
  const now = hour * 60 + minute;
  return matches.some((match) => {
    const start = toMinutes(match[1], match[2], match[3]);
    const end = toMinutes(match[4], match[5], match[6]);
    return end >= start ? now >= start && now <= end : now >= start || now <= end;
  });
}

export function useDestinations(filters?: SearchFilters) {
  const { userLocation } = useAppStore();

  const destinations = useMemo(() => {
    let results = [...DESTINATIONS];

    // Text search
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.categories.some((c) => c.toLowerCase().includes(q)) ||
          d.shortDescription.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    // District filter
    if (filters?.district) {
      results = results.filter(
        (d) => d.districtId === filters.district || d.district.toLowerCase() === filters.district?.toLowerCase()
      );
    }

    // Province filter
    if (filters?.province) {
      results = results.filter(
        (d) => d.province.toLowerCase() === filters.province?.toLowerCase()
      );
    }

    // Category filter
    if (filters?.categories && filters.categories.length > 0) {
      results = results.filter((d) =>
        filters.categories!.some((cat) => d.categories.includes(cat))
      );
    }

    // Rating filter
    if (filters?.rating) {
      results = results.filter((d) => d.rating >= filters.rating!);
    }

    if (filters?.familyFriendly) {
      results = results.filter((d) => d.categories.includes('Family Friendly'));
    }

    if (filters?.openNow) {
      results = results.filter((d) => isOpenInSriLanka(d.openingHours));
    }

    // Add distance if user location is available
    if (userLocation) {
      results = results.map((d) => ({
        ...d,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          d.coordinates.lat,
          d.coordinates.lng
        ),
      }));

      // Radius filter
      if (filters?.radius) {
        results = results.filter((d) => (d.distance ?? Infinity) <= filters.radius!);
      }
    }

    // Sort
    switch (filters?.sort) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'nearest':
        if (userLocation) {
          results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }
        break;
      case 'newest':
        results.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'popular':
      default:
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    // Pagination
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const start = (page - 1) * limit;

    return {
      data: results.slice(start, start + limit),
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
    };
  }, [filters, userLocation]);

  return destinations;
}

export function useNearbyDestinations(radiusKm: number = 25) {
  const { userLocation } = useAppStore();

  return useMemo(() => {
    if (!userLocation) return [];

    return DESTINATIONS.map((d) => ({
      ...d,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        d.coordinates.lat,
        d.coordinates.lng
      ),
    }))
      .filter((d) => d.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }, [userLocation, radiusKm]);
}
