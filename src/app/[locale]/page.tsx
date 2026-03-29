import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import HeroSlider from '@/components/HeroSlider';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: (await params).locale });
  const allListings = await getSupabaseListings();
  const featured = allListings.filter((l) => l.featured);

  return (
    <>
      <section className="relative overflow-hidden bg-gray-900 border-none">
        {/* 무제한 2초 슬라이더 배경 */}
        <HeroSlider />
        
        {/* Dark overlay for text readability (z-10 to stay above slider) */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

        {/* Content goes above the overlay with z-20 */}
        <div className="container-main relative z-20 pt-12 pb-24 sm:pt-16 sm:pb-32 lg:pt-24 lg:pb-40">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-xs text-primary-50 sm:text-sm">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <div className="mx-auto flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-2xl">
              <div className="flex flex-1 items-center gap-2 px-4 py-2 sm:px-5 sm:py-3.5">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
              </div>
              <button className="mr-2 rounded-full bg-gray-900 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-black">
                {t('hero.exploreAll')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating 8-Item Menu Card: 1-line horizontal scroll */}
      <section className="bg-white py-12 lg:py-20 relative z-30 px-4 flex flex-col justify-center">
        {/* 내부 패딩 대폭 축소 (py-4 sm:py-6) */}
        <div className="mx-auto w-full max-w-5xl bg-white rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.08)] border border-gray-100 px-4 py-4 sm:px-8 sm:py-6">
          
          {/* Mobile: 4개씩 2줄 (grid-cols-4), Desktop: 8개 1줄 (lg:grid-cols-8) */}
          {/* 위아래 간격도 대폭 축소 (gap-y-4) */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-y-5 gap-x-2 sm:gap-x-4">
            {[
              { label: 'Restaurants', icon: '🍽️', color: 'text-orange-600', href: '/restaurants' },
              { label: 'Wellness', icon: '✨', color: 'text-pink-600', href: '/wellness' },
              { label: 'Activities', icon: '🎯', color: 'text-indigo-600', href: '/activities' },
              { label: 'Tips', icon: '💡', color: 'text-amber-600', href: '/tips-and-trend' },
              { label: 'Vegetarian', icon: '🥬', color: 'text-emerald-600', href: '/tips-and-trend/vegetarian' },
              { label: 'Halal', icon: '🌙', color: 'text-teal-600', href: '/tips-and-trend/halal' },
              { label: 'Bars', icon: '🍻', color: 'text-yellow-600', href: '/restaurants/bars' },
              { label: 'Transportation', icon: '🚆', color: 'text-blue-600', href: '/tips-and-trend/public-transportation' },
            ].map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="group flex flex-col items-center justify-start text-center cursor-pointer"
              >
                <div className={`mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[16px] bg-gray-50 border border-transparent group-hover:bg-white group-hover:border-gray-100 text-xl sm:text-2xl shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1 ${sub.color}`}>
                  {sub.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-bold tracking-tight text-gray-700 whitespace-nowrap group-hover:text-black">
                  {sub.label}
                </span>
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
                      {allListings.filter((l) => l.city === city.slug).length}+ experiences
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
