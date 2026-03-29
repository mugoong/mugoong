'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Listing } from '@/types';

function getBadgeClass(tag: string) {
  switch (tag.toUpperCase()) {
    case 'HOT':
      return 'badge-hot';
    case 'BEST':
      return 'badge-best';
    case 'NEW':
      return 'badge-new';
    default:
      return 'inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600';
  }
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const t = useTranslations();
  const isArticle = listing.contentType === 'article';

  return (
    <Link
      href={`/${listing.category}/${listing.subcategory}/${listing.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {listing.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={getBadgeClass(tag)}>
              {tag}
            </span>
          ))}
          {isArticle && (
            <span className="inline-block rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              Article
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {t(`cities.${listing.city}`)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
          {listing.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
          {listing.description}
        </p>

        {isArticle ? (
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              CMS Guide
            </span>
            <span className="text-sm font-semibold text-primary-600">
              Read article →
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
              <span className="text-xs text-gray-400">({listing.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">{t('home.startingFrom')}</span>
              <span className="ml-1 text-lg font-bold text-primary-600">
                ${listing.price}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
