import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/components/common/SearchBar';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { useDestinations } from '@/hooks/useDestinations';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: results, total } = useDestinations({ query, limit: 30 });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar
            placeholder="Search all destinations, districts, or categories..."
            autoFocus
            onSearch={(q) => setSearchParams({ q })}
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Search results for "${query}"` : 'All Destinations'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Found {total} places matching your search</p>
        </div>

        <DestinationGrid
          destinations={results}
          emptyMessage={`No results found for "${query}"`}
          emptyDescription="Try searching for another place, district, or broader keyword like 'beaches', 'falls', or 'Kandy'."
        />
      </div>
    </div>
  );
}
