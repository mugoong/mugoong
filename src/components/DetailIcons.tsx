/* Mugoong detail-page icons — 24×24 stroke-based, round caps/joins */

type P = { className?: string };
const D = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export function PinIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

export function PhoneIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );
}

export function ClockIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 14.5"/>
    </svg>
  );
}

export function CoffeeIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M17 8h1a4 4 0 110 8h-1"/>
      <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="2" x2="6" y2="5"/>
      <line x1="10" y1="2" x2="10" y2="5"/>
      <line x1="14" y1="2" x2="14" y2="5"/>
    </svg>
  );
}

export function ClosedIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="9.5" y1="15" x2="14.5" y2="15"/>
    </svg>
  );
}

export function PersonIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export function TimerIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="12" cy="13" r="8"/>
      <polyline points="12 9 12 13 15 15"/>
      <line x1="9.5" y1="3" x2="14.5" y2="3"/>
      <line x1="12" y1="3" x2="12" y2="5"/>
    </svg>
  );
}

export function PeopleIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}

export function DifficultyIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="12" y1="20" x2="12" y2="6"/>
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}

export function AgeIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
      <path d="M16 5c.8.5 1.5 1.4 1.5 2.5"/>
    </svg>
  );
}

export function FlagIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  );
}

export function MoneyIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v1m0 8v1"/>
      <path d="M9.5 9.5c.4-.8 1.3-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 2-2.5 2-2.5 4"/>
    </svg>
  );
}

export function BathIcon({ className = 'w-5 h-5' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/>
      <path d="M6 12V6a2 2 0 012-2h0a2 2 0 012 2v6"/>
      <line x1="4" y1="20" x2="4" y2="22"/>
      <line x1="20" y1="20" x2="20" y2="22"/>
    </svg>
  );
}

export function DoctorIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="10" cy="7" r="4"/>
      <path d="M3 21c0-4 3.13-7 7-7"/>
      <circle cx="18" cy="15" r="3"/>
      <line x1="18" y1="12" x2="18" y2="15"/>
      <line x1="15" y1="15" x2="18" y2="15"/>
    </svg>
  );
}

export function ScissorsIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  );
}

export function TreatmentIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export function FacilitiesIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M3 12h18M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M3 12c2.5-2 5.5-3 9-3s6.5 1 9 3"/>
    </svg>
  );
}

export function ProgramIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <rect x="5" y="3" width="14" height="18" rx="2"/>
      <line x1="9" y1="9" x2="15" y2="9"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
  );
}

export function IncludedIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function ExcludedIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export function BackpackIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2z"/>
      <path d="M9 5V4a3 3 0 016 0v1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  );
}

export function InfoCircleIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2"/>
      <line x1="12" y1="11" x2="12" y2="16"/>
    </svg>
  );
}

export function WarningIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"/>
    </svg>
  );
}

export function RefreshIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  );
}

export function LightbulbIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17H8v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/>
    </svg>
  );
}

export function MapIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
}

export function StarIconOutline({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

export function ActivityIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}

export function SaunaIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M12 2c-5 3-7 6-5 9.5C8.5 15 10 17 10 19h4c0-2 1.5-4 3-7.5C19 8 17 5 12 2z"/>
      <line x1="10" y1="22" x2="14" y2="22"/>
      <line x1="11" y1="19" x2="11" y2="22"/>
      <line x1="13" y1="19" x2="13" y2="22"/>
    </svg>
  );
}

export function MassageServiceIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M4 19c0-4 3.5-6 8-6s8 2 8 6"/>
      <circle cx="12" cy="8" r="4"/>
      <path d="M8 17c1.5 1 6.5 1 8 0"/>
    </svg>
  );
}

export function VenueIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

export function MenuPriceIcon({ className = 'w-4 h-4' }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...D}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="12" y2="17"/>
      <path d="M11 10.5c0-.5.4-1 1-1s1 .4 1 1-.4 1-1 1"/>
    </svg>
  );
}
