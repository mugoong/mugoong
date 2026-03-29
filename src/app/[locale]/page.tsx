import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default async function HomePage() {
  const t = await getTranslations();
  const allListings = await getSupabaseListings();
  const featuredProducts = allListings.filter((listing) => listing.featured && listing.contentType === 'product');

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />
        </div>

        <div className="container-main relative py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-primary-200 to-emerald-200 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100 sm:text-xl">
              {t('hero.subtitle')}
            </p>

            <div className="mx-auto flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-2xl">
              <div className="flex flex-1 items-center gap-3 px-5 py-4">
                <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
              </div>
              <button className="mr-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600">
                {t('hero.exploreAll')}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/?city=${city.slug}`}
                  className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white hover:bg-white/10 hover:text-white"
                >
                  {t(city.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">{t('home.categoryTitle')}</h2>
            <p className="text-gray-500">{t('home.categorySubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="mb-3 block text-3xl">{category.icon}</span>
                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-600">
                  {t(category.labelKey)}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.subcategories.slice(0, 3).map((subcategory) => (
                    <span
                      key={subcategory.slug}
                      className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500"
                    >
                      {t(subcategory.labelKey)}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-400">
                      +{category.subcategories.length - 3}
                    </span>
                  )}
                </div>
                <div className="absolute right-4 top-4 text-gray-300 transition-colors group-hover:text-primary-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="container-main">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{t('home.featuredTitle')}</h2>
              <p className="text-gray-500">{t('home.featuredSubtitle')}</p>
            </div>
            <Link
              href="/restaurants"
              className="hidden text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:block"
            >
              {t('home.viewAll')} →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/restaurants" className="btn-primary">
              {t('home.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">{t('home.exploreCities')}</h2>
            <p className="text-gray-500">{t('home.exploreCitiesSubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cities.map((city, index) => {
              const cityProducts = allListings.filter(
                (listing) => listing.city === city.slug && listing.contentType === 'product'
              );

              return (
                <Link
                  key={city.slug}
                  href={`/?city=${city.slug}`}
                  className={`group relative overflow-hidden rounded-2xl shadow-sm card-hover ${
                    index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <div className={`relative ${index === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3]'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-primary-900/30" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className={`font-bold text-white ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-lg'}`}>
                        {t(city.labelKey)}
                      </h3>
                      <p className="mt-1 text-sm text-white/70">
                        {cityProducts.length}+ experiences
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
