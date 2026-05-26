import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import SearchBar from '@/components/SearchBar';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — MUGOONG` : 'Search — MUGOONG',
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({ locale });

  const query = (q || '').toLowerCase().trim();
  const allListings = await getSupabaseListings();

  const results = query
    ? allListings.filter((l) => {
        const haystack = [
          l.title,
          l.description,
          l.category,
          l.subcategory,
          l.city,
          l.address ?? '',
          ...l.tags,
        ]
          .join(' ')
          .toLowerCase();
        return query.split(/\s+/).every((word) => haystack.includes(word));
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8 lg:py-10">
        <div className="container-main">
          <nav className="mb-3 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Search</span>
          </nav>
          <SearchBar placeholder={t('hero.searchPlaceholder')} />
        </div>
      </div>

      <div className="container-main py-8">
        {query ? (
          <>
            <p className="mb-6 text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{results.length}</span> result{results.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-gray-800">"{q}"</span>
            </p>

            {results.length > 0 ? (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="mt-16 text-center">
                <p className="text-4xl">🔍</p>
                <h3 className="mt-4 text-lg font-semibold text-gray-700">No results found</h3>
                <p className="mt-2 text-gray-500">Try different keywords or browse by category.</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link href="/restaurants" className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600">
                    Restaurants
                  </Link>
                  <Link href="/wellness" className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600">
                    Wellness
                  </Link>
                  <Link href="/activities" className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-600 hover:border-primary-500 hover:text-primary-600">
                    Activities
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-4xl">🔍</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Search for experiences</h3>
            <p className="mt-2 text-gray-500">Try "BBQ Seoul", "Jeju massage", "cooking class" and more.</p>
          </div>
        )}
      </div>
    </div>
  );
}
