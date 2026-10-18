import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass, Navigation, MapPin, Layers, Filter, Search,
  X, ChevronRight, Heart, ExternalLink, Route as RouteIcon
} from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { DISTRICTS, PROVINCES } from '@/data/districts';
import { CATEGORIES } from '@/data/categories';
import { SRI_LANKA_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppStore } from '@/store/useAppStore';
import { formatDistance, calculateDistance, getGoogleMapsDirectionsUrl, cn } from '@/lib/utils';
import type { Destination, Category } from '@/types';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function InteractiveMapPage() {
  const [searchParams] = useSearchParams();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { userLocation, isFavorite, addFavorite, removeFavorite } = useAppStore();
  const { requestLocation, isPermissionDenied } = useGeolocation();

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoutePanel, setShowRoutePanel] = useState<boolean>(false);

  // Check URL params for direct destination focusing
  useEffect(() => {
    const destSlug = searchParams.get('dest');
    if (destSlug) {
      const match = DESTINATIONS.find((d) => d.slug === destSlug);
      if (match) setSelectedDestination(match);
    }
  }, [searchParams]);

  // Filtered markers
  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesCat =
      selectedCategory === 'All' ||
      d.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleGetRoute = (dest: Destination) => {
    setSelectedDestination(dest);
    setShowRoutePanel(true);
    if (!userLocation) {
      requestLocation();
    }
  };

  const distToSelected =
    userLocation && selectedDestination
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          selectedDestination.coordinates.lat,
          selectedDestination.coordinates.lng
        )
      : null;

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100">
      {/* Top Floating Bar: Search & Category Chips */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row gap-2 pointer-events-none">
        {/* Search */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-1.5 flex items-center gap-2 max-w-sm w-full">
          <Search size={18} className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search map markers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm outline-none bg-transparent py-1 text-gray-800"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Beaches', 'Waterfalls', 'Hiking & Trekking', 'Wildlife', 'Cultural & Historical', 'Temples', 'Hidden Gems'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all',
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-primary-200'
                    : 'bg-white/90 text-gray-700 hover:bg-white border border-gray-100'
                )}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Map Viewport (Interactive CSS Map Engine with dynamic markers) */}
      <div
        ref={mapContainerRef}
        className="relative w-full h-full bg-[#e5e3df] overflow-hidden flex items-center justify-center select-none"
      >
        {/* Stylized Sri Lanka Map Vector/Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#c8d6e5_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        {/* Center Canvas with Visual Island Representation */}
        <div className="relative w-[340px] h-[580px] sm:w-[460px] sm:h-[760px] max-h-[90%] transition-transform">
          {/* Island SVG Silhouette Outline */}
          <svg
            viewBox="0 0 100 160"
            className="w-full h-full drop-shadow-2xl fill-[#d9ebd4] stroke-[#9ec894] stroke-[1.5]"
          >
            <path d="M 45 8 C 50 12, 58 15, 62 25 C 65 35, 75 55, 78 75 C 80 95, 72 120, 65 140 C 58 155, 45 158, 38 150 C 30 140, 22 125, 20 105 C 18 85, 25 65, 30 45 C 34 30, 40 10, 45 8 Z" />
          </svg>

          {/* User Location Marker */}
          {userLocation && (
            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
              style={{
                // Approximate coordinate mapping to canvas
                left: `${((userLocation.lng - 79.5) / 2.5) * 100}%`,
                top: `${((9.8 - userLocation.lat) / 4.0) * 100}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75" />
                <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md z-10" />
              </div>
              <span className="text-[10px] font-bold bg-white/90 text-blue-800 px-1.5 py-0.5 rounded shadow mt-1">
                You are here
              </span>
            </div>
          )}

          {/* Destination Markers */}
          {filteredDestinations.map((dest) => {
            // Coordinate mapping to SVG viewbox range:
            // Lng: ~79.5 to 81.9 (delta ~2.4)
            // Lat: ~5.9 to 9.8 (delta ~3.9)
            const leftPercent = Math.max(10, Math.min(90, ((dest.coordinates.lng - 79.5) / 2.4) * 100));
            const topPercent = Math.max(10, Math.min(90, ((9.8 - dest.coordinates.lat) / 3.9) * 100));
            const isSelected = selectedDestination?.id === dest.id;

            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestination(dest)}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                }}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-full shadow-lg border-2 flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-accent-500 border-white ring-4 ring-accent-200 scale-125'
                      : dest.isHiddenGem
                      ? 'bg-purple-600 border-white'
                      : 'bg-primary-600 border-white text-white'
                  )}
                >
                  <MapPin size={isSelected ? 18 : 14} className="text-white fill-current" />
                </div>
                <div
                  className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity',
                    isSelected
                      ? 'bg-gray-900 text-white opacity-100 z-30'
                      : 'bg-white/90 text-gray-800 opacity-0 group-hover:opacity-100'
                  )}
                >
                  {dest.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Controls on Right */}
      <div className="absolute right-4 bottom-24 sm:bottom-8 z-20 flex flex-col gap-2">
        <button
          onClick={requestLocation}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all"
          title="Detect Current Location"
          aria-label="Detect Current Location"
        >
          <Navigation size={20} className={userLocation ? 'text-blue-600 fill-current' : ''} />
        </button>
      </div>

      {/* Destination Card / Preview Bottom Sheet */}
      {selectedDestination && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-40">
              <img
                src={selectedDestination.coverImage}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setSelectedDestination(null);
                  setShowRoutePanel(false);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Close card"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-3 flex gap-1">
                <Badge variant="ghost" size="sm">
                  {selectedDestination.district}
                </Badge>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{selectedDestination.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedDestination.categories.join(' • ')}</p>
                </div>
                <Rating rating={selectedDestination.rating} size="sm" showCount={false} />
              </div>

              {distToSelected !== null && (
                <div className="text-xs font-semibold text-ocean-600 mb-3 flex items-center gap-1">
                  <Navigation size={12} /> ~{formatDistance(distToSelected)} from your location
                </div>
              )}

              {/* Route Panel when toggled */}
              {showRoutePanel && (
                <div className="bg-primary-50 rounded-2xl p-3 mb-4 text-xs space-y-2 border border-primary-100 animate-fade-in">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>From: <strong>{userLocation ? 'Your Location' : 'Colombo (Default)'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    <span>To: <strong>{selectedDestination.name}</strong></span>
                  </div>
                  {distToSelected !== null && (
                    <div className="pt-2 border-t border-primary-200/50 flex justify-between font-medium text-primary-900">
                      <span>Driving Distance: ~{formatDistance(distToSelected)}</span>
                      <span>~{Math.round(distToSelected / 45 * 60)} mins</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 text-xs"
                  leftIcon={<RouteIcon size={14} />}
                  onClick={() => handleGetRoute(selectedDestination)}
                >
                  {showRoutePanel ? 'Recalculate Route' : 'Get Route'}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="text-xs"
                  leftIcon={<ExternalLink size={14} />}
                  onClick={() => {
                    const url = userLocation
                      ? getGoogleMapsDirectionsUrl(
                          userLocation.lat,
                          userLocation.lng,
                          selectedDestination.coordinates.lat,
                          selectedDestination.coordinates.lng
                        )
                      : `https://www.google.com/maps/search/?api=1&query=${selectedDestination.coordinates.lat},${selectedDestination.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  Navigate
                </Button>

                <Link to={`/destination/${selectedDestination.slug}`}>
                  <Button variant="ghost" size="md" className="text-xs">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
