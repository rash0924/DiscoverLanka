import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Luggage, Trash2, Calendar, MapPin, Share2, Plus,
  ArrowRight, Navigation, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistance, calculateDistance, getGoogleMapsDirectionsUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

export function TripsPage() {
  const navigate = useNavigate();
  const { activeTripDestinations, removeFromTrip, clearTrip, userLocation } = useAppStore();
  const [tripName, setTripName] = useState('My Sri Lanka Adventure');

  // Compute multi-stop route distances
  let totalDistanceKm = 0;
  for (let i = 0; i < activeTripDestinations.length - 1; i++) {
    const a = activeTripDestinations[i].coordinates;
    const b = activeTripDestinations[i + 1].coordinates;
    totalDistanceKm += calculateDistance(a.lat, a.lng, b.lat, b.lng);
  }

  const handleShareTrip = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: tripName,
        text: `Check out my Sri Lanka trip itinerary with ${activeTripDestinations.length} destinations!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Trip itinerary link copied to clipboard!');
    }
  };

  const handleOpenGoogleMapsRoute = () => {
    if (activeTripDestinations.length === 0) return;
    if (activeTripDestinations.length === 1) {
      const dest = activeTripDestinations[0];
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}`;
      window.open(url, '_blank');
      return;
    }

    const origin = `${activeTripDestinations[0].coordinates.lat},${activeTripDestinations[0].coordinates.lng}`;
    const destination = `${activeTripDestinations[activeTripDestinations.length - 1].coordinates.lat},${activeTripDestinations[activeTripDestinations.length - 1].coordinates.lng}`;
    const waypoints = activeTripDestinations
      .slice(1, -1)
      .map((d) => `${d.coordinates.lat},${d.coordinates.lng}`)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
    }&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Luggage size={16} /> Trip Planner & Route Builder
            </div>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="text-2xl sm:text-3xl font-display font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none pb-1"
            />
            <p className="text-gray-500 text-sm mt-1">
              Organize destinations, calculate route distances, and export to Google Maps navigation.
            </p>
          </div>

          {activeTripDestinations.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={14} />}
                onClick={handleShareTrip}
              >
                Share
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => {
                  if (confirm('Are you sure you want to clear your current trip?')) {
                    clearTrip();
                    toast.success('Trip cleared');
                  }
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {activeTripDestinations.length === 0 ? (
          <EmptyState
            icon={<Luggage size={32} className="text-gray-400" />}
            title="Your Trip is Empty"
            description="Explore Sri Lanka's destinations across 25 districts and click 'Add to Trip' to build your custom itinerary."
            action={{
              label: 'Explore Destinations',
              onClick: () => navigate('/explore'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary List */}
            <div className="lg:col-span-2 space-y-4">
              {activeTripDestinations.map((dest, index) => {
                const nextDest = activeTripDestinations[index + 1];
                const legDistance = nextDest
                  ? calculateDistance(
                      dest.coordinates.lat,
                      dest.coordinates.lng,
                      nextDest.coordinates.lat,
                      nextDest.coordinates.lng
                    )
                  : null;

                return (
                  <div key={dest.id} className="relative">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-card border border-gray-100 flex items-center gap-4">
                      {/* Step Number */}
                      <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>

                      <img
                        src={dest.coverImage}
                        alt={dest.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/destination/${dest.slug}`}
                          className="font-bold text-gray-900 text-base hover:text-primary-600 transition-colors truncate block"
                        >
                          {dest.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {dest.district}, {dest.province} Province
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                            {dest.categories[0]}
                          </span>
                          {dest.estimatedDuration && (
                            <span className="text-xs text-gray-400">
                              ~{dest.estimatedDuration}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          removeFromTrip(dest.id);
                          toast.success(`Removed ${dest.name}`);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${dest.name} from trip`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Connecting Route Leg */}
                    {legDistance !== null && (
                      <div className="pl-8 py-2 flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <div className="w-0.5 h-6 bg-gray-200 ml-0.5" />
                        <span className="bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm text-gray-600">
                          🚘 ~{formatDistance(legDistance)} (~{Math.round((legDistance / 45) * 60)} mins)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2">
                <Link to="/explore">
                  <Button variant="outline" className="w-full border-dashed" leftIcon={<Plus size={16} />}>
                    Add More Destinations
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trip Summary Card */}
            <div>
              <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 sticky top-24 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Trip Overview</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">Total Destinations</span>
                    <span className="font-bold text-gray-900">{activeTripDestinations.length}</span>
                  </div>

                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">Est. Total Driving Distance</span>
                    <span className="font-bold text-gray-900">~{formatDistance(totalDistanceKm)}</span>
                  </div>

                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">Est. Driving Time</span>
                    <span className="font-bold text-gray-900">
                      ~{Math.floor((totalDistanceKm / 45))} hrs {Math.round((totalDistanceKm / 45) % 1 * 60)} mins
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<Navigation size={18} />}
                    onClick={handleOpenGoogleMapsRoute}
                  >
                    Open Multi-Stop Route
                  </Button>

                  <Link to="/map" className="block">
                    <Button variant="outline" size="md" className="w-full text-xs">
                      View Itinerary on App Map
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
