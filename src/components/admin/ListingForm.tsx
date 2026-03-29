'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { categories, cities } from '@/lib/categories';
import type { ListingRow, MenuItemJson } from '@/lib/supabase/types';

type FormData = {
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  city: string;
  description: string;
  content: string;
  image_url: string;
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
};

export default function ListingForm({ existing }: { existing?: ListingRow }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormData>({
    title: existing?.title ?? '',
    slug: existing?.slug ?? '',
    category: existing?.category ?? 'restaurants',
    subcategory: existing?.subcategory ?? 'korean-food',
    city: existing?.city ?? 'seoul',
    description: existing?.description ?? '',
    content: existing?.content ?? '',
    image_url: existing?.image_url ?? '',
    price: existing?.price ?? 0,
    currency: existing?.currency ?? 'USD',
    tags: existing?.tags?.join(', ') ?? '',
    featured: existing?.featured ?? false,
    published: existing?.published ?? false,
    menu_items: (existing?.menu_items as MenuItemJson[]) ?? [],
    address: existing?.address ?? '',
    phone: existing?.phone ?? '',
    operating_hours: existing?.operating_hours ?? '',
    notes: existing?.notes ?? '',
  });

  const selectedCategory = categories.find((c) => c.slug === form.category);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  };

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: existing ? form.slug : generateSlug(title) });
  };

  const addMenuItem = () => {
    setForm({
      ...form,
      menu_items: [...form.menu_items, { name: '', price: 0, description: '' }],
    });
  };

  const updateMenuItem = (index: number, field: keyof MenuItemJson, value: string | number) => {
    const items = [...form.menu_items];
    items[index] = { ...items[index], [field]: value };
    setForm({ ...form, menu_items: items });
  };

  const removeMenuItem = (index: number) => {
    setForm({ ...form, menu_items: form.menu_items.filter((_, i) => i !== index) });
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image_url;

    const supabase = createClient();
    const ext = imageFile.name.split('.').pop();
    const fileName = `${form.slug}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('listings')
      .upload(fileName, imageFile, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('listings').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const imageUrl = await uploadImage();

      const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        subcategory: form.subcategory,
        city: form.city,
        description: form.description,
        content: form.content,
        image_url: imageUrl,
        price: form.price,
        currency: form.currency,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        published: form.published,
        menu_items: form.menu_items,
        address: form.address,
        phone: form.phone,
        operating_hours: form.operating_hours,
        notes: form.notes,
      };

      if (existing) {
        const { error } = await supabase
          .from('listings')
          .update(payload)
          .eq('id', existing.id);
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

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {/* Basic Info */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="e.g., Premium Hanwoo BBQ in Gangnam"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-500 outline-none focus:border-primary-500"
              placeholder="auto-generated-from-title"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: categories.find(c => c.slug === e.target.value)?.subcategories[0]?.slug ?? '' })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Subcategory *</label>
            <select
              value={form.subcategory}
              onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {selectedCategory?.subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">City *</label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (USD) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </section>

      {/* Description & Content */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Description & Storytelling</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Short Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Brief description shown in listing cards..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Content (Storytelling)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Detailed storytelling about this place or experience. Write as if telling a friend about an amazing spot..."
            />
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Image</h2>
        <div className="space-y-4">
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-600 hover:file:bg-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Or Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      {/* Menu / Price List */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Menu / Price List</h2>
          <button
            type="button"
            onClick={addMenuItem}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            + Add Item
          </button>
        </div>
        {form.menu_items.length === 0 ? (
          <p className="text-sm text-gray-400">No menu items yet. Click &quot;Add Item&quot; to add.</p>
        ) : (
          <div className="space-y-3">
            {form.menu_items.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex-1 grid gap-2 sm:grid-cols-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                    placeholder="Item name"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateMenuItem(index, 'price', Number(e.target.value))}
                    placeholder="Price"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={item.description ?? ''}
                    onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                    placeholder="Description (optional)"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Location & Details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Location & Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="Full address in English"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="+82-2-XXX-XXXX"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Operating Hours</label>
            <input
              type="text"
              value={form.operating_hours}
              onChange={(e) => setForm({ ...form, operating_hours: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="Mon-Fri 10:00-22:00, Sat-Sun 11:00-23:00"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="HOT, Premium, Must-Try"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="Notes visible only to admin team..."
            />
          </div>
        </div>
      </section>

      {/* Publish Settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Publish Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Visible to visitors on the website</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Featured</p>
              <p className="text-xs text-gray-400">Show on homepage featured section</p>
            </div>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/listings')}
          className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : existing ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}
