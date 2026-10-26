import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, Globe, Map, Compass, Heart, Luggage, UserRound,
  ChevronDown, ShieldCheck, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, LANGUAGES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/common/SearchBar';
import { useTranslation } from '@/lib/translations';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, language, setLanguage, favorites, activeTripDestinations } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isHome = location.pathname === '/';
  const useLightNavigation = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 border-b border-white/10 transition-all duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-accent-300/80 after:to-transparent after:content-[""] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/15 before:content-[""]',
          useLightNavigation
            ? 'bg-gradient-to-r from-[#153a29]/80 via-[#236a48]/70 to-[#1d5b62]/75 backdrop-blur-xl'
            : 'bg-gradient-to-r from-[#153a29] via-[#236a48] to-[#1d5b62] shadow-[0_12px_35px_rgba(16,55,34,0.24)] backdrop-blur-xl'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2 rounded-2xl py-1 pl-1 pr-3 transition-colors hover:bg-white/10"
              aria-label={APP_NAME + ' - Home'}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 via-primary-600 to-ocean-700 text-lg font-bold text-white shadow-lg shadow-primary-950/30 ring-1 ring-accent-200/70 transition-transform group-hover:-rotate-6">
                ℒ
              </div>
              <span
                className="font-display font-bold text-xl hidden sm:block text-white tracking-tight"
              >
                {APP_NAME}
              </span>
            </Link>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  'hidden items-center rounded-xl border border-white/10 bg-white/[0.07] p-2 transition-all sm:flex',
                  'text-white/85 hover:border-white/25 hover:bg-white/15 hover:text-accent-100'
                )}
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className={cn(
                  'relative hidden items-center rounded-xl border border-white/10 bg-white/[0.07] p-2 transition-all sm:flex',
                  'text-white/85 hover:border-white/25 hover:bg-white/15 hover:text-accent-100'
                )}
                aria-label={`Favorites (${favorites.length})`}
              >
                <Heart size={18} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>

              {/* Trip counter */}
              {activeTripDestinations.length > 0 && (
                <Link
                  to="/trips"
                  className={cn(
                    'relative hidden items-center rounded-xl border border-white/10 bg-white/[0.07] p-2 transition-all sm:flex',
                    'text-white/85 hover:border-white/25 hover:bg-white/15 hover:text-accent-100'
                  )}
                  aria-label={`Trip (${activeTripDestinations.length} destinations)`}
                >
                  <Luggage size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {activeTripDestinations.length}
                  </span>
                </Link>
              )}

              {/* Language selector */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileOpen((open) => !open)}
                    aria-expanded={isProfileOpen}
                    aria-label="Open profile menu"
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-2.5 text-sm text-white transition hover:border-white/30 hover:bg-white/20"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-300 to-primary-300 font-bold text-primary-900 shadow-inner">
                      {user.email.charAt(0).toUpperCase() || <UserRound size={16} />}
                    </span>
                    <span className="hidden max-w-28 truncate lg:block">{user.email.split('@')[0]}</span>
                    <ChevronDown size={14} className={cn('transition-transform', isProfileOpen && 'rotate-180')} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-primary-100 bg-white p-1.5 text-gray-700 shadow-xl shadow-primary-950/15 animate-slide-down">
                      <div className="border-b border-primary-50 px-3 py-3">
                        <p className="truncate text-sm font-semibold text-gray-900">{user.email.split('@')[0]}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/trips" onClick={() => setIsProfileOpen(false)} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-primary-50 hover:text-primary-800"><Luggage size={16} className="text-primary-600" /> My Trips</Link>
                      <Link to="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-primary-50 hover:text-primary-800"><Heart size={16} className="text-primary-600" /> Saved Places</Link>
                      {user.role === 'admin' && <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-primary-50 hover:text-primary-800"><ShieldCheck size={16} className="text-primary-600" /> Admin Dashboard</Link>}
                      <button onClick={() => { setIsProfileOpen(false); void signOut(); }} className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-gray-100 px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-sand-50 hover:text-primary-800"><LogOut size={16} /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/20"><UserRound size={17} /><span>Sign in</span></Link>
              )}

              {/* Language selector */}
              <div className="relative group hidden md:block">
                <button
                  className={cn(
                    'flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.07] px-2.5 py-2 text-sm font-medium transition-all',
                    'text-white/85 hover:border-white/25 hover:bg-white/15 hover:text-accent-100'
                  )}
                  aria-label={t('language.select')}
                >
                  <Globe size={16} />
                  <span className="uppercase">{language}</span>
                  <ChevronDown size={12} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as 'en' | 'si' | 'ta')}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50',
                        language === lang.code ? 'text-primary-600 font-medium' : 'text-gray-600'
                      )}
                    >
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {lang.code.toUpperCase()}
                      </span>
                      {lang.nativeLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'rounded-xl border border-white/15 bg-white/10 p-2 transition-all hover:border-white/30 hover:bg-white/20 lg:hidden',
                  'text-white'
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Expandable search bar */}
          {isSearchOpen && (
            <div className="flex items-center gap-2 pb-4 animate-slide-down">
              <SearchBar
                className="min-w-0 flex-1"
                size="md"
                autoFocus
                onClose={() => setIsSearchOpen(false)}
                onSearch={(q) => {
                  if (!q.trim()) {
                    setIsSearchOpen(false);
                    return;
                  }
                  navigate(`/search?q=${encodeURIComponent(q)}`);
                  setIsSearchOpen(false);
                }}
              />
              <button onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20">
                <X size={17} />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary-100/80 bg-white/95 shadow-[0_-8px_30px_rgba(34,88,57,0.08)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {[
            { label: t('mobile.home'), href: '/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            { label: t('mobile.explore'), href: '/explore', icon: <Compass size={20} /> },
            { label: t('mobile.map'), href: '/map', icon: <Map size={20} /> },
            { label: t('mobile.trips'), href: '/trips', icon: <Luggage size={20} /> },
            { label: t('mobile.saved'), href: '/favorites', icon: <Heart size={20} /> },
          ].map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-0.5 transition-all duration-200',
                  isActive ? 'font-semibold text-primary-700' : 'text-gray-400 hover:text-gray-600'
                )
              }
              aria-label={item.label}
            >
              {({ isActive }) => <>
              <span className={cn('grid h-8 w-10 place-items-center rounded-xl transition-all', isActive && 'bg-gradient-to-br from-primary-100 to-ocean-50 text-primary-700')}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              </>}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
