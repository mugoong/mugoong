import { CategoryConfig, CityConfig, ContentType } from '@/types';

export const categories: CategoryConfig[] = [
  {
    slug: 'restaurants',
    labelKey: 'categories.restaurants',
    icon: '🍽️',
    subcategories: [
      { slug: 'korean-food', labelKey: 'subcategories.koreanFood' },
      { slug: 'korean-bbq', labelKey: 'subcategories.koreanBBQ' },
      { slug: 'korean-fried-chicken', labelKey: 'subcategories.koreanFriedChicken' },
      { slug: 'bars', labelKey: 'subcategories.bars' },
      { slug: 'vegetarian', labelKey: 'subcategories.vegetarian' },
      { slug: 'halal', labelKey: 'subcategories.halal' },
    ],
  },
  {
    slug: 'wellness',
    labelKey: 'categories.wellness',
    icon: '🧖',
    subcategories: [
      { slug: 'skin-clinic', labelKey: 'subcategories.skinClinic' },
      { slug: 'hair-salon', labelKey: 'subcategories.hairSalon' },
      { slug: 'sauna', labelKey: 'subcategories.sauna' },
      { slug: 'massage', labelKey: 'subcategories.massage' },
    ],
  },
  {
    slug: 'activities',
    labelKey: 'categories.activities',
    icon: '🎟️',
    subcategories: [
      { slug: 'local-experience', labelKey: 'subcategories.localExperience' },
      { slug: 'cooking-classes', labelKey: 'subcategories.cookingClasses' },
      { slug: 'traditional-cultural-tours', labelKey: 'subcategories.traditionalCulturalTours' },
      { slug: 'sports', labelKey: 'subcategories.sports' },
    ],
  },
  {
    slug: 'tips-and-trend',
    labelKey: 'categories.tipsAndTrend',
    icon: '📰',
    subcategories: [
      { slug: 'travel-tips', labelKey: 'subcategories.travelTips', defaultContentType: 'article' },
      { slug: 'trend-now', labelKey: 'subcategories.trendNow', defaultContentType: 'article' },
      { slug: 'smoking-spots', labelKey: 'subcategories.smokingSpots', defaultContentType: 'article' },
      { slug: 'public-transportation', labelKey: 'subcategories.publicTransportation' },
    ],
  },
];

export const cities: CityConfig[] = [
  { slug: 'seoul', labelKey: 'cities.seoul', image: 'https://images.unsplash.com/photo-1581289136611-9c869150041d?w=800&q=80' },
  { slug: 'busan', labelKey: 'cities.busan', image: 'https://images.unsplash.com/photo-1620612480678-01d78278f244?w=800&q=80' },
  { slug: 'jeju', labelKey: 'cities.jeju', image: 'https://images.unsplash.com/photo-1596489345711-4148acfb9fc4?w=800&q=80' },
  { slug: 'gyeongju', labelKey: 'cities.gyeongju', image: 'https://images.unsplash.com/photo-1596707328659-dc3480ccb8cd?w=800&q=80' },
  { slug: 'jeonju', labelKey: 'cities.jeonju', image: 'https://images.unsplash.com/photo-1619445105260-1e9671d1fedd?w=800&q=80' },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((subcategory) => subcategory.slug === subcategorySlug);
}

export function getDefaultContentType(categorySlug: string, subcategorySlug: string): ContentType {
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug);
  return subcategory?.defaultContentType ?? 'product';
}
