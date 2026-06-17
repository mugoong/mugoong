'use client';

const siteLinks = [
  {
    section: '소비자 서비스',
    color: '#6366f1',
    links: [
      { label: 'Mugoong 메인', url: 'https://www.mugoong.com', desc: '소비자용 웹사이트', icon: '🌸' },
      { label: '레스토랑', url: 'https://www.mugoong.com/en/restaurants', desc: '맛집 리스팅', icon: '🍽️' },
      { label: '웰니스', url: 'https://www.mugoong.com/en/wellness', desc: '스파·마사지', icon: '💆' },
      { label: '액티비티', url: 'https://www.mugoong.com/en/activities', desc: '투어·체험', icon: '🎯' },
      { label: '트래블 팁', url: 'https://www.mugoong.com/en/travel-tips', desc: '여행 가이드', icon: '📖' },
    ],
  },
  {
    section: '관리 시스템',
    color: '#8b5cf6',
    links: [
      { label: 'CMS Admin', url: 'https://www.mugoong.com/admin', desc: '리스팅/예약 관리', icon: '📝' },
      { label: 'OPS Dashboard', url: '/ops', desc: '통합 경영관리', icon: '🏠' },
      { label: '인사/노무', url: '/ops/hr', desc: '직원·연차 관리', icon: '👤' },
      { label: '재무/회계', url: '/ops/finance', desc: '매출·통계', icon: '💰' },
      { label: '협력사 관리', url: '/ops/partners', desc: '파트너 관리', icon: '🤝' },
    ],
  },
  {
    section: '협력사 포털',
    color: '#f59e0b',
    links: [
      { label: '포털 홈', url: '/ops/partners/portal', desc: '협력사 대시보드', icon: '🏪' },
      { label: '내 리스팅', url: '/ops/partners/portal/listings', desc: '상품 관리', icon: '📋' },
      { label: '비즈니스 설정', url: '/ops/partners/portal/settings', desc: '사업자 정보·정산계좌', icon: '⚙️' },
    ],
  },
];

export default function SiteMap() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 className="mb-1 text-lg font-bold text-white">사이트맵</h2>
      <p className="mb-6 text-[13px]" style={{ color: '#94a3b8' }}>무궁 관련 모든 서비스 바로가기</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {siteLinks.map((section) => (
          <div key={section.section}>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1 w-5 rounded-full" style={{ background: section.color }} />
              <h3 className="text-[13px] font-bold" style={{ color: '#cbd5e1' }}>{section.section}</h3>
            </div>
            <div className="space-y-1.5">
              {section.links.map((link) => {
                const isExternal = link.url.startsWith('http');
                const Tag = isExternal ? 'a' : 'a';
                return (
                  <Tag
                    key={link.url}
                    href={link.url}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = section.color + '15';
                      e.currentTarget.style.borderColor = section.color + '30';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-200 transition-colors group-hover:text-white">{link.label}</p>
                      <p className="text-[11px]" style={{ color: '#64748b' }}>{link.desc}</p>
                    </div>
                    {isExternal && (
                      <svg className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </Tag>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
