import { Listing } from '@/types';
import type { MainCategory, City } from '@/types';
import type { MenuItemJson } from '@/lib/supabase/types';

/* ─── Master image pool: 64 validated Unsplash IDs ──────────────── */
const M = [
  /* 0–9  */ '1590301157890-4810ed352733','1583417319070-4a69db38a482','1546069901-ba9599a7e63c',
             '1504674900247-0877df9cc836','1498654896293-37aacf113fd9','1565299507177-b0ac66763828',
             '1551218808-94e220e084d2','1563245372-f21724e3856d','1544025162-d76694265947',
             '1529692236671-f1f6cf9683ba',
  /* 10–19 */ '1558618666-fcd25c85cd64','1534482421-64566f976cfa','1574484284002-952d92456975',
              '1569050467447-ce54b3bbc37d','1455619452474-d2be8b1e70cd','1512621776951-a57141f2eefd',
              '1546554137-f86b9593a222','1603133872878-684f208fb84b','1565557623262-b51c2513a641',
              '1572116469696-31de0f17cc34',
  /* 20–29 */ '1514362545857-3bc16c4c7d1b','1562967914-608f82629710','1588166524941-3bf61a9c41db',
              '1414235077428-338989a2e8c0','1498579687545-d5a4fffb0a9e','1629909613654-28e377c37b09',
              '1620916566398-39f1143ab7be','1576091160550-2173dba999ef','1570172619644-dfd03ed5d881',
              '1556228578-8c89e6adf883',
  /* 30–39 */ '1598440947619-2c35fc9aa908','1540555700478-4be289fbecef','1612349317150-e413f6a5b16d',
              '1560066984-138daaa70c8f','1522337360788-8b13dee7a37e','1519494026892-80bbd2d6fd0d',
              '1545579133-99bb5ad189be','1544161515-4ab6ce6db874','1559599238-308793637427',
              '1466637574441-749b8f19452f',
  /* 40–49 */ '1547592180-85f173990554','1582979512210-99b6a53386f9','1535192952584-91d9cf7e1c0e',
              '1574680096145-d05b474e2155','1566552881560-0be862a7c445','1549488697-deead16fbe9b',
              '1571019613454-1cb2f99b2d8b','1543353071-087092ec393a','1476514525535-07fb3b4ae5f1',
              '1488646953014-85cb44e25828',
  /* 50–59 */ '1529156069898-49953e39b3ac','1555993539-1732b0258235','1554041839-bc64b14f30a5',
              '1530521954074-e64f6810b32d','1540575467063-178a50c2df87','1522337660859-02fbefca4702',
              '1501785888041-af3ef285b470','1517154421773-0529f29ea451','1583224994076-0a5a4e3384c7',
              '1482938289607-e9573fc25ebb',
  /* 60–63 */ '1559825481-12a05cc00344','1581262208435-41726149a759','1544620347-c4fd4a3d5957',
              '1565043589221-1a6fd9ae45c7',
];

/* ─── Helpers ────────────────────────────────────────────────────── */
const I = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;
const m = (n: number) => I(M[n % M.length]);
const sg = (s: number): string[] => Array.from({ length: 7 }, (_, i) => I(M[(s * 7 + i) % M.length]));

/* ─── Restaurant notes builder ───────────────────────────────────── */
function rn(
  mapQ: string, deposit: number, dietary: Record<string, boolean>,
  breakTime: string, holidays: string,
  notices: string[], cancel: string[], know: string[],
  reviews: { source: string; reviewer: string; rating: number; text: string; date: string }[]
): string {
  return JSON.stringify({ __plain: '', __extra: {
    booking_deposit: deposit, dietary,
    naver_map_url: '', kakao_map_url: '',
    google_map_url: `https://maps.google.com/?q=${encodeURIComponent(mapQ)}`,
    break_time: breakTime, holidays,
    reservation_notices: notices, cancellation_policy: cancel,
    important_notes: know, external_reviews: reviews,
  }});
}

/* ─── Restaurant listing builder (with full detail data) ─────────── */
function qr(
  id: string, slug: string, city: City, cat: MainCategory, sub: string,
  title: string, desc: string, img: string, gallery: string[],
  price: number, rating: number, rCnt: number,
  tags: string[], featured: boolean, address: string,
  phone: string, hours: string,
  menu: MenuItemJson[], notes: string
): Listing {
  return {
    id, slug, category: cat, subcategory: sub, city,
    title, description: desc, content: '',
    image: img, gallery, price, currency: 'USD',
    rating, reviewCount: rCnt, tags, featured, address,
    phone, operating_hours: hours, menu_items: menu, notes,
  };
}

/* ─── Generic compact listing generator (non-restaurant) ────────── */
function q(
  id: string, slug: string, city: City,
  category: MainCategory, sub: string,
  title: string, desc: string,
  image: string, gallery: string[],
  price: number, rating: number, reviews: number,
  tags: string[] = [], featured = false, address = ''
): Listing {
  return {
    id, slug, category, subcategory: sub, city,
    title, description: desc, content: '',
    image, gallery, price, currency: 'USD',
    rating, reviewCount: reviews,
    tags, featured, address,
    phone: '', operating_hours: '', menu_items: [], notes: '',
  };
}

/* ─── Shared policy constants ────────────────────────────────────── */
const C24 = ['Full refund 24+ hours before', 'No refund within 24 hours'];
const C48 = ['Full refund 48+ hours before', '50% refund 24–48 hours before', 'No refund within 24 hours'];
const NWI = ['Walk-in welcome — reservations recommended during peak hours'];
const NRV = ['Reservation required for groups of 4+', 'Please arrive 10 minutes early'];
const D0: Record<string, boolean> = {};
const DV: Record<string, boolean> = { vegetarian: true };
const DH: Record<string, boolean> = { halal: true };

/* ─── Menu templates per subcategory ─────────────────────────────── */
const MKF = (p = 22000): MenuItemJson[] => [
  { category: 'main', name: 'Traditional Korean Set Meal', price: p, description: 'Rice + jjigae + 8 seasonal banchan' },
  { category: 'main', name: 'Bibimbap', price: 12000, description: 'Stone pot with assorted vegetables & gochujang' },
  { category: 'main', name: 'Kimchi Jjigae', price: 9000, description: 'Spicy kimchi stew with tofu and pork' },
  { category: 'drink', name: 'Makgeolli (500ml)', price: 5000, description: 'Traditional unfiltered rice wine' },
];
const MKB = (p = 18000): MenuItemJson[] => [
  { category: 'main', name: 'Samgyeopsal 200g', price: p, description: 'Premium pork belly, grilled tableside' },
  { category: 'main', name: 'Galbi 200g', price: p + 14000, description: 'Marinated beef short ribs over charcoal' },
  { category: 'main', name: 'Bulgogi (Marinated Beef)', price: 16000, description: 'Thin-sliced marinated sirloin' },
  { category: 'drink', name: 'Soju (360ml)', price: 5000, description: 'Classic Korean spirit — pairs perfectly with BBQ' },
];
const MFC = (p = 20000): MenuItemJson[] => [
  { category: 'main', name: 'Whole Fried Chicken', price: p, description: 'Classic crispy whole bird (serves 2)' },
  { category: 'main', name: 'Yangnyeom Chicken (Half)', price: 13000, description: 'Signature sweet & spicy glazed pieces' },
  { category: 'side', name: 'Pickled Radish & Sauces', price: 0, description: 'Complimentary with every order' },
  { category: 'drink', name: 'Draft Beer 500ml', price: 5000, description: 'Domestic lager — the chimaek classic' },
];
const MBA = (p = 14000): MenuItemJson[] => [
  { category: 'main', name: 'House Signature Cocktail', price: p, description: 'Soju-base with Korean citrus and herbs' },
  { category: 'main', name: 'Craft Beer 500ml', price: 9000, description: 'Local craft, rotating seasonal taps' },
  { category: 'main', name: 'Traditional Makgeolli', price: 8000, description: 'Cloudy unfiltered rice wine, served cold' },
  { category: 'side', name: 'Korean Bar Snack Set', price: 12000, description: 'Jeon + dried squid + seasoned nuts' },
];
const MVG = (p = 18000): MenuItemJson[] => [
  { category: 'main', name: 'Temple Vegan Set', price: p, description: '8 seasonal vegetable side dishes + rice' },
  { category: 'main', name: 'Vegan Bibimbap', price: 13000, description: 'Stone pot, zero animal products' },
  { category: 'main', name: 'Seasonal Tofu Soup', price: 9000, description: 'Silken tofu in clear kelp broth' },
  { category: 'drink', name: 'Organic Barley Tea', price: 0, description: 'Complimentary hot or cold' },
];
const MHL = (p = 15000): MenuItemJson[] => [
  { category: 'main', name: 'Halal Bibimbap', price: p, description: 'KMF-certified ingredients throughout' },
  { category: 'main', name: 'Halal Galbi Jjim', price: 28000, description: 'Braised halal beef short ribs, slow-cooked' },
  { category: 'main', name: 'Halal Korean Set Meal', price: 18000, description: 'Rice + halal soup + 6 banchan' },
  { category: 'drink', name: 'Korean Barley Tea', price: 0, description: 'Complimentary — no alcohol on menu' },
];

/* ─── Things-to-know per subcategory ────────────────────────────── */
const KF_KNOW = ['Seating is first-come, first-served during peak hours', 'Remove shoes if traditional floor seating is selected'];
const KB_KNOW = ['Staff will grill for you — just ask', 'Some charcoal-grill rooms are cash-only, bring ₩'];
const FC_KNOW = ['Allow 20–30 minutes for fresh frying', 'Delivery available via Baemin and Coupang Eats'];
const BA_KNOW = ['ID verification required (21+)', 'Large groups (8+) require prior reservation'];
const VG_KNOW = ['Temple food contains no garlic or onion — confirm preferences', 'All ingredients are seasonal and locally sourced'];
const HL_KNOW = ['KMF halal-certified kitchen — no cross-contamination', 'Prayer direction indicator available on request'];
const SM_KNOW = ['Bring cash — most street stalls don\'t accept cards', 'Peak hours 12:00–14:00 and 18:00–21:00 can get crowded'];
const CD_KNOW = ['Most cafés have a 2-hour seating limit on weekends', 'Bingsu is seasonal — available May–September'];
const FD_KNOW = ['Smart casual or formal attire required', 'Tasting menu reservations require a deposit'];
const SF_KNOW = ['Freshness is best morning to early afternoon — arrive early', 'Whole fish is served bone-in — ask staff to de-bone on request'];
const QB_KNOW = ['Most quick-bite spots don\'t take reservations — queue expected', 'Meals typically served in under 10 minutes'];

const MSM = (p = 8000): MenuItemJson[] => [
  { category: 'main', name: 'Tteokbokki (Rice Cake)', price: p, description: 'Spicy chewy rice cakes in gochujang sauce' },
  { category: 'main', name: 'Bindaetteok (Mung Bean Pancake)', price: 6000, description: 'Crispy street-food classic' },
  { category: 'main', name: 'Odeng Skewer (5pc)', price: 3000, description: 'Fish cake on skewers in warm broth' },
  { category: 'drink', name: 'Makgeolli Cup', price: 2000, description: 'Plastic cup rice wine — street-market style' },
];
const MCD = (p = 9000): MenuItemJson[] => [
  { category: 'main', name: 'Signature Coffee', price: p, description: 'Single-origin espresso or pour-over' },
  { category: 'main', name: 'Bingsu (Shaved Ice)', price: 13000, description: 'Korean shaved ice with fresh toppings' },
  { category: 'main', name: 'Tteok (Korean Rice Cake) Set', price: 8000, description: '4 assorted seasonal rice cakes' },
  { category: 'side', name: 'Garlic Bread Toast', price: 6000, description: 'Korean-style thick-cut garlic toast' },
];
const MFD = (p = 90000): MenuItemJson[] => [
  { category: 'main', name: "Chef's Tasting Menu (7 course)", price: p, description: 'Seasonal Korean fine dining — paired sauces & broth' },
  { category: 'main', name: 'À la Carte Main Course', price: 45000, description: 'Signature meat or seafood, plated presentation' },
  { category: 'side', name: 'Amuse-Bouche', price: 0, description: 'Complimentary — house specialty' },
  { category: 'drink', name: 'Wine Pairing (per glass)', price: 22000, description: 'Sommelier-selected Korean and international wines' },
];
const MSF = (p = 30000): MenuItemJson[] => [
  { category: 'main', name: 'Haemultang (Seafood Hot Pot)', price: p, description: 'Spicy stew with clams, squid, shrimp & vegetables' },
  { category: 'main', name: 'Ganjang Gejang (Soy-Cured Crab)', price: 28000, description: '"Rice thief" — raw blue crab marinated in soy' },
  { category: 'main', name: 'Grilled Hairtail Fish', price: 22000, description: 'Whole crispy-skinned hairtail, Korea\'s coastal classic' },
  { category: 'drink', name: 'Soju (360ml)', price: 5000, description: 'Classic pairing with seafood in Korea' },
];
const MQB = (p = 6000): MenuItemJson[] => [
  { category: 'main', name: 'Gimbap Roll', price: p, description: 'Seaweed rice roll — tuna, kimchi, or classic' },
  { category: 'main', name: 'Kimbap Set Meal', price: 9000, description: 'Gimbap + ramyeon or soup' },
  { category: 'main', name: 'Soondae (Blood Sausage)', price: 5000, description: 'Korean glass noodle sausage with dipping sauce' },
  { category: 'side', name: 'Japchae (Glass Noodles)', price: 4000, description: 'Stir-fried sweet potato noodles' },
];

/* ─── Small photo helper (200px staff/profile images) ──────────── */
const ps = (id: string) => `https://images.unsplash.com/photo-${id}?w=200&q=80`;

/* ─── Staff pools ─────────────────────────────────────────────────── */
const SDOC = [
  { name: 'Dr. Kim Jiyeon', title: 'Chief Dermatologist · Board-certified, 15 yrs exp.', photo: ps('1612349317150-e413f6a5b16d'), bio: 'Specialises in laser treatments and anti-aging. Published researcher in Korean Dermatology Journal.' },
  { name: 'Dr. Park Seunghyun', title: 'Dermatologist · Skin Microbiome Specialist', photo: ps('1560066984-138daaa70c8f'), bio: 'Expert in acne and pigmentation treatments. 10 years of clinical experience.' },
  { name: 'Dr. Choi Hyejin', title: 'Aesthetic Dermatologist · Laser & Lifting Expert', photo: ps('1598440947619-2c35fc9aa908'), bio: 'Trained at Seoul National University Hospital. Specialises in V-line and rejuvenation procedures.' },
  { name: 'Dr. Lee Sooyoung', title: 'Dermatologist · Anti-Aging Specialist', photo: ps('1519494026892-80bbd2d6fd0d'), bio: 'Overseas-trained specialist. Expert in fillers, Botox, and non-invasive skin lifting.' },
];
const SHAIR = [
  { name: 'Jisoo Kwon', title: 'Head Designer · K-Pop Colour Specialist', photo: ps('1522337360788-8b13dee7a37e'), bio: 'Trained in Seoul and Paris. Specialises in bleach and creative colour techniques.' },
  { name: 'Mirae Yoon', title: 'Senior Designer · Balayage & Ombré Expert', photo: ps('1540555700478-4be289fbecef'), bio: 'Balayage and ombré specialist with 8 years at top Seoul salons.' },
  { name: 'Sora Han', title: 'Designer · Perm & Texture Specialist', photo: ps('1545579133-99bb5ad189be'), bio: 'Master of Korean digital perms and natural waves. Brings out texture beautifully.' },
  { name: 'Minjun Lee', title: 'Designer · Cut & Style Artist', photo: ps('1544161515-4ab6ce6db874'), bio: 'Precision cuts and editorial styling. Works with models and content creators.' },
];

/* ─── Wellness service menu pools ────────────────────────────────── */
const WTREAT = (): MenuItemJson[] => [
  { name: 'Hydrafacial Premium', price: 180000, description: 'Deep cleanse + hydration + LED (60 min)' },
  { name: 'IPL Photofacial', price: 220000, description: 'Light therapy for pigmentation & redness (45 min)' },
  { name: 'Micro-needling', price: 280000, description: 'Collagen induction therapy (60 min)' },
  { name: 'Laser Toning', price: 150000, description: 'Brightening & pore-tightening laser (30 min)' },
  { name: 'PRP Skin Rejuvenation', price: 350000, description: 'Platelet-rich plasma facial (90 min)' },
];
const WHAIR = (): MenuItemJson[] => [
  { name: 'Haircut & Blow-dry', price: 60000, description: 'Shampoo + precision cut + style (60 min)' },
  { name: 'Full Colour (roots to tips)', price: 120000, description: 'Single process + care treatment (90 min)' },
  { name: 'Balayage / Ombré', price: 180000, description: 'Hand-painted highlights, natural gradient (3+ hrs)' },
  { name: 'Korean Digital Perm', price: 150000, description: 'Volume and wave without damage (3 hrs)' },
  { name: 'Protein Treatment', price: 80000, description: 'Strengthen & restore shine (45 min)' },
];
const WMASSAGE = (): MenuItemJson[] => [
  { name: 'Full Body Massage (60 min)', price: 55000, description: 'Relaxing full-body session using aromatherapy oils' },
  { name: 'Deep Tissue (90 min)', price: 80000, description: 'Targeted muscle tension release, firm pressure' },
  { name: 'Hot Stone Therapy (75 min)', price: 70000, description: 'Volcanic basalt stones + Swedish technique' },
  { name: 'Foot & Leg Reflexology (45 min)', price: 35000, description: 'Pressure-point therapy for tired legs' },
  { name: 'Couples Room (90 min)', price: 130000, description: 'Side-by-side massage in private room (per couple)' },
];
const WSAUNA = (): MenuItemJson[] => [
  { name: 'Sikhye (Sweet Rice Drink)', price: 3000, description: 'Classic post-sauna digestive drink' },
  { name: 'Ramen Set', price: 5000, description: 'Instant noodle — jjimjilbang staple' },
  { name: 'Snack Set', price: 4000, description: 'Eggs + sikhye + crackers' },
  { name: 'Body Scrub (Italy Towel)', price: 20000, description: '45-min full body exfoliation service' },
];
const SAUNA_FACILITIES_ALL = [
  'Dry Sauna (80°C)', 'Steam Room (45°C)', 'Jade Room', 'Salt Room', 'Pine Wood Sauna',
  'Cold Plunge Pool', 'Outdoor Jacuzzi', 'Relaxation Lounge', 'TV Sleeping Zone',
  'Food Court', 'Fitness Area', 'Hanji Sleeping Room',
];
const SAUNA_PRICES = [12000, 15000, 18000, 20000, 25000, 28000];

/* ─── Activity program menus ─────────────────────────────────────── */
const ALOCALEXP = (): MenuItemJson[] => [
  { name: 'Standard Tour (2.5 hrs)', price: 45000, description: 'Guided walk + cultural storytelling + photo stops' },
  { name: 'Premium Tour (4 hrs)', price: 70000, description: 'Adds hanbok rental + traditional workshop' },
  { name: 'Private Group (up to 4)', price: 120000, description: 'Exclusive guide, fully customisable route' },
];
const ACOOKING = (): MenuItemJson[] => [
  { name: 'Standard Class (3 hrs)', price: 55000, description: 'Market intro + cook 3 dishes + eat together' },
  { name: 'Premium Class (4.5 hrs)', price: 85000, description: 'Adds makgeolli brewing + tteok dessert' },
  { name: 'Private Class (up to 4 pax)', price: 180000, description: 'Dedicated chef + custom menu selection' },
];
const ACULTURAL = (): MenuItemJson[] => [
  { name: 'Half-Day Tour (3 hrs)', price: 50000, description: 'Guided heritage walk with expert commentary' },
  { name: 'Full-Day Tour (6 hrs)', price: 85000, description: 'Adds lunch + hands-on traditional craft activity' },
  { name: 'Private Tour', price: 150000, description: 'Historian guide, no group, private transport' },
];
const ASPORTS = (): MenuItemJson[] => [
  { name: 'Beginner Session (2 hrs)', price: 65000, description: 'Equipment + safety briefing + instruction' },
  { name: 'Intermediate Session (3 hrs)', price: 85000, description: 'Skills training + guided experience' },
  { name: 'Full-Day Adventure', price: 130000, description: 'Complete day program with lunch included' },
];

/* ─── Activity detail pools ──────────────────────────────────────── */
const AGE_TIERS = [
  [{ label: 'Adult (13+)', price: 45000 }, { label: 'Youth (8–12)', price: 30000 }, { label: 'Child (4–7)', price: 20000 }, { label: 'Infant (0–3)', price: 0 }],
  [{ label: 'Adult (13+)', price: 55000 }, { label: 'Child (4–12)', price: 35000 }, { label: 'Infant (0–3)', price: 0 }],
  [{ label: 'Adult (13+)', price: 65000 }, { label: 'Youth (8–12)', price: 45000 }, { label: 'Child (4–7)', price: 30000 }],
  [{ label: 'Adult (15+)', price: 85000 }, { label: 'Teen (10–14)', price: 65000 }, { label: 'Child (5–9)', price: 45000 }],
];
const MEETING_POINTS = [
  'Exit 1, Gyeongbokgung Station (Line 3)', 'Exit 5, Insadong Station (Line 1)',
  'Exit 3, Haeundae Station (Line 2)', 'Tourist Info Center, Jeju Airport Arrivals',
  'Gamcheon Village Main Entrance', 'Seomyeon Station Exit 7 (Line 1)',
];
const WHAT_INCLUDED = [
  ['English-speaking guide', 'Admission tickets', 'Traditional snack set', 'Rain poncho'],
  ['Professional guide', 'All equipment & materials', 'Insurance coverage', 'Photo souvenir'],
  ['Local expert guide', 'Round-trip transport from meeting point', 'Bottled water', 'Certificate of completion'],
  ['Bilingual guide', 'Entrance fees', 'Traditional lunch', 'Cultural activity props'],
];
const WHAT_EXCLUDED = [
  ['Personal travel insurance', 'Hotel pick-up', 'Tips (discretionary)'],
  ['Personal expenses', 'Extra food & beverages', 'Parking fees'],
  ['Gratuities', 'Optional souvenirs', 'Medical expenses'],
];
const WHAT_BRING = [
  ['Comfortable walking shoes', 'Sunscreen & hat', 'Valid ID', 'Camera'],
  ['Weather-appropriate clothing', 'Comfortable footwear', 'Small backpack', 'Snacks (optional)'],
  ['Sunglasses', 'Cash for personal purchases', 'Water bottle', 'Phone fully charged'],
];

/* ─── Tips content pools ─────────────────────────────────────────── */
const TIPS_TRANSPORT = [
  { title: 'Get a T-money Card', content: 'Buy a T-money card at any convenience store (GS25, CU, 7-Eleven) for ₩2,500 + deposit. Works on all metro, buses, and even some taxis in Korea.' },
  { title: 'Download Naver Map', content: 'Google Maps often lacks real-time Korean transit data. Naver Map is the local standard — tap the blue circle for your location and search in English.' },
  { title: 'Avoid Peak Hours', content: 'Rush hour is 7:30–9:00 and 17:30–19:30. If possible, travel between 10:00–16:00 for a much more comfortable ride.' },
  { title: 'Free Bus-Metro Transfers', content: 'Within Seoul, you get free transfers between metro and bus if you tap out of the metro and tap onto a bus within 30 minutes.' },
];
const TIPS_TRAVEL = [
  { title: 'Best Time to Visit', content: 'Spring (April–May) for cherry blossoms and autumn (October–November) for foliage are peak seasons. Book accommodation well in advance.' },
  { title: 'Use Naver Map, Not Google', content: 'Locals use Naver Map for accurate transit directions and up-to-date business hours. Download it before your trip.' },
  { title: 'Eat Like a Local', content: 'Eating at local restaurants away from tourist streets saves 30–40%. Look for gimbap shops and bunsik eateries for great meals under ₩10,000.' },
  { title: 'Must-Have App: KakaoTaxi', content: 'KakaoTaxi is the essential ride app. Set pickup via map even without Korean — drivers accept all app bookings.' },
];
const TIPS_FOOD = [
  { title: 'Table Manners', content: 'Wait for the eldest at the table to eat first. Do not stick chopsticks upright in rice (a funeral custom). Refilling others\' drinks before your own is considered polite.' },
  { title: 'Free Side Dishes', content: 'Banchan (side dishes) are always complimentary and freely refillable — just ask the server. You are only charged for the main dishes you order.' },
  { title: 'Best Meal Timing', content: 'Koreans typically eat lunch 12:00–13:00 and dinner from 18:00–19:30. Arriving just before peak avoids queues at popular spots.' },
  { title: 'Ordering Without Korean', content: 'Most restaurants have picture menus or food models outside. Point-and-order works everywhere. Many places now have QR code menus in English.' },
];
const TIPS_TREND = [
  { title: 'Why It\'s Trending', content: 'Social media has put a spotlight on this experience — expect queues at weekends. Booking ahead online is strongly recommended.' },
  { title: 'Best Photo Spots', content: 'Golden hour (1 hour before sunset) gives the best light. Many Instagram-worthy corners are less crowded early morning on weekdays.' },
  { title: 'Local vs Tourist Price', content: 'Walk 5–10 minutes from the main tourist street to find authentic experiences at local prices — often 30–40% cheaper.' },
  { title: 'Dress Code', content: 'Smart casual is appreciated at most venues. Avoid sportswear at traditional cultural spaces. Some temples require covered shoulders.' },
];
const TIPS_SMOKE = [
  { title: 'Strict Fines', content: 'Korea strictly enforces no-smoking zones. Fines start from ₩50,000 and can reach ₩100,000 near tourist and cultural heritage sites.' },
  { title: 'Designated Zones Only', content: 'Only smoke in clearly marked designated areas (지정 흡연구역). Look for the orange cigarette sign on grey bollards or designated booths.' },
  { title: 'Find Zones on Naver Map', content: 'Search "흡연구역" (heub-yeon-gu-yeok) in Naver Map to find the nearest designated smoking zone near your location.' },
  { title: 'Near Heritage Sites', content: 'Smoking within 10m of UNESCO World Heritage Sites, palaces, and temples is always prohibited and heavily fined.' },
];

/* ─── Wellness notes builder ─────────────────────────────────────── */
function wn(sub: string, seed: number): string {
  const bookingType = sub === 'skin-clinic' ? 'free' : sub === 'hair-salon' ? 'deposit' : 'full_payment';
  const genders = ['All welcome', 'Women only', 'Mixed (separate floors)'];
  const breakTimes = ['12:00–13:00', '13:00–14:00', '14:00–15:00'];
  const holidaysList = ['Every Sunday', 'Every Monday', '1st & 3rd Sunday'];
  const s = seed % 3;
  const extra: Record<string, any> = {
    booking_type: bookingType,
    english_staff: s !== 1,
    gender_policy: genders[s],
    break_time: breakTimes[s],
    holidays: holidaysList[s],
    naver_map_url: '', kakao_map_url: '', google_map_url: '',
    reservation_notices: [
      'Please arrive 10 minutes before your appointment.',
      'Consultation is included — no prior skin analysis required.',
    ],
    cancellation_policy: C48,
    important_notes: [
      'Sunscreen required after laser or light treatments.',
      'Please bring a list of any current medications.',
    ],
    external_reviews: [RP[seed % RP.length], RP[(seed + 2) % RP.length]],
  };
  if (sub === 'skin-clinic') {
    extra.staff = [SDOC[seed % SDOC.length], SDOC[(seed + 1) % SDOC.length]];
  } else if (sub === 'hair-salon') {
    extra.staff = [SHAIR[seed % SHAIR.length], SHAIR[(seed + 1) % SHAIR.length]];
    extra.booking_deposit = [20000, 30000, 40000][s];
    extra.reservation_notices = ['Deposit required to confirm your appointment.', 'Walk-ins subject to availability — booking recommended.'];
  } else if (sub === 'sauna') {
    extra.adult_price = SAUNA_PRICES[seed % SAUNA_PRICES.length];
    extra.child_price = Math.round(extra.adult_price * 0.6);
    extra.facilities = SAUNA_FACILITIES_ALL.filter((_, i) => (i + seed) % 3 !== 0);
    extra.reservation_notices = ['Admission sold at the counter — no advance booking required.', 'Towel and gown rental available at the entrance.'];
    extra.important_notes = ['No tattoos above 10cm in most facilities — check the notice board.', 'Children under 12 must be accompanied by an adult at all times.'];
  } else {
    extra.reservation_notices = ['Book in advance — sessions fill up fast, especially weekends.', 'Please arrive 5 minutes early to change and prepare.'];
    extra.important_notes = ['Shower before and after your massage session.', 'Arrive well-hydrated for best results.'];
  }
  return JSON.stringify({ __plain: '', __extra: extra });
}

/* ─── Activities notes builder ──────────────────────────────────── */
function an(sub: string, seed: number): string {
  const durations = ['2.5 hours', '3 hours', '4 hours', '3–4 hours', '5–6 hours', 'Full day (7 hrs)'];
  const groupSizes = ['Max 8', 'Max 10', 'Max 12', 'Max 6 (private feel)', 'Max 15'];
  const difficulties = ['Easy', 'Easy to Moderate', 'Moderate', 'Moderate — some walking'];
  const ageReqs = ['4+', '5+', '7+', '10+', 'No age limit'];
  const startTimes = ['09:00', '09:30', '10:00', '10:30', '14:00'];
  const endTimes = ['12:00', '13:00', '13:30', '17:30', '18:00'];
  const meetingPoint = MEETING_POINTS[seed % MEETING_POINTS.length];
  return JSON.stringify({ __plain: '', __extra: {
    duration: durations[seed % durations.length],
    group_size: groupSizes[seed % groupSizes.length],
    difficulty: difficulties[seed % difficulties.length],
    age_requirement: ageReqs[seed % ageReqs.length],
    start_time: startTimes[seed % startTimes.length],
    end_time: endTimes[seed % endTimes.length],
    meeting_point: meetingPoint,
    end_point: seed % 2 === 0 ? 'Same as meeting point' : 'City centre transport hub',
    english_guide: seed % 4 !== 3,
    pickup_available: seed % 3 === 0,
    dropoff_available: seed % 3 === 0,
    age_pricing: AGE_TIERS[seed % AGE_TIERS.length],
    included: WHAT_INCLUDED[seed % WHAT_INCLUDED.length],
    excluded: WHAT_EXCLUDED[seed % WHAT_EXCLUDED.length],
    what_to_bring: WHAT_BRING[seed % WHAT_BRING.length],
    naver_map_url: '', kakao_map_url: '',
    google_map_url: `https://maps.google.com/?q=${encodeURIComponent(meetingPoint)}`,
    reservation_notices: [
      'Booking closes 24 hours before the activity start time.',
      'Activities run in light rain — check the weather and dress accordingly.',
    ],
    cancellation_policy: C48,
    important_notes: [
      'The guide will contact you with final meeting point confirmation 24h before.',
      'Group size is limited — reserve early to secure your spot.',
    ],
    external_reviews: [RP[seed % RP.length], RP[(seed + 3) % RP.length]],
  }});
}

/* ─── Tips notes builder ─────────────────────────────────────────── */
function tn(sub: string, seed: number): string {
  const pool = sub === 'public-transportation' ? TIPS_TRANSPORT
    : sub === 'smoking-spots' ? TIPS_SMOKE
    : sub === 'trend-now' ? TIPS_TREND
    : sub === 'travel-tips' ? TIPS_TRAVEL
    : TIPS_FOOD;
  const s = seed % pool.length;
  return JSON.stringify({ __plain: '', __extra: {
    tips: [pool[s], pool[(s + 1) % pool.length], pool[(s + 2) % pool.length]],
    map_description: '', naver_map_url: '', kakao_map_url: '', google_map_url: '',
    youtube_url: '', instagram_url: '', source_url: '', last_verified: '2026-05-01',
  }});
}

/* ─── Menu getter per subcategory ────────────────────────────────── */
function wm(sub: string): MenuItemJson[] {
  if (sub === 'skin-clinic') return WTREAT();
  if (sub === 'hair-salon') return WHAIR();
  if (sub === 'massage') return WMASSAGE();
  if (sub === 'sauna') return WSAUNA();
  return [];
}
function am(sub: string): MenuItemJson[] {
  if (sub === 'cooking-classes') return ACOOKING();
  if (sub === 'traditional-cultural-tours') return ACULTURAL();
  if (sub === 'sports') return ASPORTS();
  return ALOCALEXP();
}

/* ─── External review pool ───────────────────────────────────────── */
const RP = [
  { source: 'Google', reviewer: 'Emma L.', rating: 5, text: 'Absolutely authentic — tasted just like homemade Korean food!', date: '2026-04-10' },
  { source: 'TripAdvisor', reviewer: 'Ravi S.', rating: 5, text: 'Best meal of our entire Korea trip. Will definitely come back!', date: '2026-03-22' },
  { source: 'Google', reviewer: 'Sophie M.', rating: 4, text: 'Really good food, a bit busy at lunch but worth every minute of the wait.', date: '2026-03-15' },
  { source: 'Yelp', reviewer: 'James K.', rating: 5, text: 'Hidden gem! The staff were incredibly welcoming and the food was outstanding.', date: '2026-04-02' },
  { source: 'Google', reviewer: 'Fatima A.', rating: 5, text: 'Incredible experience. Everything was fresh, flavourful, and beautifully presented.', date: '2026-04-18' },
  { source: 'TripAdvisor', reviewer: 'Carlos R.', rating: 4, text: 'Loved the atmosphere and food. Great value for money compared to Seoul prices.', date: '2026-02-28' },
  { source: 'Google', reviewer: 'Nina T.', rating: 5, text: 'Must-visit spot. Every dish we ordered was absolutely amazing.', date: '2026-03-08' },
  { source: 'Yelp', reviewer: 'Sven B.', rating: 5, text: 'Outstanding! The flavours were perfectly balanced and the portions generous.', date: '2026-04-05' },
  { source: 'Google', reviewer: 'Priya N.', rating: 4, text: 'Great food and a fantastic location — slight wait but totally worth it.', date: '2026-03-30' },
  { source: 'TripAdvisor', reviewer: 'Ali H.', rating: 5, text: 'One of the absolute highlights of our Korea trip. Highly recommended!', date: '2026-04-12' },
];
const rv = (n: number) => [RP[n % RP.length]];

const rawSampleListings: Listing[] = [

  /* ════════════════════════════════════════════════════════════════
     🍽️  RESTAURANTS — full detail listings (existing)
  ════════════════════════════════════════════════════════════════ */
  {
    id: '1', slug: 'gwangjang-market-food-tour', category: 'restaurants', subcategory: 'classic-korean',
    city: 'seoul', title: 'Gwangjang Market Food Tour',
    title_translations: { ko: '광장시장 푸드 투어', ja: '広蔵市場フードツアー', zh: '广藏市场美食之旅', de: 'Gwangjang-Markt Foodtour', es: 'Tour gastronómico por el Mercado Gwangjang', fr: 'Visite gastronomique du marché Gwangjang' },
    description: 'Experience the oldest traditional market in Seoul. Taste bindaetteok, mayak gimbap, and more authentic Korean street food from vendors who have been serving for decades.',
    content: 'Gwangjang Market has been Seoul\'s beating culinary heart since 1905.',
    image: I('1590301157890-4810ed352733'),
    gallery: [I('1583417319070-4a69db38a482'), I('1546069901-ba9599a7e63c'), I('1574484284002-952d92456975'), I('1569050467447-ce54b3bbc37d'), I('1563245372-f21724e3856d'), I('1455619452474-d2be8b1e70cd'), I('1498654896293-37aacf113fd9')],
    price: 35, currency: 'USD', rating: 4.8, reviewCount: 234, tags: ['HOT', 'Traditional'], featured: true,
    address: '88 Changgyeonggung-ro, Jongno-gu, Seoul', phone: '+82-2-2267-0291',
    operating_hours: 'Mon–Sat 09:00–23:00',
    menu_items: [
      { category: 'main', name: 'Bindaetteok (Mung Bean Pancake)', price: 5000, description: 'Crispy and savory' },
      { category: 'main', name: 'Yukhoe (Raw Beef Tartare)', price: 15000, description: 'Premium steak tartare' },
      { category: 'main', name: 'Kalguksu (Knife-Cut Noodles)', price: 8000, description: 'Handmade in rich broth' },
      { category: 'side', name: 'Mayak Gimbap', price: 3000, description: '10 bite-sized rolls' },
      { category: 'drink', name: 'Makgeolli (Rice Wine)', price: 5000, description: 'Traditional unfiltered' },
    ],
    notes: JSON.stringify({ __plain: 'Popular with tourists. Best before 11am.', __extra: { booking_deposit: 30000, dietary: {}, naver_map_url: '', kakao_map_url: '', google_map_url: 'https://maps.google.com/?q=Gwangjang+Market+Seoul', break_time: '', holidays: 'Lunar New Year & Chuseok', reservation_notices: ['Walk-in only — no reservations at stalls', 'Bring cash'], cancellation_policy: ['Full refund 48h before', 'No refund within 24h'], important_notes: ['Wear comfortable shoes', 'Photography OK — ask vendors first'], external_reviews: [{ source: 'Google', reviewer: 'Sarah M.', rating: 5, text: 'Absolutely incredible food tour!', date: '2026-04-20' }] } }),
  },

  {
    id: '2', slug: 'gangnam-korean-bbq', category: 'restaurants', subcategory: 'korean-bbq',
    city: 'seoul', title: 'Premium Hanwoo BBQ in Gangnam',
    title_translations: { ko: '강남 프리미엄 한우 BBQ', ja: '江南プレミアム韓牛バーベキュー', zh: '江南顶级韩牛烤肉', de: 'Premium Hanwoo BBQ in Gangnam', es: 'BBQ Premium Hanwoo en Gangnam', fr: 'BBQ Premium Hanwoo à Gangnam' },
    description: 'Savor the finest Korean beef at a top-rated Gangnam BBQ restaurant. Premium 1++ grade Hanwoo with expert grilling service.',
    content: 'Not your average Korean BBQ — 1++ grade Hanwoo in the heart of Gangnam.',
    image: I('1544025162-d76694265947'),
    gallery: [I('1529692236671-f1f6cf9683ba'), I('1558618666-fcd25c85cd64'), I('1534482421-64566f976cfa'), I('1565299507177-b0ac66763828'), I('1551218808-94e220e084d2'), I('1504674900247-0877df9cc836'), I('1498654896293-37aacf113fd9')],
    price: 65, currency: 'USD', rating: 4.9, reviewCount: 189, tags: ['BEST', 'Premium'], featured: true,
    address: '23 Teheran-ro 8-gil, Gangnam-gu, Seoul', phone: '+82-2-555-1234',
    operating_hours: 'Daily 11:30–22:00',
    menu_items: [
      { category: 'main', name: 'Hanwoo Sirloin Set (200g)', price: 89000, description: '1++ grade premium' },
      { category: 'main', name: 'Galbi (Short Ribs)', price: 55000, description: 'Marinated 24h' },
      { category: 'drink', name: 'Soju (Chamisul)', price: 5000, description: 'Classic pairing' },
    ],
    notes: JSON.stringify({ __plain: 'Reservation recommended.', __extra: { booking_deposit: 50000, dietary: { gluten_free: true }, naver_map_url: '', google_map_url: 'https://maps.google.com/?q=Gangnam+Korean+BBQ', break_time: '15:00–17:00 weekdays', holidays: '1st & 3rd Monday', reservation_notices: ['₩50,000 deposit required', 'Private rooms for 6+'], cancellation_policy: ['Full refund 24h+', 'No refund within 24h'], important_notes: ['Staff grills for you', 'Smart casual dress'], external_reviews: [{ source: 'Google', reviewer: 'Mike T.', rating: 5, text: 'Best Korean BBQ ever.', date: '2026-04-10' }] } }),
  },

  {
    id: '5', slug: 'gangnam-skin-clinic', category: 'wellness', subcategory: 'skin-clinic',
    city: 'seoul', title: 'Gangnam Premium Dermatology Clinic',
    title_translations: { ko: '강남 프리미엄 피부과 클리닉', ja: '江南プレミアム皮膚科クリニック', zh: '江南顶级皮肤科诊所', de: 'Premium Dermatologie-Klinik Gangnam', es: 'Clínica Dermatológica Premium Gangnam', fr: 'Clinique Dermatologique Premium Gangnam' },
    description: 'World-class skin treatments at Korea\'s most renowned dermatology clinic. Consultation included with English-speaking dermatologists.',
    content: 'Korea\'s global capital of skincare. AI-powered skin analysis + board-certified dermatologist.',
    image: I('1629909613654-28e377c37b09'),
    gallery: [I('1620916566398-39f1143ab7be'), I('1576091160550-2173dba999ef'), I('1612349317150-e413f6a5b16d'), I('1570172619644-dfd03ed5d881'), I('1556228578-8c89e6adf883'), I('1598440947619-2c35fc9aa908'), I('1540555700478-4be289fbecef')],
    price: 120, currency: 'USD', rating: 4.9, reviewCount: 312, tags: ['BEST', 'Premium'], featured: true,
    address: '412 Gangnam-daero, Gangnam-gu, Seoul (3F)', phone: '+82-2-512-8800',
    operating_hours: 'Mon–Fri 10:00–19:00, Sat 10:00–16:00',
    menu_items: [
      { name: 'Glass Skin Package', price: 250000, description: 'Micro-needling + Growth Factor (90 min)' },
      { name: 'Hydrafacial Premium', price: 180000, description: 'Deep cleansing + hydration (60 min)' },
    ],
    notes: JSON.stringify({ __plain: '', __extra: {
      booking_type: 'free', english_staff: true, gender_policy: 'All welcome',
      break_time: '13:00–14:00', holidays: 'Every Sunday',
      staff: [SDOC[0], SDOC[1]],
      naver_map_url: '', kakao_map_url: '', google_map_url: 'https://maps.google.com/?q=412+Gangnam-daero+Gangnam+Seoul',
      reservation_notices: ['First consultation is complimentary.', 'Please arrive 10 minutes early for skin analysis.'],
      cancellation_policy: C48,
      important_notes: ['Avoid sun exposure 48h before laser treatments.', 'Bring a list of current medications and skincare products.'],
      external_reviews: [RP[0], RP[4]],
    } }),
  },

  {
    id: '9', slug: 'korean-cooking-class', category: 'activities', subcategory: 'cooking-classes',
    city: 'seoul', title: 'Learn to Make Kimchi & Bibimbap',
    title_translations: { ko: '김치 & 비빔밥 만들기 클래스', ja: 'キムチ＆ビビンバ料理教室', zh: '学做泡菜和拌饭', de: 'Kimchi & Bibimbap selber machen', es: 'Aprende a hacer Kimchi y Bibimbap', fr: 'Atelier Kimchi & Bibimbap' },
    description: 'Hands-on Korean cooking class in a traditional kitchen. Learn kimchi, bibimbap, and pancakes from a local chef.',
    content: 'Led by Chef Minji with 20 years of experience.',
    image: I('1583224994076-0a5a4e3384c7'),
    gallery: [I('1466637574441-749b8f19452f'), I('1547592180-85f173990554'), I('1414235077428-338989a2e8c0'), I('1588166524941-3bf61a9c41db'), I('1498579687545-d5a4fffb0a9e'), I('1504674900247-0877df9cc836'), I('1543353071-087092ec393a')],
    price: 55, currency: 'USD', rating: 4.9, reviewCount: 178, tags: ['BEST'], featured: true,
    address: '15 Insadong-gil, Jongno-gu, Seoul (B1)', phone: '+82-10-1234-5678',
    operating_hours: '',
    menu_items: [
      { name: 'Standard Class (3 hrs)', price: 55000, description: 'Market tour + 3 dishes + meal' },
      { name: 'Premium Class (4 hrs)', price: 85000, description: 'Adds tteokbokki + makgeolli' },
    ],
    notes: JSON.stringify({ __plain: '', __extra: {
      duration: '3–4 hours', group_size: 'Max 8', difficulty: 'Easy',
      age_requirement: '5+', start_time: '10:00', end_time: '14:00',
      meeting_point: 'Exit 6, Anguk Station (Line 3) — look for the orange Mugoong flag',
      end_point: 'Same as meeting point',
      english_guide: true, pickup_available: false, dropoff_available: false,
      age_pricing: [{ label: 'Adult (13+)', price: 55000 }, { label: 'Child (5–12)', price: 40000 }],
      included: ['English-speaking chef instructor', 'All ingredients & cooking equipment', 'Recipe card to take home', 'Full meal after class'],
      excluded: ['Personal travel insurance', 'Transport to/from venue', 'Alcoholic beverages (available to purchase)'],
      what_to_bring: ['Comfortable clothing you don\'t mind getting dirty', 'Camera', 'Empty stomach'],
      naver_map_url: '', kakao_map_url: '', google_map_url: 'https://maps.google.com/?q=15+Insadong-gil+Jongno+Seoul',
      reservation_notices: ['Booking closes 24 hours before the class.', 'Please notify us of any food allergies when booking.'],
      cancellation_policy: C48,
      important_notes: ['Class is conducted in English — no Korean required.', 'Classes run regardless of weather — rain or shine.'],
      external_reviews: [RP[1], RP[6]],
    } }),
  },

  {
    id: '13', slug: 'seoul-metro-guide', category: 'tips-and-trend', subcategory: 'public-transportation',
    city: 'seoul', title: 'How to Use the Seoul Metro Like a Local',
    title_translations: { ko: '현지인처럼 서울 지하철 이용하기', ja: 'ソウル地下鉄を地元民のように使う', zh: '像首尔本地人一样乘地铁', de: 'Die Seouler U-Bahn wie ein Einheimischer', es: 'Usa el metro de Seúl como un local', fr: 'Le métro de Séoul comme un habitant' },
    description: 'Everything you need to know about navigating Seoul\'s subway — T-money cards, transfers, and pro tips.',
    content: '🎫 T-money Card: Buy at any convenience store ₩2,500\n📱 Apps: Naver Map, KakaoMetro\n🚇 Rush hour: 7:30–9:00 & 17:30–19:00',
    image: I('1517154421773-0529f29ea451'),
    gallery: [I('1555993539-1732b0258235'), I('1581262208435-41726149a759'), I('1544620347-c4fd4a3d5957'), I('1559825481-12a05cc00344'), I('1565043589221-1a6fd9ae45c7'), I('1554041839-bc64b14f30a5'), I('1530521954074-e64f6810b32d')],
    price: 0, currency: 'USD', rating: 0, reviewCount: 0, tags: ['Guide', 'Essential'], featured: false,
    address: '', phone: '', operating_hours: '', menu_items: [],
    notes: JSON.stringify({ __plain: '', __extra: {
      tips: [
        { title: 'Get a T-money Card First', content: 'Buy a T-money card at any convenience store (GS25, CU, 7-Eleven) for ₩2,500 + deposit. Works on all metro lines, buses, and even some taxis across Korea.' },
        { title: 'Use Naver Map, Not Google', content: 'Naver Map shows real-time metro delays, exact exit numbers, and underground mall connections that Google Maps misses. Download it before you arrive.' },
        { title: 'Avoid Rush Hour', content: 'Peak hours are 7:30–9:00 and 17:30–19:30. If you can, travel between 10:00 and 16:00 for a vastly more comfortable ride with available seats.' },
        { title: 'Free Transfers', content: 'Transfer between metro and bus for free if you tap onto the bus within 30 minutes of tapping out of the metro. This works city-wide in Seoul.' },
      ],
      map_description: 'Seoul Metro has 23 lines and 300+ stations. Most tourist sites are within a 10-minute walk of a station.',
      naver_map_url: '', kakao_map_url: '', google_map_url: '',
      youtube_url: '', instagram_url: '', source_url: '', last_verified: '2026-05-01',
    } }),
  },

  /* ════════════════════════════════════════════════════════════════
     🍽️  RESTAURANTS — Korean Food  (m 0–9, sg(0))
  ════════════════════════════════════════════════════════════════ */
  qr('r-kf-se-2','insadong-traditional-korean-feast','seoul','restaurants','classic-korean',
    'Insadong Traditional Korean Feast','Sit-down traditional Korean meal steps from the cultural street. Seasonal banchan, homemade jjigae, and hand-rolled gimbap.',
    m(0),sg(0),28,4.7,145,['HOT'],false,'Insadong-gil, Jongno-gu, Seoul',
    '+82-2-724-1234','Daily 11:00–22:00',MKF(22000),
    rn('Insadong Traditional Korean Feast Seoul',0,D0,'15:00–17:00','Every Tuesday',NWI,C24,KF_KNOW,rv(0))),

  qr('r-kf-se-3','myeongdong-jjigae-noodle-house','seoul','restaurants','classic-korean',
    'Myeongdong Jjigae & Noodle House','Famous kimchi jjigae and kalguksu in the heart of shopping paradise. Standing room at peak hours — worth the wait.',
    m(1),sg(0),18,4.6,209,['Must-Try'],false,'Myeongdong-gil, Jung-gu, Seoul',
    '+82-2-776-5678','Daily 10:30–21:30',MKF(18000),
    rn('Myeongdong Jjigae Noodle House Seoul',0,D0,'15:00–16:30','Lunar New Year & Chuseok',NWI,C24,KF_KNOW,rv(1))),

  qr('r-kf-bu-1','nampo-korean-kitchen','busan','restaurants','classic-korean',
    'Nampo Authentic Korean Kitchen','Classic Korean dishes near the BIFF Square. The sundubu jjigae and doenjang soup are legendary among locals.',
    m(2),sg(0),22,4.7,178,['HOT','Local Favorite'],false,'Nampo-dong, Jung-gu, Busan',
    '+82-51-245-2345','Daily 11:00–21:30',MKF(20000),
    rn('Nampo Authentic Korean Kitchen Busan',0,D0,'15:00–17:00','1st & 3rd Monday',NWI,C24,KF_KNOW,rv(2))),

  qr('r-kf-bu-2','haeundae-grandmas-cooking','busan','restaurants','classic-korean',
    'Haeundae Grandma\'s Home Cooking','Hearty homestyle Korean set meals near Haeundae Beach. Grandma-style cooking with 10+ banchan every sitting.',
    m(3),sg(0),20,4.8,134,['Traditional'],false,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-731-6789','Daily 11:30–21:00',MKF(19000),
    rn('Haeundae Grandma Home Cooking Busan',0,D0,'','Sundays & public holidays',NWI,C24,KF_KNOW,rv(3))),

  qr('r-kf-je-1','jeju-black-pork-seafood','jeju','restaurants','classic-korean',
    'Jeju Black Pork & Seafood Restaurant','Only-in-Jeju flavors — grilled black pork belly, fresh haenyeo-caught abalone, and seasonal galchi braised fish.',
    m(4),sg(0),38,4.8,267,['BEST','Local Specialty'],true,'Doma-ro, Jeju-si, Jeju',
    '+82-64-722-3456','Daily 10:00–22:00',MKF(28000),
    rn('Jeju Black Pork Seafood Restaurant Jeju',0,D0,'','Chuseok & Seollal',NWI,C24,KF_KNOW,rv(4))),

  qr('r-kf-je-2','seogwipo-haenyeo-kitchen','jeju','restaurants','classic-korean',
    'Seogwipo Haenyeo Kitchen','Cooked and served by actual haenyeo (female divers). The freshest seafood possible — caught that morning.',
    m(5),sg(0),45,4.9,198,['HOT','Unique'],false,'Seogwipo-si, Jeju',
    '+82-64-762-7890','Daily 10:00–21:00',MKF(30000),
    rn('Seogwipo Haenyeo Kitchen Jeju',0,D0,'14:00–16:00','Every Wednesday',NWI,C48,KF_KNOW,rv(5))),

  qr('r-kf-gy-1','gyeongju-silla-royal-cuisine','gyeongju','restaurants','classic-korean',
    'Gyeongju Silla Royal Cuisine','Reconstructed royal court dishes from the Silla Kingdom era. A cultural and culinary experience in one.',
    m(6),sg(0),42,4.8,112,['Traditional','Cultural'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-773-4567','Tue–Sun 11:00–20:00',MKF(25000),
    rn('Gyeongju Silla Royal Cuisine',0,D0,'','Closed Mondays',NRV,C48,KF_KNOW,rv(6))),

  qr('r-kf-gy-2','hwangnam-traditional-table','gyeongju','restaurants','classic-korean',
    'Hwangnam Traditional Korean Table','Family-run restaurant next to the royal tumuli park. Homemade soy sauce and doenjang made in-house.',
    m(7),sg(0),25,4.6,88,['Traditional'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-772-8901','Daily 11:00–20:30',MKF(18000),
    rn('Hwangnam Traditional Korean Table Gyeongju',0,D0,'15:00–17:00','Every Thursday',NWI,C24,KF_KNOW,rv(7))),

  qr('r-kf-jo-1','jeonju-bibimbap-restaurant','jeonju','restaurants','classic-korean',
    'Jeonju Bibimbap Masterclass Restaurant','The city that invented bibimbap. Stone pot (dolsot) version with 30 premium toppings and seasonal namul.',
    m(8),sg(0),20,4.9,445,['BEST','Must-Try'],true,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-284-5678','Daily 10:30–21:30',MKF(17000),
    rn('Jeonju Bibimbap Masterclass Restaurant Jeonju',0,D0,'','Closed 2nd Monday',NWI,C24,KF_KNOW,rv(8))),

  qr('r-kf-jo-2','hanok-village-heritage-dining','jeonju','restaurants','classic-korean',
    'Hanok Village Korean Heritage Dining','Dine inside a restored 100-year-old hanok. The slow-cooked pork gukbap and barley rice are standouts.',
    m(9),sg(0),18,4.7,176,['Traditional'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-287-9012','Daily 11:00–21:00',MKF(16000),
    rn('Hanok Village Korean Heritage Dining Jeonju',0,D0,'15:00–17:00','Every Tuesday',NWI,C24,KF_KNOW,rv(9))),

  /* ─── Korean BBQ  (m 10–19, sg(1)) ─── */
  qr('r-kb-se-2','hongdae-night-bbq','seoul','restaurants','korean-bbq',
    'Hongdae Night BBQ & Craft Beer','Late-night BBQ hotspot in Hongdae. Premium pork belly, makgeolli on tap, and an electric atmosphere until 2am.',
    m(10),sg(1),40,4.7,312,['HOT','Late-Night'],false,'Hongdae, Mapo-gu, Seoul',
    '+82-2-337-1234','Daily 17:00–02:00',MKB(20000),
    rn('Hongdae Night BBQ Seoul',0,D0,'','Open 365 days',NWI,C24,KB_KNOW,rv(0))),

  qr('r-kb-se-3','itaewon-prime-grill','seoul','restaurants','korean-bbq',
    'Itaewon Prime Grill House','International-friendly BBQ in Itaewon. English menus, halal option available, premium charcoal grill.',
    m(11),sg(1),55,4.8,203,['BEST','International'],false,'Itaewon-ro, Yongsan-gu, Seoul',
    '+82-2-796-5678','Daily 12:00–22:30',MKB(22000),
    rn('Itaewon Prime Grill House Seoul',20000,D0,'','1st & 3rd Monday',NRV,C48,KB_KNOW,rv(1))),

  qr('r-kb-bu-1','seomyeon-bbq-street','busan','restaurants','korean-bbq',
    'Seomyeon BBQ Street','Busan\'s most popular BBQ corridor. Choose from a dozen grills — pork, beef, and seafood all top-notch.',
    m(12),sg(1),35,4.6,189,['HOT'],false,'Seomyeon, Busanjin-gu, Busan',
    '+82-51-816-2345','Daily 11:30–23:00',MKB(18000),
    rn('Seomyeon BBQ Street Busan',0,D0,'','Chuseok & Seollal',NWI,C24,KB_KNOW,rv(2))),

  qr('r-kb-bu-2','haeundae-charcoal-grill','busan','restaurants','korean-bbq',
    'Haeundae Charcoal Grill','Seaside premium BBQ. The chadolbaegi (thin brisket) over real oak charcoal with ocean views.',
    m(13),sg(1),50,4.8,167,['Premium'],false,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-744-6789','Daily 11:30–22:00',MKB(22000),
    rn('Haeundae Charcoal Grill Busan',20000,D0,'15:00–17:00','Every Monday',NRV,C48,KB_KNOW,rv(3))),

  qr('r-kb-je-1','jeju-black-pork-bbq','jeju','restaurants','korean-bbq',
    'Jeju Black Pork BBQ Village','Jeju\'s iconic black pig (heuk-dwaeji) grilled over lava stone. The only place to have the real deal.',
    m(14),sg(1),48,4.9,334,['BEST','Local Specialty'],true,'Doma-ro, Jeju-si, Jeju',
    '+82-64-756-3456','Daily 11:00–22:00',MKB(24000),
    rn('Jeju Black Pork BBQ Village Jeju',0,D0,'','Open every day',NWI,C24,KB_KNOW,rv(4))),

  qr('r-kb-je-2','aewol-seaside-bbq','jeju','restaurants','korean-bbq',
    'Aewol Seaside BBQ Garden','Open-air BBQ garden facing the ocean. Watch the sunset while grilling fresh Jeju pork.',
    m(15),sg(1),42,4.7,145,['Scenic'],false,'Aewol-eup, Jeju-si, Jeju',
    '+82-64-799-7890','Daily 12:00–21:30',MKB(21000),
    rn('Aewol Seaside BBQ Garden Jeju',0,D0,'','Rainy weather may affect outdoor seating',NWI,C24,KB_KNOW,rv(5))),

  qr('r-kb-gy-1','bomun-lake-bbq','gyeongju','restaurants','korean-bbq',
    'Bomun Lake BBQ Resort','Spacious BBQ restaurant overlooking Bomun Lake. Perfect for family gatherings with private grilling rooms.',
    m(16),sg(1),45,4.6,98,['Family-Friendly'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-4567','Daily 11:30–21:30',MKB(19000),
    rn('Bomun Lake BBQ Resort Gyeongju',0,D0,'','Every Wednesday',NRV,C24,KB_KNOW,rv(6))),

  qr('r-kb-gy-2','gyeongju-hanwoo-bbq','gyeongju','restaurants','korean-bbq',
    'Gyeongju Hanwoo Special BBQ','Locally-raised Hanwoo beef with Gyeongju pear marinade — a regional speciality you can\'t find in Seoul.',
    m(17),sg(1),60,4.8,87,['Premium','Local Specialty'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-771-8901','Tue–Sun 12:00–21:00',MKB(28000),
    rn('Gyeongju Hanwoo Special BBQ',30000,D0,'','Closed Mondays',NRV,C48,KB_KNOW,rv(7))),

  qr('r-kb-jo-1','jeonju-traditional-bbq','jeonju','restaurants','korean-bbq',
    'Jeonju Traditional BBQ House','Charcoal BBQ in a hanok-style building. Marinated meats use century-old soy sauce recipes from Jeonju.',
    m(18),sg(1),38,4.7,121,['Traditional'],false,'Hanok-gil, Wansan-gu, Jeonju',
    '+82-63-231-5678','Daily 11:30–22:00',MKB(17000),
    rn('Jeonju Traditional BBQ House Jeonju',0,D0,'','1st & 3rd Tuesday',NWI,C24,KB_KNOW,rv(8))),

  qr('r-kb-jo-2','deokjin-outdoor-bbq','jeonju','restaurants','korean-bbq',
    'Deokjin Park Outdoor BBQ','Al fresco BBQ next to the lotus pond. Great for summer evenings — pork belly + cold soju.',
    m(19),sg(1),30,4.5,76,['Outdoor'],false,'Deokjin-dong, Deokjin-gu, Jeonju',
    '+82-63-255-9012','Daily 17:00–23:00',MKB(16000),
    rn('Deokjin Park Outdoor BBQ Jeonju',0,D0,'','Open all week',NWI,C24,KB_KNOW,rv(9))),

  /* ─── Korean Fried Chicken  (m 20–29, sg(2)) ─── */
  qr('r-fc-se-1','hongdae-crispy-chicken','seoul','restaurants','korean-fried-chicken',
    'Hongdae Crispy Chicken & Craft Beer','Legendary chimaek (chicken + maekju) spot in Hongdae. Double-fried for extra crunch, 10 sauce options.',
    m(20),sg(2),20,4.8,456,['HOT','Late-Night'],false,'Hongdae, Mapo-gu, Seoul',
    '+82-2-338-1234','Daily 15:00–00:00',MFC(20000),
    rn('Hongdae Crispy Chicken Seoul',0,D0,'','Open 365 days',NWI,C24,FC_KNOW,rv(0))),

  qr('r-fc-se-2','sinchon-chimaek-palace','seoul','restaurants','korean-fried-chicken',
    'Sinchon Chimaek Palace','The student district\'s favourite stop. Whole chicken, half-and-half sauce, massive beer towers.',
    m(21),sg(2),18,4.6,278,['Student Favorite','Late-Night'],false,'Sinchon-ro, Seodaemun-gu, Seoul',
    '+82-2-363-5678','Daily 16:00–01:00',MFC(19000),
    rn('Sinchon Chimaek Palace Seoul',0,D0,'','Open 365 days',NWI,C24,FC_KNOW,rv(1))),

  qr('r-fc-bu-1','busan-fried-chicken-station','busan','restaurants','korean-fried-chicken',
    'Busan Fried Chicken Station','Busan-style yangnyeom chicken — sweeter sauce with a hint of local gochujang. Standing queues at dinner.',
    m(22),sg(2),17,4.7,189,['HOT'],false,'Nampo-dong, Jung-gu, Busan',
    '+82-51-246-2345','Daily 14:00–23:30',MFC(18000),
    rn('Busan Fried Chicken Station Busan',0,D0,'','Chuseok & Seollal',NWI,C24,FC_KNOW,rv(2))),

  qr('r-fc-bu-2','gwangalli-chimaek-bar','busan','restaurants','korean-fried-chicken',
    'Gwangalli Beach Chimaek Bar','Fried chicken and cold beer facing Gwangalli bridge at night. Best chicken + view combo in Busan.',
    m(23),sg(2),22,4.8,267,['Scenic','Late-Night'],false,'Gwangalli-ro, Suyeong-gu, Busan',
    '+82-51-612-6789','Daily 15:00–01:00',MFC(21000),
    rn('Gwangalli Beach Chimaek Bar Busan',0,D0,'','Open 365 days',NWI,C24,FC_KNOW,rv(3))),

  qr('r-fc-je-1','jeju-citrus-glazed-chicken','jeju','restaurants','korean-fried-chicken',
    'Jeju Citrus Glazed Chicken','Unique Jeju twist: local hallabong mandarin glaze on crispy fried chicken. Sweet, tangy, addictive.',
    m(24),sg(2),23,4.8,145,['Local Specialty','Unique'],false,'Jeju-si, Jeju',
    '+82-64-725-3456','Daily 12:00–22:00',MFC(22000),
    rn('Jeju Citrus Glazed Chicken Jeju',0,D0,'','Open every day',NWI,C24,FC_KNOW,rv(4))),

  qr('r-fc-je-2','seogwipo-spicy-wings','jeju','restaurants','korean-fried-chicken',
    'Seogwipo Spicy Wings House','Fire-level heat chicken wings in Seogwipo. Challenge menu: finish a bucket, get it free.',
    m(25),sg(2),19,4.5,98,['Spicy'],false,'Seogwipo-si, Jeju',
    '+82-64-763-7890','Daily 14:00–23:00',MFC(19000),
    rn('Seogwipo Spicy Wings House Jeju',0,D0,'','Open every day',NWI,C24,FC_KNOW,rv(5))),

  qr('r-fc-gy-1','gyeongju-chimaek-historic','gyeongju','restaurants','korean-fried-chicken',
    'Gyeongju Historic Town Chimaek','Steps from the royal tumuli. Relaxed vibe, excellent yangnyeom chicken, local craft beer on tap.',
    m(26),sg(2),18,4.5,67,['Casual'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-772-4567','Daily 15:00–23:00',MFC(17000),
    rn('Gyeongju Historic Town Chimaek Gyeongju',0,D0,'','Every Thursday',NWI,C24,FC_KNOW,rv(6))),

  qr('r-fc-gy-2','bomun-chicken-beer-garden','gyeongju','restaurants','korean-fried-chicken',
    'Bomun Chicken & Beer Garden','Outdoor chicken and beer garden near Bomun Lake. Whole fried chicken with three dipping sauces.',
    m(27),sg(2),20,4.6,54,['Outdoor'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-8901','Daily 14:00–22:30',MFC(18000),
    rn('Bomun Chicken Beer Garden Gyeongju',0,D0,'','Closed in heavy rain',NWI,C24,FC_KNOW,rv(7))),

  qr('r-fc-jo-1','jeonju-night-market-chicken','jeonju','restaurants','korean-fried-chicken',
    'Jeonju Night Market Fried Chicken','Night-market style chicken stall that\'s been running for 25 years. Paper bag, newspaper, perfect.',
    m(28),sg(2),15,4.7,134,['Local Favorite','Street Food'],false,'Nambu Market, Jeonju',
    '+82-63-288-5678','Daily 16:00–23:00',MFC(15000),
    rn('Jeonju Night Market Fried Chicken Jeonju',0,D0,'','Chuseok & Seollal',NWI,C24,FC_KNOW,rv(8))),

  qr('r-fc-jo-2','hanok-alley-crispy-wings','jeonju','restaurants','korean-fried-chicken',
    'Hanok Alley Crispy Wings','Tiny shop in hanok village alleys. Garlic soy wings paired with Jeonju dongdongju rice wine.',
    m(29),sg(2),17,4.6,89,['Hidden Gem'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-9012','Daily 15:00–22:00',MFC(16000),
    rn('Hanok Alley Crispy Wings Jeonju',0,D0,'','Every Tuesday',NWI,C24,FC_KNOW,rv(9))),

  /* ─── Bars  (m 30–39, sg(3)) ─── */
  qr('r-ba-se-1','itaewon-craft-beer-district','seoul','restaurants','bars-nightlife',
    'Itaewon Craft Beer District','Seoul\'s most international bar strip. 40+ craft beers on tap, English-speaking staff, live music weekends.',
    m(30),sg(3),35,4.7,298,['International','Craft Beer'],false,'Itaewon-ro, Yongsan-gu, Seoul',
    '+82-2-794-1234','Daily 17:00–02:00',MBA(15000),
    rn('Itaewon Craft Beer District Seoul',0,D0,'','Open 365 days',BA_KNOW,C24,BA_KNOW,rv(0))),

  qr('r-ba-se-2','hongdae-underground-bar','seoul','restaurants','bars-nightlife',
    'Hongdae Underground Bar','Basement cocktail bar with indie DJ nights. House cocktails made with Korean spirits — soju negroni is a must.',
    m(31),sg(3),30,4.6,212,['Trendy','Cocktails'],false,'Hongdae, Mapo-gu, Seoul',
    '+82-2-334-5678','Daily 18:00–03:00',MBA(14000),
    rn('Hongdae Underground Bar Seoul',0,D0,'','Open 365 days',BA_KNOW,C24,BA_KNOW,rv(1))),

  qr('r-ba-bu-1','haeundae-rooftop-bar','busan','restaurants','bars-nightlife',
    'Haeundae Rooftop Bar','Panoramic rooftop bar overlooking Haeundae Beach. Signature cocktails with Jeju citrus base.',
    m(32),sg(3),40,4.8,187,['Scenic','Rooftop'],false,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-731-2345','Daily 17:00–01:00',MBA(16000),
    rn('Haeundae Rooftop Bar Busan',0,D0,'','Open 365 days',BA_KNOW,C24,BA_KNOW,rv(2))),

  qr('r-ba-bu-2','nampo-craft-brewery','busan','restaurants','bars-nightlife',
    'Nampo Craft Brewery','Busan\'s pioneering craft brewery. Flagship ales brewed on-site, massive industrial interior.',
    m(33),sg(3),28,4.7,156,['Craft Beer','Brewery'],false,'Nampo-dong, Jung-gu, Busan',
    '+82-51-242-6789','Daily 15:00–00:00',MBA(12000),
    rn('Nampo Craft Brewery Busan',0,D0,'','Every Monday',BA_KNOW,C24,BA_KNOW,rv(3))),

  qr('r-ba-je-1','jeju-hallasan-makgeolli-bar','jeju','restaurants','bars-nightlife',
    'Jeju Hallasan Makgeolli Bar','Traditional makgeolli bar with volcanic island versions. 20 types of local rice wine paired with pajeon.',
    m(34),sg(3),22,4.7,134,['Traditional','Local Specialty'],false,'Jeju-si, Jeju',
    '+82-64-721-3456','Daily 16:00–00:00',MBA(10000),
    rn('Jeju Hallasan Makgeolli Bar Jeju',0,D0,'','Open every day',BA_KNOW,C24,BA_KNOW,rv(4))),

  qr('r-ba-je-2','seogwipo-sunset-cocktail','jeju','restaurants','bars-nightlife',
    'Seogwipo Sunset Cocktail Lounge','Cliffside cocktail lounge. The sunset hour sees every seat taken — arrive 30 min early.',
    m(35),sg(3),45,4.9,245,['Scenic','Cocktails'],false,'Seogwipo-si, Jeju',
    '+82-64-762-7890','Daily 15:00–23:00',MBA(18000),
    rn('Seogwipo Sunset Cocktail Lounge Jeju',0,D0,'','Open every day',BA_KNOW,C24,BA_KNOW,rv(5))),

  qr('r-ba-gy-1','gyeongju-makgeolli-house','gyeongju','restaurants','bars-nightlife',
    'Gyeongju Heritage Makgeolli House','Traditional liquor bar in a restored hanok. Gyeongju bread (hwangnam ppang) + local makgeolli pairing.',
    m(36),sg(3),18,4.6,76,['Traditional'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-773-4567','Daily 14:00–22:00',MBA(9000),
    rn('Gyeongju Heritage Makgeolli House Gyeongju',0,D0,'','Every Thursday',BA_KNOW,C24,BA_KNOW,rv(6))),

  qr('r-ba-gy-2','bomun-night-bar','gyeongju','restaurants','bars-nightlife',
    'Bomun Night Bar & Lounge','Lakeside lounge bar with live jazz on weekends. Imported wines and craft soju cocktails.',
    m(37),sg(3),35,4.7,65,['Jazz','Lakeside'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-8901','Daily 17:00–00:00',MBA(14000),
    rn('Bomun Night Bar Lounge Gyeongju',0,D0,'','Every Monday',BA_KNOW,C24,BA_KNOW,rv(7))),

  qr('r-ba-jo-1','jeonju-craft-liquor-bar','jeonju','restaurants','bars-nightlife',
    'Jeonju Traditional Craft Liquor Bar','Craft bar specialising in traditional Korean spirits — maesil (plum wine), bokbunja (berry wine), and makgeolli.',
    m(38),sg(3),20,4.7,98,['Traditional','Local Specialty'],false,'Samcheon-dong, Wansan-gu, Jeonju',
    '+82-63-284-5678','Daily 16:00–23:00',MBA(10000),
    rn('Jeonju Traditional Craft Liquor Bar Jeonju',0,D0,'','Every Tuesday',BA_KNOW,C24,BA_KNOW,rv(8))),

  qr('r-ba-jo-2','hanok-dongdongju-house','jeonju','restaurants','bars-nightlife',
    'Hanok Village Dongdongju House','Tiny courtyard bar pouring freshly brewed dongdongju rice wine with house-made makgeolli snacks.',
    m(39),sg(3),15,4.8,143,['Traditional','Hidden Gem'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-9012','Daily 15:00–22:30',MBA(9000),
    rn('Hanok Village Dongdongju House Jeonju',0,D0,'','Open every day',BA_KNOW,C24,BA_KNOW,rv(9))),

  /* ─── Vegetarian  (m 40–49, sg(4)) ─── */
  qr('r-vg-se-1','insadong-temple-food','seoul','restaurants','vegetarian-vegan',
    'Insadong Temple Food Restaurant','Buddhist temple cuisine — no garlic, no onion, all umami. A meditative dining experience near Jogyesa temple.',
    m(40),sg(4),32,4.8,178,['Vegan-Friendly','Buddhist'],false,'Insadong-gil, Jongno-gu, Seoul',
    '+82-2-733-1234','Daily 11:00–21:00',MVG(20000),
    rn('Insadong Temple Food Restaurant Seoul',0,DV,'15:00–17:00','Sundays',NRV,C48,VG_KNOW,rv(0))),

  qr('r-vg-se-2','mapo-vegan-korean','seoul','restaurants','vegetarian-vegan',
    'Mapo Vegan Korean Kitchen','Modern Korean vegan — jackfruit bulgogi, tofu kimchi jjigae, and oat milk sikhye dessert.',
    m(41),sg(4),25,4.6,134,['Vegan-Friendly','Modern'],false,'Mapo-daero, Mapo-gu, Seoul',
    '+82-2-717-5678','Mon–Sat 11:30–21:00',MVG(18000),
    rn('Mapo Vegan Korean Kitchen Seoul',0,DV,'','Closed Sundays',NWI,C24,VG_KNOW,rv(1))),

  qr('r-vg-bu-1','haeundae-vegan-cafe','busan','restaurants','vegetarian-vegan',
    'Haeundae Health & Vegan Café','Beachside vegan café. Acai bowls, Korean-style grain rice plates, and fresh cold-pressed juices.',
    m(42),sg(4),22,4.6,89,['Healthy','Organic'],false,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-731-2345','Daily 09:00–20:00',MVG(16000),
    rn('Haeundae Health Vegan Cafe Busan',0,DV,'','Open every day',NWI,C24,VG_KNOW,rv(2))),

  qr('r-vg-bu-2','busan-buddhist-kitchen','busan','restaurants','vegetarian-vegan',
    'Busan Vegetarian Buddhist Kitchen','Authentic temple food by a Buddhist monk near Beomeosa temple. The mushroom dubu jorim is heavenly.',
    m(43),sg(4),28,4.8,112,['Buddhist','Traditional'],false,'Beomeosa-ro, Geumjeong-gu, Busan',
    '+82-51-508-6789','Tue–Sun 11:00–19:30',MVG(20000),
    rn('Busan Vegetarian Buddhist Kitchen Busan',0,DV,'14:00–16:30','Closed Mondays & Buddhist holidays',NRV,C48,VG_KNOW,rv(3))),

  qr('r-vg-je-1','jeju-organic-farm-table','jeju','restaurants','vegetarian-vegan',
    'Jeju Organic Farm Table','On-farm restaurant — vegetables harvested that morning. Menu changes daily with whatever the soil gives.',
    m(44),sg(4),35,4.9,167,['Organic','Farm-to-Table'],false,'Aewol-eup, Jeju-si, Jeju',
    '+82-64-799-3456','Wed–Mon 11:00–18:00',MVG(22000),
    rn('Jeju Organic Farm Table Jeju',0,DV,'','Closed Tuesdays',NRV,C48,VG_KNOW,rv(4))),

  qr('r-vg-je-2','seogwipo-plant-kitchen','jeju','restaurants','vegetarian-vegan',
    'Seogwipo Plant-Based Kitchen','Jeju\'s best plant-based restaurant. The black bean tangsuyuk (sweet & sour) will convert any meat-lover.',
    m(45),sg(4),28,4.7,98,['Vegan-Friendly'],false,'Seogwipo-si, Jeju',
    '+82-64-762-7890','Daily 11:00–21:00',MVG(18000),
    rn('Seogwipo Plant Based Kitchen Jeju',0,DV,'15:00–17:00','Open every day',NWI,C24,VG_KNOW,rv(5))),

  qr('r-vg-gy-1','gyeongju-temple-vegetarian','gyeongju','restaurants','vegetarian-vegan',
    'Gyeongju Temple Vegetarian Dining','Set inside a working monastery near Bulguksa. Monks prepare seasonal temple food — reservations essential.',
    m(46),sg(4),35,4.9,134,['Buddhist','Unique'],false,'Bulguksa-ro, Gyeongju',
    '+82-54-746-4567','Tue–Sat 11:30–15:00',MVG(25000),
    rn('Gyeongju Temple Vegetarian Dining Gyeongju',0,DV,'','Closed Sun & Mon — reservation only',NRV,C48,VG_KNOW,rv(6))),

  qr('r-vg-gy-2','silla-plant-kitchen','gyeongju','restaurants','vegetarian-vegan',
    'Silla Heritage Plant Kitchen','Modern plant-based café near the Silla museum. Great lotus root chips and buckwheat cold noodles.',
    m(47),sg(4),22,4.6,67,['Modern','Healthy'],false,'Iljeong-ro, Gyeongju',
    '+82-54-771-8901','Tue–Sun 10:00–19:00',MVG(15000),
    rn('Silla Heritage Plant Kitchen Gyeongju',0,DV,'','Closed Mondays',NWI,C24,VG_KNOW,rv(7))),

  qr('r-vg-jo-1','jeonju-fermented-vegan','jeonju','restaurants','vegetarian-vegan',
    'Jeonju Fermented Food & Vegan Table','Jeonju\'s love of fermentation shines here — doenjang, kimchi, and ganjang-marinated vegetables.',
    m(48),sg(4),20,4.7,112,['Fermented','Traditional'],false,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-284-5678','Daily 11:00–20:30',MVG(16000),
    rn('Jeonju Fermented Food Vegan Table Jeonju',0,DV,'15:00–17:00','Every Wednesday',NWI,C24,VG_KNOW,rv(8))),

  qr('r-vg-jo-2','hanok-vegetarian-bibimbap','jeonju','restaurants','vegetarian-vegan',
    'Hanok Village Vegetarian Bibimbap','Bibimbap with 12 seasonal vegetables and house gochujang — no meat, full flavour. Famous Instagram spot.',
    m(49),sg(4),18,4.8,234,['BEST','Instagram-Worthy'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-9012','Daily 10:30–21:00',MVG(14000),
    rn('Hanok Village Vegetarian Bibimbap Jeonju',0,DV,'','Open every day',NWI,C24,VG_KNOW,rv(9))),

  /* ─── Halal  (m 50–59, sg(5)) ─── */
  qr('r-hl-se-1','itaewon-halal-korean-fusion','seoul','restaurants','halal-muslim-friendly',
    'Itaewon Halal Korean Fusion','Halal-certified Korean BBQ and tteokbokki in the heart of Itaewon\'s Muslim Quarter. English menus.',
    m(50),sg(5),30,4.7,234,['Halal Certified','Muslim-Friendly'],false,'Itaewon Halal Food Street, Yongsan-gu, Seoul',
    '+82-2-797-1234','Daily 11:00–22:00',MHL(16000),
    rn('Itaewon Halal Korean Fusion Seoul',0,DH,'','Open 365 days',NWI,C24,HL_KNOW,rv(0))),

  qr('r-hl-se-2','seoul-muslim-restaurant','seoul','restaurants','halal-muslim-friendly',
    'Seoul Muslim-Friendly Restaurant','KTO-certified halal restaurant near Seoul Central Mosque. Galbi, bulgogi, and bibimbap — all halal.',
    m(51),sg(5),28,4.6,178,['Halal Certified'],false,'Usadan-ro, Yongsan-gu, Seoul',
    '+82-2-793-5678','Daily 11:30–21:30',MHL(15000),
    rn('Seoul Muslim Friendly Restaurant Seoul',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(1))),

  qr('r-hl-bu-1','busan-halal-kitchen','busan','restaurants','halal-muslim-friendly',
    'Busan Halal Street Kitchen','Busan\'s most popular halal spot. Korean fried chicken and curry rice certified by KMF.',
    m(52),sg(5),22,4.5,98,['Halal Certified'],false,'Seomyeon, Busanjin-gu, Busan',
    '+82-51-819-2345','Daily 11:00–21:00',MHL(13000),
    rn('Busan Halal Street Kitchen Busan',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(2))),

  qr('r-hl-bu-2','haeundae-muslim-dining','busan','restaurants','halal-muslim-friendly',
    'Haeundae Muslim Dining','Beachside halal restaurant with panoramic views. Seafood-focused with halal certification.',
    m(53),sg(5),35,4.6,112,['Halal Certified','Seafood'],false,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-744-6789','Daily 11:00–22:00',MHL(18000),
    rn('Haeundae Muslim Dining Busan',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(3))),

  qr('r-hl-je-1','jeju-halal-seafood','jeju','restaurants','halal-muslim-friendly',
    'Jeju Halal Seafood Restaurant','Fresh Jeju seafood — abalone, hairtail, grilled fish — all halal-prepared. Rare find on the island.',
    m(54),sg(5),40,4.7,87,['Halal Certified','Seafood'],false,'Jeju-si, Jeju',
    '+82-64-721-3456','Daily 11:00–21:30',MHL(20000),
    rn('Jeju Halal Seafood Restaurant Jeju',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(4))),

  qr('r-hl-je-2','seogwipo-muslim-cafe','jeju','restaurants','halal-muslim-friendly',
    'Seogwipo Muslim-Friendly Café','Halal snacks, coffee, and Korean fusion bites with ocean views. Prayer room available.',
    m(55),sg(5),20,4.5,54,['Halal Certified','Prayer Room'],false,'Seogwipo-si, Jeju',
    '+82-64-762-7890','Daily 09:00–20:00',MHL(10000),
    rn('Seogwipo Muslim Friendly Cafe Jeju',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(5))),

  qr('r-hl-gy-1','gyeongju-halal-experience','gyeongju','restaurants','halal-muslim-friendly',
    'Gyeongju Halal Korean Experience','Traditional Korean cuisine with halal certification near Gyeongju historic sites.',
    m(56),sg(5),25,4.5,43,['Halal Certified'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-772-4567','Daily 11:00–20:30',MHL(14000),
    rn('Gyeongju Halal Korean Experience Gyeongju',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(6))),

  qr('r-hl-gy-2','bomun-halal-tea-house','gyeongju','restaurants','halal-muslim-friendly',
    'Bomun Halal Dining & Tea House','Quiet lakeside halal dining with traditional Korean tea ceremony option.',
    m(57),sg(5),30,4.6,38,['Halal Certified','Tea Ceremony'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-8901','Daily 10:00–20:00',MHL(16000),
    rn('Bomun Halal Dining Tea House Gyeongju',0,DH,'','Every Wednesday',NWI,C24,HL_KNOW,rv(7))),

  qr('r-hl-jo-1','jeonju-halal-kitchen','jeonju','restaurants','halal-muslim-friendly',
    'Jeonju Halal Traditional Kitchen','Jeonju\'s first halal-certified restaurant serving the famous bibimbap with halal ingredients.',
    m(58),sg(5),20,4.6,67,['Halal Certified','Bibimbap'],false,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-284-5678','Daily 11:00–21:00',MHL(13000),
    rn('Jeonju Halal Traditional Kitchen Jeonju',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(8))),

  qr('r-hl-jo-2','hanok-halal-bibimbap','jeonju','restaurants','halal-muslim-friendly',
    'Hanok Halal Bibimbap Restaurant','Halal bibimbap and doenjang soup in a traditional hanok setting. Muslim travellers highly recommended.',
    m(59),sg(5),18,4.7,89,['Halal Certified','Must-Try'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-9012','Daily 10:30–21:00',MHL(13000),
    rn('Hanok Halal Bibimbap Restaurant Jeonju',0,DH,'','Open every day',NWI,C24,HL_KNOW,rv(9))),

  /* ─── Street Food & Markets ─── */
  qr('r-sm-se-1','gwangjang-market-bindaetteok','seoul','restaurants','street-food-markets',
    'Gwangjang Market Bindaetteok Stall','One of the oldest street food stalls in Korea\'s original market. Crispy mung bean pancakes fried fresh every hour. Cash only.',
    m(2),sg(0),8,4.9,312,['HOT','Cash Only'],true,'Gwangjang Market, Jongno-gu, Seoul',
    '+82-2-2267-0291','Mon–Sat 09:00–22:00',MSM(8000),
    rn('Gwangjang Market Bindaetteok Seoul',0,D0,'','Closed Sundays & public holidays',NWI,C24,SM_KNOW,rv(0))),

  qr('r-sm-se-2','dongdaemun-tteokbokki-alley','seoul','restaurants','street-food-markets',
    'Dongdaemun Tteokbokki Street','Night market alley famous for spicy tteokbokki and fish cake skewers. Open until 2am — perfect late-night street food crawl.',
    m(3),sg(0),6,4.7,198,['Night Market','Late Night'],false,'Dongdaemun, Jung-gu, Seoul',
    '+82-10-9876-0011','Daily 15:00–02:00',MSM(6000),
    rn('Dongdaemun Tteokbokki Street Seoul',0,D0,'','Open every day',NWI,C24,SM_KNOW,rv(1))),

  qr('r-sm-bu-1','gukje-market-food-street','busan','restaurants','street-food-markets',
    'Gukje Market Food Street','Busan\'s biggest traditional market with dedicated food alleys. Famous for soondae, hotteok, and spicy eomuk.',
    m(4),sg(0),5,4.7,234,['HOT','Traditional Market'],false,'Gukje Market, Jung-gu, Busan',
    '+82-51-245-4649','Daily 09:00–21:00',MSM(7000),
    rn('Gukje Market Food Street Busan',0,D0,'','Open every day',NWI,C24,SM_KNOW,rv(2))),

  qr('r-sm-bu-2','busan-bupyeong-night-market','busan','restaurants','street-food-markets',
    'Bupyeong Kkangtong Night Market','Busan\'s liveliest night market under the expressway. Korean BBQ skewers, pajeon, and live music after dark.',
    m(5),sg(0),7,4.8,189,['Night Market','Live Music'],true,'Bupyeong-dong, Jung-gu, Busan',
    '+82-51-245-1234','Fri–Sun 18:00–24:00',MSM(9000),
    rn('Bupyeong Night Market Busan',0,D0,'','Weekends only',NWI,C24,SM_KNOW,rv(3))),

  qr('r-sm-je-1','jeju-dongmun-traditional-market','jeju','restaurants','street-food-markets',
    'Jeju Dongmun Traditional Market','Jeju\'s oldest covered market. Try black pork gimbap, hallabong soft-serve, and fresh raw fish from haenyeo stalls.',
    m(6),sg(0),10,4.8,267,['BEST','Local Favourite'],true,'Dongmun-ro, Jeju-si, Jeju',
    '+82-64-752-3001','Daily 07:00–21:00',MSM(8000),
    rn('Jeju Dongmun Market Jeju',0,D0,'','Closed 1st & 3rd Tuesdays',NWI,C24,SM_KNOW,rv(4))),

  qr('r-sm-je-2','seogwipo-maeil-olle-market','jeju','restaurants','street-food-markets',
    'Seogwipo Maeil Olle Market','Jeju\'s most popular weekly market. Mandarin tteok, abalone juk, and local makgeolli in a festive outdoor setting.',
    m(7),sg(0),12,4.7,143,['Market Day','Local Food'],false,'Seogwipo-si, Jeju',
    '+82-64-762-1234','Sat 08:00–13:00',MSM(10000),
    rn('Seogwipo Maeil Olle Market Jeju',0,D0,'','Saturday mornings only',NWI,C24,SM_KNOW,rv(5))),

  qr('r-sm-gy-1','gyeongju-jungang-market-food','gyeongju','restaurants','street-food-markets',
    'Gyeongju Jungang Market Street Food','Historic market near ancient ruins. Famous for ssambap rice sets and freshly fried jeon pancakes.',
    m(8),sg(0),8,4.6,98,['Historical','Traditional'],false,'Jungang-ro, Gyeongju',
    '+82-54-772-1234','Mon–Sat 09:00–20:00',MSM(7000),
    rn('Gyeongju Jungang Market Gyeongju',0,D0,'','Closed Sundays',NWI,C24,SM_KNOW,rv(6))),

  qr('r-sm-gy-2','hwangnam-bread-and-snacks','gyeongju','restaurants','street-food-markets',
    'Hwangnam Street Snacks & Bakery','Hwangnam-bbang (red bean pastry) is Gyeongju\'s most iconic snack. Buy a box warm from the oven.',
    m(9),sg(0),5,4.8,178,['Must-Buy','Iconic Snack'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-773-4422','Daily 09:00–21:00',MSM(5000),
    rn('Hwangnam Street Snacks Gyeongju',0,D0,'','Open every day',NWI,C24,SM_KNOW,rv(7))),

  qr('r-sm-jo-1','jeonju-nambu-traditional-market','jeonju','restaurants','street-food-markets',
    'Jeonju Nambu Traditional Market','Jeonju\'s food market is legendary. Bean sprout gukbap, kongnamul bibimbap, and hotteok stuffed with vegetables.',
    m(0),sg(0),9,4.8,223,['HOT','Must-Try'],true,'Nambu Market, Wansan-gu, Jeonju',
    '+82-63-284-1234','Daily 08:00–21:00',MSM(8000),
    rn('Jeonju Nambu Market Jeonju',0,D0,'','Open every day',NWI,C24,SM_KNOW,rv(8))),

  qr('r-sm-jo-2','jeonju-hanok-village-street-stalls','jeonju','restaurants','street-food-markets',
    'Jeonju Hanok Village Street Stalls','Street food paradise in the hanok village. Chocolate makgeolli, rainbow tteokbokki, giant hotteok — perfect food crawl.',
    m(1),sg(0),10,4.7,334,['Instagram-Worthy','Food Walk'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-1234','Daily 10:00–22:00',MSM(7000),
    rn('Jeonju Hanok Village Street Stalls Jeonju',0,D0,'','Open every day',NWI,C24,SM_KNOW,rv(9))),

  /* ─── Cafes & Desserts ─── */
  qr('r-cd-se-1','seongsu-specialty-coffee-lab','seoul','restaurants','cafes-desserts',
    'Seongsu-dong Specialty Coffee Lab','Seoul\'s hippest neighbourhood. Third-wave specialty coffee, banana milk soft-serve, and open-plan industrial interior.',
    m(20),sg(2),12,4.8,312,['HOT','Trendy'],true,'Seongsu-dong, Seongdong-gu, Seoul',
    '+82-2-465-1234','Daily 10:00–21:00',MCD(9000),
    rn('Seongsu Specialty Coffee Lab Seoul',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(0))),

  qr('r-cd-se-2','insadong-bingsu-dessert-house','seoul','restaurants','cafes-desserts',
    'Insadong Bingsu & Korean Dessert House','Famous for king-size pat bingsu piled with red bean, mochi, and condensed milk. Queue early on summer weekends.',
    m(21),sg(2),13,4.8,456,['BEST','Seasonal'],false,'Insadong-gil, Jongno-gu, Seoul',
    '+82-2-735-1234','Daily 10:00–22:00',MCD(13000),
    rn('Insadong Bingsu House Seoul',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(1))),

  qr('r-cd-bu-1','haeundae-ocean-cafe','busan','restaurants','cafes-desserts',
    'Haeundae Beachfront Café','Glass-walled café overlooking Haeundae Beach. Korean iced lattes, croffles, and bingsu with the sea as your backdrop.',
    m(22),sg(2),11,4.8,267,['Scenic','Instagram-Worthy'],true,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-741-1234','Daily 09:00–22:00',MCD(11000),
    rn('Haeundae Ocean Cafe Busan',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(2))),

  qr('r-cd-bu-2','nampo-hotteok-dessert-cafe','busan','restaurants','cafes-desserts',
    'Nampo-dong Hotteok & Dessert Café','Busan\'s original hotteok dough filled with syrup and seeds. Modern café format with coffee and Korean snack combos.',
    m(23),sg(2),8,4.7,178,['Traditional','Local Favourite'],false,'Nampo-dong, Jung-gu, Busan',
    '+82-51-246-1234','Daily 10:00–21:00',MCD(8000),
    rn('Nampo Hotteok Dessert Cafe Busan',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(3))),

  qr('r-cd-je-1','jeju-hallabong-citrus-cafe','jeju','restaurants','cafes-desserts',
    'Jeju Hallabong Citrus Dessert Café','Jeju-exclusive hallabong mandarin in everything — tea, cheesecake, tarts, and soft-serve. Cannot get this anywhere else.',
    m(24),sg(2),12,4.9,389,['BEST','Unique','Local Specialty'],true,'Jeju-si, Jeju',
    '+82-64-721-1234','Daily 09:00–21:00',MCD(12000),
    rn('Jeju Hallabong Dessert Cafe Jeju',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(4))),

  qr('r-cd-je-2','seogwipo-cliff-edge-cafe','jeju','restaurants','cafes-desserts',
    'Seogwipo Cliff-Edge Café & Bakery','Perched above the southern cliffs of Jeju. Watch waterfalls and ocean waves while sipping hand-drip coffee.',
    m(25),sg(2),14,4.8,234,['Scenic','Peaceful'],false,'Seogwipo-si, Jeju',
    '+82-64-763-1234','Daily 10:00–20:00',MCD(10000),
    rn('Seogwipo Cliff Cafe Jeju',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(5))),

  qr('r-cd-gy-1','gyeongju-hanok-tearoom','gyeongju','restaurants','cafes-desserts',
    'Gyeongju Heritage Hanok Tearoom','Sip traditional Korean teas and eat ssuk tteok (mugwort rice cakes) inside a 200-year-old hanok. Time-travel included.',
    m(26),sg(2),9,4.8,167,['Traditional','Cultural'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-774-1234','Tue–Sun 10:00–18:00',MCD(9000),
    rn('Gyeongju Heritage Hanok Tearoom Gyeongju',0,D0,'','Closed Mondays',NWI,C24,CD_KNOW,rv(6))),

  qr('r-cd-gy-2','bomun-lake-dessert-house','gyeongju','restaurants','cafes-desserts',
    'Bomun Lake Dessert & Coffee House','Lakeside café in the Bomun resort area. Pumpkin latte, Gyeongju chestnut tart, and handmade mochi.',
    m(27),sg(2),10,4.7,112,['Scenic','Cosy'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-1234','Daily 10:00–20:00',MCD(10000),
    rn('Bomun Lake Dessert House Gyeongju',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(7))),

  qr('r-cd-jo-1','jeonju-omija-tea-cafe','jeonju','restaurants','cafes-desserts',
    'Jeonju Omija Tea & Dessert Café','Omija (five-flavour berry) drinks and traditional Korean desserts in a restored hanok building.',
    m(28),sg(2),8,4.8,198,['Traditional','Hanok-Style'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-231-1234','Daily 10:00–20:00',MCD(8000),
    rn('Jeonju Omija Tea Cafe Jeonju',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(8))),

  qr('r-cd-jo-2','jeonju-chocolate-makgeolli-bar','jeonju','restaurants','cafes-desserts',
    'Jeonju Chocolate Makgeolli Dessert Bar','Jeonju\'s viral chocolate makgeolli in a cosy café. Pairs perfectly with honey tteok and red bean bingsu.',
    m(29),sg(2),10,4.8,289,['HOT','Viral','Instagram-Worthy'],true,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-284-9999','Daily 10:00–22:00',MCD(11000),
    rn('Jeonju Chocolate Makgeolli Cafe Jeonju',0,D0,'','Open every day',NWI,C24,CD_KNOW,rv(9))),

  /* ─── Fine Dining ─── */
  qr('r-fd-se-1','gangnam-modern-korean-fine-dining','seoul','restaurants','fine-dining',
    'Gangnam Modern Korean Fine Dining','Michelin-level Korean tasting menu. 7 courses of seasonal temple-inspired cuisine, wine pairing available. Book 3 weeks ahead.',
    m(10),sg(1),95,4.9,189,['BEST','Michelin','Premium'],true,'Cheongdam-dong, Gangnam-gu, Seoul',
    '+82-2-549-1234','Tue–Sun 18:00–22:00',MFD(110000),
    rn('Gangnam Modern Korean Fine Dining Seoul',50000,D0,'','Closed Mondays',NRV,C48,FD_KNOW,rv(0))),

  qr('r-fd-se-2','bukchon-hanok-omakase','seoul','restaurants','fine-dining',
    'Bukchon Hanok Omakase Table','Private dining rooms inside a 100-year-old hanok. Korean omakase with seasonal ingredients sourced from local farmers.',
    m(11),sg(1),85,4.8,134,['Unique','Private Room'],false,'Bukchon-ro, Jongno-gu, Seoul',
    '+82-2-722-1234','Tue–Sat 18:00–22:00',MFD(95000),
    rn('Bukchon Hanok Omakase Seoul',50000,D0,'','Closed Sun & Mon',NRV,C48,FD_KNOW,rv(1))),

  qr('r-fd-bu-1','haeundae-ocean-fine-dining','busan','restaurants','fine-dining',
    'Haeundae Ocean Fine Dining','Rooftop fine dining above the beach — fresh Busan seafood elevated to haute cuisine. Paired Korean natural wine selection.',
    m(12),sg(1),120,4.9,167,['BEST','Rooftop','Seafood'],true,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-743-1234','Wed–Mon 18:00–22:00',MFD(120000),
    rn('Haeundae Ocean Fine Dining Busan',60000,D0,'','Closed Tuesdays',NRV,C48,FD_KNOW,rv(2))),

  qr('r-fd-bu-2','busan-modern-korean-table','busan','restaurants','fine-dining',
    'Busan Modern Korean Table','Progressive Korean cuisine — traditional fermented flavours reinterpreted with modern technique. 8-course dinner only.',
    m(13),sg(1),80,4.7,98,['Modern','Seasonal'],false,'Seomyeon, Busanjin-gu, Busan',
    '+82-51-819-1234','Thu–Tue 18:30–22:00',MFD(90000),
    rn('Busan Modern Korean Table Busan',40000,D0,'','Closed Wednesdays',NRV,C48,FD_KNOW,rv(3))),

  qr('r-fd-je-1','jeju-island-tasting-menu','jeju','restaurants','fine-dining',
    'Jeju Island Seasonal Tasting Menu','Every course uses Jeju-exclusive ingredients — black pork, abalone, citrus, and volcanic mineral water. Unmissable.',
    m(14),sg(1),100,4.9,145,['BEST','Jeju Exclusive','Seasonal'],true,'Jeju-si, Jeju',
    '+82-64-724-1234','Wed–Mon 18:00–21:30',MFD(130000),
    rn('Jeju Island Seasonal Tasting Menu Jeju',60000,D0,'','Closed Tuesdays',NRV,C48,FD_KNOW,rv(4))),

  qr('r-fd-je-2','seogwipo-garden-fine-dining','jeju','restaurants','fine-dining',
    'Seogwipo Garden Fine Dining','Open-air fine dining in a private citrus garden. 6-course dinner with ocean views and candle-lit table settings.',
    m(15),sg(1),90,4.8,89,['Garden Setting','Romantic'],false,'Seogwipo-si, Jeju',
    '+82-64-762-5678','Fri–Wed 18:00–21:00',MFD(100000),
    rn('Seogwipo Garden Fine Dining Jeju',50000,D0,'','Closed Thursdays',NRV,C48,FD_KNOW,rv(5))),

  qr('r-fd-gy-1','gyeongju-silla-royal-banquet','gyeongju','restaurants','fine-dining',
    'Gyeongju Silla Royal Banquet Table','Recreation of Silla dynasty royal cuisine. 9 courses with gold lacquer tableware and traditional court music.',
    m(16),sg(1),70,4.8,112,['BEST','Cultural','Unique'],true,'Hwangnam-dong, Gyeongju',
    '+82-54-771-1234','Tue–Sun 18:00–21:00',MFD(85000),
    rn('Gyeongju Silla Royal Banquet Gyeongju',40000,D0,'','Closed Mondays',NRV,C48,FD_KNOW,rv(6))),

  qr('r-fd-gy-2','bomun-lakeside-fine-dinner','gyeongju','restaurants','fine-dining',
    'Bomun Lakeside Fine Dining','5-course dinner with Bomun Lake views. Korean-French fusion with Gyeongju seasonal vegetables and locally-aged kimchi.',
    m(17),sg(1),75,4.7,76,['Scenic','Fusion'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-5678','Wed–Mon 18:00–21:30',MFD(80000),
    rn('Bomun Lakeside Fine Dining Gyeongju',40000,D0,'','Closed Tuesdays',NRV,C48,FD_KNOW,rv(7))),

  qr('r-fd-jo-1','jeonju-slow-food-table','jeonju','restaurants','fine-dining',
    'Jeonju Slow Food Fine Dining Table','Jeonju\'s premier tasting table. Courses built on fermented foundations — doenjang-aged sauces, 3-year-old kimchi.',
    m(18),sg(1),65,4.8,98,['Fermented','Slow Food','Artisan'],false,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-288-1234','Tue–Sun 18:00–21:00',MFD(75000),
    rn('Jeonju Slow Food Table Jeonju',35000,D0,'','Closed Mondays',NRV,C48,FD_KNOW,rv(8))),

  qr('r-fd-jo-2','jeonju-modern-hanjeongsik','jeonju','restaurants','fine-dining',
    'Jeonju Modern Hanjeongsik Restaurant','The most ambitious hanjeongsik in Korea. 12-course full Korean set meal with natural wine and artisan sool pairings.',
    m(19),sg(1),75,4.9,134,['BEST','12-Course','Hanjeongsik'],true,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-5678','Wed–Mon 18:00–21:30',MFD(85000),
    rn('Jeonju Modern Hanjeongsik Jeonju',40000,D0,'','Closed Tuesdays',NRV,C48,FD_KNOW,rv(9))),

  /* ─── Seafood ─── */
  qr('r-sf-se-1','noryangjin-fish-market-dining','seoul','restaurants','seafood',
    'Noryangjin Fish Market Experience','Buy your catch direct from Seoul\'s largest fish market and have it cooked upstairs. Freshest sashimi in the city.',
    m(30),sg(4),25,4.7,312,['HOT','Authentic','Fresh'],true,'Noryangjin Fisheries Wholesale Market, Dongjak-gu, Seoul',
    '+82-2-814-2211','Daily 00:00–24:00',MSF(25000),
    rn('Noryangjin Fish Market Seoul',0,D0,'','Open 24 hours',NWI,C24,SF_KNOW,rv(0))),

  qr('r-sf-se-2','mapo-haemultang-restaurant','seoul','restaurants','seafood',
    'Mapo Haemultang Seafood Hot Pot','Mapo\'s most-loved seafood restaurant. Pot full of clams, squid, shrimp, and snapper in fiery gochugaru broth.',
    m(31),sg(4),28,4.7,178,['Spicy','Hearty'],false,'Mapo-daero, Mapo-gu, Seoul',
    '+82-2-325-1234','Daily 11:00–22:00',MSF(28000),
    rn('Mapo Haemultang Restaurant Seoul',0,D0,'15:00–17:00','Open every day',NWI,C24,SF_KNOW,rv(1))),

  qr('r-sf-bu-1','jagalchi-sashimi-restaurant','busan','restaurants','seafood',
    'Jagalchi Market Sashimi Restaurant','Upstairs from Korea\'s most famous fish market. Point at what you want from the tank — grilled or raw. Ocean-fresh guaranteed.',
    m(32),sg(4),35,4.8,445,['BEST','Must-Try'],true,'Jagalchi Market, Jung-gu, Busan',
    '+82-51-713-1234','Daily 08:00–22:00',MSF(35000),
    rn('Jagalchi Market Sashimi Busan',0,D0,'','Open every day',NWI,C24,SF_KNOW,rv(2))),

  qr('r-sf-bu-2','haeundae-ganjang-gejang-house','busan','restaurants','seafood',
    'Haeundae Ganjang Gejang House','Busan\'s best spot for "rice thief" soy-cured raw crab. Set meals with multiple gejang preparations marinated days in advance.',
    m(33),sg(4),45,4.9,234,['BEST','Raw Crab','Must-Try'],true,'Haeundae-ro, Haeundae-gu, Busan',
    '+82-51-744-1234','Tue–Sun 11:30–21:00',MSF(40000),
    rn('Haeundae Ganjang Gejang House Busan',0,D0,'','Closed Mondays',NRV,C48,SF_KNOW,rv(3))),

  qr('r-sf-je-1','jeju-abalone-seafood-house','jeju','restaurants','seafood',
    'Jeju Abalone & Seafood House','Served by haenyeo divers themselves. Fresh abalone juk (porridge) and sashimi — a Jeju experience you cannot replicate.',
    m(34),sg(4),40,4.9,289,['BEST','Haenyeo','Unique'],true,'Jeju-si, Jeju',
    '+82-64-721-1111','Daily 09:00–19:00',MSF(38000),
    rn('Jeju Abalone Seafood House Jeju',0,D0,'','Open every day — supply dependent',NWI,C24,SF_KNOW,rv(4))),

  qr('r-sf-je-2','seogwipo-hairtail-charcoal','jeju','restaurants','seafood',
    'Seogwipo Hairtail Fish Restaurant','Grilled hairtail (galchi) is Jeju\'s most beloved seafood. This restaurant serves it whole and crispy over charcoal.',
    m(35),sg(4),25,4.7,167,['Local Specialty','Charcoal'],false,'Seogwipo-si, Jeju',
    '+82-64-762-2222','Daily 11:00–21:00',MSF(25000),
    rn('Seogwipo Hairtail Fish Jeju',0,D0,'15:00–16:00','Open every day',NWI,C24,SF_KNOW,rv(5))),

  qr('r-sf-gy-1','gyeongju-nakji-octopus','gyeongju','restaurants','seafood',
    'Gyeongju Nakji & Seafood Restaurant','Famous for live octopus (sannakji) and grilled eel. Ingredients arrive from the Pohang coast each morning.',
    m(36),sg(4),22,4.6,98,['Live Seafood','Fresh Daily'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-775-1234','Tue–Sun 11:00–21:00',MSF(22000),
    rn('Gyeongju Nakji Seafood Gyeongju',0,D0,'','Closed Mondays',NWI,C24,SF_KNOW,rv(6))),

  qr('r-sf-gy-2','bomun-lakeside-grilled-fish','gyeongju','restaurants','seafood',
    'Bomun Lakeside Grilled Fish House','Fresh-caught fish grilled simply over wood fire near Bomun Lake. No frills, pure freshness — a local favourite.',
    m(37),sg(4),18,4.6,67,['Simple','Local Favourite'],false,'Bomun-ro, Gyeongju',
    '+82-54-748-2222','Daily 11:00–20:30',MSF(18000),
    rn('Bomun Grilled Fish House Gyeongju',0,D0,'','Open every day',NWI,C24,SF_KNOW,rv(7))),

  qr('r-sf-jo-1','jeonju-freshwater-fish-restaurant','jeonju','restaurants','seafood',
    'Jeonju Freshwater Fish & Doganitang','Inland Jeonju specialises in freshwater fish. Try doganitang (beef knee soup) alongside grilled river carp.',
    m(38),sg(4),15,4.6,89,['Local Specialty','Traditional'],false,'Pungnam-ro, Wansan-gu, Jeonju',
    '+82-63-287-1234','Daily 10:30–20:00',MSF(15000),
    rn('Jeonju Freshwater Fish Jeonju',0,D0,'','Open every day',NWI,C24,SF_KNOW,rv(8))),

  qr('r-sf-jo-2','jeonju-carp-river-fish-grill','jeonju','restaurants','seafood',
    'Jeonju Carp & River Fish Grill','Traditional Jeonju-style pan-fried river fish with gomguk rice soup. A simple, slow, deeply Korean meal.',
    m(39),sg(4),12,4.5,54,['Traditional','River Fish'],false,'Deokjin-dong, Deokjin-gu, Jeonju',
    '+82-63-275-1234','Tue–Sun 11:00–19:00',MSF(12000),
    rn('Jeonju Carp River Fish Jeonju',0,D0,'','Closed Mondays',NWI,C24,SF_KNOW,rv(9))),

  /* ─── Quick Bites ─── */
  qr('r-qb-se-1','myeongdong-gimbap-heaven','seoul','restaurants','quick-bites',
    'Myeongdong Gimbap Heaven','The original fast Korean meal — gimbap rolls fresh every 20 minutes. Tuna, kimchi, and classic bulgogi rolls to eat on the go.',
    m(40),sg(3),5,4.7,267,['HOT','Fast','Value'],false,'Myeongdong-gil, Jung-gu, Seoul',
    '+82-2-318-1234','Daily 07:00–22:00',MQB(5500),
    rn('Myeongdong Gimbap Heaven Seoul',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(0))),

  qr('r-qb-se-2','hongdae-soondae-pojangmacha','seoul','restaurants','quick-bites',
    'Hongdae Soondae & Odeng Pojangmacha','Outdoor tent stall near Hongik University. Soondae (blood sausage), odeng, and tteokbokki — Korea\'s favourite pub snacks.',
    m(41),sg(3),4,4.6,189,['Night Out','Casual'],false,'Hongdae, Mapo-gu, Seoul',
    '+82-10-1111-2222','Daily 17:00–02:00',MQB(4000),
    rn('Hongdae Soondae Pojangmacha Seoul',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(1))),

  qr('r-qb-bu-1','busan-eomuk-fish-cake-stall','busan','restaurants','quick-bites',
    'Busan Fish Cake (Eomuk) Stall','Busan eomuk is different — thicker, chewier, bouncier. Street vendor near Seomyeon station. Eat straight off the skewer.',
    m(42),sg(3),3,4.7,312,['HOT','Street Food','Authentic'],true,'Seomyeon, Busanjin-gu, Busan',
    '+82-51-816-1234','Daily 10:00–22:00',MQB(3000),
    rn('Busan Eomuk Skewer Stall Busan',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(2))),

  qr('r-qb-bu-2','busan-milmyeon-quick-lunch','busan','restaurants','quick-bites',
    'Busan Milmyeon Quick Lunch','Milmyeon (Busan cold wheat noodles) in 5 minutes flat. A local lunch staple — noodles in cold beef broth.',
    m(43),sg(3),6,4.7,156,['Local Specialty','Quick Lunch'],false,'Seomyeon, Busanjin-gu, Busan',
    '+82-51-817-1234','Daily 10:00–21:00',MQB(7000),
    rn('Busan Milmyeon Quick Lunch Busan',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(3))),

  qr('r-qb-je-1','jeju-black-pork-gimbap','jeju','restaurants','quick-bites',
    'Jeju Black Pork Gimbap Roll','Gimbap stuffed with Jeju\'s prized black pork and kimchi. A Jeju-exclusive quick bite you can\'t get anywhere else.',
    m(44),sg(3),6,4.8,178,['Jeju Exclusive','Must-Try'],false,'Jeju-si, Jeju',
    '+82-64-721-3333','Daily 08:00–20:00',MQB(6000),
    rn('Jeju Black Pork Gimbap Jeju',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(4))),

  qr('r-qb-je-2','seogwipo-hallabong-hotteok','jeju','restaurants','quick-bites',
    'Seogwipo Hallabong Hotteok Stand','Sweet pancake filled with hallabong mandarin jam — a Jeju street food original. Queue at the stall near the waterfall.',
    m(45),sg(3),4,4.8,234,['Viral','Sweet','Jeju Exclusive'],true,'Seogwipo-si, Jeju',
    '+82-64-762-3333','Daily 09:00–18:00',MQB(4000),
    rn('Seogwipo Mandarin Hotteok Jeju',0,D0,'','Open every day — sells out early',NWI,C24,QB_KNOW,rv(5))),

  qr('r-qb-gy-1','gyeongju-hwangnam-bbang-bakery','gyeongju','restaurants','quick-bites',
    'Gyeongju Hwangnam Bbang Bakery','The iconic red-bean pastry of Gyeongju. Baked fresh every 30 minutes, sold warm. The quintessential Gyeongju quick bite.',
    m(46),sg(3),3,4.9,445,['BEST','Iconic'],true,'Hwangnam-dong, Gyeongju',
    '+82-54-773-1234','Daily 08:00–21:00',MQB(3500),
    rn('Gyeongju Hwangnam Bbang Gyeongju',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(6))),

  qr('r-qb-gy-2','gyeongju-chapsal-donut','gyeongju','restaurants','quick-bites',
    'Gyeongju Chapsal Rice Donuts','Rice-flour donuts fried to order near the Cheonmachong tomb park. Light, chewy, dusted in cinnamon sugar.',
    m(47),sg(3),5,4.6,98,['Sweet','Fried'],false,'Hwangnam-dong, Gyeongju',
    '+82-54-772-9999','Daily 09:00–20:00',MQB(4500),
    rn('Gyeongju Chapsal Donut Gyeongju',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(7))),

  qr('r-qb-jo-1','jeonju-kongnamul-gukbap','jeonju','restaurants','quick-bites',
    'Jeonju Kongnamul Gukbap (Quick Bowl)','The morning staple of Jeonju — bean sprout rice soup with raw egg. Fast, cheap, and deeply restorative.',
    m(48),sg(3),5,4.7,312,['HOT','Morning Meal','Local'],true,'Wansan-gu, Jeonju',
    '+82-63-284-4444','Daily 06:00–15:00',MQB(5000),
    rn('Jeonju Kongnamul Gukbap Jeonju',0,D0,'','Open every day — closes early',NWI,C24,QB_KNOW,rv(8))),

  qr('r-qb-jo-2','jeonju-hotteok-street','jeonju','restaurants','quick-bites',
    'Jeonju Hanok Village Hotteok Street','Multiple hotteok vendors in the hanok village each with their own twist — red bean, vegetable, and sweet potato versions.',
    m(49),sg(3),4,4.7,223,['Street Food','Variety'],false,'Gyo-dong, Wansan-gu, Jeonju',
    '+82-63-232-5555','Daily 10:00–21:00',MQB(4000),
    rn('Jeonju Hotteok Street Jeonju',0,D0,'','Open every day',NWI,C24,QB_KNOW,rv(9))),

  /* ════════════════════════════════════════════════════════════════
     ✨  WELLNESS — Skin Clinic  (m 60–69, sg(6))
  ════════════════════════════════════════════════════════════════ */
  q('w-sc-se-2','myeongdong-glow-dermatology','seoul','wellness','skin-clinic','Myeongdong Glow Dermatology','Walk-in-friendly clinic in the shopping district. Express facials, LED therapy, and quick laser peel.',m(60),sg(6),90,4.7,267,['Express','Walk-In'],false,'Myeongdong-gil, Jung-gu, Seoul'),
  q('w-sc-se-3','cheongdam-k-beauty-spa','seoul','wellness','skin-clinic','Cheongdam K-Beauty Medical Spa','Luxury medical spa in Cheongdam. Bespoke skin programs, celebrity clientele, same-day consultation.',m(61),sg(6),180,4.9,189,['BEST','Premium','Celebrity'],false,'Cheongdam-dong, Gangnam-gu, Seoul'),
  q('w-sc-bu-1','haeundae-skin-clinic','busan','wellness','skin-clinic','Haeundae Premium Skin Clinic','Busan\'s top dermatology clinic near the beach. Specialises in anti-ageing and whitening treatments.',m(62),sg(6),100,4.8,198,['BEST','Premium'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-sc-bu-2','seomyeon-beauty-medical','busan','wellness','skin-clinic','Seomyeon Beauty Medical Center','One-stop beauty clinic: skin + hair + laser. English consultation available on request.',m(63),sg(6),80,4.6,145,['English-Staff'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('w-sc-je-1','jeju-volcanic-skin-clinic','jeju','wellness','skin-clinic','Jeju Volcanic Skin Care Clinic','Jeju-exclusive treatments using hallasan volcanic mineral water. Hydration and pore-tightening specialist.',m(64),sg(6),95,4.8,134,['Local Specialty','Unique'],false,'Jeju-si, Jeju'),
  q('w-sc-je-2','seogwipo-anti-aging','jeju','wellness','skin-clinic','Seogwipo Anti-Aging Dermatology','Quiet dermatology clinic in Seogwipo. Wrinkle treatments, filler consultations, English doctor on staff.',m(65),sg(6),120,4.7,98,['English-Staff','Anti-Aging'],false,'Seogwipo-si, Jeju'),
  q('w-sc-gy-1','gyeongju-healing-skin','gyeongju','wellness','skin-clinic','Gyeongju Healing Skin Center','Holistic skin care combining Korean herbal medicine with modern dermatology. Unique in Korea.',m(66),sg(6),85,4.7,76,['Traditional','Holistic'],false,'Hwangnam-dong, Gyeongju'),
  q('w-sc-gy-2','bomun-beauty-clinic','gyeongju','wellness','skin-clinic','Bomun Beauty Clinic & Spa','Full-service skin and body clinic near Bomun tourist complex. Hotel-quality service.',m(67),sg(6),100,4.6,65,['Premium'],false,'Bomun-ro, Gyeongju'),
  q('w-sc-jo-1','jeonju-k-beauty-studio','jeonju','wellness','skin-clinic','Jeonju K-Beauty Skin Studio','Modern K-beauty clinic in Jeonju. Glass skin facial, V-line thread lift, affordable pricing.',m(68),sg(6),75,4.7,89,['Affordable','Modern'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),
  q('w-sc-jo-2','hanok-glow-skin-clinic','jeonju','wellness','skin-clinic','Hanok Glow Skin Clinic','Boutique skin clinic in a restored hanok. Specialises in traditional herbal facials and modern peels.',m(69),sg(6),80,4.8,112,['Unique','Traditional'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Hair Salon  (m 70–79, sg(7)) ─── */
  q('w-hs-se-1','cheongdam-hair-studio','seoul','wellness','hair-salon','Cheongdam Hair Design Studio','Runway-level cuts and colour at Gangnam\'s most stylish salon. English-speaking designers, no language barrier.',m(70),sg(7),120,4.9,312,['BEST','English-Staff','K-Pop Style'],true,'Cheongdam-dong, Gangnam-gu, Seoul'),
  q('w-hs-se-2','hongdae-kpop-hair','seoul','wellness','hair-salon','Hongdae K-Pop Style Hair','The salon that actually does the looks you see in K-pop videos. Book in advance — always full.',m(71),sg(7),90,4.8,278,['K-Pop Style','Trendy'],false,'Hongdae, Mapo-gu, Seoul'),
  q('w-hs-bu-1','haeundae-hair-color-lab','busan','wellness','hair-salon','Haeundae Hair & Color Lab','Colour specialist near the beach. Experts in balayage, bleach, and vibrant Korean pastel tones.',m(72),sg(7),100,4.8,167,['Color Expert','Premium'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-hs-bu-2','seomyeon-korean-hair-studio','busan','wellness','hair-salon','Seomyeon Korean Hair Studio','Full-service salon with English-speaking stylist. Cut, perm, colour — all services available.',m(73),sg(7),75,4.6,134,['English-Staff'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('w-hs-je-1','jeju-island-hair-style','jeju','wellness','hair-salon','Jeju Island Hair & Style','Relaxed island salon with top-tier Korean styling. Specialises in natural waves and beachy texture.',m(74),sg(7),80,4.7,98,['Natural Style'],false,'Jeju-si, Jeju'),
  q('w-hs-je-2','seogwipo-boutique-hair','jeju','wellness','hair-salon','Seogwipo Boutique Hair Salon','Small boutique salon in southern Jeju. Personal attention, bespoke colour, ocean-view waiting area.',m(75),sg(7),90,4.8,76,['Boutique','Scenic'],false,'Seogwipo-si, Jeju'),
  q('w-hs-gy-1','gyeongju-modern-hair','gyeongju','wellness','hair-salon','Gyeongju Traditional & Modern Hair','Half the salon does modern cuts, the other half traditional perms. Unusual mix, great results.',m(76),sg(7),65,4.6,54,['Traditional','Modern'],false,'Hwangnam-dong, Gyeongju'),
  q('w-hs-gy-2','bomun-premium-hair','gyeongju','wellness','hair-salon','Bomun Premium Hair Design','Upscale hair salon in the Bomun resort area. Full colour treatments and K-drama-worthy styling.',m(77),sg(7),95,4.7,67,['Premium'],false,'Bomun-ro, Gyeongju'),
  q('w-hs-jo-1','jeonju-trendy-hair','jeonju','wellness','hair-salon','Jeonju Trendy Hair Studio','The most in-demand salon in Jeonju city. Book 2 weeks ahead for weekend slots.',m(78),sg(7),70,4.7,98,['Trendy','Popular'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),
  q('w-hs-jo-2','hanok-hair-beauty','jeonju','wellness','hair-salon','Hanok Village Hair & Beauty','Hair + makeup studio in the hanok village. Popular for hanbok photoshoot styling packages.',m(79),sg(7),60,4.8,145,['Hanbok','Photo-Ready'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Sauna / Jjimjilbang  (m 80–89, sg(8)) ─── */
  q('w-sa-se-1','dragon-hill-spa','seoul','wellness','sauna','Dragon Hill Spa & Jjimjilbang','Seoul\'s most famous jjimjilbang — 7 floors, 15+ rooms, rooftop pool, open 24/7. A must-do experience.',m(80),sg(8),25,4.7,456,['HOT','Must-Try','24hr'],true,'Yongsan-gu, Seoul'),
  q('w-sa-se-2','itaewon-luxury-bathhouse','seoul','wellness','sauna','Itaewon Luxury Bathhouse','Foreigner-friendly premium bathhouse. English signage throughout, locker rooms clean and modern.',m(81),sg(8),30,4.6,178,['Foreigner-Friendly','Modern'],false,'Itaewon-ro, Yongsan-gu, Seoul'),
  q('w-sa-bu-1','haeundae-spaland','busan','wellness','sauna','Haeundae Spa Land','Busan\'s largest and most famous spa — 22 themed rooms in Shinsegae Department Store.',m(82),sg(8),18,4.8,567,['BEST','Iconic'],true,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-sa-bu-2','busan-grand-jjimjilbang','busan','wellness','sauna','Busan Grand Jjimjilbang','Old-school Korean jjimjilbang near Busan station. Authentic, affordable, loved by locals.',m(83),sg(8),12,4.5,134,['Budget-Friendly','Local Favourite'],false,'Dong-gu, Busan'),
  q('w-sa-je-1','jeju-volcanic-hot-spring','jeju','wellness','sauna','Jeju Volcanic Hot Spring Spa','Natural hot spring fed by volcanic groundwater. Outdoor pools with Hallasan mountain views.',m(84),sg(8),28,4.9,234,['BEST','Natural Spring','Scenic'],true,'Jeju-si, Jeju'),
  q('w-sa-je-2','seogwipo-mineral-sauna','jeju','wellness','sauna','Seogwipo Natural Mineral Sauna','Rich in natural minerals from Jeju bedrock. Skin-softening waters popular with local elders.',m(85),sg(8),22,4.7,98,['Natural Spring'],false,'Seogwipo-si, Jeju'),
  q('w-sa-gy-1','gyeongju-bomun-hot-spring','gyeongju','wellness','sauna','Gyeongju Bomun Hot Spring','Hotel-grade hot spring facility open to non-guests. The jade sauna room is a standout.',m(86),sg(8),20,4.7,89,['Hot Spring'],false,'Bomun-ro, Gyeongju'),
  q('w-sa-gy-2','silla-heritage-spa','gyeongju','wellness','sauna','Silla Heritage Spa & Bath','Themed around ancient Silla royalty. Jjimjilbang rooms named after Silla queens and kings.',m(87),sg(8),25,4.6,67,['Cultural','Themed'],false,'Bomun-ro, Gyeongju'),
  q('w-sa-jo-1','jeonju-hanok-wellness-bath','jeonju','wellness','sauna','Jeonju Hanok Wellness Bath','Jjimjilbang designed in traditional hanok style. Cedar sauna, jade room, and herbal bath.',m(88),sg(8),18,4.7,112,['Traditional','Hanok-Style'],false,'Wansan-gu, Jeonju'),
  q('w-sa-jo-2','deokjin-jjimjilbang','jeonju','wellness','sauna','Deokjin Park Jjimjilbang','Affordable neighbourhood jjimjilbang popular with families. Clean, friendly staff, basic sauna done right.',m(89),sg(8),12,4.5,78,['Budget-Friendly','Family'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),

  /* ─── Massage  (m 90–99, sg(9)) ─── */
  q('w-ms-se-1','gangnam-premium-massage','seoul','wellness','massage','Gangnam Premium Thai & Korean Massage','Award-winning massage studio. Thai + Korean hybrid technique by certified therapists. Private rooms.',m(90),sg(9),80,4.9,389,['BEST','Premium','English-Staff'],true,'Gangnam-daero, Gangnam-gu, Seoul'),
  q('w-ms-se-2','myeongdong-relaxation','seoul','wellness','massage','Myeongdong Relaxation Center','Walk-in friendly massage in the shopping district. 30/60/90 min options. Excellent value.',m(91),sg(9),55,4.6,234,['Walk-In','Value'],false,'Myeongdong-gil, Jung-gu, Seoul'),
  q('w-ms-bu-1','haeundae-ocean-massage','busan','wellness','massage','Haeundae Ocean Breeze Massage','Seaside massage studio with ocean sounds playing throughout. Deep tissue and hot stone specialties.',m(92),sg(9),70,4.8,198,['Scenic','Deep Tissue'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-ms-bu-2','nampo-wellness-studio','busan','wellness','massage','Nampo Wellness Massage Studio','Affordable full-body massage near Nampo-dong market. Quick sessions available for busy travellers.',m(93),sg(9),45,4.6,145,['Affordable'],false,'Nampo-dong, Jung-gu, Busan'),
  q('w-ms-je-1','jeju-botanical-spa','jeju','wellness','massage','Jeju Botanical Spa & Massage','Aromatherapy massage using Jeju-grown green tea and citrus essential oils. Nature-inspired retreat.',m(94),sg(9),90,4.9,212,['BEST','Aromatherapy','Organic'],true,'Aewol-eup, Jeju-si, Jeju'),
  q('w-ms-je-2','seogwipo-citrus-spa','jeju','wellness','massage','Seogwipo Citrus Aromatherapy Spa','Hallabong mandarin massage oil — only possible in Jeju. Couples room available.',m(95),sg(9),75,4.8,134,['Unique','Couples'],false,'Seogwipo-si, Jeju'),
  q('w-ms-gy-1','gyeongju-royal-massage','gyeongju','wellness','massage','Gyeongju Royal Heritage Massage','Massage inspired by Silla-era royal wellness practices. Unique herbal compress technique.',m(96),sg(9),65,4.7,87,['Cultural','Traditional'],false,'Hwangnam-dong, Gyeongju'),
  q('w-ms-gy-2','bomun-lake-spa','gyeongju','wellness','massage','Bomun Lake Relaxation Spa','Lake-view massage rooms. Couples and individual packages with free hot spring access after session.',m(97),sg(9),80,4.7,76,['Scenic','Couples'],false,'Bomun-ro, Gyeongju'),
  q('w-ms-jo-1','jeonju-traditional-massage','jeonju','wellness','massage','Jeonju Traditional Korean Massage','Dry Korean-style massage (an-ma) by third-generation masseurs. Strong pressure, complete relaxation.',m(98),sg(9),50,4.8,134,['Traditional','Deep Pressure'],false,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('w-ms-jo-2','hanok-body-mind-spa','jeonju','wellness','massage','Hanok Village Body & Mind Spa','Spa inside a renovated hanok building. Scented candles, hanji paper décor, and full-body oil massage.',m(99),sg(9),65,4.7,98,['Boutique','Hanok-Style'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ════════════════════════════════════════════════════════════════
     🎯  ACTIVITIES — Local Experience  (m 100–109, sg(10))
  ════════════════════════════════════════════════════════════════ */
  q('a-le-se-1','bukchon-hanok-walking-tour','seoul','activities','local-experience','Bukchon Hanok Village Walking Tour','Explore the 600-year-old hanok alleys with a local guide. Hanbok rental included for photo stops.',m(100),sg(10),45,4.8,312,['HOT','English Guide','Hanbok'],false,'Bukchon-ro, Jongno-gu, Seoul'),
  q('a-le-se-2','hongdae-street-art-tour','seoul','activities','local-experience','Hongdae Street Art & Nightlife Tour','Evening tour of Seoul\'s youth culture district — street artists, hidden bars, K-indie music venues.',m(101),sg(10),40,4.7,234,['Evening','Youth Culture'],false,'Hongdae, Mapo-gu, Seoul'),
  q('a-le-bu-1','gamcheon-culture-village','busan','activities','local-experience','Gamcheon Culture Village Tour','The "Machu Picchu of Busan" — colourful hillside village with art installations and stunning views.',m(102),sg(10),35,4.8,445,['BEST','Instagram-Worthy'],true,'Gamcheon-dong, Saha-gu, Busan'),
  q('a-le-bu-2','busan-fish-market-tour','busan','activities','local-experience','Busan Fish Market & Harbor Experience','Morning trip to Jagalchi fish market with a local fisherman guide. Watch auctions, taste raw fish.',m(103),sg(10),50,4.8,267,['Authentic','Morning Tour'],false,'Jagalchi Market, Jung-gu, Busan'),
  q('a-le-je-1','hallasan-haenyeo-experience','jeju','activities','local-experience','Hallasan Haenyeo Cultural Experience','Meet real haenyeo divers, hear their stories, and try basic freediving techniques in supervised waters.',m(104),sg(10),65,4.9,198,['BEST','Unique','Cultural'],true,'Seogwipo-si, Jeju'),
  q('a-le-je-2','seongsan-sunrise-hike','jeju','activities','local-experience','Seongsan Sunrise Peak Guided Hike','Wake up at 5am to witness Jeju\'s famous sunrise from the UNESCO crater rim. Worth every step.',m(105),sg(10),40,4.9,334,['HOT','UNESCO','Sunrise'],false,'Seongsan-eup, Seogwipo-si, Jeju'),
  q('a-le-gy-1','royal-tumuli-heritage-walk','gyeongju','activities','local-experience','Royal Tumuli & Silla Heritage Walk','Walk among the ancient burial mounds of Silla kings. Expert historian guide, includes Anapji Pond.',m(106),sg(10),45,4.8,178,['Historical','UNESCO'],false,'Hwangnam-dong, Gyeongju'),
  q('a-le-gy-2','gyeongju-night-cycling','gyeongju','activities','local-experience','Gyeongju Night Cycling Tour','Cycle past lit-up ancient tumuli, pagodas, and temples after dark. Magical and unforgettable.',m(107),sg(10),35,4.8,145,['Unique','Night Tour'],false,'Gyeongju'),
  q('a-le-jo-1','jeonju-hanbok-village-tour','jeonju','activities','local-experience','Jeonju Hanbok & Village Experience','Dress in traditional hanbok and explore the 800-house hanok village with a cultural storyteller.',m(108),sg(10),40,4.9,289,['BEST','Hanbok','Cultural'],true,'Gyo-dong, Wansan-gu, Jeonju'),
  q('a-le-jo-2','jeonju-craft-tour','jeonju','activities','local-experience','Jeonju Traditional Craft Tour','Visit three artisan workshops — hanji (paper), fan-making, and lacquerware. Create your own souvenir.',m(109),sg(10),38,4.7,134,['Artisan','Craft'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Cooking Classes  (m 110–119, sg(11)) ─── */
  q('a-cc-se-2','seoul-street-food-workshop','seoul','activities','cooking-classes','K-Street Food Cooking Workshop','Master tteokbokki, odeng, and hotteok in a lively street-food-inspired kitchen. No experience needed.',m(110),sg(11),50,4.8,212,['HOT','Beginner-Friendly'],false,'Insadong, Jongno-gu, Seoul'),
  q('a-cc-se-3','seoul-tteok-making-class','seoul','activities','cooking-classes','Seoul Tteok (Rice Cake) Making Class','Learn to make 5 types of traditional Korean rice cakes with a master tteok artisan. Take home your creations.',m(111),sg(11),45,4.7,167,['Traditional','Take-Home'],false,'Nakwon-dong, Jongno-gu, Seoul'),
  q('a-cc-bu-1','busan-seafood-cooking','busan','activities','cooking-classes','Busan Seafood & Doenjang Cooking','Cook iconic Busan dishes — haemul pajeon (seafood pancake), sundubu jjigae — with local ingredients.',m(112),sg(11),55,4.8,156,['Local Specialty','Seafood'],false,'Haeundae-gu, Busan'),
  q('a-cc-bu-2','busan-pajeon-makgeolli','busan','activities','cooking-classes','Busan Pajeon & Makgeolli Class','Make the perfect Korean pancake and pair it with homemade makgeolli rice wine. Fun for all ages.',m(113),sg(11),40,4.7,112,['Fun','Pairs Well'],false,'Nampo-dong, Jung-gu, Busan'),
  q('a-cc-je-1','jeju-black-pork-cooking','jeju','activities','cooking-classes','Jeju Black Pork Cooking Experience','Learn to prepare Jeju\'s prized black pig from scratch — seasoning, grilling, and proper ssam wrapping.',m(114),sg(11),70,4.9,198,['BEST','Local Specialty'],true,'Doma-ro, Jeju-si, Jeju'),
  q('a-cc-je-2','jeju-seasonal-food-class','jeju','activities','cooking-classes','Jeju Citrus & Seasonal Food Class','Jeju hallabong jam, citrus chicken, and seasonal side dishes using farm-fresh Jeju produce.',m(115),sg(11),55,4.8,134,['Seasonal','Local Produce'],false,'Aewol-eup, Jeju-si, Jeju'),
  q('a-cc-gy-1','gyeongju-royal-cuisine-class','gyeongju','activities','cooking-classes','Gyeongju Silla Royal Cuisine Class','Recreate ancient Silla banquet dishes. Hands-on with a culinary history professor as your guide.',m(116),sg(11),65,4.8,87,['Historical','Unique'],false,'Gyeongju'),
  q('a-cc-gy-2','gyeongju-rice-wine-making','gyeongju','activities','cooking-classes','Gyeongju Traditional Rice Wine Making','Brew your own Gyeongju beopju (traditional rice wine) — a UNESCO Intangible Heritage product.',m(117),sg(11),55,4.7,76,['UNESCO','Craft'],false,'Gyeongju'),
  q('a-cc-jo-1','jeonju-bibimbap-masterclass','jeonju','activities','cooking-classes','Jeonju Bibimbap Cooking Masterclass','Cook the real Jeonju bibimbap with 30 toppings — from the home of bibimbap. Certificate awarded.',m(118),sg(11),60,4.9,267,['BEST','Certificate'],true,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('a-cc-jo-2','jeonju-fermented-workshop','jeonju','activities','cooking-classes','Jeonju Fermented Food Workshop','Make kimchi, ganjang (soy sauce), and doenjang — Jeonju\'s world-famous fermentation traditions.',m(119),sg(11),50,4.8,145,['Traditional','Fermentation'],false,'Wansan-gu, Jeonju'),

  /* ─── Traditional Cultural Tours  (m 120–129, sg(12)) ─── */
  q('a-tc-se-1','gyeongbokgung-hanbok-tour','seoul','activities','traditional-cultural-tours','Gyeongbokgung Palace & Hanbok Tour','Full guided tour of the main Joseon palace in traditional hanbok. Guard changing ceremony included.',m(120),sg(12),50,4.8,456,['HOT','Hanbok','UNESCO'],true,'Gyeongbokgung, Jongno-gu, Seoul'),
  q('a-tc-se-2','namsan-seoul-history-walk','seoul','activities','traditional-cultural-tours','Namsan Tower & Seoul History Walk','From ancient fortress walls to N Seoul Tower — a journey through 2,000 years of Seoul history.',m(121),sg(12),40,4.7,267,['Historical','Walking Tour'],false,'Namsan, Jung-gu, Seoul'),
  q('a-tc-bu-1','beomeosa-templestay','busan','activities','traditional-cultural-tours','Busan Templestay at Beomeo-sa','Overnight or day templestay at 1,300-year-old Beomeo-sa. Meditation, chanting, and temple food.',m(122),sg(12),65,4.9,189,['BEST','Templestay','Spiritual'],true,'Beomeosa-ro, Geumjeong-gu, Busan'),
  q('a-tc-bu-2','biff-square-culture-walk','busan','activities','traditional-cultural-tours','BIFF Square Busan Culture Walk','From traditional Nampodong to modern film festival grounds — Busan\'s cultural evolution in one walk.',m(123),sg(12),35,4.6,134,['Cultural','Film'],false,'Nampo-dong, Jung-gu, Busan'),
  q('a-tc-je-1','jeju-stone-park-tour','jeju','activities','traditional-cultural-tours','Jeju Stone Park & Mythology Tour','Learn Jeju\'s unique Samseong (Three Clans) creation mythology at the open-air stone sculpture park.',m(124),sg(12),40,4.7,134,['Cultural','Mythology'],false,'Jeju-si, Jeju'),
  q('a-tc-je-2','hallasan-shaman-experience','jeju','activities','traditional-cultural-tours','Hallasan Shaman Culture Experience','Meet a Jeju shaman (manshin) and participate in a traditional gut ceremony. Rare and profound.',m(125),sg(12),55,4.8,98,['Unique','Spiritual'],false,'Jeju'),
  q('a-tc-gy-1','bulguksa-seokguram-tour','gyeongju','activities','traditional-cultural-tours','Bulguksa Temple & Seokguram Grotto Tour','UNESCO World Heritage site tour with expert art historian guide. The pinnacle of Korean Buddhism.',m(126),sg(12),55,4.9,312,['BEST','UNESCO','Must-Do'],true,'Bulguksa-ro, Gyeongju'),
  q('a-tc-gy-2','anapji-silla-night-tour','gyeongju','activities','traditional-cultural-tours','Anapji Pond Silla Kingdom Night Tour','Evening guided tour of the illuminated royal garden pond. Ancient splendour after dark.',m(127),sg(12),35,4.8,189,['Night Tour','Scenic'],false,'Wolseong-ro, Gyeongju'),
  q('a-tc-jo-1','jeonju-artisan-hanok-tour','jeonju','activities','traditional-cultural-tours','Jeonju Hanok Village Artisan Tour','Meet master artisans of hanji, pottery, and traditional music inside a living hanok village.',m(128),sg(12),40,4.8,178,['Artisan','Cultural'],false,'Gyo-dong, Wansan-gu, Jeonju'),
  q('a-tc-jo-2','jeonju-paper-making-class','jeonju','activities','traditional-cultural-tours','Jeonju Paper Making & Craft Class','Make traditional hanji paper and create a souvenir notebook. UNESCO Intangible Heritage craft.',m(129),sg(12),38,4.7,134,['Craft','UNESCO'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Sports  (m 130–139, sg(13)) ─── */
  q('a-sp-se-1','han-river-kayaking','seoul','activities','sports','Han River Kayaking & Cycling','Kayak on the Han River then cycle along the riverside path. Equipment and guide included.',m(130),sg(13),45,4.7,178,['HOT','Outdoor'],false,'Banpo Hangang Park, Seoul'),
  q('a-sp-se-2','seoul-esports-experience','seoul','activities','sports','Seoul E-Sports & PC Bang Experience','Visit a professional esports arena, watch a live match, and play in a premium PC bang. The full gamer package.',m(131),sg(13),35,4.7,234,['Unique','Gaming'],false,'Jongno-gu, Seoul'),
  q('a-sp-bu-1','busan-surf-lessons','busan','activities','sports','Busan Surfing Lessons at Songjeong','Korea\'s best surf beach. 2-hour beginner lesson with certified instructor. Board and wetsuit included.',m(132),sg(13),60,4.8,267,['BEST','Beginner-Friendly','Beach'],true,'Songjeong Beach, Haeundae-gu, Busan'),
  q('a-sp-bu-2','gwangalli-night-run','busan','activities','sports','Gwangalli Night Marathon & Running','Guided night run along Gwangalli Beach with the illuminated bridge as backdrop. All levels welcome.',m(133),sg(13),30,4.7,112,['Night','Running'],false,'Gwangalli Beach, Suyeong-gu, Busan'),
  q('a-sp-je-1','jeju-scuba-diving','jeju','activities','sports','Jeju Scuba Diving & Snorkeling','Crystal-clear Jeju waters — dive with haenyeo divers, spot tropical fish and underwater lava formations.',m(134),sg(13),85,4.9,198,['BEST','Diving','Nature'],true,'Seogwipo-si, Jeju'),
  q('a-sp-je-2','jeju-horseback-riding','jeju','activities','sports','Jeju Horseback Riding Tour','Jeju is famous for its horses. Trail ride through volcanic farmland with Hallasan mountain views.',m(135),sg(13),65,4.8,156,['Nature','Beginner-Friendly'],false,'Jeju'),
  q('a-sp-gy-1','gyeongju-bike-tour','gyeongju','activities','sports','Gyeongju Bike Tour of Ancient Ruins','Cycle between Silla tombs, temples, and UNESCO sites. The flattest and most scenic city bike tour in Korea.',m(136),sg(13),35,4.8,145,['HOT','Cycling','UNESCO'],false,'Gyeongju'),
  q('a-sp-gy-2','bomun-pedal-boat','gyeongju','activities','sports','Bomun Lake Pedal Boat & Leisure','Relaxed pedal boat rental on Bomun Lake. Gentle exercise with beautiful mountain and lake views.',m(137),sg(13),20,4.5,87,['Family-Friendly','Relaxed'],false,'Bomun-ro, Gyeongju'),
  q('a-sp-jo-1','jeonju-traditional-archery','jeonju','activities','sports','Jeonju Archery & Traditional Sports','Try Korean traditional archery (gungdo) and ssireum wrestling in a purpose-built cultural sports park.',m(138),sg(13),30,4.7,98,['Traditional','Cultural'],false,'Wansan-gu, Jeonju'),
  q('a-sp-jo-2','deokjin-trail-running','jeonju','activities','sports','Deokjin Park Trail Running & Hiking','Morning trail run through the lotus-covered park with certified running coach. Group runs every weekend.',m(139),sg(13),25,4.6,67,['Running','Morning'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),

  /* ════════════════════════════════════════════════════════════════
     💡  TIPS & TREND — Travel Tips  (m 140–149, sg(14))
  ════════════════════════════════════════════════════════════════ */
  q('t-tt-se-1','seoul-essential-apps','seoul','tips-and-trend','travel-tips','Essential Apps Every Seoul Traveler Needs','Naver Map, KakaoTaxi, Coupang Eats, Papago — the 10 apps that make Seoul life effortless.',m(140),sg(14),0,0,0,['Guide','Essential']),
  q('t-tt-se-2','seoul-budget-travel','seoul','tips-and-trend','travel-tips','Seoul on a Budget: Best Free Things To Do','Free palaces, free hiking, free museums — how to spend an amazing week in Seoul for under $50/day.',m(141),sg(14),0,0,0,['Budget','Free']),
  q('t-tt-bu-1','busan-first-timers-guide','busan','tips-and-trend','travel-tips','Busan Travel Guide for First-Timers','Everything you need to know before visiting Busan — neighborhoods, beaches, transport, and food.',m(142),sg(14),0,0,0,['Guide','Beginner']),
  q('t-tt-bu-2','busan-best-neighborhoods','busan','tips-and-trend','travel-tips','Best Neighborhoods to Stay in Busan','Haeundae for beach lovers, Nampo for foodies, Seomyeon for nightlife — pick your Busan base.',m(143),sg(14),0,0,0,['Guide','Accommodation']),
  q('t-tt-je-1','jeju-car-rental-guide','jeju','tips-and-trend','travel-tips','How to Rent a Car in Jeju Island','International license, best rental companies, insurance tips, and driving rules in Jeju explained.',m(144),sg(14),0,0,0,['Guide','Driving']),
  q('t-tt-je-2','jeju-3-day-itinerary','jeju','tips-and-trend','travel-tips','Jeju Island 3-Day Itinerary Guide','The perfect 3-day plan covering both coasts, Hallasan, Seongsan, and the best food stops.',m(145),sg(14),0,0,0,['Itinerary','Guide']),
  q('t-tt-gy-1','gyeongju-day-trip-guide','gyeongju','tips-and-trend','travel-tips','Gyeongju Day Trip Guide from Seoul','2.5 hours by KTX — how to plan the perfect day trip to see Bulguksa, tumuli, and back by dinner.',m(146),sg(14),0,0,0,['Day Trip','KTX']),
  q('t-tt-gy-2','best-time-visit-gyeongju','gyeongju','tips-and-trend','travel-tips','Best Time to Visit Gyeongju','Cherry blossoms in spring, starry skies in autumn — when to visit and what to expect each season.',m(147),sg(14),0,0,0,['Seasonal','Guide']),
  q('t-tt-jo-1','jeonju-hanok-complete-guide','jeonju','tips-and-trend','travel-tips','Jeonju Hanok Village Complete Guide','Map, top food stops, hanbok rental spots, and hidden alleys — the definitive Jeonju travel guide.',m(148),sg(14),0,0,0,['Guide','Comprehensive']),
  q('t-tt-jo-2','jeonju-ktx-vs-bus','jeonju','tips-and-trend','travel-tips','Getting to Jeonju from Seoul: KTX vs Bus','KTX is faster, express bus is cheaper — we break down both options with times, costs, and tips.',m(149),sg(14),0,0,0,['Transport','Guide']),

  /* ─── Trend Now  (m 150–159, sg(15)) ─── */
  q('t-tn-se-1','seoul-hottest-cafes-2026','seoul','tips-and-trend','trend-now','Seoul\'s Hottest New Café Districts 2026','Seongsu-dong, Mangwon, Euljiro — the café neighbourhoods taking over Seoul right now.',m(150),sg(15),0,0,0,['Trending','Cafés']),
  q('t-tn-se-2','kpop-filming-locations','seoul','tips-and-trend','trend-now','K-Pop & K-Drama Filming Locations in Seoul','From Goblin alleys to BTS photoshoot spots — the ultimate fan location guide for Seoul.',m(151),sg(15),0,0,0,['K-Pop','K-Drama','Fan']),
  q('t-tn-bu-1','busan-coolest-city','busan','tips-and-trend','trend-now','Why Busan is Korea\'s Coolest City Right Now','Surf culture, indie music, rooftop cafés, and international art festivals — Busan\'s golden era.',m(152),sg(15),0,0,0,['Trending']),
  q('t-tn-bu-2','busan-arts-culture-scene','busan','tips-and-trend','trend-now','Busan\'s Emerging Arts & Culture Scene','From the UN Memorial Park to Busan Museum of Art — a new generation of Busan creatives.',m(153),sg(15),0,0,0,['Arts','Culture']),
  q('t-tn-je-1','jeju-digital-nomad','jeju','tips-and-trend','trend-now','Jeju\'s Digital Nomad Paradise: Work & Travel','Jeju is now Korea\'s top remote work destination — co-working cafés, fast internet, nature.',m(154),sg(15),0,0,0,['Digital Nomad','Remote Work']),
  q('t-tn-je-2','jeju-ocean-view-cafes','jeju','tips-and-trend','trend-now','Jeju\'s Trendy Cafés with Ocean Views','Curved glass buildings on cliff edges, matcha lattes with Hallasan views — Jeju café culture.',m(155),sg(15),0,0,0,['Cafés','Scenic']),
  q('t-tn-gy-1','gyeongju-aesthetic-2026','gyeongju','tips-and-trend','trend-now','The Aesthetic Appeal of Gyeongju in 2026','Why photographers and creatives are flocking to Gyeongju — cherry blossom, ancient stone, golden hour.',m(156),sg(15),0,0,0,['Photography','Aesthetic']),
  q('t-tn-gy-2','gyeongju-new-hot-destination','gyeongju','tips-and-trend','trend-now','Why Gyeongju is the New Hot Destination','Slow travel, heritage tourism, and Instagram magic — Gyeongju\'s quiet rise to fame.',m(157),sg(15),0,0,0,['Trending','Slow Travel']),
  q('t-tn-jo-1','jeonju-street-food-instagram','jeonju','tips-and-trend','trend-now','Jeonju\'s Instagram-Worthy Street Food Scene','Chocolate makgeolli, rainbow tteokbokki, giant hotteok — Jeonju food is made for the camera.',m(158),sg(15),0,0,0,['Food','Instagram']),
  q('t-tn-jo-2','jeonju-food-capital-2026','jeonju','tips-and-trend','trend-now','Jeonju: Korea\'s Food Capital for 2026','Named top food city by multiple travel outlets — why every Korean foodie is making the pilgrimage.',m(159),sg(15),0,0,0,['Food','Trending']),

  /* ─── Smoking Spots  (m 160–169, sg(16)) ─── */
  q('t-ss-se-1','myeongdong-smoking-areas','seoul','tips-and-trend','smoking-spots','Official Smoking Areas in Myeongdong','Map of all designated smoking zones in the Myeongdong shopping district. Updated 2026.',m(160),sg(16),0,0,0,['Map','Guide']),
  q('t-ss-se-2','hongdae-sinchon-smoking','seoul','tips-and-trend','smoking-spots','Where to Smoke Near Hongdae & Sinchon','Night-out guide to designated smoking areas in Seoul\'s youth districts — no fines, no trouble.',m(161),sg(16),0,0,0,['Map','Night Out']),
  q('t-ss-bu-1','haeundae-smoking-zones','busan','tips-and-trend','smoking-spots','Smoking Areas Near Haeundae Beach','All designated zones near the beach strip, hotels, and BEXCO convention center.',m(162),sg(16),0,0,0,['Map','Beach Area']),
  q('t-ss-bu-2','busan-station-smoking','busan','tips-and-trend','smoking-spots','Busan Station & Seomyeon Smoking Zones','Pocket guide to smoking areas in Busan\'s two busiest transit hubs. Avoid hefty fines.',m(163),sg(16),0,0,0,['Map','Transit']),
  q('t-ss-je-1','jeju-city-smoking-spots','jeju','tips-and-trend','smoking-spots','Designated Smoking Spots in Jeju City','Jeju city centre smoking zones near the airport, tourist street, and harbour.',m(164),sg(16),0,0,0,['Map','Guide']),
  q('t-ss-je-2','jeju-tourist-smoking-rules','jeju','tips-and-trend','smoking-spots','Smoking Rules & Areas for Jeju Tourists','Jeju has strict outdoor smoking rules. Know before you go — fines can reach ₩100,000.',m(165),sg(16),0,0,0,['Rules','Important']),
  q('t-ss-gy-1','gyeongju-historic-smoking','gyeongju','tips-and-trend','smoking-spots','Smoking Areas Near Gyeongju Historic Sites','Smoking is strictly prohibited near UNESCO heritage sites — find the nearest legal zones.',m(166),sg(16),0,0,0,['Map','UNESCO Area']),
  q('t-ss-gy-2','gyeongju-tourist-smoking-guide','gyeongju','tips-and-trend','smoking-spots','Gyeongju Tourist Smoking Zone Guide','Full map of smoking zones for visitors to the Gyeongju Historic Zone.',m(167),sg(16),0,0,0,['Map','Guide']),
  q('t-ss-jo-1','jeonju-hanok-smoking','jeonju','tips-and-trend','smoking-spots','Smoking Spots in Jeonju Hanok Village Area','Fire risk is high in the hanok village — designated smoking spots are at the periphery.',m(168),sg(16),0,0,0,['Map','Important']),
  q('t-ss-jo-2','jeonju-smoking-zone-map','jeonju','tips-and-trend','smoking-spots','Jeonju City Smoking Zone Map','Comprehensive guide to Jeonju\'s official smoking areas by district.',m(169),sg(16),0,0,0,['Map','Guide']),

  /* ─── Public Transportation  (m 170–179, sg(17)) ─── */
  q('t-pt-se-2','seoul-airport-limousine-bus','seoul','tips-and-trend','public-transportation','Seoul Airport Limousine Bus Guide','All limousine bus routes from Incheon & Gimpo airports — stops, costs, and exact times.',m(170),sg(17),0,0,0,['Airport','Guide']),
  q('t-pt-se-3','kakao-taxi-map-guide','seoul','tips-and-trend','public-transportation','How to Use KakaoTaxi & Kakao Map in Seoul','Step-by-step guide to calling taxis and navigating Seoul with Kakao apps — even without Korean.',m(171),sg(17),0,0,0,['App','Guide']),
  q('t-pt-bu-1','busan-metro-guide','busan','tips-and-trend','public-transportation','Busan Metro System Guide for Tourists','4 lines, 90+ stations — how to navigate Busan by subway with T-money card tips.',m(172),sg(17),0,0,0,['Subway','Guide']),
  q('t-pt-bu-2','busan-transport-comparison','busan','tips-and-trend','public-transportation','Getting Around Busan: Bus vs Metro vs Taxi','Cost and time comparison for getting between Busan\'s main districts. When to choose what.',m(173),sg(17),0,0,0,['Comparison','Guide']),
  q('t-pt-je-1','jeju-without-car','jeju','tips-and-trend','public-transportation','Getting Around Jeju Without a Car','Bus routes, taxi apps, and e-scooters — it\'s possible to explore Jeju without renting a car.',m(174),sg(17),0,0,0,['Bus','Budget']),
  q('t-pt-je-2','jeju-coastal-bus-route','jeju','tips-and-trend','public-transportation','Jeju Bus 810 & 820: Coastal Route Guide','The two circular coastal bus routes that cover almost every tourist spot in Jeju.',m(175),sg(17),0,0,0,['Bus','Scenic']),
  q('t-pt-gy-1','gyeongju-getting-around','gyeongju','tips-and-trend','public-transportation','Getting to Gyeongju & Moving Around','KTX from Seoul (2h), then bus or taxi to sites. Complete transport guide for Gyeongju visitors.',m(176),sg(17),0,0,0,['KTX','Guide']),
  q('t-pt-gy-2','gyeongju-ktx-bus-guide','gyeongju','tips-and-trend','public-transportation','Gyeongju KTX & Local Bus Guide','Which KTX station to use, which local bus numbers reach each major site, and taxi costs.',m(177),sg(17),0,0,0,['KTX','Bus']),
  q('t-pt-jo-1','jeonju-ktx-terminal-guide','jeonju','tips-and-trend','public-transportation','Jeonju KTX & Bus Terminal Guide','All transport options from Seoul to Jeonju — KTX to Jeonju Station, express buses, costs.',m(178),sg(17),0,0,0,['KTX','Guide']),
  q('t-pt-jo-2','jeonju-hanok-village-transport','jeonju','tips-and-trend','public-transportation','Getting Around Jeonju Hanok Village','Walking is best, but here\'s the bus and taxi guide for Jeonju city including the hanok village.',m(179),sg(17),0,0,0,['Walking','Guide']),
];

export const sampleListings: Listing[] = rawSampleListings.map((l, i) => {
  if (l.notes !== '' && l.notes != null) return l;
  const seed = i;
  if (l.category === 'wellness') return { ...l, notes: wn(l.subcategory ?? '', seed), menu_items: wm(l.subcategory ?? '') };
  if (l.category === 'activities') return { ...l, notes: an(l.subcategory ?? '', seed), menu_items: am(l.subcategory ?? '') };
  if (l.category === 'tips-and-trend') return { ...l, notes: tn(l.subcategory ?? '', seed) };
  return l;
});
