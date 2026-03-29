import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { sampleListings } from '@/lib/sample-data';
import ListingCard from '@/components/ListingCard';

export default function HomePage() {
  const t = useTranslations();
  const featured = sampleListings.filter((l) => l.featured);

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gray-900 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1920&auto=format&fit=crop')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

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

            {/* Search bar */}
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

            {/* City quick links */}
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

      {/* Categories Section */}
      <section className="py-16 lg:py-20">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">{t('home.categoryTitle')}</h2>
            <p className="text-gray-500">{t('home.categorySubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="mb-3 block text-3xl">{cat.icon}</span>
                <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-primary-600">
                  {t(cat.labelKey)}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.slug}
                      className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500"
                    >
                      {t(sub.labelKey)}
                    </span>
                  ))}
                  {cat.subcategories.length > 3 && (
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-400">
                      +{cat.subcategories.length - 3}
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

      {/* Featured Listings */}
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
            {featured.slice(0, 6).map((listing) => (
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

      {/* Explore Cities */}
      <section className="py-16 lg:py-20">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">{t('home.exploreCities')}</h2>
            <p className="text-gray-500">{t('home.exploreCitiesSubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cities.map((city, index) => (
              <Link
                key={city.slug}
                href={`/?city=${city.slug}`}
                className={`group relative overflow-hidden rounded-2xl shadow-sm card-hover ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className={`relative ${index === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3]'}`}>
                  <img src={city.image} alt={t(city.labelKey)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className={`font-bold text-white ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-lg'}`}>
                      {t(city.labelKey)}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {sampleListings.filter((l) => l.city === city.slug).length}+ experiences
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
