import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCategoryBySlug } from '@/lib/categories';
import { sampleListings } from '@/lib/sample-data';
import ListingCard from '@/components/ListingCard';
import CityFilter from '@/components/CityFilter';
import type { Metadata } from 'next';
import type { MainCategory } from '@/types';

type Props = {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ city?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  const t = await getTranslations({ locale });
  const title = t(cat.labelKey);

  return {
    title,
    description: `Discover the best ${title} experiences in Korea. Book authentic local services trusted by travelers worldwide.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, category } = await params;
  const { city } = await searchParams;
  const cat = getCategoryBySlug(category);

  if (!cat) notFound();

  const t = await getTranslations({ locale });

  const listings = sampleListings.filter(
    (l) =>
      l.category === (category as MainCategory) &&
      (!city || l.city === city)
  );

  const categoryLabel = t(cat.labelKey);
  const subLabels: Record<string, string> = {};
  for (const sub of cat.subcategories) {
    subLabels[sub.slug] = t(sub.labelKey);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-12 lg:py-16">
        <div className="container-main">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white lg:text-4xl">
                {categoryLabel}
              </h1>
              <p className="mt-1 text-primary-100">
                Discover the best {categoryLabel.toLowerCase()} in Korea
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Subcategory tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href={`/${cat.slug}${city ? `?city=${city}` : ''}`}
            className="flex-shrink-0 rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white"
          >
            All
          </Link>
          {cat.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${cat.slug}/${sub.slug}${city ? `?city=${city}` : ''}`}
              className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600"
            >
              {subLabels[sub.slug]}
            </Link>
          ))}
        </div>

        {/* City filter */}
        <CityFilter activeCity={city} basePath={`/${cat.slug}`} />

        {/* Listings grid */}
        {listings.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-4xl">🔍</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No listings found</h3>
            <p className="mt-2 text-gray-500">Try selecting a different city or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
