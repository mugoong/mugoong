'use client';

import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';

const SITE_URL = 'https://mugoong.com';

type PortalItem = {
  label: string;
  url: string;
  description: string;
  external?: boolean;
  badge?: string;
};

type PortalSection = {
  title: string;
  icon: string;
  color: string;
  items: PortalItem[];
};

const sections: PortalSection[] = [
  {
    title: 'Customer Site',
    icon: '🌐',
    color: 'border-blue-200 bg-blue-50',
    items: [
      { label: 'Home', url: `${SITE_URL}/en`, description: 'Main landing page — hero, featured listings, category nav', external: true },
      { label: 'Restaurants', url: `${SITE_URL}/en/restaurants`, description: 'All restaurant listings', external: true },
      { label: 'Wellness', url: `${SITE_URL}/en/wellness`, description: 'Sauna, massage, skin clinic, hair salon', external: true },
      { label: 'Activities', url: `${SITE_URL}/en/activities`, description: 'Tours, experiences, adventures', external: true },
      { label: 'Tips & Trends', url: `${SITE_URL}/en/tips-and-trend`, description: 'Local life guides and travel tips', external: true },
      { label: 'Login', url: `${SITE_URL}/en/login`, description: 'Member login — email + Google + Apple OAuth', external: true },
      { label: 'Sign Up', url: `${SITE_URL}/en/signup`, description: 'Email verification signup with profile step', external: true },
      { label: 'My Account', url: `${SITE_URL}/en/account`, description: 'Member profile + booking history with MGN numbers', external: true },
    ],
  },
  {
    title: 'Admin — Content',
    icon: '📝',
    color: 'border-green-200 bg-green-50',
    items: [
      { label: 'Admin Dashboard', url: '/admin', description: 'Overview: total listings, bookings count, quick actions' },
      { label: 'Listings', url: '/admin/listings', description: 'View, publish/unpublish all listings' },
      { label: 'New Listing', url: '/admin/listings/new', description: 'Create a new restaurant, wellness, or activity listing' },
    ],
  },
  {
    title: 'Admin — Operations',
    icon: '📊',
    color: 'border-purple-200 bg-purple-50',
    items: [
      { label: 'Bookings', url: '/admin/bookings', description: 'All bookings with MGN numbers — confirm, cancel, view customer info' },
      { label: 'Members', url: '/admin/users', description: 'Registered member list — email, name, profile status' },
      { label: 'Exchange Rates', url: '/admin/exchange-rates', description: 'MUGOONG live exchange rate table (10 currencies, 3% spread)' },
    ],
  },
  {
    title: 'External Tools',
    icon: '🔧',
    color: 'border-orange-200 bg-orange-50',
    items: [
      { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard', description: 'Database, Auth users, RLS policies, Storage', external: true, badge: 'DB' },
      { label: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', description: 'Deployment logs, environment variables, domains', external: true, badge: 'Deploy' },
      { label: 'Gmail (booking emails)', url: 'https://mail.google.com', description: 'Booking notifications sent via nodemailer/Gmail', external: true, badge: 'Email' },
    ],
  },
];

function CardContent({ item }: { item: PortalItem }) {
  return (
    <>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-semibold text-gray-900 group-hover:text-primary-600">
          {item.label}
        </span>
        <div className="flex items-center gap-1.5">
          {item.badge && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-sm">
              {item.badge}
            </span>
          )}
          {item.external && (
            <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-500">{item.description}</p>
      <p className="mt-2 truncate text-[10px] text-gray-400">{item.url}</p>
    </>
  );
}

export default function PortalPage() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">MUGOONG Site Portal</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete sitemap of all customer-facing pages, admin tools, and external services.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${section.color}`}
                  >
                    <CardContent item={item} />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.url}
                    className={`group flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${section.color}`}
                  >
                    <CardContent item={item} />
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Quick Reference</h3>
        <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
          <div><span className="font-medium">Customer site:</span> {SITE_URL}</div>
          <div><span className="font-medium">Admin panel:</span> {SITE_URL}/admin</div>
          <div><span className="font-medium">Booking emails:</span> MGN-XXXXXX auto-assigned</div>
          <div><span className="font-medium">Member types:</span> Admin (4 emails) · Member · Guest</div>
          <div><span className="font-medium">Languages:</span> EN · KO · JA · ZH · FR · DE · ES</div>
          <div><span className="font-medium">Currencies:</span> KRW · USD · JPY · CNY · EUR · GBP · AUD · CAD · SGD · TWD</div>
        </div>
      </div>
    </AdminShell>
  );
}
