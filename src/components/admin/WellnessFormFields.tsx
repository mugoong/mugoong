'use client';

import { useState } from 'react';
import type { MenuItemJson } from '@/lib/supabase/types';

const LANGS = [
  { code: 'ko', flag: '🇰🇷', label: 'Korean' },
  { code: 'de', flag: '🇩🇪', label: 'German' },
  { code: 'es', flag: '🇪🇸', label: 'Spanish' },
  { code: 'fr', flag: '🇫🇷', label: 'French' },
  { code: 'ja', flag: '🇯🇵', label: 'Japanese' },
  { code: 'zh', flag: '🇨🇳', label: 'Chinese' },
] as const;

function MenuItemTranslations({ item, onUpdate }: { item: MenuItemJson; onUpdate: (field: string, value: any) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button type="button" onClick={() => setOpen(!open)} className="text-xs text-blue-500 hover:text-blue-700">
        🌐 Translations {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/40 p-2 space-y-1.5">
          {LANGS.map(({ code, flag, label }) => (
            <div key={code} className="grid grid-cols-[90px_1fr_1fr] items-center gap-1.5">
              <span className="text-xs text-gray-500">{flag} {label}</span>
              <input
                type="text"
                value={(item.name_translations as any)?.[code] ?? ''}
                onChange={e => {
                  const t = { ...(item.name_translations ?? {}), [code]: e.target.value };
                  if (!e.target.value) delete (t as any)[code];
                  onUpdate('name_translations', Object.keys(t).length ? t : undefined);
                }}
                className="rounded border border-gray-200 px-2 py-1 text-xs outline-none"
                placeholder={`Name in ${label}`}
              />
              <input
                type="text"
                value={(item.description_translations as any)?.[code] ?? ''}
                onChange={e => {
                  const t = { ...(item.description_translations ?? {}), [code]: e.target.value };
                  if (!e.target.value) delete (t as any)[code];
                  onUpdate('description_translations', Object.keys(t).length ? t : undefined);
                }}
                className="rounded border border-gray-200 px-2 py-1 text-xs outline-none"
                placeholder={`Desc in ${label}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface StaffMember { name: string; title: string; photo: string; bio: string; }

interface Props {
  subcategory: string;
  menuItems: MenuItemJson[];
  setMenuItems: (items: MenuItemJson[]) => void;
  extra: Record<string, any>;
  setExtra: (key: string, value: any) => void;
  operatingHours: string;
  setOperatingHours: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}

const cls = 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

export default function WellnessFormFields({
  subcategory, menuItems, setMenuItems, extra, setExtra,
  operatingHours, setOperatingHours, address, setAddress, phone, setPhone,
}: Props) {
  const isSkinClinic = subcategory === 'skin-clinic';
  const isHairSalon = subcategory === 'hair-salon';
  const isSauna = subcategory === 'sauna';

  /* ── staff array ── */
  const staff: StaffMember[] = extra.staff ?? [];
  const updStaff = (i: number, f: keyof StaffMember, v: string) => {
    const u = [...staff]; u[i] = { ...u[i], [f]: v };
    setExtra('staff', u);
  };

  /* ── facilities (sauna) ── */
  const facilities: string[] = extra.facilities ?? [];
  const updFacility = (i: number, v: string) => {
    const u = [...facilities]; u[i] = v; setExtra('facilities', u);
  };

  /* ── menu items ── */
  const updMenuItem = (i: number, f: keyof MenuItemJson, v: string | number | boolean) => {
    const items = [...menuItems]; items[i] = { ...items[i], [f]: v }; setMenuItems(items);
  };

  /* ── array helpers (notices / policy / notes / reviews) ── */
  const arrHelpers = (key: string) => {
    const arr: any[] = extra[key] ?? [];
    return {
      arr,
      add: (blank: any) => setExtra(key, [...arr, blank]),
      upd: (i: number, v: any) => { const u = [...arr]; u[i] = v; setExtra(key, u); },
      updField: (i: number, field: string, v: any) => { const u = [...arr]; u[i] = { ...u[i], [field]: v }; setExtra(key, u); },
      del: (i: number) => setExtra(key, arr.filter((_, idx) => idx !== i)),
    };
  };

  const noticesH = arrHelpers('reservation_notices');
  const policyH = arrHelpers('cancellation_policy');
  const notesH = arrHelpers('important_notes');
  const reviewsH = arrHelpers('external_reviews');

  const bookingType = extra.booking_type ?? (isSkinClinic ? 'free' : isSauna ? 'full_payment' : isHairSalon ? 'deposit' : 'full_payment');

  const staffLabel = isSkinClinic ? 'Doctors / Practitioners' : isHairSalon ? 'Hair Designers' : 'Staff';

  return (
    <>
      {/* ── Booking Type ── */}
      <section className="rounded-xl border border-teal-100 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-teal-700">✨ Booking & Payment Type</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['free', 'deposit', 'full_payment'] as const).map((type) => (
            <label key={type} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${bookingType === type ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-200'}`}>
              <input type="radio" name="booking_type" value={type} checked={bookingType === type} onChange={() => setExtra('booking_type', type)} className="accent-teal-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {type === 'free' ? 'Free (Request Only)' : type === 'deposit' ? 'Deposit / Booking Fee' : 'Full Payment'}
                </p>
                <p className="text-xs text-gray-400">
                  {type === 'free' ? 'No payment at booking' : type === 'deposit' ? 'Partial fee at booking' : 'Pay in full at booking'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Location & Contact ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">📍 Location & Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={cls} placeholder="Full address in English" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={cls} placeholder="+82-2-XXX-XXXX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Operating Hours</label>
            <input type="text" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} className={cls} placeholder="Mon-Sat 10:00-20:00" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Break Time</label>
            <input type="text" value={extra.break_time ?? ''} onChange={(e) => setExtra('break_time', e.target.value)} className={cls} placeholder="13:00-14:00" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Closed Days</label>
            <input type="text" value={extra.holidays ?? ''} onChange={(e) => setExtra('holidays', e.target.value)} className={cls} placeholder="Sundays, Public Holidays" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender Policy</label>
            <select value={extra.gender_policy ?? ''} onChange={(e) => setExtra('gender_policy', e.target.value)} className={cls}>
              <option value="">— No restriction —</option>
              <option value="All genders welcome">All genders welcome</option>
              {isSauna && <option value="Mixed (separate areas)">Mixed (separate areas)</option>}
              <option value="Female only">Female only</option>
              <option value="Male only">Male only</option>
            </select>
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={!!extra.english_staff} onChange={(e) => setExtra('english_staff', e.target.checked)} className="h-5 w-5 rounded border-gray-300 accent-teal-500" />
          <span className="text-sm font-medium text-gray-700">English-speaking staff available</span>
        </label>
      </section>

      {/* ── Sauna Pricing ── */}
      {isSauna && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">💰 Admission Pricing</h2>
          <p className="mb-4 text-xs text-gray-400">Child = Elementary school and below (age ≤ 12) · Adult = Middle school and above (age 13+)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Adult Price (₩)</label>
              <input type="number" value={extra.adult_price ?? ''} onChange={(e) => setExtra('adult_price', Number(e.target.value))} className={cls} placeholder="e.g. 15000" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Child Price (₩)</label>
              <input type="number" value={extra.child_price ?? ''} onChange={(e) => setExtra('child_price', Number(e.target.value))} className={cls} placeholder="e.g. 8000" />
            </div>
          </div>
        </section>
      )}

      {/* ── Sauna Facilities ── */}
      {isSauna && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">🛁 Facilities & Amenities</h2>
            <button type="button" onClick={() => setExtra('facilities', [...facilities, ''])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
          </div>
          {facilities.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">No facilities added yet.</p>
          ) : (
            <div className="space-y-2">
              {facilities.map((f, i) => (
                <div key={i} className="flex gap-3">
                  <input type="text" value={f} onChange={(e) => updFacility(i, e.target.value)} className={cls} placeholder="e.g. Infrared Sauna, Cold Pool, Outdoor Jacuzzi" />
                  <button type="button" onClick={() => setExtra('facilities', facilities.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Staff / Doctors (skin-clinic, hair-salon) ── */}
      {(isSkinClinic || isHairSalon) && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">👨‍⚕️ {staffLabel}</h2>
            <button type="button" onClick={() => setExtra('staff', [...staff, { name: '', title: '', photo: '', bio: '' }])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
          </div>
          {staff.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">No staff added yet.</p>
          ) : (
            <div className="space-y-4">
              {staff.map((member, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">#{i + 1}</span>
                    <button type="button" onClick={() => setExtra('staff', staff.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
                      <input type="text" value={member.name} onChange={(e) => updStaff(i, 'name', e.target.value)} className={cls} placeholder={isSkinClinic ? 'Dr. Kim Jiyeon' : 'Jisoo Park'} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">{isSkinClinic ? 'Title / Specialization' : 'Title / Role'}</label>
                      <input type="text" value={member.title} onChange={(e) => updStaff(i, 'title', e.target.value)} className={cls} placeholder={isSkinClinic ? 'Dermatologist · 12 yrs exp.' : 'Senior Hair Designer'} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">Photo URL</label>
                      <input type="text" value={member.photo} onChange={(e) => updStaff(i, 'photo', e.target.value)} className={cls} placeholder="https://..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">Bio / Credentials</label>
                      <textarea value={member.bio} onChange={(e) => updStaff(i, 'bio', e.target.value)} rows={2} className={cls} placeholder="Board-certified dermatologist specialising in..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Treatments / Services ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isSkinClinic ? '💉 Treatment List & Prices' : isHairSalon ? '✂️ Service Menu & Prices' : isSauna ? '🍜 Optional Add-ons / Cafeteria' : '💆 Massage Options & Prices'}
          </h2>
          <button type="button" onClick={() => setMenuItems([...menuItems, { name: '', price: 0, description: '' }])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Item</button>
        </div>
        {menuItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">
            {isSauna ? 'Optional — leave empty if no add-ons.' : 'No items added yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <input type="text" value={item.name} onChange={(e) => updMenuItem(i, 'name', e.target.value)} placeholder="Name" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" />
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 focus-within:border-primary-500">
                      <input type="number" value={item.price_variable ? 0 : (item.price || 0)} onChange={(e) => updMenuItem(i, 'price', Number(e.target.value))} placeholder="₩" disabled={!!item.price_variable} className="w-0 flex-1 min-w-0 py-2 text-sm outline-none disabled:text-gray-400 bg-transparent" />
                      <label className="flex items-center gap-0.5 whitespace-nowrap text-[10px] text-gray-400 cursor-pointer select-none">
                        <input type="checkbox" checked={!!item.price_variable} onChange={e => { const c = e.target.checked; const items = [...menuItems]; items[i] = { ...items[i], price_variable: c, ...(c ? { price: 0 } : {}) }; setMenuItems(items); }} className="rounded" />
                        변동
                      </label>
                    </div>
                    <input type="text" value={item.description ?? ''} onChange={(e) => updMenuItem(i, 'description', e.target.value)} placeholder="Duration / Details" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" />
                  </div>
                  <button type="button" onClick={() => setMenuItems(menuItems.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
                </div>
                <MenuItemTranslations item={item} onUpdate={(field, value) => updMenuItem(i, field as any, value as any)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Map Links ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🗺️ Map Links</h2>
        <div className="space-y-3">
          {[
            { key: 'naver_map_url', label: 'Naver Map URL', ph: 'https://naver.me/...' },
            { key: 'kakao_map_url', label: 'Kakao Map URL', ph: 'https://kko.to/...' },
            { key: 'google_map_url', label: 'Google Map URL', ph: 'https://maps.app.goo.gl/...' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
              <input type="url" value={extra[key] ?? ''} onChange={(e) => setExtra(key, e.target.value)} className={cls} placeholder={ph} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Reservation Notices ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">📋 Reservation Info & Notices</h2>
          <button type="button" onClick={() => noticesH.add('')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
        </div>
        {noticesH.arr.length === 0 ? <p className="text-sm text-gray-400">No notices added.</p> : (
          <div className="space-y-2">
            {noticesH.arr.map((n, i) => (
              <div key={i} className="flex gap-3">
                <input type="text" value={n} onChange={(e) => noticesH.upd(i, e.target.value)} className={cls} placeholder="e.g. Please arrive 10 min before your appointment" />
                <button type="button" onClick={() => noticesH.del(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Cancellation Policy ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">🔄 Cancellation Policy</h2>
          <button type="button" onClick={() => policyH.add('')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
        </div>
        {policyH.arr.length === 0 ? <p className="text-sm text-gray-400">No policies added.</p> : (
          <div className="space-y-2">
            {policyH.arr.map((p, i) => (
              <div key={i} className="flex gap-3">
                <input type="text" value={p} onChange={(e) => policyH.upd(i, e.target.value)} className={cls} placeholder="e.g. Free cancellation up to 24 hours before" />
                <button type="button" onClick={() => policyH.del(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Important Notes ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">⚠️ Important Notes</h2>
          <button type="button" onClick={() => notesH.add('')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
        </div>
        {notesH.arr.length === 0 ? <p className="text-sm text-gray-400">No notes added.</p> : (
          <div className="space-y-2">
            {notesH.arr.map((n, i) => (
              <div key={i} className="flex gap-3">
                <input type="text" value={n} onChange={(e) => notesH.upd(i, e.target.value)} className={cls} placeholder="e.g. Consultation required for first-time patients" />
                <button type="button" onClick={() => notesH.del(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── External Reviews ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">⭐ External Reviews</h2>
          <button type="button" onClick={() => reviewsH.add({ source: '', reviewer: '', rating: 5, text: '', translation_en: '', date: '' })} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Review</button>
        </div>
        {reviewsH.arr.length === 0 ? <p className="text-sm text-gray-400">No reviews added.</p> : (
          <div className="space-y-4">
            {reviewsH.arr.map((rev, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Review #{i + 1}</span>
                  <button type="button" onClick={() => reviewsH.del(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Source</label><input type="text" value={rev.source} onChange={(e) => reviewsH.updField(i, 'source', e.target.value)} className={cls} placeholder="Google, Naver, Kakao" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Reviewer</label><input type="text" value={rev.reviewer} onChange={(e) => reviewsH.updField(i, 'reviewer', e.target.value)} className={cls} placeholder="Anonymous" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Rating (1–5)</label><input type="number" min={1} max={5} value={rev.rating} onChange={(e) => reviewsH.updField(i, 'rating', Number(e.target.value))} className={cls} /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Date</label><input type="text" value={rev.date ?? ''} onChange={(e) => reviewsH.updField(i, 'date', e.target.value)} className={cls} placeholder="2024-11" /></div>
                  <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-gray-600">Review Text (original)</label><textarea value={rev.text} onChange={(e) => reviewsH.updField(i, 'text', e.target.value)} rows={2} className={cls} placeholder="Original review in any language" /></div>
                  <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-gray-600">English Translation (optional)</label><textarea value={rev.translation_en ?? ''} onChange={(e) => reviewsH.updField(i, 'translation_en', e.target.value)} rows={2} className={cls} placeholder="English translation…" /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
