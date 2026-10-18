import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, Globe, Map, Compass, Heart, Luggage,
  ChevronDown, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, LANGUAGES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import { SearchBar } from '@/components/common/SearchBar';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, language, setLanguage, favorites, activeTripDestinations } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', href: '/explore', icon: <Compass size={16} /> },
    { label: 'Districts', href: '/districts', icon: <Map size={16} /> },
    { label: 'Map', href: '/map', icon: <Map size={16} /> },
    { label: 'Trip Planner', href: '/trips', icon: <Luggage size={16} /> },
    { label: 'Hidden Gems', href: '/hidden-gems', icon: null },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label={APP_NAME + ' - Home'}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-ocean-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                L
              </div>
              <span
                className={cn(
                  'font-display font-bold text-lg hidden sm:block transition-colors',
                  isScrolled ? 'text-gray-900' : 'text-white drop-shadow'
                )}
              >
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isScrolled
                        ? isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : isActive
                        ? 'text-white bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  'p-2 rounded-xl transition-colors hidden sm:flex items-center',
                  isScrolled
                    ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className={cn(
                  'relative p-2 rounded-xl transition-colors hidden sm:flex items-center',
                  isScrolled
                    ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
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
                    'relative p-2 rounded-xl transition-colors hidden sm:flex items-center',
                    isScrolled
                      ? 'text-gray-500 hover:bg-gray-100'
                      : 'text-white/90 hover:bg-white/10'
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
              <div className="relative group hidden md:block">
                <button
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    isScrolled
                      ? 'text-gray-500 hover:bg-gray-100'
                      : 'text-white/90 hover:bg-white/10'
                  )}
                  aria-label="Select language"
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
                  'p-2 rounded-xl lg:hidden transition-colors',
                  isScrolled
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
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
            <div className="pb-4 animate-slide-down">
              <SearchBar
                size="md"
                autoFocus
                onSearch={(q) => {
                  navigate(`/search?q=${encodeURIComponent(q)}`);
                  setIsSearchOpen(false);
                }}
              />
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    )
                  }
                >
                  {link.icon && <span className="text-current">{link.icon}</span>}
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <NavLink
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <Heart size={16} /> Favorites
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
                <Link
                  to="/nearby"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <Compass size={16} /> Explore Near Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {[
            { label: 'Home', href: '/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
            { label: 'Explore', href: '/explore', icon: <Compass size={20} /> },
            { label: 'Map', href: '/map', icon: <Map size={20} /> },
            { label: 'Trips', href: '/trips', icon: <Luggage size={20} /> },
            { label: 'Saved', href: '/favorites', icon: <Heart size={20} /> },
          ].map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 transition-colors',
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                )
              }
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
