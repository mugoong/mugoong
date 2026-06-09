'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { categories, cities } from '@/lib/categories';
import { getCategoryFormConfig } from '@/lib/categoryFormConfig';
import type { ListingRow, MenuItemJson } from '@/lib/supabase/types';
import RestaurantFormFields from './RestaurantFormFields';
import WellnessFormFields from './WellnessFormFields';
import ActivitiesFormFields from './ActivitiesFormFields';
import TipsFormFields from './TipsFormFields';

type GalleryItem = { url: string; file?: File };

type FormData = {
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  city: string;
  description: string;
  content: string;
  image_url: string;
  gallery: GalleryItem[];
  price: number;
  currency: string;
  tags: string;
  featured: boolean;
  published: boolean;
  menu_items: MenuItemJson[];
  address: string;
  phone: string;
  operating_hours: string;
  notes: string;
  extra: Record<string, any>;
};

function parseExtra(notes: string): Record<string, any> {
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed === 'object' && parsed.__extra) return parsed.__extra;
  } catch {}
  return {};
}

function serializeNotes(plainNotes: string, extra: Record<string, any>): string {
  const hasExtra = Object.keys(extra).length > 0;
  if (!hasExtra) return plainNotes;
  return JSON.stringify({ __plain: plainNotes, __extra: extra });
}

function parsePlainNotes(notes: string): string {
  try {
    const parsed = JSON.parse(notes);
    if (parsed && typeof parsed === 'object' && parsed.__plain !== undefined) return parsed.__plain;
  } catch {}
  return notes;
}

export default function ListingForm({ existing }: { existing?: ListingRow }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormData>({
    title: existing?.title ?? '',
    slug: existing?.slug ?? '',
    category: existing?.category ?? 'restaurants',
    subcategory: existing?.subcategory ?? 'classic-korean',
    city: existing?.city ?? 'seoul',
    description: existing?.description ?? '',
    content: existing?.content ?? '',
    image_url: existing?.image_url ?? '',
    gallery: (existing?.gallery ?? []).map((url) => ({ url })),
    price: existing?.price ?? 0,
    currency: existing?.currency ?? 'USD',
    tags: existing?.tags?.join(', ') ?? '',
    featured: existing?.featured ?? false,
    published: existing?.published ?? false,
    menu_items: (existing?.menu_items as MenuItemJson[]) ?? [],
    address: existing?.address ?? '',
    phone: existing?.phone ?? '',
    operating_hours: existing?.operating_hours ?? '',
    notes: parsePlainNotes(existing?.notes ?? ''),
    extra: parseExtra(existing?.notes ?? ''),
  });

  const cfg = getCategoryFormConfig(form.category);
  const selectedCategory = categories.find((c) => c.slug === form.category);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80);

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: existing ? form.slug : generateSlug(title) });
  };

  const handleCategoryChange = (cat: string) => {
    const newCat = categories.find((c) => c.slug === cat);
    setForm({
      ...form,
      category: cat,
      subcategory: newCat?.subcategories[0]?.slug ?? '',
      extra: {},
    });
  };

  const setExtra = (key: string, value: any) => {
    setForm({ ...form, extra: { ...form.extra, [key]: value } });
  };

  const isRestaurant = form.category === 'restaurants';
  const isWellness = form.category === 'wellness';
  const isActivities = form.category === 'activities';
  const isTips = form.category === 'tips-and-trend';

  const addMenuItem = () => {
    setForm({ ...form, menu_items: [...form.menu_items, { name: '', price: 0, description: '' }] });
  };

  const updateMenuItem = (i: number, field: keyof MenuItemJson, value: string | number) => {
    const items = [...form.menu_items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, menu_items: items });
  };

  const removeMenuItem = (i: number) => {
    setForm({ ...form, menu_items: form.menu_items.filter((_, idx) => idx !== i) });
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;
    const supabase = createClient();
    const ext = imageFile.name.split('.').pop();
    const fileName = `${form.slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('listings').upload(fileName, imageFile, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('listings').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const uploadGallery = async (): Promise<string[]> => {
    const supabase = createClient();
    return Promise.all(
      form.gallery
        .filter((g) => g.url || g.file)
        .map(async (g) => {
          if (!g.file) return g.url;
          const ext = g.file.name.split('.').pop();
          const fileName = `${form.slug}-gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from('listings').upload(fileName, g.file, { upsert: true });
          if (error) throw error;
          const { data } = supabase.storage.from('listings').getPublicUrl(fileName);
          return data.publicUrl;
        })
    );
  };

  const addGallerySlot = () => {
    if (form.gallery.length < 7) setForm({ ...form, gallery: [...form.gallery, { url: '' }] });
  };

  const updateGallerySlot = (i: number, url: string, file?: File) => {
    const updated = [...form.gallery];
    updated[i] = { url, file };
    setForm({ ...form, gallery: updated });
  };

  const removeGallerySlot = (i: number) => {
    setForm({ ...form, gallery: form.gallery.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const imageUrl = await uploadImage();
      const galleryUrls = await uploadGallery();
      const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        subcategory: form.subcategory,
        city: form.city,
        description: form.description,
        content: form.content,
        image_url: imageUrl,
        gallery: galleryUrls,
        price: form.price,
        currency: form.currency,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        published: form.published,
        menu_items: form.menu_items,
        address: form.address,
        phone: form.phone,
        operating_hours: form.operating_hours,
        notes: serializeNotes(form.notes, form.extra),
      };
      if (existing) {
        const { error } = await supabase.from('listings').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('listings').insert(payload);
        if (error) throw error;
      }
      router.push('/admin/listings');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  /* ── shared input classes ── */
  const inputCls = 'w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {/* Category Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const c = getCategoryFormConfig(cat.slug);
          const active = form.category === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
              style={{
                backgroundColor: active ? c.color : '#f3f4f6',
                color: active ? '#fff' : '#6b7280',
                boxShadow: active ? `0 4px 14px ${c.color}40` : 'none',
              }}
            >
              {c.icon} {cat.slug === 'restaurants' ? 'Restaurant' : cat.slug === 'wellness' ? 'Wellness' : cat.slug === 'activities' ? 'Activity' : 'Tips & Trends'}
            </button>
          );
        })}
      </div>

      {/* Category Badge */}
      <div className="rounded-xl p-4" style={{ backgroundColor: cfg.color + '10', borderLeft: `4px solid ${cfg.color}` }}>
        <p className="text-sm font-medium" style={{ color: cfg.color }}>
          {cfg.icon} You are creating a <strong>{cfg.label}</strong> listing
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {form.category === 'restaurants' && 'Fill in the restaurant details, menu, and location info.'}
          {form.category === 'wellness' && 'Add treatment options, booking info, and clinic details.'}
          {form.category === 'activities' && 'Describe the activity, schedule, and what participants need to know.'}
          {form.category === 'tips-and-trend' && 'Write your article — no location or pricing needed.'}
        </p>
      </div>

      {/* ── Section 1: Basic Info ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
            <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputCls} placeholder={cfg.titlePlaceholder} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls + ' text-gray-500'} placeholder="auto-generated-from-title" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Subcategory *</label>
            <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} className={inputCls}>
              {selectedCategory?.subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>{sub.slug}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">City *</label>
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls}>
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>{city.slug}</option>
              ))}
            </select>
          </div>
          {cfg.showPrice && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {form.category === 'restaurants' ? 'Average Price Per Person (₩)' : form.category === 'wellness' ? 'Starting Price (₩)' : 'Price (₩)'} *
              </label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min="0" step="0.01" className={inputCls} />
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2: Description & Content ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {form.category === 'tips-and-trend' ? '📝 Article' : '📖 Description & Story'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Short Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputCls} placeholder={cfg.descriptionPlaceholder} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{cfg.contentLabel}</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={form.category === 'tips-and-trend' ? 16 : 8} className={inputCls} placeholder={cfg.contentPlaceholder} />
          </div>
        </div>
      </section>

      {/* ── Section 3: Images (main + gallery up to 7) ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">🖼️ Images</h2>
        <p className="mb-5 text-xs text-gray-400">Main image + up to 7 gallery images (max 8 total)</p>

        {/* Main image */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">① Main Image <span className="text-xs font-normal text-gray-400">(required)</span></p>
          {(imageFile ? URL.createObjectURL(imageFile) : form.image_url) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
              alt="Main preview"
              className="mb-3 h-40 w-full rounded-lg object-cover"
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Upload file</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-600 hover:file:bg-primary-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">Or paste URL</label>
              <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Gallery images */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">② Gallery Images <span className="text-xs font-normal text-gray-400">({form.gallery.length}/7)</span></p>
            {form.gallery.length < 7 && (
              <button type="button" onClick={addGallerySlot} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">
                + Add Image
              </button>
            )}
          </div>
          {form.gallery.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400">
              No gallery images. Click &quot;Add Image&quot; to add up to 7 more.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {form.gallery.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Image {i + 2}</span>
                    <button type="button" onClick={() => removeGallerySlot(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  </div>
                  {(item.file ? URL.createObjectURL(item.file) : item.url) && (
                    <img
                      src={item.file ? URL.createObjectURL(item.file) : item.url}
                      alt={`Gallery ${i + 2}`}
                      className="mb-2 h-28 w-full rounded-lg object-cover"
                    />
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateGallerySlot(i, item.url, file);
                      }}
                      className="text-xs text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-primary-50 file:px-2 file:py-1 file:text-xs file:text-primary-600"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateGallerySlot(i, e.target.value)}
                      placeholder="or paste URL"
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-primary-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Restaurant-specific sections ── */}
      {isRestaurant && (
        <RestaurantFormFields
          menuItems={form.menu_items}
          setMenuItems={(items) => setForm({ ...form, menu_items: items })}
          extra={form.extra}
          setExtra={setExtra}
          operatingHours={form.operating_hours}
          setOperatingHours={(v) => setForm({ ...form, operating_hours: v })}
          address={form.address}
          setAddress={(v) => setForm({ ...form, address: v })}
          phone={form.phone}
          setPhone={(v) => setForm({ ...form, phone: v })}
        />
      )}

      {/* ── Wellness-specific sections ── */}
      {isWellness && (
        <WellnessFormFields
          subcategory={form.subcategory}
          menuItems={form.menu_items}
          setMenuItems={(items) => setForm({ ...form, menu_items: items })}
          extra={form.extra}
          setExtra={setExtra}
          operatingHours={form.operating_hours}
          setOperatingHours={(v) => setForm({ ...form, operating_hours: v })}
          address={form.address}
          setAddress={(v) => setForm({ ...form, address: v })}
          phone={form.phone}
          setPhone={(v) => setForm({ ...form, phone: v })}
        />
      )}

      {/* ── Activities-specific sections ── */}
      {isActivities && (
        <ActivitiesFormFields
          menuItems={form.menu_items}
          setMenuItems={(items) => setForm({ ...form, menu_items: items })}
          extra={form.extra}
          setExtra={setExtra}
          operatingHours={form.operating_hours}
          setOperatingHours={(v) => setForm({ ...form, operating_hours: v })}
          address={form.address}
          setAddress={(v) => setForm({ ...form, address: v })}
          phone={form.phone}
          setPhone={(v) => setForm({ ...form, phone: v })}
        />
      )}

      {/* ── Tips & Trend-specific sections ── */}
      {isTips && (
        <TipsFormFields
          extra={form.extra}
          setExtra={setExtra}
        />
      )}

      {/* ── Tags & Notes ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">🏷️ Tags & Notes</h2>
        <div className="grid gap-4 sm:grid-cols-1">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="HOT, Premium, Must-Try" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={inputCls} placeholder="Notes visible only to admin team..." />
          </div>
        </div>
      </section>

      {/* ── Publish Settings ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Publish Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Visible to visitors on the website</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Featured</p>
              <p className="text-xs text-gray-400">Show on homepage featured section</p>
            </div>
          </label>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-4">
        <button type="button" onClick={() => router.push('/admin/listings')} className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : existing ? 'Update Listing' : 'Create Listing'}</button>
      </div>
    </form>
  );
}
