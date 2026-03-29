'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Listing, CategoryConfig, SubCategory } from '@/types';
import BookingForm from './BookingForm';

export default function ListingDetail({
  listing,
  category,
  subcategory,
}: {
  listing: Listing;
  category: CategoryConfig;
  subcategory: SubCategory;
}) {
  const t = useTranslations();
  const isArticle = listing.contentType === 'article';
  const paragraphs = listing.content
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-main py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href={`/${category.slug}`} className="hover:text-primary-600">
              {t(category.labelKey)}
            </Link>
            <span>/</span>
            <Link href={`/${category.slug}/${subcategory.slug}`} className="hover:text-primary-600">
              {t(subcategory.labelKey)}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8">
        <div className={`grid gap-8 ${isArticle ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'lg:grid-cols-3'}`}>
          <div className={isArticle ? '' : 'lg:col-span-2'}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {listing.tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      tag === 'HOT'
                        ? 'badge-hot'
                        : tag === 'BEST'
                        ? 'badge-best'
                        : tag === 'NEW'
                        ? 'badge-new'
                        : 'rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700'
                    }
                  >
                    {tag}
                  </span>
                ))}
                {isArticle && (
                  <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    CMS Article
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                  {t(`cities.${listing.city}`)}
                </span>
                <span>•</span>
                <span>{t(subcategory.labelKey)}</span>
                {isArticle && (
                  <>
                    <span>•</span>
                    <span>Editorial</span>
                  </>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold text-gray-900 lg:text-4xl">
                {listing.title}
              </h1>

              {!isArticle && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-800">{listing.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">
                    {listing.reviewCount} {t('listing.reviews')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isArticle ? 'Article Overview' : t('listing.aboutThis')}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {listing.description}
              </p>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>

            {!isArticle && (
              <>
                {listing.menuItems && listing.menuItems.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Menu Highlights</h2>
                    <div className="grid gap-3">
                      {listing.menuItems.map((item) => (
                        <div key={`${item.name}-${item.price}`} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {item.description && (
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-primary-600">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    {t('listing.highlights')}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      'English-speaking support available',
                      'Trusted for international visitors',
                      'Easy reservation request flow',
                      'Clear location and arrival guidance',
                      'Curated by the MUGOONG team',
                      'Good fit for short-stay travelers',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                        <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(listing.address || listing.operatingHours || listing.phone) && (
                  <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Visit Details</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {listing.address && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</p>
                          <p className="mt-1 text-sm text-gray-700">{listing.address}</p>
                        </div>
                      )}
                      {listing.operatingHours && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hours</p>
                          <p className="mt-1 text-sm text-gray-700">{listing.operatingHours}</p>
                        </div>
                      )}
                      {listing.phone && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contact</p>
                          <p className="mt-1 text-sm text-gray-700">{listing.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            {isArticle ? (
              <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">MUGOONG Guide</p>
                <h2 className="mt-3 text-xl font-bold text-gray-900">Read, then explore nearby</h2>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  This section is CMS-style content, so we keep the page focused on useful travel information instead of pricing or bookings.
                </p>
                <div className="mt-6 space-y-4 rounded-xl bg-gray-50 p-4 text-sm">
                  <div>
                    <p className="text-gray-400">Category</p>
                    <p className="font-medium text-gray-800">{t(category.labelKey)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Section</p>
                    <p className="font-medium text-gray-800">{t(subcategory.labelKey)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">City</p>
                    <p className="font-medium text-gray-800">{t(`cities.${listing.city}`)}</p>
                  </div>
                </div>
                <Link
                  href={`/${category.slug}/${subcategory.slug}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Browse more in this section
                </Link>
              </aside>
            ) : (
              <BookingForm listing={listing} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
