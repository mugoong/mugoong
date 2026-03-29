import type { MainCategory } from '@/types';

const iconPaths: Record<MainCategory, React.ReactNode> = {
  restaurants: (
    <>
      <ellipse cx="14" cy="14" rx="5" ry="8" />
      <line x1="14" y1="22" x2="14" y2="42" />
      <line x1="30" y1="6" x2="28" y2="42" />
      <line x1="36" y1="6" x2="34" y2="42" />
    </>
  ),
  wellness: (
    <>
      <circle cx="24" cy="22" r="14" />
      <path d="M18 20v0" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 20v0" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 28c1.5 1.5 6.5 1.5 8 0" />
      <line x1="40" y1="6" x2="40" y2="12" />
      <line x1="37" y1="9" x2="43" y2="9" />
      <line x1="6" y1="10" x2="6" y2="14" />
      <line x1="4" y1="12" x2="8" y2="12" />
    </>
  ),
  activities: (
    <>
      <path d="M16 38h16" />
      <path d="M18 38c0 0-3-4-3-14s3-12 9-12 9 2 9 12-3 14-3 14" />
      <path d="M20 16c0-2 1.5-4 4-4s4 2 4 4" />
      <path d="M19 26h10" />
      <path d="M20 30h8" />
    </>
  ),
  'tips-and-trend': (
    <>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="3" />
      <polygon points="24,8 26,21 24,24 22,21" fill="currentColor" opacity="0.3" />
      <polygon points="24,40 22,27 24,24 26,27" fill="currentColor" opacity="0.15" />
      <line x1="24" y1="4" x2="24" y2="8" />
      <line x1="24" y1="40" x2="24" y2="44" />
      <line x1="4" y1="24" x2="8" y2="24" />
      <line x1="40" y1="24" x2="44" y2="24" />
    </>
  ),
};

export default function CategoryIcon({
  slug,
  className = 'w-10 h-10',
}: {
  slug: string;
  className?: string;
}) {
  const paths = iconPaths[slug as MainCategory];
  if (!paths) return null;

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </svg>
  );
}
