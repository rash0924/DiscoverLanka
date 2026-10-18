export const APP_NAME = 'LankaExplore';
export const APP_TAGLINE = 'Explore Sri Lanka, One Journey at a Time';
export const APP_DESCRIPTION =
  'Discover beaches, mountains, waterfalls, wildlife, culture, hidden gems and unforgettable places across Sri Lanka.';

// Sri Lanka center coordinates
export const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 };
export const SRI_LANKA_BOUNDS = {
  north: 9.85,
  south: 5.9,
  east: 82.0,
  west: 79.5,
};

export const DEFAULT_MAP_ZOOM = 7;
export const DETAIL_MAP_ZOOM = 14;

export const NEARBY_RADIUS_OPTIONS = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
];

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: '\u0DC3\u0DD2\u0D82\u0DC4\u0DBD' },
  { code: 'ta', label: 'Tamil', nativeLabel: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
] as const;

export const CURRENCIES = [
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lanka Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
] as const;

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'newest', label: 'Newest' },
  { value: 'recommended', label: 'Recommended' },
] as const;

export const EMERGENCY_CONTACTS = [
  { name: 'Police Emergency', number: '119' },
  { name: 'Ambulance', number: '110' },
  { name: 'Fire Brigade', number: '111' },
  { name: 'Sri Lanka Tourism (SLTDA)', number: '1912' },
  { name: 'Tourist Police', number: '011-2-421052' },
];

export const CURATED_COLLECTIONS = [
  { id: 'top-beaches', title: 'Top 10 Beaches', icon: '\uD83C\uDFD6\uFE0F', category: 'Beaches' },
  { id: 'top-waterfalls', title: 'Top 10 Waterfalls', icon: '\uD83D\uDCA7', category: 'Waterfalls' },
  { id: 'best-hikes', title: 'Best Hiking Trails', icon: '\uD83E\uDD7E', category: 'Hiking & Trekking' },
  { id: 'family-trips', title: 'Best Family Trips', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', category: 'Family Friendly' },
  { id: 'romantic-spots', title: 'Best Romantic Places', icon: '\uD83D\uDC91', category: 'Romantic' },
  { id: 'photography', title: 'Best Photography Spots', icon: '\uD83D\uDCF7', category: 'Photography' },
  { id: 'hidden-gems', title: 'Hidden Gems', icon: '\uD83D\uDC8E', category: 'Hidden Gems' },
  { id: 'budget', title: 'Best Budget Destinations', icon: '\uD83D\uDCB0', category: '' },
];

export const SEASONAL_INFO = [
  {
    months: 'December – March',
    label: 'West & South Coast Season',
    description: 'Best time for the west and south coasts. Colombo, Galle, Mirissa, Yala.',
    icon: '\u2600\uFE0F',
    recommended: ['Galle', 'Colombo', 'Kalutara', 'Hambantota'],
  },
  {
    months: 'April – September',
    label: 'East Coast & Hill Country Season',
    description: 'Best time for the east coast and northern areas. Arugam Bay, Trincomalee, Jaffna.',
    icon: '\uD83C\uDF0A',
    recommended: ['Trincomalee', 'Ampara', 'Jaffna', 'Batticaloa'],
  },
];
