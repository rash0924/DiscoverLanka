import type { Category_Meta } from '@/types';

export const CATEGORIES: Category_Meta[] = [
  { id: 'beaches', name: 'Beaches', slug: 'beaches', icon: '🏖️', description: 'Pristine sandy shores and turquoise waters', destinationCount: 78 },
  { id: 'waterfalls', name: 'Waterfalls', slug: 'waterfalls', icon: '💧', description: 'Cascading falls hidden in lush forests', destinationCount: 64 },
  { id: 'mountains', name: 'Mountains', slug: 'mountains', icon: '⛰️', description: 'Dramatic peaks and scenic hill country', destinationCount: 45 },
  { id: 'hiking', name: 'Hiking & Trekking', slug: 'hiking-trekking', icon: '🥾', description: 'Trails through jungle and highlands', destinationCount: 52 },
  { id: 'wildlife', name: 'Wildlife', slug: 'wildlife', icon: '🐘', description: 'Elephants, leopards, and exotic species', destinationCount: 38 },
  { id: 'national-parks', name: 'National Parks', slug: 'national-parks', icon: '🌿', description: 'Protected wilderness and safari parks', destinationCount: 26 },
  { id: 'cultural', name: 'Cultural & Historical', slug: 'cultural-historical', icon: '🏛️', description: 'Ancient kingdoms and living heritage', destinationCount: 89 },
  { id: 'temples', name: 'Temples', slug: 'temples', icon: '🛕', description: 'Sacred Buddhist and Hindu shrines', destinationCount: 112 },
  { id: 'churches', name: 'Churches', slug: 'churches', icon: '⛪', description: 'Colonial-era and modern churches', destinationCount: 22 },
  { id: 'mosques', name: 'Mosques', slug: 'mosques', icon: '🕌', description: 'Historic and cultural mosques', destinationCount: 15 },
  { id: 'viewpoints', name: 'Viewpoints', slug: 'viewpoints', icon: '🔭', description: 'Stunning panoramic vistas', destinationCount: 67 },
  { id: 'lakes', name: 'Lakes', slug: 'lakes', icon: '🏞️', description: 'Serene lakes and reservoirs', destinationCount: 43 },
  { id: 'rivers', name: 'Rivers', slug: 'rivers', icon: '🌊', description: 'Scenic river valleys and rafting', destinationCount: 28 },
  { id: 'caves', name: 'Caves', slug: 'caves', icon: '🕳️', description: 'Ancient caves and rock formations', destinationCount: 19 },
  { id: 'forests', name: 'Forests', slug: 'forests', icon: '🌲', description: 'Primary rainforests and nature reserves', destinationCount: 31 },
  { id: 'tea-estates', name: 'Tea Estates', slug: 'tea-estates', icon: '🍵', description: 'Verdant tea plantations and factories', destinationCount: 34 },
  { id: 'adventure', name: 'Adventure', slug: 'adventure', icon: '🧗', description: 'Extreme sports and adrenaline activities', destinationCount: 28 },
  { id: 'camping', name: 'Camping', slug: 'camping', icon: '⛺', description: 'Camping sites under the stars', destinationCount: 21 },
  { id: 'photography', name: 'Photography', slug: 'photography', icon: '📷', description: 'Iconic locations for stunning shots', destinationCount: 95 },
  { id: 'family', name: 'Family Friendly', slug: 'family-friendly', icon: '👨‍👩‍👧‍👦', description: 'Perfect for families with children', destinationCount: 56 },
  { id: 'romantic', name: 'Romantic', slug: 'romantic', icon: '💑', description: 'Intimate and scenic locations for couples', destinationCount: 44 },
  { id: 'food', name: 'Food', slug: 'food', icon: '🍛', description: 'Local cuisine and food experiences', destinationCount: 38 },
  { id: 'shopping', name: 'Shopping', slug: 'shopping', icon: '🛍️', description: 'Markets, malls, and local crafts', destinationCount: 24 },
  { id: 'museums', name: 'Museums', slug: 'museums', icon: '🏺', description: 'History, art, and culture museums', destinationCount: 32 },
  { id: 'heritage', name: 'Heritage Sites', slug: 'heritage-sites', icon: '🏰', description: 'UNESCO and nationally protected sites', destinationCount: 18 },
  { id: 'hidden-gems', name: 'Hidden Gems', slug: 'hidden-gems', icon: '💎', description: 'Secret spots known only to locals', destinationCount: 47 },
  { id: 'sunrise', name: 'Sunrise', slug: 'sunrise', icon: '🌅', description: 'Best sunrise viewing spots', destinationCount: 29 },
  { id: 'sunset', name: 'Sunset', slug: 'sunset', icon: '🌇', description: 'Magical sunset viewpoints', destinationCount: 36 },
];

export const getCategoryBySlug = (slug: string): Category_Meta | undefined =>
  CATEGORIES.find((c) => c.slug === slug);
