'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalListings: 0,
    publishedListings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [listings, published, pending, confirmed] = await Promise.all([
        supabase.from('listings').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'confirmed'),
      ]);

      setStats({
        totalListings: listings.count ?? 0,
        publishedListings: published.count ?? 0,
        pendingBookings: pending.count ?? 0,
        confirmedBookings: confirmed.count ?? 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Listings', value: stats.totalListings, icon: '📝', color: 'bg-blue-50 text-blue-600', href: '/admin/listings' },
    { label: 'Published', value: stats.publishedListings, icon: '✅', color: 'bg-green-50 text-green-600', href: '/admin/listings' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: '⏳', color: 'bg-yellow-50 text-yellow-600', href: '/admin/bookings' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, icon: '🎉', color: 'bg-primary-50 text-primary-600', href: '/admin/bookings' },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here&apos;s an overview of your platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2.5 text-xl ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/listings/new" className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-primary-50 hover:border-primary-200">
              <span className="text-xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Add New Listing</p>
                <p className="text-sm text-gray-500">Create a restaurant, wellness, or activity listing</p>
              </div>
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-primary-50 hover:border-primary-200">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-medium text-gray-900">Manage Bookings</p>
                <p className="text-sm text-gray-500">Review and confirm pending reservations</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Platform Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Categories</span>
              <span className="font-medium text-gray-900">4</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Subcategories</span>
              <span className="font-medium text-gray-900">18</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Cities</span>
              <span className="font-medium text-gray-900">5 (Seoul, Busan, Jeju, Gyeongju, Jeonju)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Languages</span>
              <span className="font-medium text-gray-900">6 (EN, JA, ZH, FR, DE, ES)</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
