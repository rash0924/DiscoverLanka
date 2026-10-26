import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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
import { DestinationPhoto } from '@/components/destination/DestinationPhoto';

function MapViewportController({ destination }: { destination: Destination | null }) {
  const map = useMap();

  useEffect(() => {
    if (destination) {
      map.flyTo([destination.coordinates.lat, destination.coordinates.lng], 11, {
        duration: 0.8,
      });
    }
  }, [destination, map]);

  return null;
}

export function InteractiveMapPage() {
  const [searchParams] = useSearchParams();
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
    <div className="relative flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden bg-slate-100">
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

      {/* Real OpenStreetMap viewport with destination coordinates */}
      <div className="relative w-full h-full overflow-hidden">
        <MapContainer
          center={[SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng]}
          zoom={DEFAULT_MAP_ZOOM}
          minZoom={6}
          className="h-full w-full z-0"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapViewportController destination={selectedDestination} />

          {userLocation && (
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={9}
              pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2563eb', fillOpacity: 1 }}
            >
              <Tooltip permanent direction="top" offset={[0, -8]} className="font-semibold text-blue-700">
                You are here
              </Tooltip>
            </CircleMarker>
          )}

          {filteredDestinations.map((dest) => {
            const isSelected = selectedDestination?.id === dest.id;
            return (
              <CircleMarker
                key={dest.id}
                center={[dest.coordinates.lat, dest.coordinates.lng]}
                radius={isSelected ? 10 : 6}
                pathOptions={{
                  color: '#ffffff',
                  weight: isSelected ? 3 : 2,
                  fillColor: isSelected ? '#f7941d' : dest.isHiddenGem ? '#7c3aed' : '#1b6b3a',
                  fillOpacity: 1,
                }}
                eventHandlers={{ click: () => setSelectedDestination(dest) }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={0.96}>
                  <span className="font-semibold">{dest.name}</span>
                  <span className="block text-xs text-gray-500">{dest.district}</span>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
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
        <div className="absolute bottom-20 left-3 right-3 z-30 animate-slide-up sm:bottom-4 sm:left-auto sm:right-4 sm:w-96">
          <div className="max-h-[68dvh] overflow-y-auto rounded-3xl border border-gray-100 bg-white shadow-2xl">
            <div className="relative h-40">
              <DestinationPhoto destination={selectedDestination} className="h-full w-full" />
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
