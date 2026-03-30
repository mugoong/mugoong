import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import CityFilter from '@/components/CityFilter';
import type { Metadata } from 'next';
import { RestaurantIcon, WellnessIcon, ActivitiesIcon, TipsIcon } from '@/components/CategoryIcons';
import type { MainCategory } from '@/types';

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  restaurants: RestaurantIcon,
  wellness: WellnessIcon,
  activities: ActivitiesIcon,
  'tips-and-trend': TipsIcon,
};

type Props = {
  params: Promise<{ locale: string; category: string; subcategory: string }>;
  searchParams: Promise<{ city?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, subcategory } = await params;
  const sub = getSubcategoryBySlug(category, subcategory);
  if (!sub) return {};

  const allListings = await getSupabaseListings();
  const t = await getTranslations({ locale });
  const title = t(sub.labelKey);

  return {
    title,
    description: `Book the best ${title} experiences in Korea. Authentic local services for travelers and expats.`,
  };
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { locale, category, subcategory } = await params;
  const { city } = await searchParams;

  const cat = getCategoryBySlug(category);
  const sub = getSubcategoryBySlug(category, subcategory);
  if (!cat || !sub) notFound();

  const t = await getTranslations({ locale });
  const allListings = await getSupabaseListings();

  const listings = allListings.filter(
    (l) =>
      l.category === (category as MainCategory) &&
      l.subcategory === subcategory &&
      (!city || l.city === city)
  );

  const categoryLabel = t(cat.labelKey);
  const subcategoryLabel = t(sub.labelKey);
  const subLabels: Record<string, string> = {};
  for (const s of cat.subcategories) {
    subLabels[s.slug] = t(s.labelKey);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb + Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-3 lg:py-5">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="mb-1.5 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href={`/${cat.slug}`} className="hover:text-white">
              {categoryLabel}
            </Link>
            <span>/</span>
            <span className="text-white">{subcategoryLabel}</span>
          </nav>
          <div className="flex items-center gap-3">
            {(() => { const Icon = categoryIcons[cat.slug]; return Icon ? <Icon className="w-8 h-8 text-white" /> : null; })()}
            <h1 className="text-xl font-bold text-white lg:text-2xl">
              {subcategoryLabel}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Sibling subcategory tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {cat.subcategories.map((s) => (
            <Link
              key={s.slug}
              href={`/${cat.slug}/${s.slug}${city ? `?city=${city}` : ''}`}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                s.slug === sub.slug
                  ? 'bg-primary-500 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-600'
              }`}
            >
              {subLabels[s.slug]}
            </Link>
          ))}
        </div>

        {/* City filter */}
        <CityFilter activeCity={city} basePath={`/${cat.slug}/${sub.slug}`} />

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

