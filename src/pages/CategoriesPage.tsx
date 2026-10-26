import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight } from 'lucide-react';

export function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="primary" size="md" className="mb-2">Discover by Theme</Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            All Destination Categories
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            From tropical beaches and soaring peaks to heritage kingdoms and wildlife reserves, explore Sri Lanka by your travel passion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.destinationCount} destinations</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
