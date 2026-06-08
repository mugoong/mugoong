import { CategoryConfig, CityConfig } from '@/types';

export const categories: CategoryConfig[] = [
  {
    slug: 'restaurants',
    labelKey: 'categories.restaurants',
    icon: '🍽️',
    subcategories: [
      { slug: 'korean-bbq', labelKey: 'subcategories.koreanBBQ' },
      { slug: 'korean-fried-chicken', labelKey: 'subcategories.koreanFriedChicken' },
      { slug: 'classic-korean', labelKey: 'subcategories.classicKorean' },
      { slug: 'street-food-markets', labelKey: 'subcategories.streetFoodMarkets' },
      { slug: 'bars-nightlife', labelKey: 'subcategories.barsNightlife' },
      { slug: 'cafes-desserts', labelKey: 'subcategories.cafesDesserts' },
      { slug: 'fine-dining', labelKey: 'subcategories.fineDining' },
      { slug: 'seafood', labelKey: 'subcategories.seafood' },
      { slug: 'quick-bites', labelKey: 'subcategories.quickBites' },
      { slug: 'vegetarian-vegan', labelKey: 'subcategories.vegetarianVegan' },
      { slug: 'halal-muslim-friendly', labelKey: 'subcategories.halalMuslimFriendly' },
    ],
  },
  {
    slug: 'wellness',
    labelKey: 'categories.wellness',
    icon: '✨',
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
    icon: '🎯',
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
    icon: '💡',
    subcategories: [
      { slug: 'travel-tips', labelKey: 'subcategories.travelTips' },
      { slug: 'trend-now', labelKey: 'subcategories.trendNow' },
      { slug: 'smoking-spots', labelKey: 'subcategories.smokingSpots' },
      { slug: 'public-transportation', labelKey: 'subcategories.publicTransportation' },
    ],
  },
];

export const cities: CityConfig[] = [
  { slug: 'seoul', labelKey: 'cities.seoul', image: '/images/cities/seoul.jpg' },
  { slug: 'busan', labelKey: 'cities.busan', image: '/images/cities/busan.jpg' },
  { slug: 'jeju', labelKey: 'cities.jeju', image: '/images/cities/jeju.jpg' },
  { slug: 'gyeongju', labelKey: 'cities.gyeongju', image: '/images/cities/gyeongju.jpg' },
  { slug: 'jeonju', labelKey: 'cities.jeonju', image: '/images/cities/jeonju.jpg' },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find((s) => s.slug === subcategorySlug);
}
