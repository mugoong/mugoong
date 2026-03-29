'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories, cities, getDefaultContentType } from '@/lib/categories';
import { createClient } from '@/lib/supabase/client';
import type { ListingRow, MenuItemJson } from '@/lib/supabase/types';
import type { ContentType } from '@/types';

type FormData = {
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  content_type: ContentType;
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

function buildInitialForm(existing?: ListingRow): FormData {
  const category = existing?.category ?? 'restaurants';
  const subcategory = existing?.subcategory ?? 'korean-food';

  return {
    title: existing?.title ?? '',
    slug: existing?.slug ?? '',
    category,
    subcategory,
    content_type: existing?.content_type ?? getDefaultContentType(category, subcategory),
    city: existing?.city ?? 'seoul',
    description: existing?.description ?? '',
    content: existing?.content ?? '',
    image_url: existing?.image_url ?? '',
    price: Number(existing?.price ?? 0),
    currency: existing?.currency ?? 'USD',
    tags: existing?.tags?.join(', ') ?? '',
    featured: existing?.featured ?? false,
    published: existing?.published ?? false,
    menu_items: (existing?.menu_items as MenuItemJson[]) ?? [],
    address: existing?.address ?? '',
    phone: existing?.phone ?? '',
    operating_hours: existing?.operating_hours ?? '',
    notes: existing?.notes ?? '',
  };
}

export default function ListingForm({ existing }: { existing?: ListingRow }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormData>(() => buildInitialForm(existing));

  const selectedCategory = categories.find((category) => category.slug === form.category);
  const isArticle = form.content_type === 'article';
  const showMenuItems = !isArticle && form.category === 'restaurants';
  const defaultContentType = getDefaultContentType(form.category, form.subcategory);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: existing ? current.slug : generateSlug(title),
    }));
  };

  const handleCategoryChange = (category: string) => {
    const nextCategory = categories.find((item) => item.slug === category);
    const nextSubcategory = nextCategory?.subcategories[0]?.slug ?? '';

    setForm((current) => ({
      ...current,
      category,
      subcategory: nextSubcategory,
      content_type: getDefaultContentType(category, nextSubcategory),
    }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setForm((current) => ({
      ...current,
      subcategory,
      content_type: getDefaultContentType(current.category, subcategory),
    }));
  };

  const addMenuItem = () => {
    setForm((current) => ({
      ...current,
      menu_items: [...current.menu_items, { name: '', price: 0, description: '' }],
    }));
  };

  const updateMenuItem = (index: number, field: keyof MenuItemJson, value: string | number) => {
    setForm((current) => {
      const menuItems = [...current.menu_items];
      menuItems[index] = { ...menuItems[index], [field]: value };
      return { ...current, menu_items: menuItems };
    });
  };

  const removeMenuItem = (index: number) => {
    setForm((current) => ({
      ...current,
      menu_items: current.menu_items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      return form.image_url;
    }

    const supabase = createClient();
    const ext = imageFile.name.split('.').pop();
    const fileName = `${form.slug || 'content'}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('listings')
      .upload(fileName, imageFile, { upsert: true });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from('listings').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const imageUrl = await uploadImage();

      const payload = {
        title: form.title,
        slug: form.slug,
        category: form.category,
        subcategory: form.subcategory,
        content_type: form.content_type,
        city: form.city,
        description: form.description,
        content: form.content,
        image_url: imageUrl,
        price: isArticle ? 0 : form.price,
        currency: form.currency,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        featured: isArticle ? false : form.featured,
        published: form.published,
        menu_items: showMenuItems ? form.menu_items : [],
        address: isArticle ? '' : form.address,
        phone: isArticle ? '' : form.phone,
        operating_hours: isArticle ? '' : form.operating_hours,
        notes: form.notes,
      };

      if (existing) {
        const { error } = await supabase
          .from('listings')
          .update(payload)
          .eq('id', existing.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from('listings').insert(payload);

        if (error) {
          throw error;
        }
      }

      router.push('/admin/listings');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Content Setup</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose whether this entry should behave like a bookable product or a CMS-style article.
            </p>
          </div>
          <div className="rounded-full bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500">
            Default for this subcategory: {defaultContentType === 'article' ? 'Article' : 'Product'}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, content_type: 'product' }))}
            className={`rounded-xl border p-4 text-left transition-colors ${
              form.content_type === 'product'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            <p className="font-semibold text-gray-900">Product</p>
            <p className="mt-1 text-sm text-gray-500">
              Shows price, operational details, and the reservation form on the public page.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, content_type: 'article' }))}
            className={`rounded-xl border p-4 text-left transition-colors ${
              form.content_type === 'article'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            <p className="font-semibold text-gray-900">CMS Article</p>
            <p className="mt-1 text-sm text-gray-500">
              Hides pricing and bookings, and keeps the page focused on editorial or guide content.
            </p>
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder={isArticle ? 'e.g., Seoul Travel Tips for First-Time Visitors' : 'e.g., Premium Hanwoo BBQ in Gangnam'}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-500 outline-none focus:border-primary-500"
              placeholder="auto-generated-from-title"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
            <select
              value={form.category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.icon} {category.slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Subcategory *</label>
            <select
              value={form.subcategory}
              onChange={(event) => handleSubcategoryChange(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {selectedCategory?.subcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug}>
                  {subcategory.slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">City *</label>
            <select
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.slug}
                </option>
              ))}
            </select>
          </div>
          {!isArticle && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (USD) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              />
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isArticle ? 'Article Copy' : 'Description & Storytelling'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isArticle ? 'Summary *' : 'Short Description *'}
            </label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder={isArticle ? 'Short summary shown on article cards and SEO surfaces...' : 'Brief description shown in listing cards...'}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isArticle ? 'Article Body' : 'Full Content'}
            </label>
            <textarea
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              rows={10}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder={isArticle ? 'Write the guide or editorial content here. Separate paragraphs with blank lines...' : 'Detailed storytelling about this place or experience...'}
            />
          </div>
        </div>
      </section>

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
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-600 hover:file:bg-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Or Image URL</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      {showMenuItems && (
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
            <p className="text-sm text-gray-400">No menu items yet. Add a few items if you want the public page to show dish-level pricing.</p>
          ) : (
            <div className="space-y-3">
              {form.menu_items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="grid flex-1 gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(event) => updateMenuItem(index, 'name', event.target.value)}
                      placeholder="Item name"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(event) => updateMenuItem(index, 'price', Number(event.target.value))}
                      placeholder="Price"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                    />
                    <input
                      type="text"
                      value={item.description ?? ''}
                      onChange={(event) => updateMenuItem(index, 'description', event.target.value)}
                      placeholder="Description (optional)"
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!isArticle && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Visit Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
                placeholder="Full address in English"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
                placeholder="+82-2-XXX-XXXX"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Operating Hours</label>
              <input
                type="text"
                value={form.operating_hours}
                onChange={(event) => setForm((current) => ({ ...current, operating_hours: event.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
                placeholder="Mon-Fri 10:00-22:00, Sat-Sun 11:00-23:00"
              />
            </div>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Tags & Internal Notes</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="HOT, Premium, Must-Try"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Internal Notes</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary-500"
              placeholder="Notes visible only to the admin team..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Publish Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => setForm((current) => ({ ...current, published: event.target.checked }))}
              className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Published</p>
              <p className="text-xs text-gray-400">Visible to visitors on the website</p>
            </div>
          </label>
          {!isArticle ? (
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Featured</p>
                <p className="text-xs text-gray-400">Show on homepage featured experiences section</p>
              </div>
            </label>
          ) : (
            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
              CMS articles currently skip the homepage featured experiences block.
            </div>
          )}
        </div>
      </section>

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
          {saving ? 'Saving...' : existing ? 'Update Content' : 'Create Content'}
        </button>
      </div>
    </form>
  );
}
