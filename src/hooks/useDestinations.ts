import { useMemo } from 'react';
import type { SearchFilters, Destination } from '@/types';
import { DESTINATIONS } from '@/data/destinations';
import { calculateDistance } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

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
