import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useDestinations } from '@/hooks/useDestinations';
import { CATEGORIES } from '@/data/categories';
import { DISTRICTS } from '@/data/districts';
import { SORT_OPTIONS } from '@/lib/constants';
import type { SearchFilters, Category, SortOption } from '@/types';
import { cn } from '@/lib/utils';

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    district: searchParams.get('district') || '',
    categories: [],
    sort: (searchParams.get('sort') as SortOption) || 'popular',
    page: 1,
    limit: 12,
  });

  const { data: destinations, total, totalPages } = useDestinations(filters);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const toggleCategory = (cat: Category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories?.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...(prev.categories ?? []), cat],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({ query: '', district: '', categories: [], sort: 'popular', page: 1, limit: 12 });
    setSearchParams({});
  };

  const activeFilterCount =
    (filters.categories?.length ?? 0) +
    (filters.district ? 1 : 0) +
    (filters.rating ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold text-gray-900">Explore Destinations</h1>
            <p className="text-gray-500 mt-1">
              {total} destinations across all 25 districts of Sri Lanka
            </p>
          </div>
          <SearchBar
            onSearch={(q) => updateFilter('query', q)}
            placeholder="Search destinations, districts, categories..."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter panel - desktop */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => updateFilter('district', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.slice(0, 14).map((cat) => {
                    const active = filters.categories?.includes(cat.name as Category);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.name as Category)}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                          active
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateFilter('rating', filters.rating === r ? undefined : r)}
                      className={cn(
                        'flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                        filters.rating === r
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'
                      )}
                    >
                      {r}+★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter bar */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 shadow-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Active filters */}
            {(filters.categories?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.categories?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-200 transition-colors"
                  >
                    {cat} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {/* Result count */}
            <p className="text-sm text-gray-500 mb-5">
              Showing <span className="font-semibold text-gray-900">{destinations.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{total}</span> destinations
            </p>

            <DestinationGrid destinations={destinations} onClearFilters={clearFilters} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filters.page ?? 1) <= 1}
                  onClick={() => updateFilter('page', (filters.page ?? 1) - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {filters.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(filters.page ?? 1) >= totalPages}
                  onClick={() => updateFilter('page', (filters.page ?? 1) + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
