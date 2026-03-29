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
