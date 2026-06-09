'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';

export default function PartnerSettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    company_name: '한옥스테이',
    business_registration_number: '123-45-67890',
    representative_name: '김한옥',
    business_type: '숙박업',
    phone: '02-1234-5678',
    email: 'info@hanokstay.com',
    address: '서울시 종로구 북촌로 45',
  });

  const [bankInfo, setBankInfo] = useState({
    bank_name: '신한은행',
    bank_account: '110-123-456789',
    bank_holder: '김한옥',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <OpsShell module="partners">
      <div className="mb-8">
        <span
          className="mb-2 inline-block rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
        >
          Partner Portal
        </span>
        <h1 className="text-2xl font-bold text-gray-900">비즈니스 설정</h1>
        <p className="mt-1 text-[14px] text-gray-400">사업자 정보 및 정산 계좌 관리</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Info */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              🏢
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">사업자 정보</h2>
              <p className="text-[11px] text-gray-400">비즈니스 등록 정보</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'company_name', label: '업체명', type: 'text' },
              { key: 'business_registration_number', label: '사업자등록번호', type: 'text' },
              { key: 'representative_name', label: '대표자명', type: 'text' },
              { key: 'business_type', label: '업종', type: 'text' },
              { key: 'phone', label: '연락처', type: 'text' },
              { key: 'email', label: '이메일', type: 'email' },
              { key: 'address', label: '주소', type: 'text' },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">{field.label}</label>
                <input
                  type={field.type}
                  value={(businessInfo as Record<string, string>)[field.key]}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            ))}
          </div>

          {/* Document Upload */}
          <div className="mt-6">
            <label className="mb-2 block text-[12px] font-medium text-gray-500">사업자등록증 사본</label>
            <div
              className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/30"
            >
              <div className="text-xl">📄</div>
              <div>
                <p className="text-[13px] font-medium text-gray-600">클릭하여 파일 업로드</p>
                <p className="text-[11px] text-gray-400">PDF, JPG (최대 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ background: 'rgba(16,185,129,0.1)' }}
              >
                🏦
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">정산 계좌</h2>
                <p className="text-[11px] text-gray-400">매출 정산금 수령 계좌</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">은행</label>
                <select
                  value={bankInfo.bank_name}
                  onChange={(e) => setBankInfo((prev) => ({ ...prev, bank_name: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  {['신한은행', '국민은행', '하나은행', '우리은행', '농협', '기업은행', '카카오뱅크', '토스뱅크'].map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">계좌번호</label>
                <input
                  type="text"
                  value={bankInfo.bank_account}
                  onChange={(e) => setBankInfo((prev) => ({ ...prev, bank_account: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">예금주</label>
                <input
                  type="text"
                  value={bankInfo.bank_holder}
                  onChange={(e) => setBankInfo((prev) => ({ ...prev, bank_holder: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl p-3" style={{ background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-[11px] text-gray-500">
                💡 정산은 매월 5일에 전월 매출에 대해 진행됩니다. 계좌 변경 시 다음 정산부터 적용됩니다.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: saved
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              boxShadow: saved
                ? '0 4px 12px rgba(16,185,129,0.3)'
                : '0 4px 12px rgba(245,158,11,0.3)',
            }}
          >
            {saved ? '✓ 저장 완료!' : '변경사항 저장'}
          </button>

          {/* Danger Zone */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <h3 className="mb-2 text-[14px] font-bold text-red-500">위험 영역</h3>
            <p className="mb-4 text-[12px] text-gray-400">
              아래 작업은 되돌릴 수 없습니다. 신중하게 진행하세요.
            </p>
            <button className="rounded-lg border border-red-200 px-4 py-2 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-50">
              파트너 탈퇴 요청
            </button>
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
