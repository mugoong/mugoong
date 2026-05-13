'use client';

import type { MenuItemJson, ExternalReview } from '@/lib/supabase/types';

const inputCls = 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

type Extra = Record<string, any>;

interface Props {
  menuItems: MenuItemJson[];
  setMenuItems: (items: MenuItemJson[]) => void;
  extra: Extra;
  setExtra: (key: string, value: any) => void;
  operatingHours: string;
  setOperatingHours: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}

/* ── helpers ── */
function menuByCategory(items: MenuItemJson[], cat: string) {
  return items.filter(i => (i.category || 'main') === cat);
}

function MenuSection({ title, cat, emoji, items, setItems, allItems, setAllItems }: {
  title: string; cat: string; emoji: string;
  items: MenuItemJson[]; setItems: (items: MenuItemJson[]) => void;
  allItems: MenuItemJson[]; setAllItems: (items: MenuItemJson[]) => void;
}) {
  const add = () => {
    if (items.length >= 5) return;
    setAllItems([...allItems, { category: cat as any, name: '', price: 0, description: '' }]);
  };
  const update = (idx: number, field: string, value: string | number) => {
    const globalIdx = allItems.findIndex((item, i) => {
      const matching = allItems.slice(0, i + 1).filter(x => (x.category || 'main') === cat);
      return matching.length === idx + 1;
    });
    if (globalIdx === -1) return;
    const updated = [...allItems];
    updated[globalIdx] = { ...updated[globalIdx], [field]: value };
    setAllItems(updated);
  };
  const remove = (idx: number) => {
    let count = 0;
    const updated = allItems.filter(item => {
      if ((item.category || 'main') !== cat) return true;
      return count++ !== idx;
    });
    setAllItems(updated);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{emoji} {title} ({items.length}/5)</h4>
        {items.length < 5 && (
          <button type="button" onClick={add} className="text-xs text-primary-600 hover:underline">+ Add</button>
        )}
      </div>
      {items.map((item, i) => (
        <div key={i} className="mb-3 rounded-xl border border-gray-100 bg-white p-3">
          <div className="mb-2 flex items-center gap-2">
            <input type="text" value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Dish name" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
            <input type="number" value={item.price} onChange={e => update(i, 'price', Number(e.target.value))} placeholder="₩" className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input type="text" value={item.description || ''} onChange={e => update(i, 'description', e.target.value)} placeholder="Description (optional)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
            <input type="text" value={item.image_url || ''} onChange={e => update(i, 'image_url', e.target.value)} placeholder="🖼️ Image URL (optional)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-gray-400 mb-2">No items yet.</p>}
    </div>
  );
}

function ArraySection({ title, emoji, items, max, onChange }: {
  title: string; emoji: string; items: string[]; max: number;
  onChange: (items: string[]) => void;
}) {
  const add = () => { if (items.length < max) onChange([...items, '']); };
  const update = (i: number, v: string) => { const u = [...items]; u[i] = v; onChange(u); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{emoji} {title} ({items.length}/{max})</h4>
        {items.length < max && <button type="button" onClick={add} className="text-xs text-primary-600 hover:underline">+ Add</button>}
      </div>
      {items.map((item, i) => (
        <div key={i} className="mb-2 flex items-center gap-2">
          <input type="text" value={item} onChange={e => update(i, e.target.value)} className={inputCls} placeholder={`Item ${i + 1}`} />
          <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg">✕</button>
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-gray-400 mb-2">No items yet.</p>}
    </div>
  );
}

export default function RestaurantFormFields({ menuItems, setMenuItems, extra, setExtra, operatingHours, setOperatingHours, address, setAddress, phone, setPhone }: Props) {
  const reviews: ExternalReview[] = extra.external_reviews || [];

  const addReview = () => {
    if (reviews.length >= 200) return;
    setExtra('external_reviews', [...reviews, { source: '', reviewer: '', rating: 5, text: '', translation_en: '', date: '' }]);
  };
  const updateReview = (i: number, field: string, value: any) => {
    const updated = [...reviews];
    updated[i] = { ...updated[i], [field]: value };
    setExtra('external_reviews', updated);
  };
  const removeReview = (i: number) => setExtra('external_reviews', reviews.filter((_, idx) => idx !== i));

  return (
    <>
      {/* ── Booking Deposit ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">💰 Booking Deposit</h2>
        <p className="mb-3 text-xs text-gray-500">This is the deposit amount charged when a customer books this restaurant. The remaining balance is paid at the restaurant.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Deposit Amount (₩) *</label>
            <input type="number" value={extra.booking_deposit || 0} onChange={e => setExtra('booking_deposit', Number(e.target.value))} min="0" className={inputCls} placeholder="e.g., 30000" />
          </div>
        </div>
      </section>

      {/* ── Structured Menu ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🍽️ Menu</h2>
        <div className="space-y-6">
          <MenuSection title="Main Menu" cat="main" emoji="🥩" items={menuByCategory(menuItems, 'main')} setItems={() => {}} allItems={menuItems} setAllItems={setMenuItems} />
          <hr className="border-gray-100" />
          <MenuSection title="Side Dishes" cat="side" emoji="🥗" items={menuByCategory(menuItems, 'side')} setItems={() => {}} allItems={menuItems} setAllItems={setMenuItems} />
          <hr className="border-gray-100" />
          <MenuSection title="Drinks & Alcohol" cat="drink" emoji="🍺" items={menuByCategory(menuItems, 'drink')} setItems={() => {}} allItems={menuItems} setAllItems={setMenuItems} />
        </div>
      </section>

      {/* ── Dietary Options ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🥬 Dietary Options</h2>
        <p className="mb-3 text-xs text-gray-500">Check all dietary accommodations this restaurant offers.</p>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'vegetarian', label: '🥦 Vegetarian' },
            { key: 'pescetarian', label: '🐟 Pescetarian' },
            { key: 'halal', label: '🕌 Halal' },
            { key: 'gluten_free', label: '🌾 Gluten-Free' },
            { key: 'non_dairy', label: '🥛 Non-Dairy' },
          ].map(d => (
            <label key={d.key} className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 hover:bg-gray-50">
              <input type="checkbox" checked={!!(extra.dietary && extra.dietary[d.key])} onChange={e => setExtra('dietary', { ...(extra.dietary || {}), [d.key]: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-primary-600" />
              <span className="text-sm">{d.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Location & Maps ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">📍 Location & Maps</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address *</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputCls} placeholder="Full address in English" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+82-2-XXX-XXXX" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Naver Map URL</label>
            <input type="text" value={extra.naver_map_url || ''} onChange={e => setExtra('naver_map_url', e.target.value)} className={inputCls} placeholder="https://naver.me/..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Kakao Map URL</label>
            <input type="text" value={extra.kakao_map_url || ''} onChange={e => setExtra('kakao_map_url', e.target.value)} className={inputCls} placeholder="https://place.map.kakao.com/..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Google Map URL</label>
            <input type="text" value={extra.google_map_url || ''} onChange={e => setExtra('google_map_url', e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </section>

      {/* ── Operating Hours ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🕐 Operating Hours</h2>
        <div className="grid gap-4 sm:grid-cols-1">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Regular Hours</label>
            <input type="text" value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className={inputCls} placeholder="Mon–Fri 11:30–22:00, Sat–Sun 11:00–23:00" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Break Time</label>
            <input type="text" value={extra.break_time || ''} onChange={e => setExtra('break_time', e.target.value)} className={inputCls} placeholder="e.g., 15:00–17:00 (weekdays only)" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Holidays / Closed Days</label>
            <input type="text" value={extra.holidays || ''} onChange={e => setExtra('holidays', e.target.value)} className={inputCls} placeholder="e.g., Every Monday, Lunar New Year, Chuseok" />
          </div>
        </div>
      </section>

      {/* ── Reservation Notices ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <ArraySection title="Reservation Info & Notices" emoji="📋" items={extra.reservation_notices || []} max={5} onChange={v => setExtra('reservation_notices', v)} />
      </section>

      {/* ── Cancellation & Refund Policy ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <ArraySection title="Cancellation & Refund Policy" emoji="🔄" items={extra.cancellation_policy || []} max={5} onChange={v => setExtra('cancellation_policy', v)} />
      </section>

      {/* ── Important Notes ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <ArraySection title="Important Things to Know" emoji="⚠️" items={extra.important_notes || []} max={10} onChange={v => setExtra('important_notes', v)} />
      </section>

      {/* ── External Reviews ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">⭐ External Reviews ({reviews.length}/200)</h2>
          {reviews.length < 200 && <button type="button" onClick={addReview} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">+ Add Review</button>}
        </div>
        <p className="mb-3 text-xs text-gray-500">Import reviews from Google, TripAdvisor, Naver, MangoPlate, etc. to build trust.</p>
        {reviews.map((r, i) => (
          <div key={i} className="mb-3 rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex gap-2">
              <select value={r.source} onChange={e => updateReview(i, 'source', e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
                <option value="">Source</option>
                <option value="Google">Google</option>
                <option value="TripAdvisor">TripAdvisor</option>
                <option value="Naver">Naver</option>
                <option value="MangoPlate">MangoPlate</option>
                <option value="Kakao">Kakao</option>
                <option value="Instagram">Instagram</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" value={r.reviewer} onChange={e => updateReview(i, 'reviewer', e.target.value)} placeholder="Reviewer name" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
              <select value={r.rating} onChange={e => updateReview(i, 'rating', Number(e.target.value))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
                {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(v => <option key={v} value={v}>{'⭐'.repeat(Math.floor(v))} {v}</option>)}
              </select>
              <button type="button" onClick={() => removeReview(i)} className="text-red-400 hover:text-red-600">✕</button>
            </div>
            <textarea value={r.text} onChange={e => updateReview(i, 'text', e.target.value)} placeholder="Review text (original language)..." rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
            <textarea value={r.translation_en || ''} onChange={e => updateReview(i, 'translation_en', e.target.value)} placeholder="🌐 English translation (for non-English reviews)" rows={2} className="w-full rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm outline-none" />
            <input type="text" value={r.date} onChange={e => updateReview(i, 'date', e.target.value)} placeholder="Date (e.g., 2026-04-15)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none" />
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-gray-400">No reviews yet. Click &quot;Add Review&quot; to import from other platforms.</p>}
      </section>
    </>
  );
}
