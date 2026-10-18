import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug, CATEGORIES } from '@/data/categories';
import { DESTINATIONS } from '@/data/destinations';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { ArrowLeft } from 'lucide-react';

export function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const categoryMeta = getCategoryBySlug(slug ?? '');

  const destinations = DESTINATIONS.filter((d) =>
    d.categories.some(
      (c) =>
        c.toLowerCase() === (categoryMeta?.name.toLowerCase() ?? slug?.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> All Categories
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{categoryMeta?.icon || '🌴'}</span>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                {categoryMeta?.name || slug} in Sri Lanka
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {categoryMeta?.description || `Explore ${categoryMeta?.name || slug} destinations`}
              </p>
            </div>
          </div>
        </div>

        <DestinationGrid
          destinations={destinations}
          emptyMessage={`No destinations tagged with ${categoryMeta?.name || slug} yet.`}
        />
      </div>
    </div>
  );
}
