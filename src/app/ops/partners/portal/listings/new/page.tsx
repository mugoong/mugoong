'use client';

import { useState } from 'react';
import OpsShell from '@/components/ops/OpsShell';

export default function NewPartnerListingPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    city: '',
    description: '',
    content: '',
    price: '',
    address: '',
    phone: '',
    operating_hours: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OpsShell module="partners">
      <div className="mb-6">
        <a href="/ops/partners/portal/listings" className="text-[13px] font-medium text-indigo-500 hover:text-indigo-700">
          ← 내 리스팅
        </a>
      </div>

      <div className="mb-8">
        <span
          className="mb-2 inline-block rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
        >
          Partner Portal
        </span>
        <h1 className="text-2xl font-bold text-gray-900">새 리스팅 등록</h1>
        <p className="mt-1 text-[14px] text-gray-400">새 상품 또는 서비스를 등록하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div
          className="space-y-6 lg:col-span-2"
        >
          {/* Basic Info */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">기본 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">상품명 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="예: 북촌 한옥 프리미엄 스테이"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-500">카테고리 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  >
                    <option value="">선택</option>
                    <option value="restaurants">레스토랑</option>
                    <option value="wellness">웰니스</option>
                    <option value="activities">액티비티</option>
                    <option value="travel-tips">트래블 팁</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-500">서브카테고리</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-gray-500">도시 *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  >
                    <option value="">선택</option>
                    <option value="seoul">Seoul</option>
                    <option value="busan">Busan</option>
                    <option value="jeju">Jeju</option>
                    <option value="gyeongju">Gyeongju</option>
                    <option value="jeonju">Jeonju</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">간략 설명 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="상품에 대한 간략한 소개"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">상세 내용</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={6}
                  placeholder="상세 설명, 포함 사항, 주의사항 등"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          {/* Price & Details */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">가격 및 상세</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">가격 (KRW) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="65000"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">연락처</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="02-1234-5678"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">주소</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="서울시 종로구 북촌로 45"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-medium text-gray-500">영업시간</label>
                <input
                  type="text"
                  value={formData.operating_hours}
                  onChange={(e) => handleChange('operating_hours', e.target.value)}
                  placeholder="매일 09:00-18:00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[13px] outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">이미지</h2>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 transition-colors hover:border-amber-300 hover:bg-amber-50/30"
            >
              <div className="mb-2 text-3xl">📷</div>
              <p className="text-[13px] font-medium text-gray-600">클릭 또는 드래그하여 이미지 업로드</p>
              <p className="text-[11px] text-gray-400">JPG, PNG, WebP (최대 5MB)</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div
            className="sticky top-[88px] rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">게시</h2>
            <div className="space-y-3">
              <button
                className="w-full rounded-xl py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                }}
              >
                등록 요청 (검토 후 공개)
              </button>
              <button className="w-full rounded-xl border border-gray-200 py-3 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50">
                초안 저장
              </button>
            </div>

            <div className="mt-6 rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <p className="text-[11px] text-gray-400">
                💡 리스팅 등록 후 무궁 관리자의 검토를 거쳐 공개됩니다.
                검토는 영업일 기준 1~2일 소요됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </OpsShell>
  );
}
