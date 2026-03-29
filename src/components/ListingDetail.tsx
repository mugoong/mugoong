'use client';

import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
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
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute left-4 top-4 flex gap-2">
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
              </div>
            </div>

            {/* Title & rating */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                  {t(`cities.${listing.city}`)}
                </span>
                <span>·</span>
                <span>{t(subcategory.labelKey)}</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 lg:text-4xl">
                {listing.title}
              </h1>
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
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {t('listing.aboutThis')}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {listing.description}
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                This experience is designed specifically for international visitors.
                Our English-speaking staff will guide you through every step, ensuring
                you have an authentic and memorable Korean experience. All materials
                and equipment are provided. Perfect for solo travelers, couples, and
                small groups.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {t('listing.highlights')}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'English-speaking guide included',
                  'Small group experience (max 8)',
                  'All materials & equipment provided',
                  'Free cancellation up to 24h before',
                  'Instant confirmation',
                  'Mobile voucher accepted',
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
          </div>

          {/* Right: Booking form */}
          <div className="lg:col-span-1">
            <BookingForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
