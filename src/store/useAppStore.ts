import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Currency, Destination, Trip, Favorite } from '@/types';

interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

interface AppState {
  // Location
  userLocation: UserLocation | null;
  locationPermission: 'granted' | 'denied' | 'prompt' | null;
  setUserLocation: (location: UserLocation | null) => void;
  setLocationPermission: (permission: 'granted' | 'denied' | 'prompt') => void;

  // Preferences
  language: Language;
  currency: Currency;
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;

  // Favorites (local state, syncs with server when auth available)
  favorites: string[]; // destination IDs
  addFavorite: (destinationId: string) => void;
  removeFavorite: (destinationId: string) => void;
  isFavorite: (destinationId: string) => boolean;

  // Active Trip (currently planning)
  activeTripDestinations: Destination[];
  addToTrip: (destination: Destination) => void;
  removeFromTrip: (destinationId: string) => void;
  clearTrip: () => void;
  isInTrip: (destinationId: string) => boolean;

  // Search state
  lastSearchQuery: string;
  setLastSearchQuery: (query: string) => void;

  // Map state
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  activeMapCategory: string | null;
  setActiveMapCategory: (category: string | null) => void;

  // UI state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isFilterPanelOpen: boolean;
  setFilterPanelOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Location
      userLocation: null,
      locationPermission: null,
      setUserLocation: (location) => set({ userLocation: location }),
      setLocationPermission: (permission) => set({ locationPermission: permission }),

      // Preferences
      language: 'en',
      currency: 'LKR',
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),

      // Favorites
      favorites: [],
      addFavorite: (destinationId) =>
        set((state) => ({
          favorites: state.favorites.includes(destinationId)
            ? state.favorites
            : [...state.favorites, destinationId],
        })),
      removeFavorite: (destinationId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== destinationId),
        })),
      isFavorite: (destinationId) => get().favorites.includes(destinationId),

      // Trip
      activeTripDestinations: [],
      addToTrip: (destination) =>
        set((state) => ({
          activeTripDestinations: state.activeTripDestinations.some(
            (d) => d.id === destination.id
          )
            ? state.activeTripDestinations
            : [...state.activeTripDestinations, destination],
        })),
      removeFromTrip: (destinationId) =>
        set((state) => ({
          activeTripDestinations: state.activeTripDestinations.filter(
            (d) => d.id !== destinationId
          ),
        })),
      clearTrip: () => set({ activeTripDestinations: [] }),
      isInTrip: (destinationId) =>
        get().activeTripDestinations.some((d) => d.id === destinationId),

      // Search
      lastSearchQuery: '',
      setLastSearchQuery: (query) => set({ lastSearchQuery: query }),

      // Map
      selectedDestinationId: null,
      setSelectedDestinationId: (id) => set({ selectedDestinationId: id }),
      mapZoom: 7,
      setMapZoom: (zoom) => set({ mapZoom: zoom }),
      activeMapCategory: null,
      setActiveMapCategory: (category) => set({ activeMapCategory: category }),

      // UI
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isFilterPanelOpen: false,
      setFilterPanelOpen: (open) => set({ isFilterPanelOpen: open }),
    }),
    {
      name: 'lanka-explore-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        activeTripDestinations: state.activeTripDestinations,
        language: state.language,
        currency: state.currency,
      }),
    }
  )
);
