'use client';

import OpsShell from '@/components/ops/OpsShell';

export default function PartnerDetailPage() {
  const partner = {
    company_name: '한옥스테이',
    business_registration_number: '123-45-67890',
    representative_name: '김한옥',
    business_type: '숙박업',
    phone: '02-1234-5678',
    email: 'info@hanokstay.com',
    address: '서울시 종로구 북촌로 45',
    bank_name: '신한은행',
    bank_account: '110-123-456789',
    bank_holder: '김한옥',
    status: 'active',
    created_at: '2025-03-15',
  };

  const listings = [
    { title: '북촌 한옥 프리미엄 스테이', price: 180000, status: 'published', bookings: 45 },
    { title: '경복궁 한옥 체험', price: 65000, status: 'published', bookings: 82 },
    { title: '한옥 다도 체험', price: 45000, status: 'draft', bookings: 0 },
  ];

  const settlements = [
    { month: '2026-05', amount: 4200000, status: '정산 완료', date: '2026-06-05' },
    { month: '2026-04', amount: 3800000, status: '정산 완료', date: '2026-05-05' },
    { month: '2026-03', amount: 3200000, status: '정산 완료', date: '2026-04-05' },
  ];

  return (
    <OpsShell module="partners">
      <div className="mb-6">
        <a href="/ops/partners" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-700">
          ← 협력사 목록
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Partner Info */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            >
              {partner.company_name[0]}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{partner.company_name}</h2>
            <p className="text-[13px] text-gray-400">{partner.business_type}</p>
            <span
              className="mt-2 rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
            >
              활성
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            {[
              { label: '대표자', value: partner.representative_name },
              { label: '사업자번호', value: partner.business_registration_number },
              { label: '연락처', value: partner.phone },
              { label: '이메일', value: partner.email },
              { label: '주소', value: partner.address },
              { label: '등록일', value: partner.created_at },
            ].map((info) => (
              <div key={info.label} className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-400">{info.label}</span>
                <span className="font-medium text-gray-700">{info.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="mb-1 text-[11px] font-bold text-amber-600">정산 계좌</p>
            <p className="text-[13px] font-semibold text-gray-900">{partner.bank_name}</p>
            <p className="text-[12px] text-gray-600">{partner.bank_account}</p>
            <p className="text-[11px] text-gray-400">예금주: {partner.bank_holder}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Listings */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="mb-4 text-[15px] font-bold text-gray-900">등록 리스팅</h3>
            <div className="space-y-3">
              {listings.map((listing, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-gray-50 p-4 transition-colors hover:bg-gray-50">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">{listing.title}</p>
                    <p className="text-[12px] text-gray-400">₩{listing.price.toLocaleString()} · {listing.bookings}건 예약</p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                      background: listing.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                      color: listing.status === 'published' ? '#10b981' : '#94a3b8',
                    }}
                  >
                    {listing.status === 'published' ? '공개' : '초안'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement History */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h3 className="mb-4 text-[15px] font-bold text-gray-900">정산 내역</h3>
            <div className="space-y-3">
              {settlements.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
                      style={{ background: 'rgba(16,185,129,0.1)' }}
                    >
                      💳
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-800">{s.month} 정산</p>
                      <p className="text-[11px] text-gray-400">정산일: {s.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-gray-900">₩{s.amount.toLocaleString()}</p>
                    <span className="text-[10px] font-semibold" style={{ color: '#10b981' }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
