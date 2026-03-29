'use client';

import AdminShell from '@/components/admin/AdminShell';
import ListingForm from '@/components/admin/ListingForm';

export default function NewListingPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Content</h1>
        <p className="mt-1 text-sm text-gray-500">Create either a bookable product or a CMS article for the platform</p>
      </div>
      <ListingForm />
    </AdminShell>
  );
}
