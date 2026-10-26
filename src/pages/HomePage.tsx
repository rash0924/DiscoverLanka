import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Compass, ArrowRight, Star, TrendingUp, Gem, Calendar, ChevronLeft, ChevronRight, Mountain, Waves, Trees, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/common/SearchBar';
import { HomeExploreMap } from '@/components/home/HomeExploreMap';
import { DestinationCard } from '@/components/destination/DestinationCard';
import { DestinationPhoto } from '@/components/destination/DestinationPhoto';
import { DistrictCard } from '@/components/district/DistrictCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DESTINATIONS, getFeaturedDestinations, getTrendingDestinations } from '@/data/destinations';
import { DISTRICTS, PROVINCES } from '@/data/districts';
import { CATEGORIES } from '@/data/categories';
import { CURATED_COLLECTIONS, SEASONAL_INFO } from '@/lib/constants';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translations';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1656314945066-edca54a983ec?auto=format&fit=crop&w=2400&q=88',
    alt: 'Tea-covered hills in Sri Lanka',
    label: 'Ella tea country',
  },
  {
    image: 'https://images.unsplash.com/photo-1679754767470-d0dda4882da2?auto=format&fit=crop&w=2400&q=88',
    alt: 'Tropical Sri Lankan beach with palms and waves',
    label: 'South coast beaches',
  },
  {
    image: 'https://ehiassets.b-cdn.net/Ehi%20Website/4DJI_0278.jpg?quality=90&width=2200',
    alt: 'Sigiriya Rock rising over Sri Lankan jungle',
    label: 'Ancient Sigiriya',
  },
  {
    image: 'https://storage.ghost.io/c/70/8b/708b2000-5c7e-45ce-bf29-9aed2c09de58/content/images/2023/08/Untitled-design---2023-08-25T124617.071-1.png',
    alt: 'Misty green tea estates in Sri Lanka',
    label: 'Misty highlands',
  },
];

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const { t } = useTranslation();
  const { requestLocation, hasLocation, isPermissionDenied } = useGeolocation();
  const navigate = useNavigate();
  const featured = getFeaturedDestinations().slice(0, 6);
  const trending = getTrendingDestinations().slice(0, 4);
  const hiddenGems = DESTINATIONS.filter((d) => d.isHiddenGem).slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
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
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              i === heroIndex ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              aria-hidden={i !== heroIndex}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#163726]/55 via-[#173d2a]/12 to-[#12382e]/28" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#143b2a]/55 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 animate-float rounded-full bg-primary-300/10 blur-3xl" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24 pb-24">
          <Badge variant="ghost" size="md" className="mb-6 inline-flex">
            🇱🇰 {t('home.badge')}
          </Badge>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-7 drop-shadow-[0_4px_24px_rgba(16,55,34,0.45)]">
            {t('home.titleStart')}
            <br />
            <span className="text-gradient-primary">{t('home.titleAccent')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-9 leading-relaxed">
            {t('home.description')}
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              size="lg"
              placeholder="Where do you want to go? Search Ella, beaches, Kandy..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm">
            {[
              { label: 'Hill country', icon: <Mountain size={14} /> },
              { label: 'South coast', icon: <Waves size={14} /> },
              { label: 'Wildlife', icon: <Trees size={14} /> },
            ].map((idea) => (
              <button
                key={idea.label}
                onClick={() => navigate(`/search?q=${encodeURIComponent(idea.label)}`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/15 px-3.5 py-2 text-white/90 backdrop-blur-sm transition hover:border-white/45 hover:bg-white/15 hover:text-white"
              >
                {idea.icon}{idea.label}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/explore')}
              leftIcon={<Compass size={18} />}
            >
              {t('home.exploreSriLanka')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/50 bg-white/10 text-white hover:border-white/70 hover:bg-white/20 hover:text-white"
              onClick={() => {
                if (!hasLocation && !isPermissionDenied) requestLocation();
                navigate('/nearby');
              }}
              leftIcon={<Navigation size={18} />}
            >
              {t('home.exploreNearMe')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/90 bg-white/95 text-primary-900 shadow-lg hover:border-white hover:bg-white hover:text-primary-950"
              onClick={() => navigate('/trips')}
              leftIcon={<Calendar size={18} />}
            >
              {t('home.planTrip')}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-white">
            {[
              { value: '25', label: t('home.districts') },
              { value: '500+', label: 'Destinations' },
              { value: '9', label: t('home.provinces') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-accent-300">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-white/65 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.image}
              onClick={() => setHeroIndex(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === heroIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
              )}
              aria-label={`Show ${slide.label}`}
              aria-current={i === heroIndex ? 'true' : undefined}
            />
          ))}
        </div>

        <div className="absolute inset-x-4 top-1/2 z-10 hidden -translate-y-1/2 justify-between sm:flex">
          <button
            onClick={() => setHeroIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/15 text-white/90 backdrop-blur-sm transition hover:scale-105 hover:bg-white/20 hover:text-white"
            aria-label="Previous scenic image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/15 text-white/90 backdrop-blur-sm transition hover:scale-105 hover:bg-white/20 hover:text-white"
            aria-label="Next scenic image"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* ===== QUICK EXPLORE ===== */}
      <section className="py-14 bg-gradient-to-br from-primary-50 via-white to-ocean-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">A little inspiration</p>
              <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">What are you in the mood for?</h2>
            </div>
            <Link to="/categories" className="hidden items-center gap-1 text-sm font-semibold text-primary-700 transition hover:text-primary-900 sm:flex">All experiences <ChevronRight size={16} /></Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-8">
            {topCategories.slice(0, 8).map((category, index) => (
              <Link key={category.id} to={`/category/${category.slug}`} className="group relative flex min-w-36 shrink-0 items-center gap-3 overflow-hidden rounded-2xl border border-primary-100/80 bg-white px-3.5 py-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card sm:min-w-0 sm:flex-col sm:items-start sm:gap-2.5 sm:p-4">
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl transition-transform group-hover:scale-105 sm:h-11 sm:w-11', index % 3 === 0 ? 'bg-primary-50' : index % 3 === 1 ? 'bg-ocean-50' : 'bg-sand-100')}>{category.icon}</span>
                <span className="min-w-0"><span className="block truncate text-xs font-semibold text-gray-800 sm:whitespace-normal">{category.name}</span><span className="mt-0.5 block text-[10px] text-gray-400">Explore places</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="bg-gradient-to-b from-white via-primary-50/30 to-ocean-50/35 py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">🌟 Featured</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">{t('home.mustVisit')}</h2>
            <p className="text-gray-500 mt-1">Handpicked destinations you shouldn't miss</p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {t('common.viewAll')} <ChevronRight size={16} />
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

      <HomeExploreMap />

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

      {/* ===== HIDDEN GEMS ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-700"><Gem size={14} /> For the curious</p>
              <h2 className="font-display text-3xl font-bold text-gray-900">Beyond the Usual</h2>
              <p className="mt-1 text-sm text-gray-500">Discover places most travelers haven't seen yet.</p>
            </div>
            <Link to="/hidden-gems" className="hidden items-center gap-1 text-sm font-semibold text-primary-700 transition hover:text-primary-900 sm:flex">All hidden gems <ChevronRight size={16} /></Link>
          </div>
          {hiddenGems.length > 0 && <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Link to={`/destination/${hiddenGems[0].slug}`} className="group relative min-h-[360px] overflow-hidden rounded-3xl bg-primary-900 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover sm:min-h-[440px]">
              <DestinationPhoto destination={hiddenGems[0]} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102b20]/85 via-[#102b20]/15 to-transparent" />
              <Badge variant="ghost" className="absolute left-5 top-5"><Gem size={13} className="mr-1.5 text-accent-200" /> Hidden gem</Badge>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/75"><MapPin size={13} /> {hiddenGems[0].district}, {hiddenGems[0].province}</p>
                <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{hiddenGems[0].name}</h3>
                <p className="mt-2 max-w-xl line-clamp-2 text-sm leading-relaxed text-white/75">{hiddenGems[0].shortDescription}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:gap-3">Uncover this place <ArrowRight size={16} /></span>
              </div>
            </Link>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {hiddenGems.slice(1, 4).map((destination) => (
                <Link key={destination.id} to={`/destination/${destination.slug}`} className="group relative flex min-h-32 overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-card sm:min-h-40 lg:min-h-0">
                  <DestinationPhoto destination={destination} className="h-full min-h-32 w-2/5 shrink-0 transition-transform duration-500 group-hover:scale-105 sm:min-h-40 lg:min-h-full" />
                  <div className="flex min-w-0 flex-1 flex-col justify-center bg-gradient-to-r from-white to-primary-50/60 p-3.5 sm:p-4">
                    <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-accent-700"><Sparkles size={11} /> Hidden gem</span>
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 transition group-hover:text-primary-800 sm:text-base">{destination.name}</h3>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500"><MapPin size={11} /> {destination.district}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>}
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
              className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-primary-50/80 rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 border border-primary-100/80 hover:border-primary-200"
            >
              <span className="text-3xl block mb-3">{col.icon}</span>
              <h3 className="text-sm font-bold text-gray-900 leading-snug">{col.title}</h3>
              <ArrowRight size={14} className="absolute bottom-4 right-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SEASONAL ===== */}
      <section className="py-16 bg-gradient-to-br from-ocean-50/70 via-white to-sand-100">
        <div className="px-4 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide mb-1">🗓️ Seasonal</p>
            <h2 className="text-3xl font-display font-bold text-gray-900">Best Time to Visit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SEASONAL_INFO.map((season) => (
              <div key={season.months} className="bg-white/90 rounded-3xl p-6 shadow-card ring-1 ring-primary-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
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
      <section className="px-4 py-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-900 via-primary-700 to-ocean-800 px-6 py-14 text-center shadow-2xl shadow-primary-900/20 sm:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-ocean-300/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent-300/20 blur-3xl" />
          <div className="relative">
          <span className="mb-4 block text-4xl">🧳</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Plan Your Sri Lanka Adventure?
          </h2>
          <p className="mb-8 text-lg text-white/75">
            Build your perfect itinerary, save your favorites, and start exploring.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="xl" variant="primary" onClick={() => navigate('/trips')}>
              Start Planning
            </Button>
            <Button size="xl" variant="outline" className="border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20 hover:text-white" onClick={() => navigate('/explore')}>
              Browse Destinations
            </Button>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
