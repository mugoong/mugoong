import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import type { Metadata } from 'next';
import type { MainCategory } from '@/types';

type Props = {
  params: Promise<{ locale: string; city: string }>;
  searchParams: Promise<{ category?: string; subcategory?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const cityConfig = cities.find((c) => c.slug === city);
  if (!cityConfig) return {};

  const t = await getTranslations({ locale });
  const cityName = t(cityConfig.labelKey);

  return {
    title: `${cityName} — MUGOONG`,
    description: `Discover the best local experiences in ${cityName}, Korea. Restaurants, wellness, activities and more.`,
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { locale, city } = await params;
  const { category, subcategory } = await searchParams;

  const cityConfig = cities.find((c) => c.slug === city);
  if (!cityConfig) notFound();

  const t = await getTranslations({ locale });
  const cityName = t(cityConfig.labelKey);
  const allListings = await getSupabaseListings();

  const listings = allListings.filter(
    (l) =>
      l.city === city &&
      (!category || l.category === (category as MainCategory)) &&
      (!subcategory || l.subcategory === subcategory)
  );

  const categoryLabels: Record<string, string> = {};
  for (const cat of categories) {
    categoryLabels[cat.slug] = t(cat.labelKey);
  }

  const activeCat = category ? categories.find((c) => c.slug === category) : null;
  const subLabels: Record<string, string> = {};
  if (activeCat) {
    for (const sub of activeCat.subcategories) {
      subLabels[sub.slug] = t(sub.labelKey);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 py-4 lg:py-5">
        <div className="container-main">
          <nav className="mb-1.5 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">{cityName}</span>
          </nav>
          <h1 className="text-xl font-bold text-white lg:text-2xl">
            {cityName}
          </h1>
          <p className="mt-0.5 text-xs text-primary-100 lg:text-sm">
            Discover the best local experiences in {cityName}
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Category filter tabs */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <Link
            href={`/city/${city}`}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              !category
                ? 'bg-primary-500 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-600'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/city/${city}?category=${cat.slug}`}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                category === cat.slug
                  ? 'bg-primary-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              {categoryLabels[cat.slug]}
            </Link>
          ))}
        </div>

        {/* Subcategory filter tabs (shown when a category is selected) */}
        {activeCat && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <Link
              href={`/city/${city}?category=${category}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                !subcategory
                  ? 'bg-gray-800 text-white'
                  : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              All {categoryLabels[activeCat.slug]}
            </Link>
            {activeCat.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/city/${city}?category=${category}&subcategory=${sub.slug}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  subcategory === sub.slug
                    ? 'bg-gray-800 text-white'
                    : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {subLabels[sub.slug]}
              </Link>
            ))}
          </div>
        )}

        {/* Listings */}
        {listings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-4xl">🔍</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No listings found</h3>
            <p className="mt-2 text-gray-500">Check back soon for new listings in {cityName}!</p>
          </div>
        )}
      </div>
    </div>
  );
}
