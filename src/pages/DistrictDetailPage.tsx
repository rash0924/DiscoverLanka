import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { getDistrictBySlug } from '@/data/districts';
import { getDestinationsByDistrict } from '@/data/destinations';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { useState } from 'react';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

export function DistrictDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const district = getDistrictBySlug(slug ?? '');

  if (!district) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🗺️</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">District Not Found</h1>
          <p className="text-gray-500 mb-6">We couldn't find this district.</p>
          <Link to="/districts"><Button variant="primary">View All Districts</Button></Link>
        </div>
      </div>
    );
  }

  const allDestinations = getDestinationsByDistrict(district.id);
  const filtered =
    activeCategory === 'all'
      ? allDestinations
      : allDestinations.filter((d) => d.categories.includes(activeCategory as Category));

  const availableCategories = Array.from(
    new Set(allDestinations.flatMap((d) => d.categories))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={district.coverImage}
          alt={district.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
          <Link
            to="/districts"
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit"
          >
            <ArrowLeft size={16} /> All Districts
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-3 py-1 bg-white/20 text-white backdrop-blur-sm rounded-full">
                  {district.province} Province
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                {district.name}
              </h1>
              <p className="text-white/80 mt-2 max-w-xl">{district.description}</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-3xl font-bold text-accent-400">{district.destinationCount}</p>
              <p className="text-white/70 text-sm">destinations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              All ({allDestinations.length})
            </button>
            {availableCategories.map((cat) => {
              const catMeta = CATEGORIES.find((c) => c.name === cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                    activeCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {catMeta?.icon} {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DestinationGrid
          destinations={filtered}
          emptyMessage={`No ${activeCategory === 'all' ? '' : activeCategory + ' '}destinations in ${district.name} yet.`}
          emptyDescription="Check back soon as we add more destinations."
          onClearFilters={activeCategory !== 'all' ? () => setActiveCategory('all') : undefined}
        />
      </div>
    </div>
  );
}
