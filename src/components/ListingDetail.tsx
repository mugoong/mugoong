'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Listing, CategoryConfig, SubCategory } from '@/types';
import BookingForm from './BookingForm';

/* ── helpers to read extra fields stored in notes ── */
function parseExtra(notes?: string): Record<string, string | boolean> {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed === 'object' && parsed.__extra) return parsed.__extra;
  } catch {}
  return {};
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase">{label}</p>
        <p className="text-sm text-gray-700">{value}</p>
      </div>
    </div>
  );
}

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
  const extra = parseExtra((listing as any).notes);
  const cat = category.slug;
  const isTips = cat === 'tips-and-trend';

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container-main py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href={`/${category.slug}`} className="hover:text-primary-600">{t(category.labelKey)}</Link>
            <span>/</span>
            <Link href={`/${category.slug}/${subcategory.slug}`} className="hover:text-primary-600">{t(subcategory.labelKey)}</Link>
            <span>/</span>
            <span className="text-gray-800">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8">
        <div className={`grid gap-8 ${isTips ? '' : 'lg:grid-cols-3'}`}>
          {/* Left: Content */}
          <div className={isTips ? 'mx-auto max-w-3xl' : 'lg:col-span-2'}>
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={listing.image} alt={listing.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
              <div className="absolute left-4 top-4 flex gap-2">
                {listing.tags.map((tag) => (
                  <span key={tag} className={tag === 'HOT' ? 'badge-hot' : tag === 'BEST' ? 'badge-best' : tag === 'NEW' ? 'badge-new' : 'rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700'}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Title & rating */}
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">{t(`cities.${listing.city}`)}</span>
                <span>·</span>
                <span>{t(subcategory.labelKey)}</span>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 lg:text-4xl">{listing.title}</h1>
              {!isTips && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-800">{listing.rating}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{listing.reviewCount} {t('listing.reviews')}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">{t('listing.aboutThis')}</h2>
              <p className="leading-relaxed text-gray-600">{listing.description}</p>
              {(listing as any).content && (
                <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">{(listing as any).content}</div>
              )}
            </div>

            {/* ── RESTAURANT-specific: info & menu ── */}
            {cat === 'restaurants' && (
              <>
                <div className="mt-8 rounded-xl border border-gray-100 p-5">
                  <h2 className="mb-3 text-lg font-bold text-gray-900">🍽️ Restaurant Info</h2>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <InfoRow icon="📍" label="Address" value={(listing as any).address} />
                    <InfoRow icon="📞" label="Phone" value={(listing as any).phone} />
                    <InfoRow icon="🕐" label="Hours" value={(listing as any).operating_hours} />
                    <InfoRow icon="📋" label="Reservation" value={extra.reservation as string} />
                    <InfoRow icon="🅿️" label="Parking" value={extra.parking as string} />
                    <InfoRow icon="💳" label="Payment" value={extra.payment as string} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {extra.english_menu && <Check>English menu available</Check>}
                    {extra.seating && <Check>{extra.seating as string}</Check>}
                  </div>
                </div>
              </>
            )}

            {/* ── WELLNESS-specific ── */}
            {cat === 'wellness' && (
              <div className="mt-8 rounded-xl border border-gray-100 p-5">
                <h2 className="mb-3 text-lg font-bold text-gray-900">✨ Clinic Details</h2>
                <div className="grid gap-1 sm:grid-cols-2">
                  <InfoRow icon="📍" label="Address" value={(listing as any).address} />
                  <InfoRow icon="📞" label="Phone" value={(listing as any).phone} />
                  <InfoRow icon="🕐" label="Hours" value={(listing as any).operating_hours} />
                  <InfoRow icon="📋" label="Reservation" value={extra.reservation as string} />
                  <InfoRow icon="👤" label="Gender Policy" value={extra.gender_policy as string} />
                  <InfoRow icon="⏱️" label="Duration" value={extra.duration as string} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extra.english_staff && <Check>English-speaking staff</Check>}
                  {extra.what_to_bring && <Check>{extra.what_to_bring as string}</Check>}
                </div>
              </div>
            )}

            {/* ── ACTIVITIES-specific ── */}
            {cat === 'activities' && (
              <div className="mt-8 rounded-xl border border-gray-100 p-5">
                <h2 className="mb-3 text-lg font-bold text-gray-900">🎯 Activity Info</h2>
                <div className="grid gap-1 sm:grid-cols-2">
                  <InfoRow icon="⏱️" label="Duration" value={extra.duration as string} />
                  <InfoRow icon="👥" label="Group Size" value={extra.group_size as string} />
                  <InfoRow icon="📊" label="Difficulty" value={extra.difficulty as string} />
                  <InfoRow icon="📍" label="Meeting Point" value={extra.meeting_point as string} />
                  <InfoRow icon="🎒" label="What to Bring" value={extra.what_to_bring as string} />
                  <InfoRow icon="🎁" label="What's Included" value={extra.inclusions as string} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extra.english_guide && <Check>English guide available</Check>}
                </div>
              </div>
            )}

            {/* Highlights (non-tips only) */}
            {!isTips && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">{t('listing.highlights')}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cat === 'restaurants' && (
                    <>
                      <Check>Authentic Korean cuisine</Check>
                      {extra.english_menu && <Check>English menu provided</Check>}
                      <Check>Foreigner-friendly service</Check>
                      <Check>Easy subway access</Check>
                    </>
                  )}
                  {cat === 'wellness' && (
                    <>
                      {extra.english_staff && <Check>English-speaking staff</Check>}
                      <Check>Professional certified therapists</Check>
                      <Check>Clean & hygienic facility</Check>
                      <Check>Instant confirmation</Check>
                    </>
                  )}
                  {cat === 'activities' && (
                    <>
                      {extra.english_guide && <Check>English-speaking guide</Check>}
                      <Check>All materials provided</Check>
                      <Check>Small group experience</Check>
                      <Check>Free cancellation up to 24h</Check>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking form (not for tips) */}
          {!isTips && (
            <div className="lg:col-span-1">
              <BookingForm listing={listing} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
