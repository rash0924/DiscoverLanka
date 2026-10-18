import { ShieldCheck, Phone, AlertTriangle, LifeBuoy, HeartPulse, Mountain } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';

export function SafetyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="success" size="md" className="gap-1 mb-2">
            <ShieldCheck size={14} /> Official Guidance
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
            Sri Lanka Travel Safety Guide
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Essential emergency contacts, ocean safety rules, wildlife protocols, and high-altitude hiking tips for travelers.
          </p>
        </div>

        {/* Emergency Hotline Numbers */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={20} className="text-red-500" /> Emergency Hotlines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {EMERGENCY_CONTACTS.map((item) => (
              <div key={item.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500">{item.name}</p>
                <p className="text-2xl font-bold text-primary-700 mt-1">{item.number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
              <LifeBuoy size={20} className="text-ocean-500" /> Beach & Ocean Currents Safety
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Always pay attention to beach flags. Southern and eastern coast currents can change rapidly depending on monsoon seasons. Never swim alone in unpatrolled areas or rough surf breaks without local knowledge.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
              <Mountain size={20} className="text-primary-600" /> Hiking & Wilderness Precautions
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For peak hikes like Adam's Peak or Horton Plains, begin early in the morning to avoid thick midday mist and rapid cloud cover. Wear leech protection when exploring wet zone rainforests like Sinharaja.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
              <AlertTriangle size={20} className="text-amber-500" /> Wildlife & Safari Etiquette
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Inside national parks like Yala, Wilpattu, or Minneriya, never leave your vehicle unless at designated park bungalows or viewpoints. Do not feed wild elephants on highway road corridors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
