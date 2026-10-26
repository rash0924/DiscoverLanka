import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DESTINATIONS } from '@/data/destinations';
import { DISTRICTS } from '@/data/districts';
import { useAppStore } from '@/store/useAppStore';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  onClose?: () => void;
}

export function SearchBar({
  placeholder = 'Where do you want to go?',
  className,
  size = 'md',
  autoFocus,
  onSearch,
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ type: string; label: string; slug: string; sublabel?: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLastSearchQuery } = useAppStore();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const results: typeof suggestions = [];

    // Search districts
    DISTRICTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q)
    )
      .slice(0, 3)
      .forEach((d) =>
        results.push({
          type: 'district',
          label: d.name,
          slug: `/district/${d.slug}`,
          sublabel: `${d.province} Province • ${d.destinationCount} places`,
        })
      );

    // Search destinations
    DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.categories.some((c) => c.toLowerCase().includes(q))
    )
      .slice(0, 5)
      .forEach((d) =>
        results.push({
          type: 'destination',
          label: d.name,
          slug: `/destination/${d.slug}`,
          sublabel: `${d.district} • ${d.categories[0]}`,
        })
      );

    setSuggestions(results);
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) {
      setIsFocused(false);
      if (onSearch) onSearch('');
      else navigate('/explore');
      return;
    }
    setLastSearchQuery(q);
    if (onSearch) {
      onSearch(q);
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query);
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
      onClose?.();
    }
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border bg-white/95 transition-all duration-200',
          size === 'sm' && 'px-3 py-2',
          size === 'md' && 'px-4 py-2.5',
          size === 'lg' && 'gap-3 rounded-[1.35rem] p-2 pl-5',
          isFocused
            ? 'border-primary-300 shadow-[0_18px_48px_rgba(25,84,52,0.20)] ring-4 ring-primary-100/70'
            : size === 'lg'
              ? 'border-white/80 shadow-[0_22px_60px_rgba(15,45,29,0.22)] hover:border-primary-100'
              : 'border-gray-200 shadow-sm hover:border-primary-200'
        )}
      >
        <Search
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 22}
          className="text-gray-400 shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-base sm:text-lg'
          )}
          aria-label="Search destinations"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className="p-0.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => handleSearch(query)}
          className={cn(
            'shrink-0 font-semibold text-white bg-primary-700 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/15 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
            size === 'sm' && 'px-3 py-1.5 text-xs',
            size === 'md' && 'px-4 py-2 text-sm',
            size === 'lg' && 'px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base'
          )}
          aria-label="Search"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slide-down"
          role="listbox"
        >
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              onClick={() => navigate(suggestion.slug)}
              role="option"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                  suggestion.type === 'district'
                    ? 'bg-ocean-100 text-ocean-600'
                    : 'bg-primary-100 text-primary-600'
                )}
              >
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{suggestion.label}</p>
                {suggestion.sublabel && (
                  <p className="text-xs text-gray-400 mt-0.5">{suggestion.sublabel}</p>
                )}
              </div>
              <span className="ml-auto text-xs text-gray-300 capitalize shrink-0 mt-1">
                {suggestion.type}
              </span>
            </button>
          ))}
          <button
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-primary-600 font-medium border-t border-gray-100"
            onClick={() => handleSearch(query)}
          >
            <Search size={14} />
            Search for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
