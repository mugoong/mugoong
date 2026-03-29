import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/categories';
import { sampleListings } from '@/lib/sample-data';
import ListingCard from '@/components/ListingCard';
import CityFilter from '@/components/CityFilter';
import type { Metadata } from 'next';
import type { MainCategory } from '@/types';

type Props = {
  params: Promise<{ locale: string; category: string; subcategory: string }>;
  searchParams: Promise<{ city?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, subcategory } = await params;
  const sub = getSubcategoryBySlug(category, subcategory);
  if (!sub) return {};

  const t = await getTranslations({ locale });
  const title = t(sub.labelKey);

  return {
    title,
    description: `Book the best ${title} experiences in Korea. Authentic local services for travelers and expats.`,
  };
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { category, subcategory } = await params;
  const { city } = await searchParams;

  const cat = getCategoryBySlug(category);
  const sub = getSubcategoryBySlug(category, subcategory);
  if (!cat || !sub) notFound();

  const listings = sampleListings.filter(
    (l) =>
      l.category === (category as MainCategory) &&
      l.subcategory === subcategory &&
      (!city || l.city === city)
  );

  return <SubcategoryContent category={cat} subcategory={sub} listings={listings} activeCity={city} />;
}

function SubcategoryContent({
  category,
  subcategory,
  listings,
  activeCity,
}: {
  category: NonNullable<ReturnType<typeof getCategoryBySlug>>;
  subcategory: NonNullable<ReturnType<typeof getSubcategoryBySlug>>;
  listings: typeof sampleListings;
  activeCity?: string;
}) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb + Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-10 lg:py-14">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href={`/${category.slug}`} className="hover:text-white">
              {t(category.labelKey)}
            </Link>
            <span>/</span>
            <span className="text-white">{t(subcategory.labelKey)}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">
            {t(subcategory.labelKey)}
          </h1>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Sibling subcategory tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${category.slug}/${sub.slug}${activeCity ? `?city=${activeCity}` : ''}`}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                sub.slug === subcategory.slug
                  ? 'bg-primary-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              {t(sub.labelKey)}
            </Link>
          ))}
        </div>

        {/* City filter */}
        <CityFilter activeCity={activeCity} basePath={`/${category.slug}/${subcategory.slug}`} />

        {/* Listings */}
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
            <p className="mt-2 text-gray-500">Try selecting a different city or check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
