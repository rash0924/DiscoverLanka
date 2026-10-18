import { DestinationCard } from './DestinationCard';
import { DestinationCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Destination } from '@/types';
import { Search } from 'lucide-react';

interface DestinationGridProps {
  destinations: Destination[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  columns?: 2 | 3 | 4;
}

export function DestinationGrid({
  destinations,
  isLoading,
  emptyMessage = 'No destinations found.',
  emptyDescription = 'Try another district, category or search term.',
  onClearFilters,
  columns = 3,
}: DestinationGridProps) {
  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${
          columns === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : columns === 3
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <DestinationCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <EmptyState
        icon={<Search size={24} className="text-gray-400" />}
        title={emptyMessage}
        description={emptyDescription}
        action={
          onClearFilters
            ? { label: 'Clear Filters', onClick: onClearFilters }
            : undefined
        }
      />
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        columns === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : columns === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }`}
    >
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
