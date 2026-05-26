import type { Listing } from '@/types';

export type SortKey = 'top' | 'rating' | 'reviews' | 'price_asc' | 'price_desc' | 'newest';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'top',        label: 'Top Picks' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'reviews',    label: 'Most Reviewed' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest',     label: 'Newest' },
];

export function sortListings(listings: Listing[], sort?: string): Listing[] {
  const s = [...listings];
  switch (sort) {
    case 'rating':     return s.sort((a, b) => b.rating - a.rating);
    case 'reviews':    return s.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'price_asc':  return s.sort((a, b) => a.price - b.price);
    case 'price_desc': return s.sort((a, b) => b.price - a.price);
    case 'newest':     return s.sort((a, b) => b.id.localeCompare(a.id));
    default:
      return s.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }
}
