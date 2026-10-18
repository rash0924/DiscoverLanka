import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg',
        className
      )}
      style={{ animation: 'shimmer 2s linear infinite' }}
    />
  );
}

export function DestinationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DistrictCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
