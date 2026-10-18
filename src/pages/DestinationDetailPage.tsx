import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Calendar, ShieldCheck, Heart, BookmarkPlus,
  Share2, Navigation, AlertCircle, Compass, Star, ChevronRight,
  Info, ExternalLink, ArrowLeft, CheckCircle2
} from 'lucide-react';
import { getDestinationBySlug, DESTINATIONS } from '@/data/destinations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { useAppStore } from '@/store/useAppStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  formatEntranceFee,
  formatDistance,
  getGoogleMapsUrl,
  getGoogleMapsDirectionsUrl,
  calculateDistance,
  cn
} from '@/lib/utils';
import toast from 'react-hot-toast';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const destination = getDestinationBySlug(slug ?? '');

  const {
    isFavorite, addFavorite, removeFavorite,
    addToTrip, isInTrip, userLocation
  } = useAppStore();

  const { requestLocation, hasLocation } = useGeolocation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-6xl mb-4">📍</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Destination Not Found</h1>
          <p className="text-gray-500 mb-6">
            The destination you are looking for does not exist or has been removed.
          </p>
          <Link to="/explore">
            <Button variant="primary">Explore Destinations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(destination.id);
  const inTrip = isInTrip(destination.id);

  // Calculate distance if user location is available
  const userDist = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      )
    : null;

  // Nearby related destinations (same district or category)
  const nearbyPlaces = DESTINATIONS.filter(
    (d) =>
      d.id !== destination.id &&
      (d.districtId === destination.districtId ||
        d.categories.some((c) => destination.categories.includes(c)))
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${destination.name} - LankaExplore`,
          text: destination.shortDescription,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDirections = () => {
    if (!userLocation) {
      requestLocation();
      toast('Please allow location access to get direct routes, or check the route in Google Maps.', {
        icon: '📍',
      });
      const url = getGoogleMapsUrl(
        destination.coordinates.lat,
        destination.coordinates.lng,
        destination.name
      );
      window.open(url, '_blank');
      return;
    }

    const url = getGoogleMapsDirectionsUrl(
      userLocation.lat,
      userLocation.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <Link to="/districts" className="hover:text-primary-600 transition-colors">Districts</Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <Link to={`/district/${destination.districtId}`} className="hover:text-primary-600 transition-colors">
              {destination.district}
            </Link>
            <ChevronRight size={14} className="text-gray-300 shrink-0" />
            <span className="text-gray-900 font-medium truncate">{destination.name}</span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                to={`/district/${destination.districtId}`}
                className="text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
              >
                <MapPin size={12} /> {destination.district}, {destination.province} Province
              </Link>
              {destination.verified && (
                <Badge variant="success" size="sm" className="gap-1">
                  <ShieldCheck size={12} /> {destination.verificationStatus}
                </Badge>
              )}
              {destination.isHiddenGem && (
                <Badge variant="accent" size="sm">💎 Hidden Gem</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900">
              {destination.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <Rating rating={destination.rating} reviewCount={destination.reviewCount} size="md" />
              {userDist !== null && (
                <span className="text-sm font-medium text-ocean-600 flex items-center gap-1 bg-ocean-50 px-2.5 py-0.5 rounded-full">
                  <Navigation size={12} /> {formatDistance(userDist)} away from you
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={favorited ? 'danger' : 'outline'}
              size="md"
              leftIcon={<Heart size={16} className={favorited ? 'fill-current' : ''} />}
              onClick={() => {
                if (favorited) {
                  removeFavorite(destination.id);
                  toast.success('Removed from favorites');
                } else {
                  addFavorite(destination.id);
                  toast.success('Saved to favorites!');
                }
              }}
            >
              {favorited ? 'Saved' : 'Save'}
            </Button>

            <Button
              variant={inTrip ? 'secondary' : 'outline'}
              size="md"
              leftIcon={<BookmarkPlus size={16} />}
              onClick={() => {
                if (inTrip) {
                  navigate('/trips');
                } else {
                  addToTrip(destination);
                  toast.success('Added to your trip plan!');
                }
              }}
            >
              {inTrip ? 'View in Trip' : 'Add to Trip'}
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={<Share2 size={16} />}
              onClick={handleShare}
              aria-label="Share destination"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-10">
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-80 sm:h-[450px] lg:h-[500px] bg-gray-900">
            <img
              src={destination.images[activeImageIndex]?.url || destination.coverImage}
              alt={destination.images[activeImageIndex]?.caption || destination.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {destination.images[activeImageIndex]?.caption && (
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl">
                {destination.images[activeImageIndex]?.caption}
              </div>
            )}
          </div>

          {destination.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {destination.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    'relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                    activeImageIndex === idx ? 'border-primary-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Experience & Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {destination.categories.map((cat) => (
                  <Badge key={cat} variant="primary" size="md">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this Destination</h2>
              <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {/* Key Visit Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-ocean-50 text-ocean-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Estimated Visit Duration</h4>
                  <p className="text-base font-bold text-gray-800 mt-0.5">{destination.estimatedDuration || '1 - 2 hours'}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-accent-50 text-accent-600 rounded-xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Best Time to Visit</h4>
                  <p className="text-base font-bold text-gray-800 mt-0.5">{destination.bestTimeToVisit || 'Year-round'}</p>
                </div>
              </div>

              {destination.difficulty && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Difficulty Level</h4>
                    <p className="text-base font-bold text-gray-800 mt-0.5">{destination.difficulty}</p>
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Accessibility</h4>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{destination.accessibility || 'Standard visitor access'}</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            {destination.facilities && destination.facilities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Available Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {destination.facilities.map((fac) => (
                    <div key={fac} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-primary-500 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Highlights */}
            {nearbyPlaces.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nearby & Similar Spots</h3>
                  <Link
                    to={`/district/${destination.districtId}`}
                    className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                  >
                    More in {destination.district} <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {nearbyPlaces.map((np) => (
                    <Link
                      key={np.id}
                      to={`/destination/${np.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <img src={np.coverImage} alt={np.name} className="h-32 w-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-3">
                        <p className="font-semibold text-sm text-gray-900 truncate">{np.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{np.district}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Directions, Location, Fees */}
          <div className="space-y-6">
            {/* Directions Card */}
            <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Getting There</h3>
              <p className="text-xs text-gray-500 mb-5">
                {destination.address || `${destination.name}, ${destination.district}, Sri Lanka`}
              </p>

              {userDist !== null ? (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-primary-700 font-medium">Distance from you</span>
                    <span className="text-base font-bold text-primary-900">{formatDistance(userDist)}</span>
                  </div>
                  <p className="text-xs text-primary-600">
                    Est. drive: ~{Math.round(userDist / 45 * 60)} mins (traffic depending)
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">
                    Enable location to calculate accurate distance and driving route.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={requestLocation}
                  >
                    Enable Location
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<Navigation size={18} />}
                  onClick={handleDirections}
                >
                  Get Driving Directions
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  leftIcon={<ExternalLink size={18} />}
                  onClick={() => {
                    const url = getGoogleMapsUrl(
                      destination.coordinates.lat,
                      destination.coordinates.lng,
                      destination.name
                    );
                    window.open(url, '_blank');
                  }}
                >
                  Open in Google Maps
                </Button>

                <Link
                  to={`/map?dest=${destination.slug}&lat=${destination.coordinates.lat}&lng=${destination.coordinates.lng}`}
                  className="block"
                >
                  <Button variant="ghost" size="md" className="w-full text-xs text-gray-500">
                    View on Interactive App Map
                  </Button>
                </Link>
              </div>

              {/* Entrance fee & hours */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Entrance Fee</h4>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatEntranceFee(destination.entranceFee)}
                  </p>
                  {destination.entranceFee?.notes && (
                    <p className="text-xs text-gray-500 mt-0.5">{destination.entranceFee.notes}</p>
                  )}
                </div>

                {destination.openingHours && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Operating Hours</h4>
                    <p className="text-xs text-gray-700 mt-1">
                      {destination.openingHours.notes || 'Normal daytime access'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
