// ============================================================
// All TypeScript types for LankaExplore
// ============================================================

export type Province =
  | 'Western'
  | 'Central'
  | 'Southern'
  | 'Northern'
  | 'Eastern'
  | 'North Western'
  | 'North Central'
  | 'Uva'
  | 'Sabaragamuwa';

export type DistrictName =
  | 'Colombo' | 'Gampaha' | 'Kalutara'
  | 'Kandy' | 'Matale' | 'Nuwara Eliya'
  | 'Galle' | 'Matara' | 'Hambantota'
  | 'Jaffna' | 'Kilinochchi' | 'Mannar' | 'Mullaitivu' | 'Vavuniya'
  | 'Trincomalee' | 'Batticaloa' | 'Ampara'
  | 'Kurunegala' | 'Puttalam'
  | 'Anuradhapura' | 'Polonnaruwa'
  | 'Badulla' | 'Monaragala'
  | 'Ratnapura' | 'Kegalle';

export type Category =
  | 'Beaches' | 'Waterfalls' | 'Mountains' | 'Hiking & Trekking'
  | 'Wildlife' | 'National Parks' | 'Cultural & Historical' | 'Temples'
  | 'Churches' | 'Mosques' | 'Viewpoints' | 'Lakes' | 'Rivers'
  | 'Caves' | 'Forests' | 'Tea Estates' | 'Adventure' | 'Camping'
  | 'Photography' | 'Family Friendly' | 'Romantic' | 'Food'
  | 'Shopping' | 'Museums' | 'Heritage Sites' | 'Hidden Gems'
  | 'Sunrise' | 'Sunset';

export type VerificationStatus =
  | 'Verified' | 'Needs Review' | 'Community Submitted'
  | 'Temporarily Closed' | 'Permanently Closed';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Difficult' | 'Expert';

export type SortOption =
  | 'popular' | 'rating' | 'nearest' | 'newest' | 'recommended';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface District {
  id: string;
  name: DistrictName;
  province: Province;
  slug: string;
  description: string;
  coverImage: string;
  destinationCount: number;
  popularDestinations: string[];
  coordinates: Coordinates;
}

export interface DestinationImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  notes?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  districtId: string;
  district: DistrictName;
  province: Province;
  description: string;
  shortDescription: string;
  coordinates: Coordinates;
  address?: string;
  categories: Category[];
  rating: number;
  reviewCount: number;
  entranceFee?: {
    local?: number;
    foreign?: number;
    currency?: string;
    notes?: string;
  };
  openingHours?: OpeningHours;
  bestTimeToVisit?: string;
  estimatedDuration?: string;
  difficulty?: DifficultyLevel;
  accessibility?: string;
  facilities?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images: DestinationImage[];
  coverImage: string;
  verified: boolean;
  verifiedAt?: string;
  verificationStatus: VerificationStatus;
  isHiddenGem?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
  distance?: number; // computed: km from user location
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  destinationId: string;
  rating: number;
  ratings: {
    overall: number;
    cleanliness?: number;
    accessibility?: number;
    value?: number;
    experience?: number;
  };
  comment: string;
  photos?: string[];
  createdAt: string;
  status: 'published' | 'pending' | 'rejected';
  helpfulCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredLanguage: 'en' | 'si' | 'ta';
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  destinationId: string;
  destination: Destination;
  createdAt: string;
}

export interface TripDestination {
  id: string;
  tripId: string;
  destinationId: string;
  destination: Destination;
  dayNumber: number;
  orderIndex: number;
  notes?: string;
  estimatedDuration?: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destinations: TripDestination[];
  totalDistance?: number;
  totalDuration?: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  shareToken?: string;
}

export interface Category_Meta {
  id: string;
  name: Category;
  slug: string;
  icon: string;
  description?: string;
  destinationCount: number;
}

export interface SearchFilters {
  query?: string;
  district?: string;
  province?: string;
  categories?: Category[];
  rating?: number;
  radius?: number;
  familyFriendly?: boolean;
  openNow?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  distanceValue: number; // meters
  durationValue: number; // seconds
  summary?: string;
}

export interface WeatherInfo {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainProbability?: number;
  sunrise?: string;
  sunset?: string;
  isGoodDay?: boolean;
  warnings?: string[];
}

export interface NearbyRadius {
  label: string;
  value: number; // km
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface MapMarkerData {
  destination: Destination;
  position: Coordinates;
}

export type Language = 'en' | 'si' | 'ta';
export type Currency = 'LKR' | 'USD' | 'EUR' | 'GBP';
