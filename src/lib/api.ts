import { getDefaultContentType } from '@/lib/categories';
import { sampleListings } from '@/lib/sample-data';
import { Listing, MenuItem } from '@/types';

type ListingRowResponse = {
  id: string;
  slug: string;
  category: Listing['category'];
  subcategory: string;
  city: Listing['city'];
  title: string;
  description: string;
  content: string;
  image_url: string;
  price: number;
  currency: string;
  rating: number | string;
  review_count: number;
  tags: string[] | null;
  featured: boolean | null;
  published: boolean | null;
  content_type?: Listing['contentType'];
  address?: string | null;
  phone?: string | null;
  operating_hours?: string | null;
  menu_items?: MenuItem[] | null;
};

function mapRowToListing(row: ListingRowResponse): Listing {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    subcategory: row.subcategory,
    contentType: row.content_type ?? getDefaultContentType(row.category, row.subcategory),
    city: row.city,
    title: row.title,
    description: row.description,
    content: row.content ?? '',
    image: row.image_url || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
    price: Number(row.price ?? 0),
    currency: row.currency ?? 'USD',
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    published: row.published ?? false,
    address: row.address ?? '',
    phone: row.phone ?? '',
    operatingHours: row.operating_hours ?? '',
    menuItems: row.menu_items ?? [],
  };
}

export const getSupabaseListings = async (): Promise<Listing[]> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return sampleListings;
  }

  try {
    const url = `${supabaseUrl}/rest/v1/listings?published=eq.true&select=*&order=created_at.desc`;
    const res = await fetch(url, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Supabase request failed: ${res.status}`);
    }

    const data = (await res.json()) as ListingRowResponse[];
    if (!Array.isArray(data)) {
      throw new Error('Unexpected listings response');
    }

    return data.map(mapRowToListing);
  } catch (error) {
    console.error('Supabase fetch failed, returning sample listings fallback', error);
    return sampleListings;
  }
};
