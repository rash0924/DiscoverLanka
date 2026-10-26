import { useState } from 'react';
import { DISTRICTS, PROVINCES } from '@/data/districts';
import { DistrictCard } from '@/components/district/DistrictCard';
import { cn } from '@/lib/utils';

export function DistrictsPage() {
  const [activeProvince, setActiveProvince] = useState<string>('all');

  const filtered =
    activeProvince === 'all'
      ? DISTRICTS
      : DISTRICTS.filter((d) => d.province === activeProvince);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-ocean-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-accent-400 text-sm font-medium uppercase tracking-wide mb-2">🗺️ All 9 Provinces</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explore by District
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Sri Lanka is divided into 25 administrative districts across 9 provinces.
            Each district has its own unique character, culture, and beauty.
          </p>
        </div>
      </div>

      {/* Province filter tabs */}
      <div className="sticky top-16 bg-white border-b border-gray-100 shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => setActiveProvince('all')}
              className={cn(
                'shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                activeProvince === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              All Provinces
            </button>
            {PROVINCES.map((p) => (
              <button
                key={p.name}
                onClick={() => setActiveProvince(p.name)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                  activeProvince === p.name
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Districts grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeProvince === 'all' ? (
          PROVINCES.map((province) => {
            const provinceDistricts = DISTRICTS.filter((d) =>
              province.districts.includes(d.name)
            );
            return (
              <div key={province.name} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{province.name} Province</h2>
                  <span className="text-sm text-gray-400">{provinceDistricts.length} districts</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {provinceDistricts.map((district) => (
                    <DistrictCard key={district.id} district={district} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((district) => (
              <DistrictCard key={district.id} district={district} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
