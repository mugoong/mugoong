import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { categories, cities } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';
import HeroSlider from '@/components/HeroSlider';
import {
  RestaurantIcon, WellnessIcon, ActivitiesIcon, TipsIcon,
  VegetarianIcon, HalalIcon, BarsIcon, TransportIcon,
} from '@/components/CategoryIcons';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: (await params).locale });
  const allListings = await getSupabaseListings();
  const featured = allListings.filter((l) => l.featured);

  return (
    <>
      <section className="relative overflow-hidden bg-gray-900 border-none">
        <HeroSlider />
        
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

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

      {/* Floating 8-Item Menu Card: Compressed Vertical Spacing */}
      <section className="bg-white py-3 lg:py-5 relative z-30 px-4 flex flex-col justify-center">
        {/* 외부 및 내부 패딩 1/4 체감되도록 극단적 축소 (py-2 sm:py-3) */}
        <div className="mx-auto w-full max-w-5xl bg-white rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.08)] border border-gray-100 px-4 py-3 sm:px-8 sm:py-4">
          <p className="mb-3 text-center text-sm font-medium text-gray-500">
            Book authentic local experiences with MUGOONG
          </p>
          {/* Mobile: 4개씩 2줄 (grid-cols-4), Desktop: 8개 1줄 (lg:grid-cols-8). 상하 간격 최대로 좁힘 (gap-y-3) */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-y-3 gap-x-2 sm:gap-x-4">
            {[
              { label: 'Restaurants', Icon: RestaurantIcon, color: 'text-stone-700', href: '/restaurants' },
              { label: 'Wellness', Icon: WellnessIcon, color: 'text-rose-400', href: '/wellness' },
              { label: 'Activities', Icon: ActivitiesIcon, color: 'text-amber-700', href: '/activities' },
              { label: 'Tips', Icon: TipsIcon, color: 'text-slate-600', href: '/tips-and-trend' },
              { label: 'Vegetarian', Icon: VegetarianIcon, color: 'text-emerald-600', href: '/tips-and-trend/vegetarian' },
              { label: 'Halal', Icon: HalalIcon, color: 'text-indigo-500', href: '/tips-and-trend/halal' },
              { label: 'Bars', Icon: BarsIcon, color: 'text-amber-500', href: '/restaurants/bars' },
              { label: 'Transport', Icon: TransportIcon, color: 'text-blue-500', href: '/tips-and-trend/public-transportation' },
            ].map((sub) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="group flex flex-col items-center justify-start text-center cursor-pointer"
              >
                <div className={`mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gray-50/80 border border-gray-100 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1 group-hover:bg-white ${sub.color}`}>
                  <sub.Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-gray-600 whitespace-nowrap group-hover:text-gray-900">
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
