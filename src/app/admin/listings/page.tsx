'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import type { ListingRow } from '@/lib/supabase/types';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', city: '', published: '' });

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    const supabase = createClient();
    let query = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter.category) query = query.eq('category', filter.category);
    if (filter.city) query = query.eq('city', filter.city);
    if (filter.published === 'true') query = query.eq('published', true);
    if (filter.published === 'false') query = query.eq('published', false);

    const { data } = await query;
    setListings(data ?? []);
    setLoading(false);
  };

  const togglePublish = async (id: string, currentState: boolean) => {
    const supabase = createClient();
    await supabase.from('listings').update({ published: !currentState }).eq('id', id);
    fetchListings();
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    const supabase = createClient();
    await supabase.from('listings').delete().eq('id', id);
    fetchListings();
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all service listings on the platform</p>
        </div>
        <Link href="/admin/listings/new" className="btn-primary">
          + New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary-500"
        >
          <option value="">All Categories</option>
          <option value="restaurants">Restaurants</option>
          <option value="wellness">Wellness</option>
          <option value="activities">Activities</option>
          <option value="tips-and-trend">Tips & Trend</option>
        </select>
        <select
          value={filter.city}
          onChange={(e) => setFilter({ ...filter, city: e.target.value })}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary-500"
        >
          <option value="">All Cities</option>
          <option value="seoul">Seoul</option>
          <option value="busan">Busan</option>
          <option value="jeju">Jeju</option>
          <option value="gyeongju">Gyeongju</option>
          <option value="jeonju">Jeonju</option>
        </select>
        <select
          value={filter.published}
          onChange={(e) => setFilter({ ...filter, published: e.target.value })}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary-500"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : listings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl">📝</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No listings yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first listing to get started.</p>
            <Link href="/admin/listings/new" className="btn-primary mt-4 inline-block">
              + Create Listing
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 font-medium text-gray-500">City</th>
                <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {listing.image_url && (
                        <img src={listing.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{listing.title}</p>
                        <p className="text-xs text-gray-400">{listing.subcategory}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">{listing.category}</td>
                  <td className="px-6 py-4 capitalize text-gray-600">{listing.city}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${listing.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(listing.id, listing.published)}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        listing.published
                          ? 'bg-green-50 text-green-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {listing.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/listings/edit/${listing.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
