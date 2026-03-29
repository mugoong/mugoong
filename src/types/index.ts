export type City = 'seoul' | 'busan' | 'jeju' | 'gyeongju' | 'jeonju';

export type MainCategory = 'restaurants' | 'wellness' | 'activities' | 'tips-and-trend';
export type ContentType = 'product' | 'article';

export interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

export interface SubCategory {
  slug: string;
  labelKey: string;
  defaultContentType?: ContentType;
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
  contentType: ContentType;
  city: City;
  title: string;
  description: string;
  content: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  address?: string;
  phone?: string;
  operatingHours?: string;
  menuItems?: MenuItem[];
  published?: boolean;
}
