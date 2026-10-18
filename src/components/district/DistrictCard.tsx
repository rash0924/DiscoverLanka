import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import type { District } from '@/types';
import { cn, PROVINCE_COLORS } from '@/lib/utils';

interface DistrictCardProps {
  district: District;
  className?: string;
}

export function DistrictCard({ district, className }: DistrictCardProps) {
  const provinceColor = PROVINCE_COLORS[district.province] || 'bg-gray-100 text-gray-700';

  return (
    <Link
      to={`/district/${district.slug}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={district.coverImage}
          alt={district.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Province badge */}
        <div className="absolute top-3 left-3">
          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', provinceColor)}>
            {district.province}
          </span>
        </div>

        {/* Destination count */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
            {district.destinationCount} places
          </span>
        </div>

        {/* District name overlay */}
        <div className="absolute bottom-3 left-3">
          <h3 className="text-lg font-bold text-white">{district.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{district.description}</p>

        {/* Popular destinations */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
            Popular Places
          </p>
          <div className="flex flex-wrap gap-1">
            {district.popularDestinations.slice(0, 3).map((place) => (
              <span
                key={place}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {place}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
          <span>Explore District</span>
          <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
