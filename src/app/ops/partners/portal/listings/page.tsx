'use client';

import OpsShell from '@/components/ops/OpsShell';

const myListings = [
  { id: '1', title: '북촌 한옥 프리미엄 스테이', category: 'wellness', price: 180000, status: 'published', bookings: 45, rating: 4.8, image: '' },
  { id: '2', title: '경복궁 한옥 체험', category: 'activities', price: 65000, status: 'published', bookings: 82, rating: 4.9, image: '' },
  { id: '3', title: '한옥 다도 체험', category: 'activities', price: 45000, status: 'draft', bookings: 0, rating: 0, image: '' },
];

export default function PartnerListingsPage() {
  return (
    <OpsShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span
            className="mb-2 inline-block rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
          >
            Partner Portal
          </span>
          <h1 className="text-2xl font-bold text-gray-900">내 리스팅</h1>
          <p className="mt-1 text-[14px] text-gray-400">등록한 상품 관리</p>
        </div>
        <a
          href="/ops/partners/portal/listings/new"
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
          }}
        >
          <span>+</span> 새 리스팅
        </a>
      </div>

      <div className="space-y-4">
        {myListings.map((listing) => (
          <div
            key={listing.id}
            className="flex items-center justify-between rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl"
                style={{ background: 'rgba(245,158,11,0.08)' }}
              >
                {listing.category === 'wellness' ? '🏠' : '🎯'}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">{listing.title}</h3>
                <div className="mt-1 flex items-center gap-4 text-[12px] text-gray-400">
                  <span>₩{listing.price.toLocaleString()}</span>
                  <span>{listing.bookings}건 예약</span>
                  {listing.rating > 0 && <span>⭐ {listing.rating}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{
                  background: listing.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                  color: listing.status === 'published' ? '#10b981' : '#94a3b8',
                }}
              >
                {listing.status === 'published' ? '공개' : '초안'}
              </span>
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-50">
                수정
              </button>
            </div>
          </div>
        ))}
      </div>
    </OpsShell>
  );
}
