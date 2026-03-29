import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: (await params).locale });
  const allListings = await getSupabaseListings();
  const featured = allListings.filter((l) => l.featured);

  return (
    <>
      {/* Hero Section */}
      {/* Hero Section */}
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-gray-900 bg-cover bg-center"
        // 서울 밤 야경 보장된 이미지 URL
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1920&auto=format&fit=crop')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Increase bottom padding to fit the floating card */}
        <div className="container-main relative pt-12 pb-32 sm:pt-16 sm:pb-40 lg:pt-24 lg:pb-48">
          <div className="mx-auto max-w-3xl text-center">
            {/* Reduced font size for mobile and slightly larger for large screens */}
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-primary-50 sm:text-lg">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <div className="mx-auto flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-2xl">
              <div className="flex flex-1 items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
                <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
              </div>
              <button className="mr-2 rounded-full bg-gray-900 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white transition-colors hover:bg-black">
                {t('hero.exploreAll')}
              </button>
            </div>
            {/* Quick links removed as they cluttered the view. Icons do the job now. */}
          </div>
        </div>
      </section>

      {/* Floating 8-Item Menu Card (말풍선 직사각형) */}
      <section className="bg-white pb-6 lg:pb-14 relative z-10 px-4">
        <div className="mx-auto max-w-5xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 sm:p-6 lg:p-10 -mt-20 sm:-mt-24 lg:-mt-32">
          {/* 4 columns strictly across 2 rows for desktop & mobile to ensure tight fit */}
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-6">
            {[
              { label: 'Restaurants', icon: '🍽️', color: 'bg-orange-50 text-orange-600 border-orange-100', href: '/restaurants' },
              { label: 'Wellness', icon: '✨', color: 'bg-pink-50 text-pink-600 border-pink-100', href: '/wellness' },
              { label: 'Activities', icon: '🎯', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', href: '/activities' },
              { label: 'Tips', icon: '💡', color: 'bg-amber-50 text-amber-600 border-amber-100', href: '/tips-and-trend' },
              { label: 'Vegetarian', icon: '🥬', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', href: '/tips-and-trend/vegetarian' },
              { label: 'Halal', icon: '🌙', color: 'bg-teal-50 text-teal-600 border-teal-100', href: '/tips-and-trend/halal' },
              { label: 'Bars', icon: '🍻', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', href: '/restaurants/bars' },
              { label: 'Transport', icon: '🚆', color: 'bg-blue-50 text-blue-600 border-blue-100', href: '/tips-and-trend/public-transportation' },
            ].map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1 cursor-pointer"
              >
                <div className={`mb-2.5 flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl border ${sub.color} text-2xl lg:text-3xl shadow-sm transition-all group-hover:shadow-md group-hover:scale-105`}>
                  {sub.icon}
                </div>
                {/* Text styling made highly compact to prevent wrapping on small mobile screens */}
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-tight text-gray-700 whitespace-nowrap overflow-visible">
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
