'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import type { Listing, CategoryConfig, SubCategory } from '@/types';
import BookingForm from './BookingForm';
import {
  PinIcon, PhoneIcon, ClockIcon, CoffeeIcon, ClosedIcon, PersonIcon,
  TimerIcon, PeopleIcon, DifficultyIcon, AgeIcon, FlagIcon,
  MoneyIcon, DoctorIcon, ScissorsIcon,
  FacilitiesIcon, ProgramIcon, IncludedIcon, ExcludedIcon,
  BackpackIcon, InfoCircleIcon, RefreshIcon,
  LightbulbIcon, MapIcon, StarIconOutline, ActivityIcon,
  SaunaIcon, MassageServiceIcon, VenueIcon, MenuPriceIcon,
} from './DetailIcons';

function parseExtra(notes?: string): Record<string, any> {
  if (!notes) return {};
  try { const p = JSON.parse(notes); if (p?.__extra) return p.__extra; } catch {}
  return {};
}
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function Check({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
      <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  );
}
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-primary-500">{icon}</span>
      <div><p className="text-xs font-medium uppercase text-gray-400">{label}</p><p className="text-sm text-gray-700">{value}</p></div>
    </div>
  );
}
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-gray-900">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">{icon}</span>
      {title}
    </h2>
  );
}
function ListBadges({ items, green }: { items: string[]; green?: boolean }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className={`flex items-start gap-3 rounded-lg p-3 ${green ? 'bg-green-50' : 'bg-gray-50'}`}>
          <span className={`mt-0.5 flex-shrink-0 text-sm font-bold ${green ? 'text-green-500' : 'text-gray-400'}`}>{green ? '✓' : '•'}</span>
          <span className="text-sm text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  );
}
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );
}
function ReviewCard({ review, td }: { review: any; td: (k: string) => string }) {
  const [showTr, setShowTr] = useState(false);
  const hasTr = review.translation_en?.trim().length > 0;
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><Stars rating={review.rating} /><span className="font-medium text-gray-800">{review.reviewer}</span></div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">{review.source}</span>
          {review.date && <span className="text-xs text-gray-400">{review.date}</span>}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.text}</p>
      {hasTr && (
        <>
          <button onClick={() => setShowTr(!showTr)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition">🌐 {showTr ? td('showOriginal') : td('seeEnglishTranslation')}</button>
          {showTr && <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm leading-relaxed text-blue-800">{review.translation_en}</div>}
        </>
      )}
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({ images, idx, onClose, setIdx }: { images: string[]; idx: number; onClose: () => void; setIdx: (i: number) => void }) {
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) setIdx(idx - 1);
      if (e.key === 'ArrowRight' && idx < images.length - 1) setIdx(idx + 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, images.length, onClose, setIdx]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90" onClick={onClose}>
      <button className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
      <div className="relative flex w-full max-w-5xl items-center px-14" onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const d = touchX.current - e.changedTouches[0].clientX;
          if (d > 50 && idx < images.length - 1) setIdx(idx + 1);
          if (d < -50 && idx > 0) setIdx(idx - 1);
          touchX.current = null;
        }}>
        <button className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-2xl leading-none text-white hover:bg-white/30 disabled:opacity-20"
          onClick={(e) => { e.stopPropagation(); setIdx(Math.max(0, idx - 1)); }} disabled={idx === 0}>‹</button>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={images[idx]} alt="" fill className="object-contain" sizes="100vw" />
        </div>
        <button className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-2xl leading-none text-white hover:bg-white/30 disabled:opacity-20"
          onClick={(e) => { e.stopPropagation(); setIdx(Math.min(images.length - 1, idx + 1)); }} disabled={idx === images.length - 1}>›</button>
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">{idx + 1} / {images.length}</p>
    </div>
  );
}

/* ── Mobile Swipe Gallery ── */
function MobileGallery({ images, tags, onOpen }: {
  images: string[];
  tags: string[];
  onOpen: (idx: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [slideW, setSlideW] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const update = () => { if (containerRef.current) setSlideW(containerRef.current.offsetWidth); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goTo = (n: number) => setIdx(Math.max(0, Math.min(images.length - 1, n)));

  return (
    <div ref={containerRef} className="relative aspect-[4/3] overflow-hidden">
      {/* Sliding track */}
      <div
        className="flex h-full"
        style={{
          transform: slideW ? `translateX(${-idx * slideW + dragX}px)` : undefined,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          willChange: 'transform',
        }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setDragging(true); }}
        onTouchMove={(e) => { if (touchStartX.current === null) return; setDragX(e.touches[0].clientX - touchStartX.current); }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX.current;
          setDragging(false);
          setDragX(0);
          if (Math.abs(diff) > 40) goTo(diff < 0 ? idx + 1 : idx - 1);
          touchStartX.current = null;
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative h-full flex-shrink-0"
            style={{ width: slideW || '100vw' }}
            onClick={() => { if (Math.abs(dragX) < 5) onOpen(i); }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="100vw" priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className={
              tag === 'HOT' ? 'badge-hot' :
              tag === 'BEST' ? 'badge-best' :
              tag === 'NEW' ? 'badge-new' :
              'rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap'
            }>{tag}</span>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <>
          {/* Counter */}
          <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {idx + 1} / {images.length}
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function ListingDetail({
  listing, category, subcategory,
}: {
  listing: Listing; category: CategoryConfig; subcategory: SubCategory;
}) {
  const t = useTranslations();
  const td = useTranslations('detail');
  const locale = useLocale();
  const displayTitle = listing.title_translations?.[locale] ?? listing.title;
  const displayDescription = (listing as any).description_translations?.[locale] ?? listing.description;
  const displayContent = (listing as any).content_translations?.[locale] ?? listing.content;
  const mName = (item: any) => item.name_translations?.[locale] ?? item.name;
  const mDesc = (item: any) => item.description_translations?.[locale] ?? item.description;
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const allImages = [listing.image, ...(listing.gallery ?? [])].filter(Boolean);
  const extra = parseExtra(listing.notes);
  const cat = category.slug;
  const isTips = cat === 'tips-and-trend';
  const isRestaurant = cat === 'restaurants';
  const menuItems = listing.menu_items || [];
  const dietary = extra.dietary || {};
  const bookingType: 'free' | 'deposit' | 'full_payment' =
    listing.price_display_type === 'from' ? 'free'
    : (listing.price_display_type === 'deposit' || listing.price_display_type === 'reserve') ? 'deposit'
    : (isRestaurant && (extra.booking_deposit ?? 0) > 0) ? 'deposit'
    : isRestaurant ? 'free'
    : extra.booking_type ?? 'free';
  const hasReviews = extra.external_reviews?.length > 0;

  function lowestNonDrinkPrice(items: any[]): number | null {
    const priced = (items ?? []).filter(
      (i: any) => typeof i.price === 'number' && i.price > 0 && i.category?.toLowerCase() !== 'drink' && !i.price_variable
    );
    if (!priced.length) return null;
    return Math.min(...priced.map((i: any) => i.price as number));
  }
  const fmtKRW = (n: number) => `₩${n.toLocaleString('ko-KR')}`;
  const headerPrice =
    listing.price_display_type === 'deposit' ? (listing.booking_deposit ?? listing.price)
    : listing.price_display_type === 'reserve' ? (listing.reserve_fee ?? listing.price)
    : (lowestNonDrinkPrice(menuItems) ?? listing.price);
  const headerPriceLabel = listing.price_display_type === 'deposit'
    ? 'Deposit From'
    : listing.price_display_type === 'reserve'
      ? 'Reserve From'
      : null;

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function MapButtons() {
    if (!extra.naver_map_url && !extra.kakao_map_url && !extra.google_map_url) return null;
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {extra.naver_map_url && <a href={extra.naver_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition"><MapIcon className="h-4 w-4" /> {td('naverMap')}</a>}
        {extra.kakao_map_url && <a href={extra.kakao_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition"><MapIcon className="h-4 w-4" /> {td('kakaoMap')}</a>}
        {extra.google_map_url && <a href={extra.google_map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"><MapIcon className="h-4 w-4" /> {td('googleMap')}</a>}
      </div>
    );
  }

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
            <span className="truncate text-gray-800">{displayTitle}</span>
          </nav>
        </div>
      </div>

      {/* ══ GALLERY — mobile: swipe carousel / desktop: main + 2×2 grid ══ */}

      {/* Mobile swipe carousel */}
      <div className="lg:hidden">
        <MobileGallery images={allImages} tags={listing.tags} onOpen={(i) => setLbIdx(i)} />
      </div>

      {/* Desktop grid */}
      <div className="container-main hidden pt-6 lg:block">
        <div className="grid grid-cols-[3fr_2fr] gap-2 overflow-hidden rounded-2xl">

          {/* Main image */}
          <div className="relative cursor-pointer overflow-hidden" style={{ aspectRatio: '4/3' }}
            onClick={() => setLbIdx(0)}>
            <Image src={allImages[0]} alt={displayTitle} fill className="object-cover transition-transform duration-500 hover:scale-105" priority sizes="60vw" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-1">
              {listing.tags.map(tag => (
                <span key={tag} className={tag === 'HOT' ? 'badge-hot' : tag === 'BEST' ? 'badge-best' : tag === 'NEW' ? 'badge-new' : 'rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap'}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 2×2 thumbnail grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3, 4].map((imgIdx) => {
              const src = allImages[imgIdx];
              const isLast = imgIdx === 4;
              const hasMore = allImages.length > 5;
              if (!src) {
                return <div key={imgIdx} className="bg-gray-100" />;
              }
              return (
                <div key={imgIdx} className="relative cursor-pointer overflow-hidden"
                  onClick={() => isLast && hasMore ? setLbIdx(5) : setLbIdx(imgIdx)}>
                  <Image src={src} alt="" fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="20vw" />
                  {isLast && hasMore && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/50">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wide text-white">{td('viewAll')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT: 8:2 layout ══ */}
      <div className="container-main mt-8 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[13fr_7fr]">

          {/* ── LEFT 8: all page content ── */}
          <div ref={contentRef}>
            {/* City · Category */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">{t(`cities.${listing.city}`)}</span>
              <span className="text-gray-300">·</span>
              <span>{t(subcategory.labelKey)}</span>
            </div>

            {/* Title */}
            <h1 className="mt-3 text-2xl font-bold text-gray-900 lg:text-3xl">{displayTitle}</h1>

            {/* Rating */}
            {!isTips && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="font-semibold text-gray-800">{listing.rating}</span>
                </div>
                <button onClick={() => hasReviews && scrollTo(reviewsRef)} className="text-sm text-gray-500 hover:text-primary-600 hover:underline transition">
                  {listing.reviewCount} {t('listing.reviews')}
                </button>
              </div>
            )}

            {/* Price */}
            {!isTips && (
              <div className="mt-4">
                {headerPrice > 0 ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm text-gray-500">{headerPriceLabel ?? t('booking.fromLabel')}</span>
                    <span className="text-3xl font-bold text-primary-600">{fmtKRW(headerPrice)}</span>
                    <span className="text-sm text-gray-500">{t('booking.perPersonLabel')}</span>
                  </div>
                ) : (
                  <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">{t('booking.freeRequest')}</span>
                )}
              </div>
            )}

            {/* Dietary badges */}
            {isRestaurant && Object.keys(dietary).some(k => dietary[k]) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {dietary.vegetarian && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">🥦 {td('dietaryVegetarian')}</span>}
                {dietary.pescetarian && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">🐟 {td('dietaryPescetarian')}</span>}
                {dietary.halal && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">🕌 {td('dietaryHalal')}</span>}
                {dietary.gluten_free && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">🌾 {td('dietaryGlutenFree')}</span>}
                {dietary.non_dairy && <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">🥛 {td('dietaryNonDairy')}</span>}
              </div>
            )}

            {/* Divider */}
            <div className="mt-8 border-t border-gray-100 pt-8" />

            {/* ── Description ── */}
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {isRestaurant ? td('storyTitle') : isTips ? td('articleTitle') : (() => {
                const wellnessMap: Record<string, string> = {
                  'skin-clinic': td('aboutSkinClinic'),
                  'hair-salon': td('aboutHairSalon'),
                  'sauna': td('aboutSauna'),
                  'massage': td('aboutMassage'),
                };
                const activitiesMap: Record<string, string> = {
                  'local-experience': td('aboutLocalExperience'),
                  'cooking-classes': td('aboutCookingClass'),
                  'traditional-cultural-tours': td('aboutTour'),
                  'sports': td('aboutSports'),
                };
                if (cat === 'wellness') return wellnessMap[listing.subcategory] ?? td('aboutExperience');
                if (cat === 'activities') return activitiesMap[listing.subcategory] ?? td('aboutExperience');
                return td('aboutExperience');
              })()}
            </h2>
            <p className="leading-relaxed text-gray-700">{displayDescription}</p>
            {displayContent && <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">{displayContent}</div>}

            {/* ── TIPS ── */}
            {isTips && (
              <>
                {extra.tips?.length > 0 && (
                  <div className="mt-8">
                    <SectionHeader icon={<LightbulbIcon className="h-5 w-5" />} title={td('keyTipPoints')} />
                    <div className="space-y-4">
                      {extra.tips.map((tip: any, i: number) => (
                        <div key={i} className="rounded-xl border-l-4 border-primary-400 bg-primary-50 px-5 py-4">
                          {tip.title && <h3 className="mb-1 font-semibold text-primary-800">{tip.title}</h3>}
                          <p className="text-sm leading-relaxed text-gray-700">{tip.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {extra.youtube_url && getYouTubeId(extra.youtube_url) && (
                  <div className="mt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">{td('watchVideo')}</h2>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                      <iframe src={`https://www.youtube.com/embed/${getYouTubeId(extra.youtube_url)}`} title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" />
                    </div>
                  </div>
                )}
                {(extra.youtube_url || extra.instagram_url) && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {extra.youtube_url && <a href={extra.youtube_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>YouTube</a>}
                    {extra.instagram_url && <a href={extra.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-pink-200 bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-700 hover:bg-pink-100 transition"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>Instagram</a>}
                  </div>
                )}
                {(extra.map_description || extra.naver_map_url || extra.kakao_map_url || extra.google_map_url) && (
                  <div className="mt-8 rounded-xl border border-gray-100 p-5">
                    <div className="mb-3 flex items-center gap-2"><span className="text-primary-500"><PinIcon className="h-5 w-5" /></span><h2 className="text-lg font-bold text-gray-900">{td('locationInfo')}</h2></div>
                    {extra.map_description && <p className="mb-3 text-sm text-gray-600">{extra.map_description}</p>}
                    <MapButtons />
                    {extra.google_map_url && <div className="mt-4 overflow-hidden rounded-lg"><iframe src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address || extra.map_description || '')}&output=embed`} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
                  </div>
                )}
              </>
            )}

            {/* ── RESTAURANT ── */}
            {isRestaurant && (
              <>
                {menuItems.length > 0 && (
                  <div className="mt-8">
                    <SectionHeader icon={<ProgramIcon className="h-5 w-5" />} title={td('menu')} />
                    {['main','side','drink'].map(c => {
                      const items = menuItems.filter(i => (i.category || 'main') === c);
                      if (!items.length) return null;
                      return (
                        <div key={c} className="mb-6">
                          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">{c === 'main' ? td('mainDishes') : c === 'side' ? td('sideDishes') : td('drinksAndAlcohol')}</h3>
                          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                            {items.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 px-4 py-3">
                                {item.image_url && <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg"><Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="56px" /></div>}
                                <div className="flex flex-1 items-center justify-between">
                                  <div><p className="font-medium text-gray-800">{mName(item)}</p>{mDesc(item) && <p className="text-xs text-gray-500">{mDesc(item)}</p>}</div>
                                  <span className="ml-4 shrink-0 text-sm font-semibold text-primary-600">{item.price_variable ? td('variablePrice') : fmtKRW(item.price ?? 0)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-8 rounded-xl border border-gray-100 p-5">
                  <div className="mb-3 flex items-center gap-2"><span className="text-primary-500"><PinIcon className="h-5 w-5" /></span><h2 className="text-lg font-bold text-gray-900">{td('locationAndInfo')}</h2></div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <InfoRow icon={<PinIcon />} label={td('address')} value={listing.address} />
                    <InfoRow icon={<PhoneIcon />} label={td('phone')} value={listing.phone} />
                    <InfoRow icon={<ClockIcon />} label={td('hours')} value={listing.operating_hours} />
                    <InfoRow icon={<CoffeeIcon />} label={td('breakTime')} value={extra.break_time} />
                    <InfoRow icon={<ClosedIcon />} label={td('closed')} value={extra.holidays} />
                  </div>
                  <MapButtons />
                  {extra.google_map_url && <div className="mt-4 overflow-hidden rounded-lg"><iframe src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address)}&output=embed&t=k`} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
                </div>
                {extra.reservation_notices?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('reservationInfo')} /><div className="space-y-2">{extra.reservation_notices.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">{i+1}</span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
                {extra.cancellation_policy?.length > 0 && <div className="mt-8"><SectionHeader icon={<RefreshIcon className="h-5 w-5" />} title={td('cancellationPolicy')} /><div className="space-y-2">{extra.cancellation_policy.map((p: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" /><span className="text-sm text-gray-700">{p}</span></div>)}</div></div>}
                {extra.important_notes?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('thingsToKnow')} /><div className="grid gap-2 sm:grid-cols-2">{extra.important_notes.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-0.5 flex-shrink-0 text-primary-400"><InfoCircleIcon className="h-4 w-4" /></span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
              </>
            )}

            {/* ── WELLNESS ── */}
            {cat === 'wellness' && (
              <>
                <div className="mt-8 rounded-xl border border-gray-100 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-primary-500">{listing.subcategory === 'sauna' ? <SaunaIcon className="h-5 w-5" /> : listing.subcategory === 'massage' ? <MassageServiceIcon className="h-5 w-5" /> : <VenueIcon className="h-5 w-5" />}</span>
                    <h2 className="text-lg font-bold text-gray-900">{listing.subcategory === 'sauna' ? td('saunaInfo') : listing.subcategory === 'hair-salon' ? td('salonInfo') : listing.subcategory === 'skin-clinic' ? td('clinicInfo') : td('venueInfo')}</h2>
                  </div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <InfoRow icon={<PinIcon />} label={td('address')} value={listing.address} />
                    <InfoRow icon={<PhoneIcon />} label={td('phone')} value={listing.phone} />
                    <InfoRow icon={<ClockIcon />} label={td('hours')} value={listing.operating_hours} />
                    <InfoRow icon={<CoffeeIcon />} label={td('breakTime')} value={extra.break_time} />
                    <InfoRow icon={<ClosedIcon />} label={td('closed')} value={extra.holidays} />
                    <InfoRow icon={<PersonIcon />} label={td('genderPolicy')} value={extra.gender_policy} />
                  </div>
                  {extra.english_staff && <div className="mt-3"><Check>{td('englishStaffAvailable')}</Check></div>}
                  <MapButtons />
                  {extra.google_map_url && <div className="mt-4 overflow-hidden rounded-lg"><iframe src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address)}&output=embed&t=k`} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
                </div>
                {listing.subcategory === 'sauna' && (extra.adult_price || extra.child_price) && <div className="mt-8"><SectionHeader icon={<MoneyIcon className="h-5 w-5" />} title={td('admissionPricing')} /><p className="mb-3 text-xs text-gray-400">{td('childAgeSauna')}</p><div className="grid gap-3 sm:grid-cols-2">{extra.adult_price > 0 && <div className="rounded-xl border border-gray-100 p-4 text-center"><p className="text-sm font-medium text-gray-500">{td('adultAgeLabel')}</p><p className="mt-1 text-2xl font-bold text-primary-600">₩{Number(extra.adult_price).toLocaleString()}</p></div>}{extra.child_price > 0 && <div className="rounded-xl border border-gray-100 p-4 text-center"><p className="text-sm font-medium text-gray-500">{td('childAgeLabel')}</p><p className="mt-1 text-2xl font-bold text-primary-600">₩{Number(extra.child_price).toLocaleString()}</p></div>}</div></div>}
                {listing.subcategory === 'sauna' && extra.facilities?.length > 0 && <div className="mt-8"><SectionHeader icon={<FacilitiesIcon className="h-5 w-5" />} title={td('facilitiesAndAmenities')} /><div className="grid gap-2 sm:grid-cols-2">{extra.facilities.map((f: string, i: number) => <Check key={i}>{f}</Check>)}</div></div>}
                {extra.staff?.length > 0 && <div className="mt-8"><SectionHeader icon={listing.subcategory === 'skin-clinic' ? <DoctorIcon className="h-5 w-5" /> : <ScissorsIcon className="h-5 w-5" />} title={listing.subcategory === 'skin-clinic' ? td('ourDoctors') : td('ourHairDesigners')} /><div className="grid gap-4 sm:grid-cols-2">{extra.staff.map((m: any, i: number) => <div key={i} className="flex gap-4 rounded-xl border border-gray-100 p-4">{m.photo ? <img src={m.photo} alt={m.name} className="h-16 w-16 flex-shrink-0 rounded-full object-cover" /> : <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">{listing.subcategory === 'skin-clinic' ? <DoctorIcon className="h-8 w-8" /> : <ScissorsIcon className="h-8 w-8" />}</div>}<div className="min-w-0"><p className="font-semibold text-gray-800">{m.name}</p>{m.title && <p className="text-xs text-primary-600">{m.title}</p>}{m.bio && <p className="mt-1 text-xs leading-relaxed text-gray-500">{m.bio}</p>}</div></div>)}</div></div>}
                {menuItems.length > 0 && <div className="mt-8"><SectionHeader icon={<MenuPriceIcon className="h-5 w-5" />} title={listing.subcategory === 'skin-clinic' ? td('treatmentsAndPrices') : listing.subcategory === 'hair-salon' ? td('servicesAndPrices') : listing.subcategory === 'sauna' ? td('addOnsAndCafeteria') : td('massageOptionsAndPrices')} /><div className="divide-y divide-gray-100 rounded-xl border border-gray-100">{menuItems.map((item, i) => <div key={i} className="flex items-start gap-3 px-4 py-3"><div className="flex flex-1 items-center justify-between"><div><p className="font-medium text-gray-800">{mName(item)}</p>{mDesc(item) && <p className="text-xs text-gray-500">{mDesc(item)}</p>}</div><span className="ml-4 shrink-0 text-sm font-semibold text-primary-600">{item.price_variable ? td('variablePrice') : fmtKRW(item.price ?? 0)}</span></div></div>)}</div></div>}
                {extra.reservation_notices?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('reservationInfo')} /><div className="space-y-2">{extra.reservation_notices.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">{i+1}</span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
                {extra.cancellation_policy?.length > 0 && <div className="mt-8"><SectionHeader icon={<RefreshIcon className="h-5 w-5" />} title={td('cancellationPolicy')} /><div className="space-y-2">{extra.cancellation_policy.map((p: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" /><span className="text-sm text-gray-700">{p}</span></div>)}</div></div>}
                {extra.important_notes?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('thingsToKnow')} /><div className="grid gap-2 sm:grid-cols-2">{extra.important_notes.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-0.5 flex-shrink-0 text-primary-400"><InfoCircleIcon className="h-4 w-4" /></span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
              </>
            )}

            {/* ── ACTIVITIES ── */}
            {cat === 'activities' && (
              <>
                <div className="mt-8 rounded-xl border border-gray-100 p-5">
                  <div className="mb-3 flex items-center gap-2"><span className="text-primary-500"><ActivityIcon className="h-5 w-5" /></span><h2 className="text-lg font-bold text-gray-900">{td('activityDetails')}</h2></div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <InfoRow icon={<TimerIcon />} label={td('duration')} value={extra.duration} />
                    <InfoRow icon={<PeopleIcon />} label={td('groupSize')} value={extra.group_size} />
                    <InfoRow icon={<DifficultyIcon />} label={td('difficulty')} value={extra.difficulty} />
                    <InfoRow icon={<AgeIcon />} label={td('ageRequirement')} value={extra.age_requirement} />
                    <InfoRow icon={<ClockIcon />} label={td('startTime')} value={extra.start_time} />
                    <InfoRow icon={<ClockIcon />} label={td('endTime')} value={extra.end_time} />
                    <InfoRow icon={<PinIcon />} label={td('meetingPoint')} value={extra.meeting_point} />
                    <InfoRow icon={<FlagIcon />} label={td('endDropoff')} value={extra.end_point} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {extra.english_guide && <Check>{td('englishGuide')}</Check>}
                    {extra.pickup_available && <Check>{td('pickupAvailable')}</Check>}
                    {extra.dropoff_available && <Check>{td('dropoffAvailable')}</Check>}
                  </div>
                </div>
                {extra.age_pricing?.length > 0 && <div className="mt-8"><SectionHeader icon={<MoneyIcon className="h-5 w-5" />} title={td('pricingByAge')} /><div className="divide-y divide-gray-100 rounded-xl border border-gray-100">{extra.age_pricing.map((tier: any, i: number) => <div key={i} className="flex items-center justify-between px-4 py-3"><span className="font-medium text-gray-700">{tier.label}</span><span className="font-semibold text-primary-600">₩{Number(tier.price).toLocaleString()}</span></div>)}</div></div>}
                {extra.included?.length > 0 && <div className="mt-8"><SectionHeader icon={<IncludedIcon className="h-5 w-5" />} title={td('whatsIncluded')} /><ListBadges items={extra.included} green /></div>}
                {extra.excluded?.length > 0 && <div className="mt-6"><SectionHeader icon={<ExcludedIcon className="h-5 w-5" />} title={td('notIncluded')} /><ListBadges items={extra.excluded} /></div>}
                {extra.what_to_bring?.length > 0 && <div className="mt-6"><SectionHeader icon={<BackpackIcon className="h-5 w-5" />} title={td('whatToBring')} /><ListBadges items={extra.what_to_bring} /></div>}
                {menuItems.length > 0 && <div className="mt-8"><SectionHeader icon={<ProgramIcon className="h-5 w-5" />} title={td('programOptions')} /><div className="divide-y divide-gray-100 rounded-xl border border-gray-100">{menuItems.map((item, i) => <div key={i} className="flex items-start justify-between px-4 py-3"><div><p className="font-medium text-gray-800">{mName(item)}</p>{mDesc(item) && <p className="text-xs text-gray-500">{mDesc(item)}</p>}</div>{item.price_variable ? <span className="ml-4 shrink-0 text-sm font-semibold text-primary-600">{td('variablePrice')}</span> : item.price > 0 && <span className="ml-4 shrink-0 text-sm font-semibold text-primary-600">{fmtKRW(item.price)}</span>}</div>)}</div></div>}
                {(listing.address || listing.phone || extra.naver_map_url || extra.kakao_map_url || extra.google_map_url) && <div className="mt-8 rounded-xl border border-gray-100 p-5"><div className="mb-3 flex items-center gap-2"><span className="text-primary-500"><PinIcon className="h-5 w-5" /></span><h2 className="text-lg font-bold text-gray-900">{td('contactAndLocation')}</h2></div><div className="grid gap-1 sm:grid-cols-2"><InfoRow icon={<PinIcon />} label={td('address')} value={listing.address} /><InfoRow icon={<PhoneIcon />} label={td('phone')} value={listing.phone} /><InfoRow icon={<ClockIcon />} label={td('schedule')} value={listing.operating_hours} /></div><MapButtons />{extra.google_map_url && <div className="mt-4 overflow-hidden rounded-lg"><iframe src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address || extra.meeting_point || '')}&output=embed`} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}</div>}
                {extra.reservation_notices?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('reservationInfo')} /><div className="space-y-2">{extra.reservation_notices.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-blue-50 p-3"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700">{i+1}</span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
                {extra.cancellation_policy?.length > 0 && <div className="mt-8"><SectionHeader icon={<RefreshIcon className="h-5 w-5" />} title={td('cancellationPolicy')} /><div className="space-y-2">{extra.cancellation_policy.map((p: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" /><span className="text-sm text-gray-700">{p}</span></div>)}</div></div>}
                {extra.important_notes?.length > 0 && <div className="mt-8"><SectionHeader icon={<InfoCircleIcon className="h-5 w-5" />} title={td('thingsToKnow')} /><div className="grid gap-2 sm:grid-cols-2">{extra.important_notes.map((n: string, i: number) => <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"><span className="mt-0.5 flex-shrink-0 text-primary-400"><InfoCircleIcon className="h-4 w-4" /></span><span className="text-sm text-gray-700">{n}</span></div>)}</div></div>}
              </>
            )}

            {/* ── Reviews ── */}
            {hasReviews && (
              <div ref={reviewsRef} className="mt-10 scroll-mt-8 border-t border-gray-100 pt-8">
                <SectionHeader icon={<StarIconOutline className="h-5 w-5" />} title={`${td('reviews')} (${extra.external_reviews.length})`} />
                <div className="space-y-3">
                  {extra.external_reviews.map((review: any, i: number) => <ReviewCard key={i} review={review} td={td} />)}
                </div>
              </div>
            )}

            {/* ── Booking ── */}
            {!isTips && (
              <div ref={bookingRef} className="mt-10 scroll-mt-8 border-t border-gray-100 pt-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">{cat === 'activities' ? t('booking.title') : t('booking.titlePlace')}</h2>
                <div>
                  <BookingForm listing={listing} />
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT 2: sticky action panel ── */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-3">
              {/* More Details → scroll to content */}
              <button
                onClick={() => scrollTo(contentRef)}
                className="w-full rounded-xl border-2 border-gray-800 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50 active:scale-95"
              >
                {td('moreDetails')}
              </button>

              {/* Book Now → scroll to booking */}
              {!isTips && (
                <button
                  onClick={() => scrollTo(bookingRef)}
                  className="w-full rounded-xl bg-primary-500 py-3 text-sm font-bold text-white shadow-md shadow-primary-200 transition hover:bg-primary-600 active:scale-95"
                >
                  BOOK NOW
                </button>
              )}

              <div className="pt-2 border-t border-gray-100 space-y-1">
                {/* Reviews shortcut */}
                {hasReviews && (
                  <button
                    onClick={() => scrollTo(reviewsRef)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{td('reviews')} ({extra.external_reviews?.length})</span>
                  </button>
                )}

                {/* Real-time inquiry */}
                <a
                  href={`mailto:hello@mugoong.com?subject=${encodeURIComponent('Inquiry: ' + displayTitle)}`}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-primary-50 hover:text-primary-700"
                >
                  <svg className="h-4 w-4 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{td('inquiry')}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile: floating bottom bar */}
        {!isTips && (
          <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => scrollTo(contentRef)} className="flex-1 rounded-lg border-2 border-gray-800 py-3 text-sm font-bold text-gray-800">
              {td('moreDetails')}
            </button>
            <button onClick={() => scrollTo(bookingRef)} className="flex-1 rounded-lg bg-primary-500 py-3 text-sm font-bold text-white">
              BOOK NOW
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lbIdx !== null && <Lightbox images={allImages} idx={lbIdx} onClose={() => setLbIdx(null)} setIdx={setLbIdx} />}
    </div>
  );
}
