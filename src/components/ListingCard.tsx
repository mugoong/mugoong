'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Listing } from '@/types';

const BADGE_TAGS = new Set(['HOT', 'BEST', 'NEW', 'PREMIUM', 'ONLY']);

function getBadgeClass(tag: string) {
  switch (tag.toUpperCase()) {
    case 'HOT':  return 'badge-hot';
    case 'BEST': return 'badge-best';
    case 'NEW':  return 'badge-new';
    default:
      return 'inline-block rounded-full bg-gray-700/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm';
  }
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const t = useTranslations();

  const isTips = listing.category === 'tips-and-trend';
  const overlayTags = listing.tags.filter((tag) => BADGE_TAGS.has(tag.toUpperCase()));
  const keywordTags = listing.tags.filter((tag) => !BADGE_TAGS.has(tag.toUpperCase()));

  return (
    <Link
      href={`/${listing.category}/${listing.subcategory}/${listing.slug}`}
      className="group flex h-[160px] sm:block sm:h-auto overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image — square on mobile, 16/10 aspect on desktop */}
      <div className="relative w-[160px] h-[160px] shrink-0 sm:w-auto sm:h-auto sm:aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 160px, (max-width: 1024px) 33vw, 25vw"
        />
        {overlayTags.length > 0 && (
          <div className="absolute left-2 top-2 flex gap-1">
            {overlayTags.slice(0, 2).map((tag) => (
              <span key={tag} className={getBadgeClass(tag)}>{tag}</span>
            ))}
          </div>
        )}
        {listing.tags.some((t) => t.endsWith('%')) && (
          <div className="absolute right-2 top-2">
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {listing.tags.find((t) => t.endsWith('%'))}
            </span>
          </div>
        )}
      </div>

      {/* Content — flex column on mobile, block on desktop */}
      <div className="flex flex-1 flex-col justify-between min-w-0 p-2.5 sm:block sm:p-3">
        <div>
          {/* Title */}
          <h3 className="mb-1 line-clamp-2 sm:line-clamp-1 text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-primary-600">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{t(`cities.${listing.city}`)}</span>
          </div>

          {/* Keyword chips — desktop only */}
          {keywordTags.length > 0 && (
            <div className="hidden sm:flex mt-2 mb-1 flex-wrap gap-1">
              {keywordTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        {!isTips ? (
          <div className="flex items-center justify-between sm:mt-2">
            <div className="flex items-center gap-0.5">
              <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-semibold text-gray-700">{listing.rating}</span>
              <span className="text-[10px] text-gray-400">({listing.reviewCount})</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400">From </span>
              <span className="text-sm font-bold text-primary-600">${listing.price}</span>
            </div>
          </div>
        ) : (
          keywordTags.length > 0 && (
            <span className="truncate text-[10px] text-gray-400 sm:hidden">{keywordTags[0]}</span>
          )
        )}
      </div>
    </Link>
  );
}
