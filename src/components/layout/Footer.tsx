import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Share2, Compass } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-gray-300 pb-20 lg:pb-0" aria-label="Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-ocean-500 flex items-center justify-center text-white font-bold text-sm">
                L
              </div>
              <span className="font-display font-bold text-lg text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted guide to discovering Sri Lanka's most beautiful destinations, hidden gems, and unforgettable experiences.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Web" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Globe size={16} />
              </a>
              <a href="#" aria-label="Share" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Share2 size={16} />
              </a>
              <a href="#" aria-label="Explore" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Compass size={16} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'All Destinations', href: '/explore' },
                { label: 'Browse Districts', href: '/districts' },
                { label: 'Interactive Map', href: '/map' },
                { label: 'Hidden Gems', href: '/hidden-gems' },
                { label: 'Categories', href: '/categories' },
                { label: 'Nearby Places', href: '/nearby' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Plan</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Trip Planner', href: '/trips' },
                { label: 'Saved Places', href: '/favorites' },
                { label: 'Seasonal Guide', href: '/explore?view=seasonal' },
                { label: 'Budget Planner', href: '/trips?tab=budget' },
                { label: 'Travel Safety', href: '/safety' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Emergency</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm">
                <Phone size={13} className="text-red-400 shrink-0" />
                <span className="text-gray-400">Police: <span className="text-white font-medium">119</span></span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={13} className="text-red-400 shrink-0" />
                <span className="text-gray-400">Ambulance: <span className="text-white font-medium">110</span></span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={13} className="text-primary-400 shrink-0" />
                <span className="text-gray-400">Tourist Police: <span className="text-white font-medium">1912</span></span>
              </li>
              <li className="mt-4">
                <Link
                  to="/safety"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View Safety Guide →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Use</Link>
            <Link to="/about" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
