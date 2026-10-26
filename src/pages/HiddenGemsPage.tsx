import { Gem, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '@/data/destinations';
import { DestinationGrid } from '@/components/destination/DestinationGrid';
import { Badge } from '@/components/ui/Badge';

export function HiddenGemsPage() {
  const gems = DESTINATIONS.filter((d) => d.isHiddenGem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <Badge variant="accent" size="md" className="gap-1 mb-3">
            <Gem size={14} /> Secret & Less-Known
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            Hidden Gems of Sri Lanka
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Discover lesser-known spots, tranquil viewpoints, secluded trails, and peaceful escapes
            carefully verified and curated away from crowded tourist hotspots.
          </p>
        </div>

        <DestinationGrid destinations={gems} />
      </div>
    </div>
  );
}
