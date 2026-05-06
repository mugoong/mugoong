// Category-specific form configuration
// Controls which sections/fields appear and their placeholders per category

export type ExtraFieldType = 'text' | 'select' | 'boolean' | 'number';

export interface ExtraField {
  key: string;
  label: string;
  type: ExtraFieldType;
  placeholder?: string;
  options?: string[];  // for select type
}

export interface CategoryFormConfig {
  slug: string;
  label: string;
  icon: string;
  color: string;
  // Section visibility
  showPrice: boolean;
  showMenuItems: boolean;
  showAddress: boolean;
  showPhone: boolean;
  showHours: boolean;
  // Placeholders
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  contentPlaceholder: string;
  contentLabel: string;
  menuLabel: string;
  menuItemLabels: { name: string; price: string; desc: string };
  // Extra category-specific fields stored in notes as JSON
  extraFields: ExtraField[];
}

export const categoryFormConfigs: Record<string, CategoryFormConfig> = {
  restaurants: {
    slug: 'restaurants',
    label: '🍽️ Restaurant',
    icon: '🍽️',
    color: '#E85D3A',
    showPrice: true,
    showMenuItems: true,
    showAddress: true,
    showPhone: true,
    showHours: true,
    titlePlaceholder: 'e.g., Premium Hanwoo BBQ in Gangnam',
    descriptionPlaceholder: 'Brief intro: cuisine type, ambiance, what makes it special for travelers...',
    contentPlaceholder: 'Tell the story: atmosphere, signature dishes, ordering tips, how to get there, what to expect...',
    contentLabel: 'Restaurant Story & Guide',
    menuLabel: 'Menu & Price List',
    menuItemLabels: { name: 'Dish name', price: 'Price (₩)', desc: 'Description (optional)' },
    extraFields: [
      { key: 'reservation', label: 'Reservation Required?', type: 'select', options: ['Not required', 'Recommended', 'Required'] },
      { key: 'english_menu', label: 'English Menu Available?', type: 'boolean' },
      { key: 'seating', label: 'Seating Capacity', type: 'text', placeholder: 'e.g., 40 seats, private rooms available' },
      { key: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g., Free valet parking / Street parking only' },
      { key: 'payment', label: 'Payment Methods', type: 'text', placeholder: 'e.g., Cash, Card, Naver Pay' },
    ],
  },

  wellness: {
    slug: 'wellness',
    label: '✨ Wellness',
    icon: '✨',
    color: '#9B59B6',
    showPrice: true,
    showMenuItems: true,
    showAddress: true,
    showPhone: true,
    showHours: true,
    titlePlaceholder: 'e.g., Gangnam Premium Skin Clinic – Glow Package',
    descriptionPlaceholder: 'Brief intro: type of service, who it\'s for, key benefits...',
    contentPlaceholder: 'Detailed guide: treatment process, what to expect, before/after care, staff language skills, atmosphere...',
    contentLabel: 'Treatment Guide & Details',
    menuLabel: 'Treatment Menu & Pricing',
    menuItemLabels: { name: 'Treatment name', price: 'Price (₩)', desc: 'Duration / details' },
    extraFields: [
      { key: 'reservation', label: 'Reservation Required?', type: 'select', options: ['Walk-in OK', 'Recommended', 'Required'] },
      { key: 'english_staff', label: 'English-speaking Staff?', type: 'boolean' },
      { key: 'gender_policy', label: 'Gender Policy', type: 'select', options: ['All welcome', 'Women only', 'Men only', 'Separate areas'] },
      { key: 'duration', label: 'Average Session Duration', type: 'text', placeholder: 'e.g., 60-90 minutes' },
      { key: 'what_to_bring', label: 'What to Bring / Wear', type: 'text', placeholder: 'e.g., Comfortable clothing, remove makeup beforehand' },
    ],
  },

  activities: {
    slug: 'activities',
    label: '🎯 Activity',
    icon: '🎯',
    color: '#2ECC71',
    showPrice: true,
    showMenuItems: true,
    showAddress: true,
    showPhone: true,
    showHours: false,
    titlePlaceholder: 'e.g., Traditional Hanbok Experience in Bukchon',
    descriptionPlaceholder: 'Brief intro: what the activity is, who it\'s for, highlight moments...',
    contentPlaceholder: 'Full guide: what you\'ll do step by step, what\'s included, tips for best experience, meeting point details...',
    contentLabel: 'Activity Guide & Itinerary',
    menuLabel: 'Program Options & Pricing',
    menuItemLabels: { name: 'Program name', price: 'Price (₩)', desc: 'Duration / group size' },
    extraFields: [
      { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 2 hours' },
      { key: 'group_size', label: 'Group Size', type: 'text', placeholder: 'e.g., Min 2 – Max 10 people' },
      { key: 'difficulty', label: 'Difficulty Level', type: 'select', options: ['Easy (anyone)', 'Moderate', 'Challenging'] },
      { key: 'inclusions', label: 'What\'s Included', type: 'text', placeholder: 'e.g., Materials, snacks, photo service' },
      { key: 'what_to_bring', label: 'What to Bring', type: 'text', placeholder: 'e.g., Comfortable shoes, sunscreen' },
      { key: 'meeting_point', label: 'Meeting Point', type: 'text', placeholder: 'e.g., Exit 3 of Anguk Station' },
      { key: 'english_guide', label: 'English Guide Available?', type: 'boolean' },
    ],
  },

  'tips-and-trend': {
    slug: 'tips-and-trend',
    label: '💡 Tips & Trends',
    icon: '💡',
    color: '#F39C12',
    showPrice: false,
    showMenuItems: false,
    showAddress: false,
    showPhone: false,
    showHours: false,
    titlePlaceholder: 'e.g., How to Use the Seoul Metro Like a Local',
    descriptionPlaceholder: 'One-liner summary that hooks the reader...',
    contentPlaceholder: 'Write your article here. Tips, guides, trends — make it informative and engaging for travelers visiting Korea...',
    contentLabel: 'Article Content',
    menuLabel: '',
    menuItemLabels: { name: '', price: '', desc: '' },
    extraFields: [
      { key: 'source_url', label: 'Source / Reference URL', type: 'text', placeholder: 'https://...' },
      { key: 'last_verified', label: 'Last Verified Date', type: 'text', placeholder: 'e.g., 2026-05-01' },
    ],
  },
};

export function getCategoryFormConfig(slug: string): CategoryFormConfig {
  return categoryFormConfigs[slug] ?? categoryFormConfigs['restaurants'];
}
