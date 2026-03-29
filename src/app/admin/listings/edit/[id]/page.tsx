'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminShell from '@/components/admin/AdminShell';
import ListingForm from '@/components/admin/ListingForm';
import type { ListingRow } from '@/lib/supabase/types';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('listings').select('*').eq('id', id).single();
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      </AdminShell>
    );
  }

  if (!listing) {
    return (
      <AdminShell>
        <div className="py-12 text-center">
          <p className="text-lg font-semibold text-gray-700">Listing not found</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        <p className="mt-1 text-sm text-gray-500">Update &ldquo;{listing.title}&rdquo;</p>
      </div>
      <ListingForm existing={listing} />
    </AdminShell>
  );
}
