export function RestaurantIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Korean-style spoon and chopsticks */}
      <ellipse cx="14" cy="14" rx="5" ry="8" />
      <line x1="14" y1="22" x2="14" y2="42" />
      <line x1="30" y1="6" x2="28" y2="42" />
      <line x1="36" y1="6" x2="34" y2="42" />
    </svg>
  );
}

export function WellnessIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Face with sparkle - skincare/beauty */}
      <circle cx="24" cy="22" r="14" />
      <path d="M18 20v0" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 20v0" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 28c1.5 1.5 6.5 1.5 8 0" />
      {/* Sparkle */}
      <line x1="40" y1="6" x2="40" y2="12" />
      <line x1="37" y1="9" x2="43" y2="9" />
      <line x1="6" y1="10" x2="6" y2="14" />
      <line x1="4" y1="12" x2="8" y2="12" />
    </svg>
  );
}

export function ActivitiesIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Pottery/vase with hands crafting */}
      <path d="M16 38h16" />
      <path d="M18 38c0 0-3-4-3-14s3-12 9-12 9 2 9 12-3 14-3 14" />
      <path d="M20 16c0-2 1.5-4 4-4s4 2 4 4" />
      {/* Small decorative lines on vase */}
      <path d="M19 26h10" />
      <path d="M20 30h8" />
    </svg>
  );
}

export function TipsIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Compass/guide */}
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="3" />
      <polygon points="24,8 26,21 24,24 22,21" fill="currentColor" opacity="0.3" />
      <polygon points="24,40 22,27 24,24 26,27" fill="currentColor" opacity="0.15" />
      <line x1="24" y1="4" x2="24" y2="8" />
      <line x1="24" y1="40" x2="24" y2="44" />
      <line x1="4" y1="24" x2="8" y2="24" />
      <line x1="40" y1="24" x2="44" y2="24" />
    </svg>
  );
}

export function VegetarianIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Leaf */}
      <path d="M24 42V24" />
      <path d="M24 24C24 24 10 22 10 12c0-6 8-8 14-6 6-2 14 0 14 6 0 10-14 12-14 12z" />
      <path d="M18 18c2-1 4-1 6 0" />
    </svg>
  );
}

export function HalalIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Crescent moon */}
      <path d="M32 8c-8 0-16 6-16 16s8 16 16 16c-12 0-20-8-20-16S20 8 32 8z" />
      {/* Star */}
      <circle cx="36" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function BarsIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Cocktail glass */}
      <path d="M12 8h24l-10 16v10h-4V24z" />
      <line x1="16" y1="40" x2="32" y2="40" />
      <line x1="24" y1="34" x2="24" y2="40" />
      {/* Ice cube suggestion */}
      <circle cx="20" cy="14" r="2" />
    </svg>
  );
}

export function TransportIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Train/subway front */}
      <rect x="12" y="8" width="24" height="28" rx="6" />
      <line x1="12" y1="24" x2="36" y2="24" />
      <circle cx="18" cy="30" r="2" />
      <circle cx="30" cy="30" r="2" />
      <rect x="18" y="12" width="12" height="8" rx="2" />
      <line x1="16" y1="40" x2="12" y2="44" />
      <line x1="32" y1="40" x2="36" y2="44" />
    </svg>
  );
}
