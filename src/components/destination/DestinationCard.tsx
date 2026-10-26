import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Heart, BookmarkPlus } from 'lucide-react';
import { cn, formatDistance } from '@/lib/utils';
import type { Destination } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { DestinationPhoto } from '@/components/destination/DestinationPhoto';
import toast from 'react-hot-toast';

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  compact?: boolean;
}

export function DestinationCard({ destination, className, compact }: DestinationCardProps) {
  const { isFavorite, addFavorite, removeFavorite, addToTrip, isInTrip } = useAppStore();
  const favorited = isFavorite(destination.id);
  const inTrip = isInTrip(destination.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(destination.id);
      toast.success(`Removed ${destination.name} from saved places`);
    } else {
      addFavorite(destination.id);
      toast.success(`${destination.name} saved to your places`);
    }
  };

  const handleAddToTrip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inTrip) {
      toast('This place is already in your trip');
      return;
    }
    addToTrip(destination);
    toast.success(`${destination.name} added to your trip`);
  };

  return (
    <Link
      to={`/destination/${destination.slug}`}
      className={cn(
        'group block bg-white rounded-3xl overflow-hidden border border-primary-100/80 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200',
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-t after:from-[#173a2a]/20 after:via-transparent after:to-transparent">
        <DestinationPhoto
          destination={destination}
          className={cn('transition-transform duration-700 group-hover:scale-105', compact ? 'h-40' : 'h-52')}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {destination.isHiddenGem && (
            <Badge variant="ghost" size="sm">
              💎 Hidden Gem
            </Badge>
          )}
          {destination.isTrending && (
            <Badge variant="ghost" size="sm">
              🔥 Trending
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={15}
              className={cn(
                'transition-colors',
                favorited ? 'fill-red-500 text-red-500' : 'text-gray-500'
              )}
            />
          </button>
          <button
            onClick={handleAddToTrip}
            aria-label={inTrip ? 'Already in trip' : 'Add to trip'}
            className={cn(
              'w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform',
              inTrip && 'bg-primary-500'
            )}
          >
            <BookmarkPlus
              size={15}
              className={inTrip ? 'text-white' : 'text-gray-500'}
            />
          </button>
        </div>

        {/* Verification badge */}
        {destination.verified && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="ghost" size="sm">
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-gradient-to-b from-white to-primary-50/45 p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
            {destination.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={11} className="text-ocean-600 shrink-0" />
          <span className="truncate">
            {destination.district}, {destination.province}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {destination.categories.slice(0, 2).map((cat) => (
            <Badge key={cat} variant="primary" size="sm">
              {cat}
            </Badge>
          ))}
        </div>

        {!compact && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {destination.shortDescription}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Rating rating={destination.rating} reviewCount={destination.reviewCount} size="sm" />
          {destination.distance !== undefined && (
            <span className="text-xs text-ocean-600 font-medium">
              {formatDistance(destination.distance)}
            </span>
          )}
          {destination.estimatedDuration && !destination.distance && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {destination.estimatedDuration}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
