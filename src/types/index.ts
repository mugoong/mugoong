export type City = 'seoul' | 'busan' | 'jeju' | 'gyeongju' | 'jeonju';

export type MainCategory = 'restaurants' | 'wellness' | 'activities' | 'tips-and-trend';

export interface SubCategory {
  slug: string;
  labelKey: string;
}

export interface CategoryConfig {
  slug: MainCategory;
  labelKey: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface CityConfig {
  slug: City;
  labelKey: string;
  image: string;
}

export interface Listing {
  id: string;
  slug: string;
  category: MainCategory;
  subcategory: string;
  city: City;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
}
