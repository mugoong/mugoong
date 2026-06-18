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

interface AgePricing { label: string; price: number; }

interface Props {
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

export default function ActivitiesFormFields({
  menuItems, setMenuItems, extra, setExtra,
  operatingHours, setOperatingHours, address, setAddress, phone, setPhone,
}: Props) {

  /* ── age pricing ── */
  const agePricing: AgePricing[] = extra.age_pricing ?? [];
  const updAgePricing = (i: number, f: keyof AgePricing, v: string | number) => {
    const u = [...agePricing]; u[i] = { ...u[i], [f]: v }; setExtra('age_pricing', u);
  };

  /* ── menu items ── */
  const updMenuItem = (i: number, f: keyof MenuItemJson, v: string | number | boolean) => {
    const items = [...menuItems]; items[i] = { ...items[i], [f]: v }; setMenuItems(items);
  };

  /* ── generic array helpers ── */
  const arrH = (key: string) => {
    const arr: any[] = extra[key] ?? [];
    return {
      arr,
      add: (blank: any = '') => setExtra(key, [...arr, blank]),
      upd: (i: number, v: any) => { const u = [...arr]; u[i] = v; setExtra(key, u); },
      updField: (i: number, field: string, v: any) => { const u = [...arr]; u[i] = { ...u[i], [field]: v }; setExtra(key, u); },
      del: (i: number) => setExtra(key, arr.filter((_, idx) => idx !== i)),
    };
  };

  const reviewsH = arrH('external_reviews');
  const noticesH = arrH('reservation_notices');
  const policyH = arrH('cancellation_policy');
  const notesH = arrH('important_notes');

  return (
    <>
      {/* ── Activity Details ── */}
      <section className="rounded-xl border border-orange-100 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-orange-700">🎯 Activity Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Duration</label>
            <input type="text" value={extra.duration ?? ''} onChange={(e) => setExtra('duration', e.target.value)} className={cls} placeholder="e.g. 3 hours" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Group Size</label>
            <input type="text" value={extra.group_size ?? ''} onChange={(e) => setExtra('group_size', e.target.value)} className={cls} placeholder="e.g. 2–12 people" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Difficulty</label>
            <select value={extra.difficulty ?? ''} onChange={(e) => setExtra('difficulty', e.target.value)} className={cls}>
              <option value="">— Select —</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Age Requirement</label>
            <input type="text" value={extra.age_requirement ?? ''} onChange={(e) => setExtra('age_requirement', e.target.value)} className={cls} placeholder="e.g. All ages / 7+ years" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Time</label>
            <input type="text" value={extra.start_time ?? ''} onChange={(e) => setExtra('start_time', e.target.value)} className={cls} placeholder="e.g. 10:00 AM" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">End Time</label>
            <input type="text" value={extra.end_time ?? ''} onChange={(e) => setExtra('end_time', e.target.value)} className={cls} placeholder="e.g. 1:00 PM" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meeting Point</label>
            <input type="text" value={extra.meeting_point ?? ''} onChange={(e) => setExtra('meeting_point', e.target.value)} className={cls} placeholder="e.g. Hongdae Station Exit 9" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">End / Dropoff Point</label>
            <input type="text" value={extra.end_point ?? ''} onChange={(e) => setExtra('end_point', e.target.value)} className={cls} placeholder="e.g. Same as meeting point" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          {[
            { key: 'pickup_available', label: 'Pickup available' },
            { key: 'dropoff_available', label: 'Dropoff available' },
            { key: 'english_guide', label: 'English-speaking guide' },
          ].map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={!!extra[key]} onChange={(e) => setExtra(key, e.target.checked)} className="h-5 w-5 rounded border-gray-300 accent-orange-500" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Age-based Pricing ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">💰 Age-based Pricing</h2>
          <button type="button" onClick={() => setExtra('age_pricing', [...agePricing, { label: '', price: 0 }])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Tier</button>
        </div>
        {agePricing.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">Add pricing tiers — e.g. Adult (13+), Child (4–12), Infant</p>
        ) : (
          <div className="space-y-3">
            {agePricing.map((tier, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="text" value={tier.label} onChange={(e) => updAgePricing(i, 'label', e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" placeholder="e.g. Adult (13+)" />
                <input type="number" value={tier.price} onChange={(e) => updAgePricing(i, 'price', Number(e.target.value))} className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" placeholder="Price ₩" />
                <button type="button" onClick={() => setExtra('age_pricing', agePricing.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Included / Excluded / Bring ── */}
      {[
        { key: 'included', title: "✅ What's Included", ph: "e.g. All equipment, Instructor guide, Photos" },
        { key: 'excluded', title: "❌ What's NOT Included", ph: "e.g. Travel insurance, Meals, Personal items" },
        { key: 'what_to_bring', title: "🎒 What to Bring", ph: "e.g. Comfortable shoes, Water bottle, Sunscreen" },
      ].map(({ key, title, ph }) => {
        const h = arrH(key);
        return (
          <section key={key} className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button type="button" onClick={() => h.add('')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
            </div>
            {h.arr.length === 0 ? <p className="text-sm text-gray-400">Nothing added yet.</p> : (
              <div className="space-y-2">
                {h.arr.map((item: string, i) => (
                  <div key={i} className="flex gap-3">
                    <input type="text" value={item} onChange={(e) => h.upd(i, e.target.value)} className={cls} placeholder={ph} />
                    <button type="button" onClick={() => h.del(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* ── Program Options ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">📋 Program Options <span className="text-xs font-normal text-gray-400">(optional — if multiple tiers)</span></h2>
          <button type="button" onClick={() => setMenuItems([...menuItems, { name: '', price: 0, description: '' }])} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Option</button>
        </div>
        {menuItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-4 text-center text-sm text-gray-400">Leave empty if fixed single-price. Add options for à-la-carte upgrades.</p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <input type="text" value={item.name} onChange={(e) => updMenuItem(i, 'name', e.target.value)} placeholder="Option name" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" />
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 focus-within:border-primary-500">
                      <input type="number" value={item.price_variable ? 0 : (item.price || 0)} onChange={(e) => updMenuItem(i, 'price', Number(e.target.value))} placeholder="₩" disabled={!!item.price_variable} className="w-0 flex-1 min-w-0 py-2 text-sm outline-none disabled:text-gray-400 bg-transparent" />
                      <label className="flex items-center gap-0.5 whitespace-nowrap text-[10px] text-gray-400 cursor-pointer select-none">
                        <input type="checkbox" checked={!!item.price_variable} onChange={e => { const c = e.target.checked; const items = [...menuItems]; items[i] = { ...items[i], price_variable: c, ...(c ? { price: 0 } : {}) }; setMenuItems(items); }} className="rounded" />
                        변동
                      </label>
                    </div>
                    <input type="text" value={item.description ?? ''} onChange={(e) => updMenuItem(i, 'description', e.target.value)} placeholder="Details" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500" />
                  </div>
                  <button type="button" onClick={() => setMenuItems(menuItems.filter((_, idx) => idx !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
                </div>
                <MenuItemTranslations item={item} onUpdate={(field, value) => updMenuItem(i, field as any, value as any)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Contact & Location ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">📍 Contact & Location</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address (optional)</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={cls} placeholder="Office or main location address" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={cls} placeholder="+82-10-XXXX-XXXX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Schedule / Hours</label>
            <input type="text" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} className={cls} placeholder="Daily 09:00–17:00" />
          </div>
        </div>
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

      {/* ── Notices / Policy / Notes ── */}
      {[
        { h: noticesH, title: '📋 Reservation Info & Notices', ph: 'e.g. Minimum 2 participants required' },
        { h: policyH, title: '🔄 Cancellation Policy', ph: 'e.g. Free cancellation up to 48 hours before' },
        { h: notesH, title: '⚠️ Important Notes', ph: 'e.g. Not suitable for people with heart conditions' },
      ].map(({ h, title, ph }) => (
        <section key={title} className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button type="button" onClick={() => h.add('')} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add</button>
          </div>
          {h.arr.length === 0 ? <p className="text-sm text-gray-400">Nothing added.</p> : (
            <div className="space-y-2">
              {h.arr.map((item: string, i) => (
                <div key={i} className="flex gap-3">
                  <input type="text" value={item} onChange={(e) => h.upd(i, e.target.value)} className={cls} placeholder={ph} />
                  <button type="button" onClick={() => h.del(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">✕</button>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

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
                  <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-gray-600">Review Text</label><textarea value={rev.text} onChange={(e) => reviewsH.updField(i, 'text', e.target.value)} rows={2} className={cls} placeholder="Original review text" /></div>
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
