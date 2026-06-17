'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { Listing } from '@/types';

function parseExtra(notes?: string): Record<string, any> {
  if (!notes) return {};
  try { const p = JSON.parse(notes); return p.__extra ?? {}; } catch { return {}; }
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en-GB', de: 'de-DE', es: 'es-ES',
  fr: 'fr-FR', ja: 'ja-JP', zh: 'zh-CN', ko: 'ko-KR',
};

function toIntl(locale: string): string {
  return LOCALE_MAP[locale] ?? 'en-GB';
}

function fmtDate(dateStr: string, locale: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(toIntl(locale), {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return dateStr; }
}

/* ── Inline calendar popup ── */
function CalendarPicker({
  value, onChange, minDate, placeholder, locale,
}: {
  value: string; onChange: (v: string) => void;
  minDate: string; placeholder: string; locale: string;
}) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);
  const intl = toIntl(locale);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const monthLabel = new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric' })
    .format(new Date(viewYear, viewMonth));

  /* Monday-first weekday headers */
  const dayHeaders = [1, 2, 3, 4, 5, 6, 0].map(n =>
    new Intl.DateTimeFormat(intl, { weekday: 'short' }).format(new Date(2024, 0, 7 + n))
  );

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const rawFirstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const offset = (rawFirstDay + 6) % 7; // convert to Monday=0

  const minObj = new Date(minDate + 'T00:00:00');
  const todayStr = today.toISOString().split('T')[0];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (d < minObj) return;
    const str = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(str);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-100 ${
          value ? 'border-primary-300 text-gray-900' : 'border-gray-200 text-gray-400'
        }`}
      >
        <span>{value ? fmtDate(value, locale) : placeholder}</span>
        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          {/* Month nav */}
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={prevMonth}
              className="rounded-lg p-1.5 text-lg text-gray-500 hover:bg-gray-100 leading-none">‹</button>
            <span className="text-sm font-semibold capitalize text-gray-800">{monthLabel}</span>
            <button type="button" onClick={nextMonth}
              className="rounded-lg p-1.5 text-lg text-gray-500 hover:bg-gray-100 leading-none">›</button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {dayHeaders.map(d => (
              <span key={d} className="py-1 text-xs font-medium text-gray-400">{d}</span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: offset }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const disabled = new Date(viewYear, viewMonth, day) < minObj;
              const selected = ds === value;
              const isToday = ds === todayStr;
              return (
                <button key={day} type="button" disabled={disabled} onClick={() => selectDay(day)}
                  className={[
                    'rounded-lg py-1.5 text-sm transition-colors',
                    selected ? 'bg-primary-500 font-semibold text-white' : '',
                    !selected && isToday ? 'font-bold text-primary-600' : '',
                    !selected && !disabled ? 'hover:bg-primary-50 text-gray-700' : '',
                    disabled ? 'cursor-not-allowed text-gray-300' : '',
                  ].join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════ */

export default function BookingForm({ listing }: { listing: Listing }) {
  const t = useTranslations('booking');
  const locale = useLocale();

  const extra = parseExtra(listing.notes);
  const menuItems: any[] = listing.menu_items ?? [];
  const isRestaurant = listing.category === 'restaurants';
  const isSauna = listing.subcategory === 'sauna';
  const agePricing: { label: string; price: number }[] = extra.age_pricing ?? [];
  const isAgePricingMode = agePricing.length > 0;
  const isSaunaMode = isSauna && (extra.adult_price > 0 || extra.child_price > 0);

  const bookingType: 'free' | 'deposit' | 'full_payment' =
    listing.price_display_type === 'from' ? 'free'
    : (listing.price_display_type === 'deposit' || listing.price_display_type === 'reserve') ? 'deposit'
    : (isRestaurant && (extra.booking_deposit ?? 0) > 0) ? 'deposit'
    : isRestaurant ? 'free'
    : extra.booking_type ?? 'free';

  /* ── form state ── */
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [guests, setGuests] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [ageCounts, setAgeCounts] = useState<number[]>(agePricing.map(() => 0));
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  /* ── price calculation ── */
  let total = 0;
  let totalGuests = 0;

  if (bookingType === 'deposit') {
    total = listing.price_display_type === 'reserve'
      ? (listing.reserve_fee ?? 0)
      : isRestaurant ? (extra.booking_deposit ?? listing.price) : (extra.booking_deposit ?? 0);
    totalGuests = guests;
  } else if (bookingType === 'full_payment') {
    if (isSaunaMode) {
      total = adults * (extra.adult_price ?? 0) + children * (extra.child_price ?? 0);
      totalGuests = adults + children;
    } else if (isAgePricingMode) {
      total = agePricing.reduce((sum, tier, i) => sum + (ageCounts[i] ?? 0) * tier.price, 0);
      totalGuests = ageCounts.reduce((s, c) => s + c, 0);
    } else if (menuItems.length > 0) {
      total = Array.from(selectedItems).reduce((sum, i) => sum + menuItems[i].price, 0);
      totalGuests = guests;
    } else {
      total = listing.price * guests;
      totalGuests = guests;
    }
  } else {
    totalGuests = guests;
  }

  const toggleItem = (i: number) => {
    const s = new Set(selectedItems);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelectedItems(s);
  };

  const setAgeCount = (i: number, delta: number) => {
    const updated = [...ageCounts];
    updated[i] = Math.max(0, (updated[i] ?? 0) + delta);
    setAgeCounts(updated);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const timeSlots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) { setError('Please select a date.'); return; }
    if (!time) { setError('Please select a time.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const selectedItemsList = Array.from(selectedItems).map(i => ({
        name: menuItems[i].name,
        price: menuItems[i].price,
        description: menuItems[i].description ?? '',
      }));

      const agePricingBreakdown = isAgePricingMode
        ? agePricing.map((tier, i) => ({ label: tier.label, price: tier.price, count: ageCounts[i] ?? 0 })).filter(t => t.count > 0)
        : [];

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          listing_title: listing.title,
          listing_category: listing.category,
          listing_subcategory: listing.subcategory,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          booking_date: date,
          booking_time: time,
          guests: totalGuests || guests,
          total_price: total,
          booking_type: bookingType,
          notes,
          selected_items: selectedItemsList,
          age_pricing_breakdown: agePricingBreakdown,
          adults: isSaunaMode ? adults : undefined,
          children: isSaunaMode ? children : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Booking failed');
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h3 className="text-lg font-bold text-gray-900">{t('requestSent')}</h3>
        <p className="mt-2 text-sm text-gray-500">
          {bookingType === 'free' ? t('requestReceivedFor') : t('bookingReceivedFor')} <strong>{listing.title}</strong>.
        </p>
        <div className="mt-4 rounded-lg bg-primary-50 p-4 text-left text-sm space-y-1">
          <p><strong>{t('dateLabel')}:</strong> {fmtDate(date, locale)}</p>
          <p><strong>{t('timeLabel')}:</strong> {time}</p>
          {bookingType !== 'free' && total > 0 && <p><strong>{t('amountLabel')}:</strong> ₩{total.toLocaleString('ko-KR')}</p>}
          {bookingType === 'free' && <p className="text-green-600 font-medium">{t('noPaymentRequired')}</p>}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          {t('confirmationSentTo')} <strong>{email}</strong> {t('within24Hours')}
        </p>
        <button onClick={() => { setSubmitted(false); setSelectedItems(new Set()); setAgeCounts(agePricing.map(() => 0)); }} className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">
          {t('makeAnotherBooking')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      {/* Header price display */}
      <h3 className="mb-1 text-lg font-bold text-gray-900">Book With MUGOONG</h3>
      <div className="mb-1 flex items-baseline gap-1.5">
        {bookingType === 'free' ? (
          <span className="text-sm text-gray-500">{t('freeBookingDesc')}</span>
        ) : bookingType === 'deposit' ? (
          <>
            <span className="text-sm text-gray-500">
              {listing.price_display_type === 'reserve' ? 'Reserve From' : t('bookingFeeLabel')}
            </span>
            <span className="text-3xl font-bold text-primary-600">
              {listing.price_display_type === 'reserve'
                ? `₩${(listing.reserve_fee ?? 0).toLocaleString('ko-KR')}`
                : `₩${(isRestaurant ? (extra.booking_deposit ?? listing.price) : (extra.booking_deposit ?? 0)).toLocaleString('ko-KR')}`}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-500">{t('fromLabel')}</span>
            <span className="text-3xl font-bold text-primary-600">₩{listing.price.toLocaleString('ko-KR')}</span>
            <span className="text-sm text-gray-500">{t('perPersonLabel')}</span>
          </>
        )}
      </div>
      {bookingType === 'deposit' && listing.price_display_type === 'deposit' && (
        <p className="mb-4 text-xs text-blue-600">{t('depositFeeNote')}</p>
      )}
      {bookingType === 'deposit' && listing.price_display_type === 'reserve' && (
        <p className="mb-4 text-xs text-amber-600">{t('reserveFeeNote')}</p>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('yourName')} *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder={t('yourNamePlaceholder')} />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('emailLabel')} *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder={t('emailPlaceholder')} />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('phoneLabel')}</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder={t('phonePlaceholder')} />
        </div>

        {/* Date — custom calendar picker */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('selectDate')} *</label>
          <CalendarPicker
            value={date}
            onChange={setDate}
            minDate={minDate}
            placeholder={t('selectDate')}
            locale={locale}
          />
        </div>

        {/* Time */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('selectTime')} *</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} required className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
            <option value="">{t('selectTime')}</option>
            {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>

        {/* ── Guest count (simple) ── */}
        {!isAgePricingMode && !isSaunaMode && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('guests')}</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600">−</button>
              <span className="w-12 text-center text-lg font-semibold text-gray-800">{guests}</span>
              <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600">+</button>
              <span className="text-sm text-gray-500">{guests === 1 ? t('guest') : t('guestsPlural')}</span>
            </div>
          </div>
        )}

        {/* ── Sauna: Adult / Child counters ── */}
        {isSaunaMode && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t('guests')}</label>
            <p className="mb-3 text-xs text-gray-400">{t('childSaunaNote')}</p>
            <div className="space-y-3">
              {[
                { label: t('adultAge'), price: extra.adult_price ?? 0, count: adults, setCount: setAdults },
                { label: t('childAge'), price: extra.child_price ?? 0, count: children, setCount: setChildren },
              ].map(({ label, price, count, setCount }) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-primary-600">₩{price.toLocaleString('ko-KR')} {t('perPersonLabel')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCount(Math.max(0, count - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600">−</button>
                    <span className="w-8 text-center font-semibold text-gray-800">{count}</span>
                    <button type="button" onClick={() => setCount(Math.min(20, count + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Age-based pricing (activities) ── */}
        {isAgePricingMode && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t('numberOfParticipants')}</label>
            <div className="space-y-3">
              {agePricing.map((tier, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{tier.label}</p>
                    <p className="text-xs text-primary-600">₩{tier.price.toLocaleString('ko-KR')} {t('perPersonLabel')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setAgeCount(i, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600">−</button>
                    <span className="w-8 text-center font-semibold text-gray-800">{ageCounts[i] ?? 0}</span>
                    <button type="button" onClick={() => setAgeCount(i, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-primary-500 hover:text-primary-600">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Menu item selection ── */}
        {menuItems.length > 0 && !isRestaurant && !isSaunaMode && !isAgePricingMode && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {bookingType === 'free' ? t('interestedIn') : t('selectServices')}
            </label>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
              {menuItems.map((item, i) => (
                <label key={i} className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${selectedItems.has(i) ? 'bg-primary-50' : ''}`}>
                  <input type="checkbox" checked={selectedItems.has(i)} onChange={() => toggleItem(i)} className="h-4 w-4 rounded border-gray-300 accent-primary-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                  </div>
                  <span className="text-sm font-semibold text-primary-600">₩{item.price?.toLocaleString('ko-KR')}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('specialRequests')}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder={t('specialRequestsPlaceholder')} />
        </div>

        {/* Total Summary */}
        <div className="rounded-lg bg-gray-50 p-4">
          {bookingType === 'free' ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">{t('noPaymentRequired')}</p>
              <p className="mt-0.5 text-xs text-gray-400">{t('confirmByEmail')}</p>
            </div>
          ) : bookingType === 'deposit' ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {listing.price_display_type === 'reserve' ? 'Reserve From' : t('bookingFeeLabel')}
                </p>
                <p className="text-xs text-gray-400">
                  {listing.price_display_type === 'reserve' ? t('reserveFeeNote') : t('depositFeeNote')}
                </p>
              </div>
              <span className="text-xl font-bold text-gray-900">₩{total.toLocaleString('ko-KR')}</span>
            </div>
          ) : (
            <div className="space-y-1">
              {isSaunaMode && (
                <>
                  {adults > 0 && <div className="flex justify-between text-sm text-gray-600"><span>{t('adultAge')} × {adults}</span><span>₩{(adults * (extra.adult_price ?? 0)).toLocaleString('ko-KR')}</span></div>}
                  {children > 0 && <div className="flex justify-between text-sm text-gray-600"><span>{t('childAge')} × {children}</span><span>₩{(children * (extra.child_price ?? 0)).toLocaleString('ko-KR')}</span></div>}
                </>
              )}
              {isAgePricingMode && agePricing.map((tier, i) => ageCounts[i] > 0 && (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{tier.label} × {ageCounts[i]}</span>
                  <span>₩{(ageCounts[i] * tier.price).toLocaleString('ko-KR')}</span>
                </div>
              ))}
              {!isSaunaMode && !isAgePricingMode && menuItems.length === 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₩{listing.price.toLocaleString('ko-KR')} × {guests}</span>
                  <span>₩{total.toLocaleString('ko-KR')}</span>
                </div>
              )}
              {!isSaunaMode && !isAgePricingMode && selectedItems.size > 0 && Array.from(selectedItems).map(i => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>{menuItems[i].name}</span>
                  <span>₩{menuItems[i].price?.toLocaleString('ko-KR')}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-gray-200 pt-2 mt-1">
                <span className="font-semibold text-gray-700">{t('total')}</span>
                <span className="text-xl font-bold text-gray-900">₩{total.toLocaleString('ko-KR')}</span>
              </div>
            </div>
          )}
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        {/* Submit */}
        <button type="submit" disabled={submitting || (isSaunaMode && adults + children === 0) || (isAgePricingMode && ageCounts.reduce((s, c) => s + c, 0) === 0)} className="w-full rounded-lg bg-primary-500 py-4 text-base font-semibold text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? t('submitting') : bookingType === 'free' ? t('requestBooking') : bookingType === 'deposit' ? `${t('payBookingFee')} ₩${total.toLocaleString('ko-KR')}` : `${t('bookNowBtn')} ₩${total.toLocaleString('ko-KR')}`}
        </button>

        {/* Trust signals */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t('instantConfirmation')}
          </div>
          {bookingType === 'free' && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {t('noPaymentAtVenue')}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
