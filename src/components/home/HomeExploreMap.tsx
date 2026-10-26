import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUpRight, MapPin, Navigation, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { DISTRICTS } from '@/data/districts';
import { SRI_LANKA_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';
import type { Destination } from '@/types';
import { DestinationPhoto } from '@/components/destination/DestinationPhoto';

function PreviewViewport({ districtName, selectedDestination }: { districtName: string; selectedDestination: Destination | null }) {
  const map = useMap();

  useEffect(() => {
    const target = selectedDestination?.coordinates ?? DISTRICTS.find((district) => district.name === districtName)?.coordinates;
    if (target) map.flyTo([target.lat, target.lng], selectedDestination ? 10 : 8, { duration: 0.7 });
  }, [districtName, map, selectedDestination]);

  return null;
}

export function HomeExploreMap() {
  const [districtName, setDistrictName] = useState<string>(DISTRICTS[0]?.name ?? 'Colombo');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const districtDestinations = DESTINATIONS.filter((destination) => destination.district === districtName);
  const previewDestinations = districtDestinations.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#153a29] via-[#205d3b] to-[#1d5360] py-16 text-white sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-ocean-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-200"><Sparkles size={14} /> Your next view is closer than you think</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Explore Sri Lanka</h2>
          <p className="mt-2 text-sm leading-6 text-white/75 sm:text-base">Discover destinations across all 25 districts, from tea country to the coast.</p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8">
          <div className="flex flex-col">
            <label htmlFor="home-map-district" className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/65">Choose a district</label>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-700" />
              <select id="home-map-district" value={districtName} onChange={(event) => { setDistrictName(event.target.value); setSelectedDestination(null); }} className="w-full appearance-none rounded-xl border border-white/70 bg-white px-10 py-3 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:ring-4 focus:ring-white/20">
                {DISTRICTS.map((district) => <option key={district.id} value={district.name}>{district.name} · {district.province}</option>)}
              </select>
            </div>

            <div className="mt-5 flex-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.06] px-4">
              <p className="py-3 text-xs font-semibold uppercase tracking-wider text-white/55">{districtName} highlights</p>
              {previewDestinations.length > 0 ? previewDestinations.map((destination) => (
                <Link key={destination.id} to={`/destination/${destination.slug}`} className="group flex items-center gap-3 py-3 transition-colors hover:text-accent-100">
                  <DestinationPhoto destination={destination} alt="" className="h-12 w-14 shrink-0 rounded-lg ring-1 ring-white/15" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">{destination.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-white/55">{destination.categories[0]}</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-200" />
                </Link>
              )) : <p className="py-4 text-sm text-white/65">Explore the district’s places on the full map.</p>}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
              {[['25', 'Districts'], ['500+', 'Destinations'], ['9', 'Provinces']].map(([value, label]) => (
                <div key={label}><p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{value}</p><p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/55 sm:text-xs">{label}</p></div>
              ))}
            </div>
            <Link to={selectedDestination ? `/map?dest=${selectedDestination.slug}` : '/map'} className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-primary-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-50">
              <Navigation size={16} /> Open interactive map <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="relative isolate h-[320px] overflow-hidden rounded-3xl border border-white/20 bg-[#e9eee6] shadow-2xl shadow-black/15 sm:h-[400px]">
            <MapContainer center={[SRI_LANKA_CENTER.lat, SRI_LANKA_CENTER.lng]} zoom={DEFAULT_MAP_ZOOM} minZoom={6} maxZoom={12} scrollWheelZoom={false} className="z-0 h-full w-full">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <PreviewViewport districtName={districtName} selectedDestination={selectedDestination} />
              {DESTINATIONS.map((destination) => (
                <CircleMarker key={destination.id} center={[destination.coordinates.lat, destination.coordinates.lng]} radius={selectedDestination?.id === destination.id ? 9 : 6} pathOptions={{ color: '#ffffff', weight: 2, fillColor: selectedDestination?.id === destination.id ? '#d6a941' : '#267448', fillOpacity: 0.95 }} eventHandlers={{ click: () => setSelectedDestination(destination) }}>
                  <Tooltip>{destination.name} · {destination.district}</Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
            <div className="pointer-events-none absolute left-3 top-3 z-[400] flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-primary-900 shadow-md backdrop-blur-sm sm:left-4 sm:top-4">
              <span className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_0_3px_rgba(51,142,89,0.15)]" /> Sri Lanka · {districtName}
            </div>
            {selectedDestination && <Link to={`/destination/${selectedDestination.slug}`} className="absolute bottom-3 left-3 right-3 z-[400] flex items-center gap-3 rounded-2xl border border-white/70 bg-white/95 p-2.5 text-gray-900 shadow-xl backdrop-blur-md transition hover:bg-white sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm sm:p-3">
              <DestinationPhoto destination={selectedDestination} alt="" className="h-12 w-14 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{selectedDestination.name}</span><span className="mt-0.5 block text-xs text-gray-500">{selectedDestination.district} · ★ {selectedDestination.rating.toFixed(1)}</span></span>
              <ArrowUpRight size={17} className="mr-1 shrink-0 text-primary-700" />
            </Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
