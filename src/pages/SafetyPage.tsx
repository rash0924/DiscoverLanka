import { useEffect, useState } from 'react';
import { ShieldCheck, Phone, AlertTriangle, LifeBuoy, Mountain, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import { isSupabaseDataConfigured, supabaseData } from '@/lib/supabaseData';

interface TravelAdvisory {
  id: string;
  title: string;
  region: string;
  category: string;
  body: string;
  source_url: string | null;
  starts_at: string;
  ends_at: string | null;
}

export function SafetyPage() {
  const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
  useEffect(() => {
    if (!isSupabaseDataConfigured) return;
    void supabaseData<TravelAdvisory[]>('travel_advisories', { query: 'select=id,title,region,category,body,source_url,starts_at,ends_at&order=starts_at.desc' })
      .then(setAdvisories).catch(() => setAdvisories([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-primary-50 py-10 px-4 sm:px-6 lg:px-8">
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

        {advisories.length > 0 && <section className="mb-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8" aria-labelledby="travel-advisory-title">
          <div className="mb-4 flex items-center gap-2"><AlertTriangle className="text-amber-700" size={20} /><h2 id="travel-advisory-title" className="text-xl font-bold text-gray-900">Current travel advisories</h2></div>
          <div className="space-y-3">{advisories.map((advisory) => <article key={advisory.id} className="rounded-2xl border border-amber-100 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-gray-900">{advisory.title}</h3><Badge variant="warning" size="sm">{advisory.category} · {advisory.region}</Badge></div>
            <p className="mt-2 text-sm leading-6 text-gray-700">{advisory.body}</p>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500"><span>Updated {new Date(advisory.starts_at).toLocaleDateString()}</span>{advisory.ends_at && <span>Through {new Date(advisory.ends_at).toLocaleDateString()}</span>}{advisory.source_url && <a href={advisory.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:underline">Source <ExternalLink size={12} /></a>}</p>
          </article>)}</div>
        </section>}

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
