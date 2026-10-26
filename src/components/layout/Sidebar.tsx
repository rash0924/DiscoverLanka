import { Link, NavLink } from 'react-router-dom';
import {
  Compass, Map, MapPinned, Luggage, Gem, Heart, LocateFixed,
  Layers3, ShieldCheck, Search, Home, Globe2, UserRound, LogOut, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/lib/translations';
import { useAuth } from '@/lib/auth';

export function Sidebar() {
  const { t } = useTranslation();
  const favorites = useAppStore((state) => state.favorites);
  const activeTripDestinations = useAppStore((state) => state.activeTripDestinations);
  const isMobileMenuOpen = useAppStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useAppStore((state) => state.setMobileMenuOpen);
  const { user, signOut } = useAuth();

  const sections = [
    {
      title: 'Discover',
      links: [
        { label: 'Home', href: '/', icon: Home, end: true },
        { label: t('nav.explore'), href: '/explore', icon: Compass },
        { label: t('nav.districts'), href: '/districts', icon: MapPinned },
        { label: 'Categories', href: '/categories', icon: Layers3 },
        { label: t('nav.hiddenGems'), href: '/hidden-gems', icon: Gem },
      ],
    },
    {
      title: 'Plan your trip',
      links: [
        { label: t('nav.map'), href: '/map', icon: Map },
        { label: t('nav.tripPlanner'), href: '/trips', icon: Luggage, count: activeTripDestinations.length },
        { label: t('nav.nearby'), href: '/nearby', icon: LocateFixed },
        { label: t('nav.favorites'), href: '/favorites', icon: Heart, count: favorites.length },
      ],
    },
  ];

  const navigation = (
    <>
      <nav aria-label="Main navigation" className="space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.links.map(({ label, href, icon: Icon, count, end }) => (
                <NavLink
                  key={href}
                  to={href}
                  end={end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-800 shadow-sm shadow-primary-900/5 ring-1 ring-primary-100'
                      : 'text-gray-600 hover:bg-primary-50/70 hover:text-primary-900'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'} />
                      <span className="flex-1">{label}</span>
                      {!!count && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{count}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="relative mt-auto overflow-hidden rounded-2xl border border-primary-800/10 bg-gradient-to-br from-[#1b4d35] via-primary-800 to-[#2c7251] p-4 text-white shadow-sm">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-3 -top-5 h-16 w-16 rounded-full border border-white/10" />
        <div className="relative mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-accent-200">
          <Globe2 size={16} strokeWidth={1.8} />
        </div>
        <p className="relative text-sm font-semibold tracking-tight">Sri Lanka, your way</p>
        <p className="relative mt-1 text-[11px] leading-relaxed text-white/75">Find the places and experiences you’ll remember.</p>
        <NavLink to="/search" className="relative mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent-100 transition-colors hover:text-white">
          <Search size={13} /> Find a place
        </NavLink>
      </div>
      <NavLink to="/safety" className="mt-4 flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 transition hover:text-gray-900">
        <ShieldCheck size={15} /> Travel safety
      </NavLink>
      <div className="mt-2 border-t border-gray-100 pt-2">
        {user ? (
          <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-gray-600">
            {user.role === 'admin' ? <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex min-w-0 items-center gap-2 truncate hover:text-gray-900"><UserRound size={15} /> Admin dashboard</Link> : <span className="flex min-w-0 items-center gap-2 truncate"><UserRound size={15} /> {user.email}</span>}
            <button onClick={() => { void signOut(); setMobileMenuOpen(false); }} className="shrink-0 hover:text-gray-900" aria-label="Sign out"><LogOut size={15} /></button>
          </div>
        ) : (
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"><UserRound size={15} /> Sign in</Link>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 flex-col border-r border-primary-100 bg-gradient-to-b from-white via-primary-50/60 to-ocean-50/55 px-4 py-6 shadow-[8px_0_30px_rgba(34,88,57,0.05)] backdrop-blur-xl lg:flex">
        {navigation}
      </aside>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/45" aria-label="Close navigation menu" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute bottom-16 left-0 top-16 flex w-[min(19rem,88vw)] flex-col overflow-y-auto border-r border-primary-100 bg-gradient-to-b from-white via-primary-50/50 to-ocean-50/60 px-4 py-6 shadow-2xl animate-slide-in-left">
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl text-gray-500 transition hover:bg-primary-100 hover:text-primary-700">
              <X size={18} />
            </button>
            {navigation}
          </aside>
        </div>
      )}
    </>
  );
}
