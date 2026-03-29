'use client';
import { useState, useEffect } from 'react';

const IMAGES = [
  '/slide-1.jpg',
  '/slide-2.jpg',
  '/slide-3.jpg',
  '/slide-4.jpg',
  '/slide-5.jpg',
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 2.5초 간격무제한 슬라이드 (대표님 요청)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 2500);
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
