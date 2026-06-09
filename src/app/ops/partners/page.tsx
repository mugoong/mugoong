'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';
import StatsCard from '@/components/ops/StatsCard';
import DataTable from '@/components/ops/DataTable';
import type { Partner } from '@/lib/supabase/ops-types';

const demoPartners: Partner[] = [
  { id: '1', created_at: '', updated_at: '', company_name: '한옥스테이', business_registration_number: '123-45-67890', representative_name: '김한옥', business_type: '숙박업', phone: '02-1234-5678', email: 'info@hanokstay.com', address: '서울시 종로구 북촌로', bank_name: '신한은행', bank_account: '110-123-456789', bank_holder: '김한옥', status: 'active', notes: '' },
  { id: '2', created_at: '', updated_at: '', company_name: '서울스파 프리미엄', business_registration_number: '234-56-78901', representative_name: '이스파', business_type: '미용서비스업', phone: '02-2345-6789', email: 'hello@seoulspa.com', address: '서울시 강남구 역삼동', bank_name: '국민은행', bank_account: '123-456-789012', bank_holder: '이스파', status: 'active', notes: '' },
  { id: '3', created_at: '', updated_at: '', company_name: '제주투어 어드벤처', business_registration_number: '345-67-89012', representative_name: '박제주', business_type: '여행업', phone: '064-3456-7890', email: 'tour@jejuadventure.com', address: '제주시 연동', bank_name: '하나은행', bank_account: '234-567-890123', bank_holder: '박제주', status: 'active', notes: '' },
  { id: '4', created_at: '', updated_at: '', company_name: '부산맛집 컬렉션', business_registration_number: '456-78-90123', representative_name: '최부산', business_type: '음식점업', phone: '051-4567-8901', email: 'eat@busanfood.com', address: '부산시 해운대구', bank_name: '우리은행', bank_account: '345-678-901234', bank_holder: '최부산', status: 'active', notes: '' },
  { id: '5', created_at: '', updated_at: '', company_name: '경주힐링 리조트', business_registration_number: '567-89-01234', representative_name: '정경주', business_type: '숙박업', phone: '054-5678-9012', email: 'info@gyeongju-healing.com', address: '경주시 보문동', bank_name: '신한은행', bank_account: '456-789-012345', bank_holder: '정경주', status: 'pending', notes: '' },
  { id: '6', created_at: '', updated_at: '', company_name: '전주한옥 체험', business_registration_number: '678-90-12345', representative_name: '한전주', business_type: '문화체험업', phone: '063-6789-0123', email: 'hanok@jeonju.com', address: '전주시 완산구 한옥마을', bank_name: '농협', bank_account: '567-890-123456', bank_holder: '한전주', status: 'active', notes: '' },
  { id: '7', created_at: '', updated_at: '', company_name: '강릉커피 투어', business_registration_number: '789-01-23456', representative_name: '송강릉', business_type: '관광업', phone: '033-7890-1234', email: 'coffee@gangneung.com', address: '강릉시 사천면', bank_name: '기업은행', bank_account: '678-901-234567', bank_holder: '송강릉', status: 'suspended', notes: '계약 검토 중' },
  { id: '8', created_at: '', updated_at: '', company_name: '인천공항 리무진', business_registration_number: '890-12-34567', representative_name: '윤인천', business_type: '운수업', phone: '032-8901-2345', email: 'limo@icnairport.com', address: '인천시 중구 공항로', bank_name: '카카오뱅크', bank_account: '789-012-345678', bank_holder: '윤인천', status: 'pending', notes: '' },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', label: '활성' },
    pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', label: '승인 대기' },
    suspended: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', label: '정지' },
  };
  const s = map[status] || map.pending;
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
};

export default function PartnersPage() {
  const [showModal, setShowModal] = useState(false);

  const activeCount = demoPartners.filter((p) => p.status === 'active').length;
  const pendingCount = demoPartners.filter((p) => p.status === 'pending').length;

  const columns = [
    {
      key: 'company_name',
      label: '업체명',
      render: (row: Partner) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
          >
            {row.company_name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.company_name}</p>
            <p className="text-[11px] text-gray-400">{row.business_type}</p>
          </div>
        </div>
      ),
    },
    { key: 'representative_name', label: '대표자' },
    { key: 'business_registration_number', label: '사업자번호' },
    { key: 'phone', label: '연락처' },
    {
      key: 'bank_name',
      label: '정산 은행',
      render: (row: Partner) => (
        <span className="text-[12px] text-gray-600">{row.bank_name} {row.bank_account ? '✓' : '—'}</span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (row: Partner) => statusBadge(row.status),
    },
    {
      key: 'actions',
      label: '',
      width: '100px',
      render: (row: Partner) => (
        <div className="flex gap-1.5">
          {row.status === 'pending' && (
            <button
              className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white"
              style={{ background: '#10b981' }}
            >
              승인
            </button>
          )}
          <a
            href={`/ops/partners/${row.id}`}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-50"
          >
            상세
          </a>
        </div>
      ),
    },
  ];

  return (
    <OpsShell module="partners">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">협력사 관리</h1>
          <p className="mt-1 text-[14px] text-gray-400">파트너 업체 관리 및 정산</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
          }}
        >
          <span>+</span> 협력사 추가
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="전체 협력사" value={demoPartners.length} icon="🤝" color="amber" />
        <StatsCard label="활성 협력사" value={activeCount} icon="✅" color="emerald" />
        <StatsCard label="승인 대기" value={pendingCount} icon="⏳" color="rose" />
        <StatsCard label="이번 달 정산" value="₩42M" icon="💳" color="indigo" />
      </div>

      <DataTable columns={columns} data={demoPartners} pageSize={10} />

      {/* Add Partner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">협력사 추가</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['업체명', '대표자명', '사업자등록번호', '업종', '이메일', '연락처', '주소', '정산 은행', '계좌번호', '예금주'].map((label) => (
                <div key={label} className={label === '주소' ? 'sm:col-span-2' : ''}>
                  <label className="mb-1 block text-[12px] font-medium text-gray-500">{label}</label>
                  <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-amber-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50">취소</button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-5 py-2 text-[13px] font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </OpsShell>
  );
}
