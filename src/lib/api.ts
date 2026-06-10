
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

    // Slug lookup: if a DB row has no notes, merge enriched data from sampleListings
    const sampleBySlug = Object.fromEntries(sampleListings.map(s => [s.slug, s]));

    return data.map((row: any) => {
      const notes = row.notes || '';
      const menuItems = row.menu_items || [];
      const sample = (!notes && sampleBySlug[row.slug]) ? sampleBySlug[row.slug] : null;
      let titleTranslations: Record<string, string> | undefined;
      let descTranslations: Record<string, string> | undefined;
      let contentTranslations: Record<string, string> | undefined;
      try {
        const parsed = JSON.parse(notes);
        if (parsed?.__extra?.title_translations) titleTranslations = parsed.__extra.title_translations;
        if (parsed?.__extra?.description_translations) descTranslations = parsed.__extra.description_translations;
        if (parsed?.__extra?.content_translations) contentTranslations = parsed.__extra.content_translations;
      } catch {}
      return {
        id: row.id,
        slug: row.slug,
        category: row.category,
        subcategory: row.subcategory,
        city: row.city,
        title: row.title,
        title_translations: titleTranslations ?? sample?.title_translations,
        description: row.description,
        description_translations: descTranslations ?? (sample as any)?.description_translations,
        content: row.content || '',
        content_translations: contentTranslations ?? (sample as any)?.content_translations,
        image: row.image_url || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80',
        price: row.price,
        currency: row.currency,
        rating: parseFloat(row.rating) || 0,
        reviewCount: row.review_count || 0,
        gallery: row.gallery || [],
        tags: row.tags || [],
        featured: row.featured || false,
        address: row.address || '',
        phone: row.phone || '',
        operating_hours: row.operating_hours || '',
        menu_items: menuItems.length ? menuItems : (sample?.menu_items ?? []),
        notes: notes || (sample?.notes ?? ''),
      };
    });
  } catch (e) {
    console.error('Supabase fetch failed, returning sample listings fallback', e);
    return sampleListings;
  }
};
