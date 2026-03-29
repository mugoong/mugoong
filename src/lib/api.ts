
import { Listing } from '@/types';

import { sampleListings } from '@/lib/sample-data';

export const getSupabaseListings = async (): Promise<Listing[]> => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/listings?published=eq.true&select=*&order=created_at.desc';
    const res = await fetch(url, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': 'Bearer ' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
      },
      next: { revalidate: 0 } // Ensure real-time updates
    });
    
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return sampleListings;
    
    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      category: row.category,
      subcategory: row.subcategory,
      city: row.city,
      title: row.title,
      description: row.description,
      image: row.image_url || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
      price: row.price,
      currency: row.currency,
      rating: parseFloat(row.rating) || 0,
      reviewCount: row.review_count || 0,
      tags: row.tags || [],
      featured: row.featured || false,
    }));
  } catch (e) {
    console.error('Supabase fetch failed, returning sample listings fallback', e);
    return sampleListings;
  }
};
