const fs = require('fs');

// 1. Create API
const apiCode = `
import { Listing } from '@/types';

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
    if (!Array.isArray(data)) return [];
    
    return data.map(row => ({
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
    console.error(e);
    return [];
  }
};
`;
fs.writeFileSync('src/lib/api.ts', apiCode);

// 2. Refactor page.tsx
let page = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
page = page.replace("import { useTranslations } from 'next-intl';", "import { getTranslations } from 'next-intl/server';");
page = page.replace("import { sampleListings } from '@/lib/sample-data';", "import { getSupabaseListings } from '@/lib/api';");
page = page.replace("export default function HomePage() {", "export default async function HomePage({ params }: { params: { locale: string } }) {");
page = page.replace("const t = useTranslations();", "const t = await getTranslations({ locale: (await params).locale });\n  const allListings = await getSupabaseListings();");
page = page.replace("const featured = sampleListings.filter((l) => l.featured);", "const featured = allListings.filter((l) => l.featured);");
page = page.replace(/sampleListings\.filter/g, "allListings.filter");
fs.writeFileSync('src/app/[locale]/page.tsx', page);

// 3. Refactor [category]/page.tsx (already async from previous fix)
let catPage = fs.readFileSync('src/app/[locale]/[category]/page.tsx', 'utf8');
catPage = catPage.replace("import { sampleListings } from '@/lib/sample-data';", "import { getSupabaseListings } from '@/lib/api';");
if (!catPage.includes('getSupabaseListings()')) {
  catPage = catPage.replace("const t = await getTranslations(", "const allListings = await getSupabaseListings();\n  const t = await getTranslations(");
}
catPage = catPage.replace("const listings = sampleListings.filter(", "const listings = allListings.filter(");
fs.writeFileSync('src/app/[locale]/[category]/page.tsx', catPage);

// 4. Refactor [category]/[subcategory]/page.tsx (already async)
let subCatPage = fs.readFileSync('src/app/[locale]/[category]/[subcategory]/page.tsx', 'utf8');
subCatPage = subCatPage.replace("import { sampleListings } from '@/lib/sample-data';", "import { getSupabaseListings } from '@/lib/api';");
if (!subCatPage.includes('getSupabaseListings()')) {
  subCatPage = subCatPage.replace("const t = await getTranslations(", "const allListings = await getSupabaseListings();\n  const t = await getTranslations(");
}
subCatPage = subCatPage.replace("const listings = sampleListings.filter(", "const listings = allListings.filter(");
fs.writeFileSync('src/app/[locale]/[category]/[subcategory]/page.tsx', subCatPage);

// 5. Refactor slug page
let slugPage = fs.readFileSync('src/app/[locale]/[category]/[subcategory]/[slug]/page.tsx', 'utf8');
slugPage = slugPage.replace("import { sampleListings } from '@/lib/sample-data';", "import { getSupabaseListings } from '@/lib/api';");
slugPage = slugPage.replace("import { useTranslations }", "import { getTranslations } from 'next-intl/server';\nimport { useTranslations }");
slugPage = slugPage.replace("import { useTranslations } from 'next-intl';", "import { getTranslations } from 'next-intl/server';");
slugPage = slugPage.replace("export default function ListingPage({ params }: Props)", "export default async function ListingPage({ params }: Props)");
slugPage = slugPage.replace("export default function ListingPage({ params", "export default async function ListingPage({ params");
slugPage = slugPage.replace("const t = useTranslations", "const allListings = await getSupabaseListings();\n  const { locale } = await params;\n  const t = await getTranslations");
slugPage = slugPage.replace(/sampleListings\.find/g, "allListings.find");
fs.writeFileSync('src/app/[locale]/[category]/[subcategory]/[slug]/page.tsx', slugPage);

// 6. Refactor sitemap
let sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
sitemap = sitemap.replace("import { sampleListings } from '@/lib/sample-data';", "import { getSupabaseListings } from '@/lib/api';");
sitemap = sitemap.replace("export default function sitemap()", "export default async function sitemap()");
sitemap = sitemap.replace("for (const listing of sampleListings) {", "const allListings = await getSupabaseListings();\n  for (const listing of allListings) {");
fs.writeFileSync('src/app/sitemap.ts', sitemap);

console.log('Refactoring complete!');
