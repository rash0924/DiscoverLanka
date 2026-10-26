import { useState } from 'react';
import { Navigation, Compass, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useNearbyDestinations } from '@/hooks/useDestinations';
import { NEARBY_RADIUS_OPTIONS } from '@/lib/constants';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function NearbyPage() {
  const { userLocation } = useAppStore();
  const { requestLocation, isPermissionDenied } = useGeolocation();
  const [radius, setRadius] = useState<number>(50);

  const nearbyDestinations = useNearbyDestinations(radius);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-ocean-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Navigation size={16} /> Proximity Discovery
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Explore Near Me</h1>
          <p className="text-gray-500 mt-1">
            Find attractions, hidden viewpoints, and sights closest to your current location in Sri Lanka.
          </p>
        </div>

        {!userLocation ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-card border border-gray-100">
            <div className="w-16 h-16 bg-ocean-50 text-ocean-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Navigation size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Location Access Needed</h2>
            <p className="text-sm text-gray-500 mb-6">
              To discover places near you and calculate accurate road distances, please allow browser location access.
            </p>
            {isPermissionDenied ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Location access was disabled in your browser settings. Please enable location permissions for this site.
              </p>
            ) : (
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Navigation size={18} />}
                onClick={requestLocation}
              >
                Enable My Location
              </Button>
            )}
          </div>
        ) : (
          <div>
            {/* Radius Filter Pills */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-2">Within:</span>
              {NEARBY_RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRadius(opt.value)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                    radius === opt.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Found <strong className="text-gray-900">{nearbyDestinations.length}</strong> places within {radius} km of your location.
            </p>

            <DestinationGrid
              destinations={nearbyDestinations}
              emptyMessage={`No destinations found within ${radius} km.`}
              emptyDescription="Try expanding the search radius above to discover more places."
            />
          </div>
        )}
      </div>
    </div>
  );
}
