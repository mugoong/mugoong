'use client';
import { useState, useEffect } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=100&w=2560&auto=format&fit=crop', // Namsan Tower Pink Sunset
  'https://images.unsplash.com/photo-1538485399081-7191377e8220?q=100&w=2560&auto=format&fit=crop', // Seoul Modern Night Skyline
  'https://images.unsplash.com/photo-1588665064560-ce1e2ea3c4ba?q=100&w=2560&auto=format&fit=crop', // Han River Bridge at Sunset
  'https://images.unsplash.com/photo-1582236315809-5a1ac2cfbf50?q=100&w=2560&auto=format&fit=crop', // Gwanghwamun/Bukchon style
  'https://images.unsplash.com/photo-1620023419088-751bdccc7fd8?q=100&w=2560&auto=format&fit=crop', // Seoul Urban lights
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 2초 간격 자동 슬라이드
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gray-900">
      {/* 긴 띠 모양의 컨테이너를 왼쪽으로 이동(translate-x)시키는 완벽하게 단순한 슬라이더 구조 */}
      <div 
        className="flex h-full w-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {IMAGES.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="h-full w-full flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
    </div>
  );
}
