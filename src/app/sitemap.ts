import { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { categories } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mugoong.com';
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
  }

  // Category pages
  for (const locale of locales) {
    for (const cat of categories) {
      entries.push({
        url: `${baseUrl}/${locale}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });

      // Subcategory pages
      for (const sub of cat.subcategories) {
        entries.push({
          url: `${baseUrl}/${locale}/${cat.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }
  }

  // Listing pages
  for (const locale of locales) {
    const allListings = await getSupabaseListings();
  for (const listing of allListings) {
      entries.push({
        url: `${baseUrl}/${locale}/${listing.category}/${listing.subcategory}/${listing.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
