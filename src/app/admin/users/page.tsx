'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminShell from '@/components/admin/AdminShell';

type UserProfile = {
  id: string;
  created_at: string;
  email: string;
  name: string;
  nationality: string;
  phone: string;
  birthday: string | null;
  interests: string[];
  profile_complete: boolean;
};

const INTEREST_LABELS: Record<string, string> = {
  'korean-food': '🍜 Korean Food',
  'korean-bbq': '🥩 Korean BBQ',
  'street-food': '🥘 Street Food',
  'bars-nightlife': '🍺 Bars & Nightlife',
  'vegetarian-halal': '🌿 Vegetarian/Halal',
  'cafes-coffee': '☕ Cafes',
  'skin-clinic': '✨ Skin Clinic',
  'hair-makeup': '💇 Hair & Makeup',
  'massage-spa': '💆 Massage & Spa',
  'jjimjilbang': '🛁 Jjimjilbang',
  'traditional-culture': '🏯 Traditional Culture',
  'kpop-entertainment': '🎵 K-Pop',
  'cooking-classes': '👨‍🍳 Cooking Classes',
  'local-experience': '🎭 Local Experience',
  'historical-temples': '⛩️ Historical Sites',
  'hiking-nature': '🥾 Hiking & Nature',
  'sports-adventure': '🏄 Sports & Adventure',
  'fashion-shopping': '🛍️ Shopping',
  'markets-souvenirs': '🏪 Markets',
  'public-transport': '🚇 Transport',
  'day-trips': '🗺️ Day Trips',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sortBy, setSortBy] = useState<'created_at' | 'name'>('created_at');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  };

  const nationalities = Array.from(new Set(users.map((u) => u.nationality).filter(Boolean))).sort();

  const filtered = users
    .filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (nationalityFilter && u.nationality !== nationalityFilter) return false;
      if (interestFilter && !u.interests.includes(interestFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const stats = {
    total: users.length,
    complete: users.filter((u) => u.profile_complete).length,
    thisMonth: users.filter((u) => {
      const d = new Date(u.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="mt-1 text-sm text-gray-500">Manage registered customer accounts</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Members', value: stats.total, icon: '👥', color: 'bg-blue-50 text-blue-600' },
          { label: 'Profile Complete', value: stats.complete, icon: '✅', color: 'bg-green-50 text-green-600' },
          { label: 'This Month', value: stats.thisMonth, icon: '📅', color: 'bg-purple-50 text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={nationalityFilter}
          onChange={(e) => setNationalityFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
        >
          <option value="">All nationalities</option>
          {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select
          value={interestFilter}
          onChange={(e) => setInterestFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
        >
          <option value="">All interests</option>
          {Object.entries(INTEREST_LABELS).map(([id, label]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary-400"
        >
          <option value="created_at">Newest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-14 text-center">
          <p className="text-4xl">👤</p>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">No members found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {users.length === 0 ? 'No users have signed up yet.' : 'Try adjusting the search filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Member</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nationality</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Interests</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => {
                const initials = user.name
                  ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : user.email[0].toUpperCase();
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name || <span className="italic text-gray-400">No name</span>}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.nationality || '—'}</td>
                    <td className="px-5 py-4">
                      {user.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.interests.slice(0, 3).map((id) => (
                            <span key={id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {INTEREST_LABELS[id] ?? id}
                            </span>
                          ))}
                          {user.interests.length > 3 && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                              +{user.interests.length - 3}
                            </span>
                          )}
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.profile_complete
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                          : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                      }`}>
                        {user.profile_complete ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
            Showing {filtered.length} of {users.length} member{users.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-xl font-bold text-white">
                  {selectedUser.name
                    ? selectedUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                    : selectedUser.email[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name || 'No name'}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
              {[
                { label: 'Nationality', value: selectedUser.nationality || '—' },
                { label: 'Phone', value: selectedUser.phone || '—' },
                { label: 'Birthday', value: selectedUser.birthday ? new Date(selectedUser.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                { label: 'Joined', value: formatDate(selectedUser.created_at) },
                { label: 'Profile', value: selectedUser.profile_complete ? 'Complete' : 'Incomplete' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            {selectedUser.interests.length > 0 && (
              <div className="mt-5">
                <p className="mb-2.5 text-sm font-semibold text-gray-700">Interests ({selectedUser.interests.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.interests.map((id) => (
                    <span key={id} className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
                      {INTEREST_LABELS[id] ?? id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
