'use client';
import { useState, useEffect } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1596489345711-4148acfb9fc4?q=100&w=2560&auto=format&fit=crop', // 롯데타워 노을 (유사 느낌 최고화질)
  'https://images.unsplash.com/photo-1546874177-9e664107e3cb?q=100&w=2560&auto=format&fit=crop', // 경복궁 전경 최고화질
  'https://images.unsplash.com/photo-1617260580956-65487e452140?q=100&w=2560&auto=format&fit=crop', // 도심 야경/남산 타워
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=100&w=2560&auto=format&fit=crop', // 남산 타워 클래식 야경 (대표님 애정 픽)
  'https://images.unsplash.com/photo-1582236315809-5a1ac2cfbf50?q=100&w=2560&auto=format&fit=crop', // 광화문/도심 현대적 야경
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 2초 간격으로 자동 슬라이드
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gray-900">
      {IMAGES.map((src, idx) => {
        // 부드러운 이동을 위한 위치 계산
        let offset = idx - currentIndex;
        // 무한 롤링 효과를 위한 처리
        if (offset < -1) offset += IMAGES.length;
        if (offset > IMAGES.length - 2) offset -= IMAGES.length;

        return (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${src}')`,
              transform: `translateX(${offset * 100}%)`,
              opacity: 1,
            }}
          />
        );
      })}
    </div>
  );
}
