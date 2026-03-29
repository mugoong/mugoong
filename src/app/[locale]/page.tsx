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
      <section 
        className="relative overflow-hidden bg-gray-900 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614051052679-dbe45c11bc32?w=1920&q=80')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="container-main relative py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            {/* Reduced font size for title */}
            <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
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
              <button className="mr-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black">
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

      {/* 12 Subcategories Icon Grid */}
      <section className="bg-white py-10 lg:py-14 border-b border-gray-100">
        <div className="container-main">
          <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-12">
            {[
              { main: 'restaurants', slug: 'korean-food', icon: '🍲', color: 'bg-orange-50 text-orange-600 border-orange-100' },
              { main: 'restaurants', slug: 'korean-bbq', icon: '🥩', color: 'bg-red-50 text-red-600 border-red-100' },
              { main: 'restaurants', slug: 'korean-fried-chicken', icon: '🍗', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
              { main: 'restaurants', slug: 'bars', icon: '🍻', color: 'bg-amber-50 text-amber-600 border-amber-100' },
              { main: 'wellness', slug: 'skin-clinic', icon: '✨', color: 'bg-pink-50 text-pink-600 border-pink-100' },
              { main: 'wellness', slug: 'hair-salon', icon: '✂️', color: 'bg-rose-50 text-rose-600 border-rose-100' },
              { main: 'wellness', slug: 'sauna', icon: '♨️', color: 'bg-sky-50 text-sky-600 border-sky-100' },
              { main: 'wellness', slug: 'massage', icon: '💆‍♀️', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { main: 'activities', slug: 'local-experience', icon: '📸', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              { main: 'activities', slug: 'cooking-classes', icon: '🍳', color: 'bg-teal-50 text-teal-600 border-teal-100' },
              { main: 'activities', slug: 'traditional-cultural-tours', icon: '🏯', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              { main: 'activities', slug: 'sports', icon: '🏸', color: 'bg-blue-50 text-blue-600 border-blue-100' },
            ].map((sub) => {
              const catObj = categories.find(c => c.slug === sub.main);
              const subObj = catObj?.subcategories.find(s => s.slug === sub.slug);
              
              return (
                <Link
                  key={sub.slug}
                  href={`/${sub.main}/${sub.slug}`}
                  className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`mb-2.5 flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl border ${sub.color} text-2xl lg:text-3xl shadow-sm transition-all group-hover:shadow-md group-hover:scale-105`}>
                    {sub.icon}
                  </div>
                  <span className="text-[11px] lg:text-xs font-bold tracking-tight text-gray-700 line-clamp-2 w-full px-1 group-hover:text-black">
                    {subObj ? t(subObj.labelKey) : sub.slug}
                  </span>
                </Link>
              );
            })}
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
