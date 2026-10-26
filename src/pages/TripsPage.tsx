import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Luggage, Trash2, Share2, Plus, Navigation
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { DestinationPhoto } from '@/components/destination/DestinationPhoto';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistance, calculateDistance, getGoogleMapsDirectionsUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth';
import { isSupabaseDataConfigured, supabaseData } from '@/lib/supabaseData';
import { DESTINATIONS } from '@/data/destinations';

interface SavedTripRow { id: string; name: string; share_token: string; updated_at: string }

export function TripsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { activeTripDestinations, removeFromTrip, clearTrip, tripDayAssignments, setTripDay } = useAppStore();
  const [tripName, setTripName] = useState('My Sri Lanka Adventure');
  const [sharedDestinations, setSharedDestinations] = useState<typeof activeTripDestinations | null>(null);
  const [shareToken, setShareToken] = useState(searchParams.get('share') ?? '');
  const [sharing, setSharing] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTripRow[]>([]);
  const [sharedDayAssignments, setSharedDayAssignments] = useState<Record<string, number>>({});
  const tripDestinations = sharedDestinations ?? activeTripDestinations;
  const isReadOnlyShare = sharedDestinations !== null;

  useEffect(() => {
    if (user && isSupabaseDataConfigured) {
      void supabaseData<SavedTripRow[]>('trips', { query: `user_id=eq.${user.id}&select=id,name,share_token,updated_at&order=updated_at.desc` })
        .then(setSavedTrips).catch(() => setSavedTrips([]));
    }
    const token = searchParams.get('share');
    if (!token || !isSupabaseDataConfigured) return;
    type SharedTrip = { name: string; share_token: string; trip_destinations: { destination_id: string; position: number; day_number: number }[] };
    void supabaseData<SharedTrip[]>('trips', {
      query: `share_token=eq.${encodeURIComponent(token)}&is_public=eq.true&select=name,share_token,trip_destinations(destination_id,position,day_number)&limit=1`,
    }).then((rows) => {
      const trip = rows[0];
      if (!trip) { toast.error('This shared itinerary was not found.'); return; }
      setTripName(trip.name);
      setShareToken(trip.share_token);
      const places = [...trip.trip_destinations].sort((a, b) => a.position - b.position)
        .map((entry) => DESTINATIONS.find((destination) => destination.id === entry.destination_id))
        .filter((destination): destination is NonNullable<typeof destination> => Boolean(destination));
      setSharedDayAssignments(Object.fromEntries(trip.trip_destinations.map((entry) => [entry.destination_id, entry.day_number || 1])));
      setSharedDestinations(places);
    }).catch((error) => toast.error(error instanceof Error ? error.message : 'Could not load shared itinerary.'));
  }, [searchParams, user]);

  const getTripDay = (destinationId: string) => isReadOnlyShare
    ? sharedDayAssignments[destinationId] ?? 1
    : tripDayAssignments[destinationId] ?? 1;

  const createShareLink = async () => {
    if (isReadOnlyShare && shareToken) {
      await navigator.clipboard.writeText(`${window.location.origin}/trips?share=${encodeURIComponent(shareToken)}`);
      toast.success('Itinerary link copied!');
      return;
    }
    if (!user) { toast.error('Sign in to create a shareable itinerary.'); navigate('/login'); return; }
    if (!isSupabaseDataConfigured) { toast.error('Configure Supabase and apply migration 002 to enable share links.'); return; }
    if (!activeTripDestinations.length) return;
    setSharing(true);
    try {
      const saved = shareToken ? await supabaseData<{ id: string; share_token: string }[]>('trips', {
        query: `share_token=eq.${encodeURIComponent(shareToken)}&user_id=eq.${user.id}&select=id,share_token&limit=1`,
      }) : [];
      let token = saved[0]?.share_token;
      let tripId = saved[0]?.id;
      if (!token) {
        const rows = await supabaseData<{ id: string; share_token: string }[]>('trips', {
          method: 'POST', query: 'select=id,share_token', prefer: 'return=representation',
          body: { user_id: user.id, name: tripName.trim() || 'My Sri Lanka Adventure', is_public: true },
        });
        const trip = rows[0];
        if (!trip) throw new Error('Trip could not be saved.');
        token = trip.share_token;
        tripId = trip.id;
      }
      if (tripId) {
        if (saved[0]) await supabaseData('trips', { method: 'PATCH', query: `id=eq.${tripId}`, prefer: 'return=minimal', body: { name: tripName.trim() || 'My Sri Lanka Adventure' } });
        await supabaseData('trip_destinations', { method: 'DELETE', query: `trip_id=eq.${tripId}` });
        await supabaseData('trip_destinations', {
          method: 'POST', prefer: 'return=minimal',
          body: activeTripDestinations.map((destination, position) => ({ trip_id: tripId, destination_id: destination.id, position, day_number: tripDayAssignments[destination.id] ?? 1 })),
        });
      }
      setShareToken(token);
      setSearchParams({ share: token });
      const refreshedTrips = await supabaseData<SavedTripRow[]>('trips', { query: `user_id=eq.${user.id}&select=id,name,share_token,updated_at&order=updated_at.desc` });
      setSavedTrips(refreshedTrips);
      await navigator.clipboard.writeText(`${window.location.origin}/trips?share=${encodeURIComponent(token)}`);
      toast.success('Shareable itinerary link copied!');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not create share link.'); }
    finally { setSharing(false); }
  };

  // Compute multi-stop route distances
  let totalDistanceKm = 0;
  for (let i = 0; i < tripDestinations.length - 1; i++) {
    const a = tripDestinations[i].coordinates;
    const b = tripDestinations[i + 1].coordinates;
    if (getTripDay(tripDestinations[i].id) === getTripDay(tripDestinations[i + 1].id)) {
      totalDistanceKm += calculateDistance(a.lat, a.lng, b.lat, b.lng);
    }
  }

  const handleOpenGoogleMapsRoute = () => {
    if (tripDestinations.length === 0) return;
    if (tripDestinations.length === 1) {
      const dest = tripDestinations[0];
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}`;
      window.open(url, '_blank');
      return;
    }

    const origin = `${tripDestinations[0].coordinates.lat},${tripDestinations[0].coordinates.lng}`;
    const destination = `${tripDestinations[tripDestinations.length - 1].coordinates.lat},${tripDestinations[tripDestinations.length - 1].coordinates.lng}`;
    const waypoints = tripDestinations
      .slice(1, -1)
      .map((d) => `${d.coordinates.lat},${d.coordinates.lng}`)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
    }&travelmode=driving`;
    window.open(url, '_blank');
    toast.success('Opening your multi-stop route in Google Maps');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
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
              readOnly={isReadOnlyShare}
              className="text-2xl sm:text-3xl font-display font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 outline-none pb-1"
            />
            <p className="text-gray-500 text-sm mt-1">
              Organize destinations, calculate route distances, and export to Google Maps navigation.
            </p>
          </div>

          {tripDestinations.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={14} />}
                onClick={() => void createShareLink()}
                isLoading={sharing}
              >
                {shareToken ? 'Copy itinerary link' : 'Create share link'}
              </Button>
              {!isReadOnlyShare && <Button
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
                {isReadOnlyShare ? 'Shared itinerary' : 'Clear'}
              </Button>}
            </div>
          )}
        </div>

        {user && isSupabaseDataConfigured && !isReadOnlyShare && <section className="mb-7 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-gray-900">Your saved itineraries</h2><span className="text-xs text-gray-500">Synced with your account</span></div>
          {savedTrips.length ? <div className="flex gap-2 overflow-x-auto pb-1">{savedTrips.map((trip) => <button key={trip.id} onClick={() => { setSharedDestinations(null); setShareToken(trip.share_token); setSearchParams({ share: trip.share_token }); }} className="min-w-48 rounded-xl border border-gray-100 bg-sand-50 px-4 py-3 text-left transition hover:border-primary-200 hover:bg-primary-50"><span className="block truncate text-sm font-semibold text-gray-900">{trip.name}</span><span className="mt-1 block text-xs text-gray-500">Updated {new Date(trip.updated_at).toLocaleDateString()}</span></button>)}</div> : <p className="text-sm text-gray-500">Create a share link to save your first itinerary to your account.</p>}
        </section>}

        {tripDestinations.length === 0 ? (
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
              {tripDestinations.map((dest, index) => {
                const nextDest = tripDestinations[index + 1];
                const legDistance = nextDest && getTripDay(dest.id) === getTripDay(nextDest.id)
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

                      <DestinationPhoto destination={dest} className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />

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
                        <label className="mt-2 flex items-center gap-2 text-xs font-medium text-primary-800">Day {isReadOnlyShare && <span className="rounded-md bg-primary-50 px-2 py-1">{getTripDay(dest.id)}</span>}
                          {!isReadOnlyShare && <select value={getTripDay(dest.id)} onChange={(event) => setTripDay(dest.id, Number(event.target.value))} className="rounded-lg border border-primary-100 bg-primary-50 px-2 py-1 text-xs">{Array.from({ length: 10 }, (_, day) => <option key={day + 1} value={day + 1}>{day + 1}</option>)}</select>}
                        </label>
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

                      {!isReadOnlyShare && <button
                        onClick={() => {
                          removeFromTrip(dest.id);
                          toast.success(`Removed ${dest.name}`);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${dest.name} from trip`}
                      >
                        <Trash2 size={16} />
                      </button>}
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

              {!isReadOnlyShare && <div className="pt-2">
                <Link to="/explore">
                  <Button variant="outline" className="w-full border-dashed" leftIcon={<Plus size={16} />}>
                    Add More Destinations
                  </Button>
                </Link>
              </div>}
            </div>

            {/* Trip Summary Card */}
            <div>
              <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-100 sticky top-24 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Trip Overview</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">Total Destinations</span>
                    <span className="font-bold text-gray-900">{tripDestinations.length}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-gray-500">Planned days</span>
                    <span className="font-bold text-gray-900">{new Set(tripDestinations.map((destination) => getTripDay(destination.id))).size}</span>
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
