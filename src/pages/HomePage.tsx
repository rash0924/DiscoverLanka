import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, ArrowRight, Star, TrendingUp, Gem, Calendar, ChevronRight } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { DestinationCard } from '@/components/destination/DestinationCard';
import { DistrictCard } from '@/components/district/DistrictCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DESTINATIONS, getFeaturedDestinations, getTrendingDestinations } from '@/data/destinations';
import { DISTRICTS, PROVINCES } from '@/data/districts';
import { CATEGORIES } from '@/data/categories';
import { CURATED_COLLECTIONS, SEASONAL_INFO } from '@/lib/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=1920&q=80',
  'https://images.unsplash.com/photo-1583087250765-8a88d5b99f6d?w=1920&q=80',
  'https://images.unsplash.com/photo-1566296412462-c3bdfa5aa96d?w=1920&q=80',
  'https://images.unsplash.com/photo-1611002165027-a8d17e3df3c8?w=1920&q=80',
];

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const { requestLocation, hasLocation, isPermissionDenied } = useGeolocation();
  const navigate = useNavigate();
  const featured = getFeaturedDestinations().slice(0, 6);
  const trending = getTrendingDestinations().slice(0, 4);
  const hiddenGems = DESTINATIONS.filter((d) => d.isHiddenGem).slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const topCategories = CATEGORIES.slice(0, 10);

  return (
    <div className="">
      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background images */}
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              i === heroIndex ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <Badge variant="ghost" size="md" className="mb-6 inline-flex">
            🇱🇰 Discover Sri Lanka
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Explore Sri Lanka,
            <br />
            <span className="text-accent-400">One Journey at a Time</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover beaches, mountains, waterfalls, wildlife, culture, hidden gems and
            unforgettable places across all 25 districts.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              size="lg"
              placeholder="Where do you want to go? Search Ella, beaches, Kandy..."
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/explore')}
              leftIcon={<Compass size={18} />}
            >
              Explore Sri Lanka
            </Button>
            <Button
              size="lg"
              variant="accent"
              onClick={() => {
                if (!hasLocation && !isPermissionDenied) requestLocation();
                navigate('/nearby');
              }}
              leftIcon={<Navigation size={18} />}
            >
              Explore Near Me
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate('/trips')}
            >
              Plan a Trip
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 text-white">
            {[
              { value: '25', label: 'Districts' },
              { value: '500+', label: 'Destinations' },
              { value: '9', label: 'Provinces' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-accent-400">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === heroIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">🌟 Featured</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Must-Visit Places</h2>
            <p className="text-gray-500 mt-1">Handpicked destinations you shouldn't miss</p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link to="/explore">
            <Button variant="outline">View All Destinations</Button>
          </Link>
        </div>
      </section>

      {/* ===== EXPLORE BY CATEGORY ===== */}
      <section className="py-16 bg-sand-100">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">Categories</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">What Are You Looking For?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.destinationCount} places</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/categories">
              <Button variant="outline">View All Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EXPLORE BY DISTRICT ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">🗺️ All 25 Districts</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Explore by District</h2>
            <p className="text-gray-500 mt-1">Browse destinations across Sri Lanka's 9 provinces</p>
          </div>
          <Link
            to="/districts"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            All Districts <ChevronRight size={16} />
          </Link>
        </div>

        {/* Province preview */}
        <div className="space-y-10">
          {PROVINCES.slice(0, 3).map((province) => {
            const provinceDistricts = DISTRICTS.filter((d) =>
              province.districts.includes(d.name)
            );
            return (
              <div key={province.name}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {province.name} Province
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {provinceDistricts.map((district) => (
                    <DistrictCard key={district.id} district={district} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/districts">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Explore All 25 Districts
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="py-16 bg-gradient-to-br from-primary-900 to-ocean-900">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-accent-400 uppercase tracking-wide mb-1">🔥 Trending</p>
              <h2 className="text-3xl font-display font-bold text-white">Popular Right Now</h2>
            </div>
            <Link
              to="/explore?sort=popular"
              className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trending.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURATED COLLECTIONS ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">📚 Curated Lists</p>
          <h2 className="text-3xl font-display font-bold text-gray-900">Best of Sri Lanka</h2>
          <p className="text-gray-500 mt-1">Expert-curated collections to inspire your next adventure</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CURATED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              to={`/explore?collection=${col.id}`}
              className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <span className="text-3xl block mb-3">{col.icon}</span>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{col.title}</h3>
              <ArrowRight size={14} className="absolute bottom-4 right-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SEASONAL ===== */}
      <section className="py-16 bg-sand-100">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">🗓️ Seasonal</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Best Time to Visit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SEASONAL_INFO.map((season) => (
              <div key={season.months} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{season.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{season.label}</p>
                    <h3 className="font-bold text-gray-900">{season.months}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{season.description}</p>
                <div className="flex flex-wrap gap-2">
                  {season.recommended.map((district) => (
                    <Link
                      key={district}
                      to={`/district/${district.toLowerCase()}`}
                      className="text-xs px-3 py-1 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      {district}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl mb-4 block">🧳</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Ready to Plan Your Sri Lanka Adventure?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Build your perfect itinerary, save your favorites, and start exploring.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="xl" variant="primary" onClick={() => navigate('/trips')}>
              Start Planning
            </Button>
            <Button size="xl" variant="outline" onClick={() => navigate('/explore')}>
              Browse Destinations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
