'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Listing, CategoryConfig, SubCategory } from '@/types';
import BookingForm from './BookingForm';

/* ── helpers ── */
function parseExtra(notes?: string): Record<string, any> {
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

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const hasTranslation = review.translation_en && review.translation_en.trim().length > 0;

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stars rating={review.rating} />
          <span className="font-medium text-gray-800">{review.reviewer}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">{review.source}</span>
          {review.date && <span className="text-xs text-gray-400">{review.date}</span>}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.text}</p>
      {hasTranslation && (
        <>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition"
          >
            🌐 {showTranslation ? 'Show original' : 'See English translation'}
          </button>
          {showTranslation && (
            <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm leading-relaxed text-blue-800">
              {review.translation_en}
            </div>
          )}
        </>
      )}
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
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const extra = parseExtra(listing.notes);
  const cat = category.slug;
  const isTips = cat === 'tips-and-trend';
  const isRestaurant = cat === 'restaurants';
  const menuItems = listing.menu_items || [];
  const dietary = extra.dietary || {};

  /* gallery: main image + up to 7 extra */
  const allImages = [listing.image, ...(listing.gallery ?? [])].filter(Boolean);
  const INITIAL_SHOW = 5; // main + 4 thumbs
  const extraCount = Math.max(0, allImages.length - INITIAL_SHOW);
  const visibleImages = galleryExpanded ? allImages : allImages.slice(0, INITIAL_SHOW);

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
            {/* ── Image Gallery ── */}
            <div>
              {/* Main image */}
              <div
                className="relative aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => setLightboxIdx(0)}
              >
                <Image src={allImages[0]} alt={listing.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
                <div className="absolute left-4 top-4 flex gap-2">
                  {listing.tags.map((tag) => (
                    <span key={tag} className={tag === 'HOT' ? 'badge-hot' : tag === 'BEST' ? 'badge-best' : tag === 'NEW' ? 'badge-new' : 'rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700'}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Thumbnails: show up to 4, last one gets "+more" overlay */}
              {allImages.length > 1 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {visibleImages.slice(1, 5).map((img, i) => {
                    const globalIdx = i + 1;
                    const isLastVisible = i === 3 && extraCount > 0 && !galleryExpanded;
                    return (
                      <div
                        key={globalIdx}
                        className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => isLastVisible ? setGalleryExpanded(true) : setLightboxIdx(globalIdx)}
                      >
                        <Image src={img} alt={`${listing.title} ${globalIdx + 1}`} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="25vw" />
                        {isLastVisible && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-2xl font-bold text-white">+{extraCount}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Expanded extra images */}
              {galleryExpanded && extraCount > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {allImages.slice(5).map((img, i) => (
                    <div
                      key={i + 5}
                      className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => setLightboxIdx(i + 5)}
                    >
                      <Image src={img} alt={`${listing.title} ${i + 6}`} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="25vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
                onClick={() => setLightboxIdx(null)}
              >
                {/* Close */}
                <button
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
                >
                  ✕
                </button>

                {/* Image with side arrows + swipe */}
                <div
                  className="relative flex w-full max-w-5xl items-center px-14"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current === null) return;
                    const delta = touchStartX.current - e.changedTouches[0].clientX;
                    if (delta > 50 && lightboxIdx < allImages.length - 1) setLightboxIdx(lightboxIdx + 1);
                    if (delta < -50 && lightboxIdx > 0) setLightboxIdx(lightboxIdx - 1);
                    touchStartX.current = null;
                  }}
                >
                  <button
                    className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-2xl leading-none text-white transition hover:bg-white/30 disabled:opacity-20"
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.max(0, lightboxIdx - 1)); }}
                    disabled={lightboxIdx === 0}
                  >
                    ‹
                  </button>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                    <Image src={allImages[lightboxIdx]} alt={listing.title} fill className="object-contain" sizes="100vw" />
                  </div>
                  <button
                    className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-2xl leading-none text-white transition hover:bg-white/30 disabled:opacity-20"
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(Math.min(allImages.length - 1, lightboxIdx + 1)); }}
                    disabled={lightboxIdx === allImages.length - 1}
                  >
                    ›
                  </button>
                </div>

                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                  {lightboxIdx + 1} / {allImages.length}
                </p>
              </div>
            )}

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

            {/* Dietary badges (restaurant) */}
            {isRestaurant && Object.keys(dietary).some(k => dietary[k]) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {dietary.vegetarian && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">🥦 Vegetarian</span>}
                {dietary.pescetarian && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">🐟 Pescetarian</span>}
                {dietary.halal && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">🕌 Halal</span>}
                {dietary.gluten_free && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">🌾 Gluten-Free</span>}
                {dietary.non_dairy && <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">🥛 Non-Dairy</span>}
              </div>
            )}

            {/* Story / Description */}
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                {isRestaurant ? '🍽️ The Story Behind the Table' : isTips ? '📝 Article' : t('listing.aboutThis')}
              </h2>
              <p className="leading-relaxed text-gray-600">{listing.description}</p>
              {listing.content && (
                <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">{listing.content}</div>
              )}
            </div>

            {/* ══════════════════════════════════════ */}
            {/* ── RESTAURANT SECTIONS ── */}
            {/* ══════════════════════════════════════ */}
            {isRestaurant && (
              <>
                {/* Menu */}
                {menuItems.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">📋 Menu</h2>
                    {['main', 'side', 'drink'].map(cat => {
                      const items = menuItems.filter(i => (i.category || 'main') === cat);
                      if (items.length === 0) return null;
                      return (
                        <div key={cat} className="mb-6">
                          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            {cat === 'main' ? '🥩 Main Menu' : cat === 'side' ? '🥗 Side Dishes' : '🍺 Drinks & Alcohol'}
                          </h3>
                          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                            {items.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 px-4 py-3">
                                {item.image_url && (
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="56px" />
                                  </div>
                                )}
                                <div className="flex flex-1 items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                                  </div>
                                  <span className="ml-4 shrink-0 text-sm font-semibold text-primary-600">₩{item.price?.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Location & Maps */}
                <div className="mt-8 rounded-xl border border-gray-100 p-5">
                  <h2 className="mb-3 text-lg font-bold text-gray-900">📍 Location & Info</h2>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <InfoRow icon="📍" label="Address" value={listing.address} />
                    <InfoRow icon="📞" label="Phone" value={listing.phone} />
                    <InfoRow icon="🕐" label="Hours" value={listing.operating_hours} />
                    <InfoRow icon="☕" label="Break Time" value={extra.break_time} />
                    <InfoRow icon="🚫" label="Closed" value={extra.holidays} />
                  </div>
                  {/* Map buttons */}
                  {(extra.naver_map_url || extra.kakao_map_url || extra.google_map_url) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {extra.naver_map_url && (
                        <a href={extra.naver_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition">
                          🗺️ Naver Map
                        </a>
                      )}
                      {extra.kakao_map_url && (
                        <a href={extra.kakao_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition">
                          🗺️ Kakao Map
                        </a>
                      )}
                      {extra.google_map_url && (
                        <a href={extra.google_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition">
                          🗺️ Google Map
                        </a>
                      )}
                    </div>
                  )}
                  {/* Satellite embed */}
                  {extra.google_map_url && (
                    <div className="mt-4 overflow-hidden rounded-lg">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address)}&output=embed&t=k`}
                        width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </div>

                {/* Reservation Notices */}
                {extra.reservation_notices?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">📋 Reservation Info</h2>
                    <div className="space-y-2">
                      {extra.reservation_notices.map((notice: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                          <span className="mt-0.5 text-blue-500 font-bold text-sm">{i + 1}</span>
                          <span className="text-sm text-gray-700">{notice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancellation & Refund Policy */}
                {extra.cancellation_policy?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">🔄 Cancellation & Refund Policy</h2>
                    <div className="space-y-2">
                      {extra.cancellation_policy.map((policy: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                          <span className="mt-0.5 text-gray-400">•</span>
                          <span className="text-sm text-gray-700">{policy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Things to Know */}
                {extra.important_notes?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">⚠️ Things to Know</h2>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {extra.important_notes.map((note: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3">
                          <span className="text-amber-500">⚡</span>
                          <span className="text-sm text-gray-700">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── WELLNESS-specific ── */}
            {cat === 'wellness' && (
              <div className="mt-8 rounded-xl border border-gray-100 p-5">
                <h2 className="mb-3 text-lg font-bold text-gray-900">✨ Clinic Details</h2>
                <div className="grid gap-1 sm:grid-cols-2">
                  <InfoRow icon="📍" label="Address" value={listing.address} />
                  <InfoRow icon="📞" label="Phone" value={listing.phone} />
                  <InfoRow icon="🕐" label="Hours" value={listing.operating_hours} />
                  <InfoRow icon="👤" label="Gender Policy" value={extra.gender_policy} />
                  <InfoRow icon="⏱️" label="Duration" value={extra.duration} />
                </div>
                {extra.english_staff && <div className="mt-3"><Check>English-speaking staff</Check></div>}
              </div>
            )}

            {/* ── ACTIVITIES-specific ── */}
            {cat === 'activities' && (
              <div className="mt-8 rounded-xl border border-gray-100 p-5">
                <h2 className="mb-3 text-lg font-bold text-gray-900">🎯 Activity Info</h2>
                <div className="grid gap-1 sm:grid-cols-2">
                  <InfoRow icon="⏱️" label="Duration" value={extra.duration} />
                  <InfoRow icon="👥" label="Group Size" value={extra.group_size} />
                  <InfoRow icon="📊" label="Difficulty" value={extra.difficulty} />
                  <InfoRow icon="📍" label="Meeting Point" value={extra.meeting_point} />
                  <InfoRow icon="🎒" label="What to Bring" value={extra.what_to_bring} />
                  <InfoRow icon="🎁" label="What's Included" value={extra.inclusions} />
                </div>
                {extra.english_guide && <div className="mt-3"><Check>English guide available</Check></div>}
              </div>
            )}

            {/* Highlights (non-tips, non-restaurant) */}
            {!isTips && !isRestaurant && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">{t('listing.highlights')}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
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

            {/* ── External Reviews ── */}
            {extra.external_reviews?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900">⭐ Reviews ({extra.external_reviews.length})</h2>
                <div className="space-y-3">
                  {extra.external_reviews.map((review: any, i: number) => (
                    <ReviewCard key={i} review={review} />
                  ))}
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
