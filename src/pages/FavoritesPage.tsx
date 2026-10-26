import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { DESTINATIONS } from '@/data/destinations';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useAppStore();

  const favoriteDestinations = DESTINATIONS.filter((d) => favorites.includes(d.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-red-500 font-semibold text-xs tracking-wider uppercase mb-1">
            <Heart size={16} className="fill-current" /> Saved Places
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Your Favorite Places</h1>
          <p className="text-gray-500 mt-1">
            Keep track of all the places you'd love to visit across Sri Lanka.
          </p>
        </div>

        {favoriteDestinations.length === 0 ? (
          <EmptyState
            icon={<Heart size={32} className="text-gray-400" />}
            title="No Favorites Saved Yet"
            description="Browse destinations and tap the heart icon on any card to save it to your personal favorites collection."
            action={{
              label: 'Discover Places',
              onClick: () => navigate('/explore'),
            }}
          />
        ) : (
          <DestinationGrid destinations={favoriteDestinations} />
        )}
      </div>
    </div>
  );
}
