import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function Rating({ rating, reviewCount, size = 'md', showCount = true, className }: RatingProps) {
  const starSize = size === 'sm' ? 12 : size === 'md' ? 14 : 18;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={cn(
              star <= Math.round(rating)
                ? 'fill-accent-400 text-accent-400'
                : star - 0.5 <= rating
                ? 'fill-accent-200 text-accent-400'
                : 'fill-gray-200 text-gray-300'
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          'font-semibold text-gray-900',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}
      >
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span
          className={cn(
            'text-gray-500',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-sm'
          )}
        >
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
