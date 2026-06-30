'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', session.user.email)
        .single();
      if (!adminRecord) {
        await supabase.auth.signOut();
        router.push('/admin/login');
        setLoading(false);
        return;
      }
      setAuthenticated(true);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
