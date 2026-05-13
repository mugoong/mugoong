import { Listing } from '@/types';
import type { MainCategory, City } from '@/types';

/* ─── Gallery pools per category ───────────────────────────────── */
const G_REST = [
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
];
const G_WELL = [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
];
const G_ACT = [
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
  'https://images.unsplash.com/photo-1535192952584-91d9cf7e1c0e?w=800&q=80',
  'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
  'https://images.unsplash.com/photo-1549488697-deead16fbe9b?w=800&q=80',
];
const G_TIPS = [
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
  'https://images.unsplash.com/photo-1554041839-bc64b14f30a5?w=800&q=80',
  'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
];

/* ─── Compact listing generator ─────────────────────────────────── */
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

/* ─── Image shorthand ───────────────────────────────────────────── */
const I = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

export const sampleListings: Listing[] = [

  /* ════════════════════════════════════════════════════════════════
     🍽️  RESTAURANTS — full detail listings
  ════════════════════════════════════════════════════════════════ */
  {
    id: '1', slug: 'gwangjang-market-food-tour', category: 'restaurants', subcategory: 'korean-food',
    city: 'seoul', title: 'Gwangjang Market Food Tour',
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
    description: 'Savor the finest Korean beef at a top-rated Gangnam BBQ restaurant. Premium 1++ grade Hanwoo with expert grilling service.',
    content: 'Not your average Korean BBQ — 1++ grade Hanwoo in the heart of Gangnam.',
    image: I('1590301157890-4810ed352733'),
    gallery: [I('1544025162-d76694265947'), I('1529692236671-f1f6cf9683ba'), I('1558618666-fcd25c85cd64'), I('1534482421-64566f976cfa'), I('1504674900247-0877df9cc836'), I('1551218808-94e220e084d2'), I('1565299507177-b0ac66763828')],
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
    notes: JSON.stringify({ __plain: '', __extra: { english_staff: true, gender_policy: 'All welcome', duration: '60–120 minutes' } }),
  },

  {
    id: '9', slug: 'korean-cooking-class', category: 'activities', subcategory: 'cooking-classes',
    city: 'seoul', title: 'Learn to Make Kimchi & Bibimbap',
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
    notes: JSON.stringify({ __plain: '', __extra: { duration: '3–4 hours', group_size: 'Max 8', difficulty: 'Easy', english_guide: true } }),
  },

  {
    id: '13', slug: 'seoul-metro-guide', category: 'tips-and-trend', subcategory: 'public-transportation',
    city: 'seoul', title: 'How to Use the Seoul Metro Like a Local',
    description: 'Everything you need to know about navigating Seoul\'s subway — T-money cards, transfers, and pro tips.',
    content: '🎫 T-money Card: Buy at any convenience store ₩2,500\n📱 Apps: Naver Map, KakaoMetro\n🚇 Rush hour: 7:30–9:00 & 17:30–19:00',
    image: I('1517154421773-0529f29ea451'),
    gallery: [I('1555993539-1732b0258235'), I('1581262208435-41726149a759'), I('1544620347-c4fd4a3d5957'), I('1559825481-12a05cc00344'), I('1565043589221-1a6fd9ae45c7'), I('1554041839-bc64b14f30a5'), I('1530521954074-e64f6810b32d')],
    price: 0, currency: 'USD', rating: 0, reviewCount: 0, tags: ['Guide', 'Essential'], featured: false,
    address: '', phone: '', operating_hours: '', menu_items: [], notes: '',
  },

  /* ════════════════════════════════════════════════════════════════
     🍽️  RESTAURANTS — Korean Food
  ════════════════════════════════════════════════════════════════ */
  q('r-kf-se-2','insadong-traditional-korean-feast','seoul','restaurants','korean-food','Insadong Traditional Korean Feast','Sit-down traditional Korean meal steps from the cultural street. Seasonal banchan, homemade jjigae, and hand-rolled gimbap.',I('1546069901-ba9599a7e63c'),G_REST,28,4.7,145,['HOT'],false,'Insadong-gil, Jongno-gu, Seoul'),
  q('r-kf-se-3','myeongdong-jjigae-noodle-house','seoul','restaurants','korean-food','Myeongdong Jjigae & Noodle House','Famous kimchi jjigae and kalguksu in the heart of shopping paradise. Standing room at peak hours — worth the wait.',I('1583417319070-4a69db38a482'),G_REST,18,4.6,209,['Must-Try'],false,'Myeongdong-gil, Jung-gu, Seoul'),
  q('r-kf-bu-1','nampo-korean-kitchen','busan','restaurants','korean-food','Nampo Authentic Korean Kitchen','Classic Korean dishes near the BIFF Square. The sundubu jjigae and doenjang soup are legendary among locals.',I('1504674900247-0877df9cc836'),G_REST,22,4.7,178,['HOT', 'Local Favorite'],false,'Nampo-dong, Jung-gu, Busan'),
  q('r-kf-bu-2','haeundae-grandmas-cooking','busan','restaurants','korean-food','Haeundae Grandma\'s Home Cooking','Hearty homestyle Korean set meals near Haeundae Beach. Grandma-style cooking with 10+ banchan every sitting.',I('1498654896293-37aacf113fd9'),G_REST,20,4.8,134,['Traditional'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('r-kf-je-1','jeju-black-pork-seafood','jeju','restaurants','korean-food','Jeju Black Pork & Seafood Restaurant','Only-in-Jeju flavors — grilled black pork belly, fresh haenyeo-caught abalone, and seasonal galchi braised fish.',I('1563245372-f21724e3856d'),G_REST,38,4.8,267,['BEST', 'Local Specialty'],true,'Doma-ro, Jeju-si, Jeju'),
  q('r-kf-je-2','seogwipo-haenyeo-kitchen','jeju','restaurants','korean-food','Seogwipo Haenyeo Kitchen','Cooked and served by actual haenyeo (female divers). The freshest seafood possible — caught that morning.',I('1551218808-94e220e084d2'),G_REST,45,4.9,198,['HOT', 'Unique'],false,'Seogwipo-si, Jeju'),
  q('r-kf-gy-1','gyeongju-silla-royal-cuisine','gyeongju','restaurants','korean-food','Gyeongju Silla Royal Cuisine','Reconstructed royal court dishes from the Silla Kingdom era. A cultural and culinary experience in one.',I('1565299507177-b0ac66763828'),G_REST,42,4.8,112,['Traditional', 'Cultural'],false,'Hwangnam-dong, Gyeongju'),
  q('r-kf-gy-2','hwangnam-traditional-table','gyeongju','restaurants','korean-food','Hwangnam Traditional Korean Table','Family-run restaurant next to the royal tumuli park. Homemade soy sauce and doenjang made in-house.',I('1583417319070-4a69db38a482'),G_REST,25,4.6,88,['Traditional'],false,'Hwangnam-dong, Gyeongju'),
  q('r-kf-jo-1','jeonju-bibimbap-restaurant','jeonju','restaurants','korean-food','Jeonju Bibimbap Masterclass Restaurant','The city that invented bibimbap. Stone pot (dolsot) version with 30 premium toppings and seasonal namul.',I('1504674900247-0877df9cc836'),G_REST,20,4.9,445,['BEST', 'Must-Try'],true,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('r-kf-jo-2','hanok-village-heritage-dining','jeonju','restaurants','korean-food','Hanok Village Korean Heritage Dining','Dine inside a restored 100-year-old hanok. The slow-cooked pork gukbap and barley rice are standouts.',I('1546069901-ba9599a7e63c'),G_REST,18,4.7,176,['Traditional'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Korean BBQ ─── */
  q('r-kb-se-2','hongdae-night-bbq','seoul','restaurants','korean-bbq','Hongdae Night BBQ & Craft Beer','Late-night BBQ hotspot in Hongdae. Premium pork belly, makeoli on tap, and an electric atmosphere until 2am.',I('1544025162-d76694265947'),G_REST,40,4.7,312,['HOT', 'Late-Night'],false,'Hongdae, Mapo-gu, Seoul'),
  q('r-kb-se-3','itaewon-prime-grill','seoul','restaurants','korean-bbq','Itaewon Prime Grill House','International-friendly BBQ in Itaewon. English menus, halal option available, premium charcoal grill.',I('1529692236671-f1f6cf9683ba'),G_REST,55,4.8,203,['BEST', 'International'],false,'Itaewon-ro, Yongsan-gu, Seoul'),
  q('r-kb-bu-1','seomyeon-bbq-street','busan','restaurants','korean-bbq','Seomyeon BBQ Street','Busan\'s most popular BBQ corridor. Choose from a dozen grills — pork, beef, and seafood all top-notch.',I('1574484284002-952d92456975'),G_REST,35,4.6,189,['HOT'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('r-kb-bu-2','haeundae-charcoal-grill','busan','restaurants','korean-bbq','Haeundae Charcoal Grill','Seaside premium BBQ. The chadolbaegi (thin brisket) over real oak charcoal with ocean views.',I('1558618666-fcd25c85cd64'),G_REST,50,4.8,167,['Premium'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('r-kb-je-1','jeju-black-pork-bbq','jeju','restaurants','korean-bbq','Jeju Black Pork BBQ Village','Jeju\'s iconic black pig (heuk-dwaeji) grilled over lava stone. The only place to have the real deal.',I('1544025162-d76694265947'),G_REST,48,4.9,334,['BEST', 'Local Specialty'],true,'Doma-ro, Jeju-si, Jeju'),
  q('r-kb-je-2','aewol-seaside-bbq','jeju','restaurants','korean-bbq','Aewol Seaside BBQ Garden','Open-air BBQ garden facing the ocean. Watch the sunset while grilling fresh Jeju pork.',I('1529692236671-f1f6cf9683ba'),G_REST,42,4.7,145,['Scenic'],false,'Aewol-eup, Jeju-si, Jeju'),
  q('r-kb-gy-1','bomun-lake-bbq','gyeongju','restaurants','korean-bbq','Bomun Lake BBQ Resort','Spacious BBQ restaurant overlooking Bomun Lake. Perfect for family gatherings with private grilling rooms.',I('1574484284002-952d92456975'),G_REST,45,4.6,98,['Family-Friendly'],false,'Bomun-ro, Gyeongju'),
  q('r-kb-gy-2','gyeongju-hanwoo-bbq','gyeongju','restaurants','korean-bbq','Gyeongju Hanwoo Special BBQ','Locally-raised Hanwoo beef with Gyeongju pear marinade — a regional speciality you can\'t find in Seoul.',I('1558618666-fcd25c85cd64'),G_REST,60,4.8,87,['Premium', 'Local Specialty'],false,'Hwangnam-dong, Gyeongju'),
  q('r-kb-jo-1','jeonju-traditional-bbq','jeonju','restaurants','korean-bbq','Jeonju Traditional BBQ House','Charcoal BBQ in a hanok-style building. Marinated meats use century-old soy sauce recipes from Jeonju.',I('1544025162-d76694265947'),G_REST,38,4.7,121,['Traditional'],false,'Hanok-gil, Wansan-gu, Jeonju'),
  q('r-kb-jo-2','deokjin-outdoor-bbq','jeonju','restaurants','korean-bbq','Deokjin Park Outdoor BBQ','Al fresco BBQ next to the lotus pond. Great for summer evenings — pork belly + cold soju.',I('1529692236671-f1f6cf9683ba'),G_REST,30,4.5,76,['Outdoor'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),

  /* ─── Korean Fried Chicken ─── */
  q('r-fc-se-1','hongdae-crispy-chicken','seoul','restaurants','korean-fried-chicken','Hongdae Crispy Chicken & Craft Beer','Legendary chimaek (chicken + maekju) spot in Hongdae. Double-fried for extra crunch, 10 sauce options.',I('1569050467447-ce54b3bbc37d'),G_REST,20,4.8,456,['HOT', 'Late-Night'],false,'Hongdae, Mapo-gu, Seoul'),
  q('r-fc-se-2','sinchon-chimaek-palace','seoul','restaurants','korean-fried-chicken','Sinchon Chimaek Palace','The student district\'s favourite stop. Whole chicken, half-and-half sauce, massive beer towers.',I('1562967914-608f82629710'),G_REST,18,4.6,278,['Student Favorite', 'Late-Night'],false,'Sinchon-ro, Seodaemun-gu, Seoul'),
  q('r-fc-bu-1','busan-fried-chicken-station','busan','restaurants','korean-fried-chicken','Busan Fried Chicken Station','Busan-style yangnyeom chicken — sweeter sauce with a hint of local gochujang. Standing queues at dinner.',I('1569050467447-ce54b3bbc37d'),G_REST,17,4.7,189,['HOT'],false,'Nampo-dong, Jung-gu, Busan'),
  q('r-fc-bu-2','gwangalli-chimaek-bar','busan','restaurants','korean-fried-chicken','Gwangalli Beach Chimaek Bar','Fried chicken and cold beer facing Gwangalli bridge at night. Best chicken + view combo in Busan.',I('1562967914-608f82629710'),G_REST,22,4.8,267,['Scenic', 'Late-Night'],false,'Gwangalli-ro, Suyeong-gu, Busan'),
  q('r-fc-je-1','jeju-citrus-glazed-chicken','jeju','restaurants','korean-fried-chicken','Jeju Citrus Glazed Chicken','Unique Jeju twist: local hallabong mandarin glaze on crispy fried chicken. Sweet, tangy, addictive.',I('1569050467447-ce54b3bbc37d'),G_REST,23,4.8,145,['Local Specialty', 'Unique'],false,'Jeju-si, Jeju'),
  q('r-fc-je-2','seogwipo-spicy-wings','jeju','restaurants','korean-fried-chicken','Seogwipo Spicy Wings House','Fire-level heat chicken wings in Seogwipo. Challenge menu: finish a bucket, get it free.',I('1562967914-608f82629710'),G_REST,19,4.5,98,['Spicy'],false,'Seogwipo-si, Jeju'),
  q('r-fc-gy-1','gyeongju-chimaek-historic','gyeongju','restaurants','korean-fried-chicken','Gyeongju Historic Town Chimaek','Steps from the royal tumuli. Relaxed vibe, excellent yangnyeom chicken, local craft beer on tap.',I('1569050467447-ce54b3bbc37d'),G_REST,18,4.5,67,['Casual'],false,'Hwangnam-dong, Gyeongju'),
  q('r-fc-gy-2','bomun-chicken-beer-garden','gyeongju','restaurants','korean-fried-chicken','Bomun Chicken & Beer Garden','Outdoor chicken and beer garden near Bomun Lake. Whole fried chicken with three dipping sauces.',I('1562967914-608f82629710'),G_REST,20,4.6,54,['Outdoor'],false,'Bomun-ro, Gyeongju'),
  q('r-fc-jo-1','jeonju-night-market-chicken','jeonju','restaurants','korean-fried-chicken','Jeonju Night Market Fried Chicken','Night-market style chicken stall that\'s been running for 25 years. Paper bag, newspaper, perfect.',I('1569050467447-ce54b3bbc37d'),G_REST,15,4.7,134,['Local Favorite', 'Street Food'],false,'Nambu Market, Jeonju'),
  q('r-fc-jo-2','hanok-alley-crispy-wings','jeonju','restaurants','korean-fried-chicken','Hanok Alley Crispy Wings','Tiny shop in hanok village alleys. Garlic soy wings paired with Jeonju dongdongju rice wine.',I('1562967914-608f82629710'),G_REST,17,4.6,89,['Hidden Gem'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Bars ─── */
  q('r-ba-se-1','itaewon-craft-beer-district','seoul','restaurants','bars','Itaewon Craft Beer District','Seoul\'s most international bar strip. 40+ craft beers on tap, English-speaking staff, live music weekends.',I('1572116469696-31de0f17cc34'),G_REST,35,4.7,298,['International', 'Craft Beer'],false,'Itaewon-ro, Yongsan-gu, Seoul'),
  q('r-ba-se-2','hongdae-underground-bar','seoul','restaurants','bars','Hongdae Underground Bar','Basement cocktail bar with indie DJ nights. House cocktails made with Korean spirits — soju negroni is a must.',I('1514362545857-3bc16c4c7d1b'),G_REST,30,4.6,212,['Trendy', 'Cocktails'],false,'Hongdae, Mapo-gu, Seoul'),
  q('r-ba-bu-1','haeundae-rooftop-bar','busan','restaurants','bars','Haeundae Rooftop Bar','Panoramic rooftop bar overlooking Haeundae Beach. Signature cocktails with Jeju citrus base.',I('1572116469696-31de0f17cc34'),G_REST,40,4.8,187,['Scenic', 'Rooftop'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('r-ba-bu-2','nampo-craft-brewery','busan','restaurants','bars','Nampo Craft Brewery','Busan\'s pioneering craft brewery. Flagship ales brewed on-site, massive industrial interior.',I('1514362545857-3bc16c4c7d1b'),G_REST,28,4.7,156,['Craft Beer', 'Brewery'],false,'Nampo-dong, Jung-gu, Busan'),
  q('r-ba-je-1','jeju-hallasan-makgeolli-bar','jeju','restaurants','bars','Jeju Hallasan Makgeolli Bar','Traditional makgeolli bar with volcanic island versions. 20 types of local rice wine paired with pajeon.',I('1572116469696-31de0f17cc34'),G_REST,22,4.7,134,['Traditional', 'Local Specialty'],false,'Jeju-si, Jeju'),
  q('r-ba-je-2','seogwipo-sunset-cocktail','jeju','restaurants','bars','Seogwipo Sunset Cocktail Lounge','Cliffside cocktail lounge. The sunset hour sees every seat taken — arrive 30 min early.',I('1514362545857-3bc16c4c7d1b'),G_REST,45,4.9,245,['Scenic', 'Cocktails'],false,'Seogwipo-si, Jeju'),
  q('r-ba-gy-1','gyeongju-makgeolli-house','gyeongju','restaurants','bars','Gyeongju Heritage Makgeolli House','Traditional liquor bar in a restored hanok. Gyeongju bread (hwangnam ppang) + local makgeolli pairing.',I('1572116469696-31de0f17cc34'),G_REST,18,4.6,76,['Traditional'],false,'Hwangnam-dong, Gyeongju'),
  q('r-ba-gy-2','bomun-night-bar','gyeongju','restaurants','bars','Bomun Night Bar & Lounge','Lakeside lounge bar with live jazz on weekends. Imported wines and craft soju cocktails.',I('1514362545857-3bc16c4c7d1b'),G_REST,35,4.7,65,['Jazz', 'Lakeside'],false,'Bomun-ro, Gyeongju'),
  q('r-ba-jo-1','jeonju-craft-liquor-bar','jeonju','restaurants','bars','Jeonju Traditional Craft Liquor Bar','Craft bar specialising in traditional Korean spirits — maesil (plum wine), bokbunja (berry wine), and makgeolli.',I('1572116469696-31de0f17cc34'),G_REST,20,4.7,98,['Traditional', 'Local Specialty'],false,'Samcheon-dong, Wansan-gu, Jeonju'),
  q('r-ba-jo-2','hanok-dongdongju-house','jeonju','restaurants','bars','Hanok Village Dongdongju House','Tiny courtyard bar pouring freshly brewed dongdongju rice wine with house-made makgeolli snacks.',I('1514362545857-3bc16c4c7d1b'),G_REST,15,4.8,143,['Traditional', 'Hidden Gem'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Vegetarian ─── */
  q('r-vg-se-1','insadong-temple-food','seoul','restaurants','vegetarian','Insadong Temple Food Restaurant','Buddhist temple cuisine — no garlic, no onion, all umami. A meditative dining experience near Jogyesa temple.',I('1512621776951-a57141f2eefd'),G_REST,32,4.8,178,['Vegan-Friendly', 'Buddhist'],false,'Insadong-gil, Jongno-gu, Seoul'),
  q('r-vg-se-2','mapo-vegan-korean','seoul','restaurants','vegetarian','Mapo Vegan Korean Kitchen','Modern Korean vegan — jackfruit bulgogi, tofu kimchi jjigae, and oat milk sikhye dessert.',I('1546554137-f86b9593a222'),G_REST,25,4.6,134,['Vegan-Friendly', 'Modern'],false,'Mapo-daero, Mapo-gu, Seoul'),
  q('r-vg-bu-1','haeundae-vegan-cafe','busan','restaurants','vegetarian','Haeundae Health & Vegan Café','Beachside vegan café. Acai bowls, Korean-style grain rice plates, and fresh cold-pressed juices.',I('1512621776951-a57141f2eefd'),G_REST,22,4.6,89,['Healthy', 'Organic'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('r-vg-bu-2','busan-buddhist-kitchen','busan','restaurants','vegetarian','Busan Vegetarian Buddhist Kitchen','Authentic temple food by a Buddhist monk near Beomeosa temple. The mushroom dubu jorim is heavenly.',I('1546554137-f86b9593a222'),G_REST,28,4.8,112,['Buddhist', 'Traditional'],false,'Beomeosa-ro, Geumjeong-gu, Busan'),
  q('r-vg-je-1','jeju-organic-farm-table','jeju','restaurants','vegetarian','Jeju Organic Farm Table','On-farm restaurant — vegetables harvested that morning. Menu changes daily with whatever the soil gives.',I('1512621776951-a57141f2eefd'),G_REST,35,4.9,167,['Organic', 'Farm-to-Table'],false,'Aewol-eup, Jeju-si, Jeju'),
  q('r-vg-je-2','seogwipo-plant-kitchen','jeju','restaurants','vegetarian','Seogwipo Plant-Based Kitchen','Jeju\'s best plant-based restaurant. The black bean tangsuyuk (sweet & sour) will convert any meat-lover.',I('1546554137-f86b9593a222'),G_REST,28,4.7,98,['Vegan-Friendly'],false,'Seogwipo-si, Jeju'),
  q('r-vg-gy-1','gyeongju-temple-vegetarian','gyeongju','restaurants','vegetarian','Gyeongju Temple Vegetarian Dining','Set inside a working monastery near Bulguksa. Monks prepare seasonal temple food — reservations essential.',I('1512621776951-a57141f2eefd'),G_REST,35,4.9,134,['Buddhist', 'Unique'],false,'Bulguksa-ro, Gyeongju'),
  q('r-vg-gy-2','silla-plant-kitchen','gyeongju','restaurants','vegetarian','Silla Heritage Plant Kitchen','Modern plant-based café near the Silla museum. Great lotus root chips and buckwheat cold noodles.',I('1546554137-f86b9593a222'),G_REST,22,4.6,67,['Modern', 'Healthy'],false,'Iljeong-ro, Gyeongju'),
  q('r-vg-jo-1','jeonju-fermented-vegan','jeonju','restaurants','vegetarian','Jeonju Fermented Food & Vegan Table','Jeonju\'s love of fermentation shines here — doenjang, kimchi, and ganjang-marinated vegetables.',I('1512621776951-a57141f2eefd'),G_REST,20,4.7,112,['Fermented', 'Traditional'],false,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('r-vg-jo-2','hanok-vegetarian-bibimbap','jeonju','restaurants','vegetarian','Hanok Village Vegetarian Bibimbap','Bibimbap with 12 seasonal vegetables and house gochujang — no meat, full flavour. Famous Instagram spot.',I('1546554137-f86b9593a222'),G_REST,18,4.8,234,['BEST', 'Instagram-Worthy'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Halal ─── */
  q('r-hl-se-1','itaewon-halal-korean-fusion','seoul','restaurants','halal','Itaewon Halal Korean Fusion','Halal-certified Korean BBQ and tteokbokki in the heart of Itaewon\'s Muslim Quarter. English menus.',I('1603133872878-684f208fb84b'),G_REST,30,4.7,234,['Halal Certified', 'Muslim-Friendly'],false,'Itaewon Halal Food Street, Yongsan-gu, Seoul'),
  q('r-hl-se-2','seoul-muslim-restaurant','seoul','restaurants','halal','Seoul Muslim-Friendly Restaurant','KTO-certified halal restaurant near Seoul Central Mosque. Galbi, bulgogi, and bibimbap — all halal.',I('1565557623262-b51c2513a641'),G_REST,28,4.6,178,['Halal Certified'],false,'Usadan-ro, Yongsan-gu, Seoul'),
  q('r-hl-bu-1','busan-halal-kitchen','busan','restaurants','halal','Busan Halal Street Kitchen','Busan\'s most popular halal spot. Korean fried chicken and curry rice certified by KMF.',I('1603133872878-684f208fb84b'),G_REST,22,4.5,98,['Halal Certified'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('r-hl-bu-2','haeundae-muslim-dining','busan','restaurants','halal','Haeundae Muslim Dining','Beachside halal restaurant with panoramic views. Seafood-focused with halal certification.',I('1565557623262-b51c2513a641'),G_REST,35,4.6,112,['Halal Certified', 'Seafood'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('r-hl-je-1','jeju-halal-seafood','jeju','restaurants','halal','Jeju Halal Seafood Restaurant','Fresh Jeju seafood — abalone, hairtail, grilled fish — all halal-prepared. Rare find on the island.',I('1603133872878-684f208fb84b'),G_REST,40,4.7,87,['Halal Certified', 'Seafood'],false,'Jeju-si, Jeju'),
  q('r-hl-je-2','seogwipo-muslim-cafe','jeju','restaurants','halal','Seogwipo Muslim-Friendly Café','Halal snacks, coffee, and Korean fusion bites with ocean views. Prayer room available.',I('1565557623262-b51c2513a641'),G_REST,20,4.5,54,['Halal Certified', 'Prayer Room'],false,'Seogwipo-si, Jeju'),
  q('r-hl-gy-1','gyeongju-halal-experience','gyeongju','restaurants','halal','Gyeongju Halal Korean Experience','Traditional Korean cuisine with halal certification near Gyeongju historic sites.',I('1603133872878-684f208fb84b'),G_REST,25,4.5,43,['Halal Certified'],false,'Hwangnam-dong, Gyeongju'),
  q('r-hl-gy-2','bomun-halal-tea-house','gyeongju','restaurants','halal','Bomun Halal Dining & Tea House','Quiet lakeside halal dining with traditional Korean tea ceremony option.',I('1565557623262-b51c2513a641'),G_REST,30,4.6,38,['Halal Certified', 'Tea Ceremony'],false,'Bomun-ro, Gyeongju'),
  q('r-hl-jo-1','jeonju-halal-kitchen','jeonju','restaurants','halal','Jeonju Halal Traditional Kitchen','Jeonju\'s first halal-certified restaurant serving the famous bibimbap with halal ingredients.',I('1603133872878-684f208fb84b'),G_REST,20,4.6,67,['Halal Certified', 'Bibimbap'],false,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('r-hl-jo-2','hanok-halal-bibimbap','jeonju','restaurants','halal','Hanok Halal Bibimbap Restaurant','Halal bibimbap and doenjang soup in a traditional hanok setting. Muslim travellers highly recommended.',I('1565557623262-b51c2513a641'),G_REST,18,4.7,89,['Halal Certified', 'Must-Try'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ════════════════════════════════════════════════════════════════
     ✨  WELLNESS — Skin Clinic
  ════════════════════════════════════════════════════════════════ */
  q('w-sc-se-2','myeongdong-glow-dermatology','seoul','wellness','skin-clinic','Myeongdong Glow Dermatology','Walk-in-friendly clinic in the shopping district. Express facials, LED therapy, and quick laser peel.',I('1620916566398-39f1143ab7be'),G_WELL,90,4.7,267,['Express', 'Walk-In'],false,'Myeongdong-gil, Jung-gu, Seoul'),
  q('w-sc-se-3','cheongdam-k-beauty-spa','seoul','wellness','skin-clinic','Cheongdam K-Beauty Medical Spa','Luxury medical spa in Cheongdam. Bespoke skin programs, celebrity clientele, same-day consultation.',I('1629909613654-28e377c37b09'),G_WELL,180,4.9,189,['BEST', 'Premium', 'Celebrity'],false,'Cheongdam-dong, Gangnam-gu, Seoul'),
  q('w-sc-bu-1','haeundae-skin-clinic','busan','wellness','skin-clinic','Haeundae Premium Skin Clinic','Busan\'s top dermatology clinic near the beach. Specialises in anti-ageing and whitening treatments.',I('1576091160550-2173dba999ef'),G_WELL,100,4.8,198,['BEST', 'Premium'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-sc-bu-2','seomyeon-beauty-medical','busan','wellness','skin-clinic','Seomyeon Beauty Medical Center','One-stop beauty clinic: skin + hair + laser. English consultation available on request.',I('1620916566398-39f1143ab7be'),G_WELL,80,4.6,145,['English-Staff'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('w-sc-je-1','jeju-volcanic-skin-clinic','jeju','wellness','skin-clinic','Jeju Volcanic Skin Care Clinic','Jeju-exclusive treatments using hallasan volcanic mineral water. Hydration and pore-tightening specialist.',I('1570172619644-dfd03ed5d881'),G_WELL,95,4.8,134,['Local Specialty', 'Unique'],false,'Jeju-si, Jeju'),
  q('w-sc-je-2','seogwipo-anti-aging','jeju','wellness','skin-clinic','Seogwipo Anti-Aging Dermatology','Quiet dermatology clinic in Seogwipo. Wrinkle treatments, filler consultations, English doctor on staff.',I('1629909613654-28e377c37b09'),G_WELL,120,4.7,98,['English-Staff', 'Anti-Aging'],false,'Seogwipo-si, Jeju'),
  q('w-sc-gy-1','gyeongju-healing-skin','gyeongju','wellness','skin-clinic','Gyeongju Healing Skin Center','Holistic skin care combining Korean herbal medicine with modern dermatology. Unique in Korea.',I('1576091160550-2173dba999ef'),G_WELL,85,4.7,76,['Traditional', 'Holistic'],false,'Hwangnam-dong, Gyeongju'),
  q('w-sc-gy-2','bomun-beauty-clinic','gyeongju','wellness','skin-clinic','Bomun Beauty Clinic & Spa','Full-service skin and body clinic near Bomun tourist complex. Hotel-quality service.',I('1620916566398-39f1143ab7be'),G_WELL,100,4.6,65,['Premium'],false,'Bomun-ro, Gyeongju'),
  q('w-sc-jo-1','jeonju-k-beauty-studio','jeonju','wellness','skin-clinic','Jeonju K-Beauty Skin Studio','Modern K-beauty clinic in Jeonju. Glass skin facial, V-line thread lift, affordable pricing.',I('1570172619644-dfd03ed5d881'),G_WELL,75,4.7,89,['Affordable', 'Modern'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),
  q('w-sc-jo-2','hanok-glow-skin-clinic','jeonju','wellness','skin-clinic','Hanok Glow Skin Clinic','Boutique skin clinic in a restored hanok. Specialises in traditional herbal facials and modern peels.',I('1629909613654-28e377c37b09'),G_WELL,80,4.8,112,['Unique', 'Traditional'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Hair Salon ─── */
  q('w-hs-se-1','cheongdam-hair-studio','seoul','wellness','hair-salon','Cheongdam Hair Design Studio','Runway-level cuts and colour at Gangnam\'s most stylish salon. English-speaking designers, no language barrier.',I('1560066984-138daaa70c8f'),G_WELL,120,4.9,312,['BEST', 'English-Staff', 'K-Pop Style'],true,'Cheongdam-dong, Gangnam-gu, Seoul'),
  q('w-hs-se-2','hongdae-kpop-hair','seoul','wellness','hair-salon','Hongdae K-Pop Style Hair','The salon that actually does the looks you see in K-pop videos. Book in advance — always full.',I('1522337360788-8b13dee7a37e'),G_WELL,90,4.8,278,['K-Pop Style', 'Trendy'],false,'Hongdae, Mapo-gu, Seoul'),
  q('w-hs-bu-1','haeundae-hair-color-lab','busan','wellness','hair-salon','Haeundae Hair & Color Lab','Colour specialist near the beach. Experts in balayage, bleach, and vibrant Korean pastel tones.',I('1560066984-138daaa70c8f'),G_WELL,100,4.8,167,['Color Expert', 'Premium'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-hs-bu-2','seomyeon-korean-hair-studio','busan','restaurants','hair-salon','Seomyeon Korean Hair Studio','Full-service salon with English-speaking stylist. Cut, perm, colour — all services available.',I('1522337360788-8b13dee7a37e'),G_WELL,75,4.6,134,['English-Staff'],false,'Seomyeon, Busanjin-gu, Busan'),
  q('w-hs-je-1','jeju-island-hair-style','jeju','wellness','hair-salon','Jeju Island Hair & Style','Relaxed island salon with top-tier Korean styling. Specialises in natural waves and beachy texture.',I('1560066984-138daaa70c8f'),G_WELL,80,4.7,98,['Natural Style'],false,'Jeju-si, Jeju'),
  q('w-hs-je-2','seogwipo-boutique-hair','jeju','wellness','hair-salon','Seogwipo Boutique Hair Salon','Small boutique salon in southern Jeju. Personal attention, bespoke colour, ocean-view waiting area.',I('1522337360788-8b13dee7a37e'),G_WELL,90,4.8,76,['Boutique', 'Scenic'],false,'Seogwipo-si, Jeju'),
  q('w-hs-gy-1','gyeongju-modern-hair','gyeongju','wellness','hair-salon','Gyeongju Traditional & Modern Hair','Half the salon does modern cuts, the other half traditional perms. Unusual mix, great results.',I('1560066984-138daaa70c8f'),G_WELL,65,4.6,54,['Traditional', 'Modern'],false,'Hwangnam-dong, Gyeongju'),
  q('w-hs-gy-2','bomun-premium-hair','gyeongju','wellness','hair-salon','Bomun Premium Hair Design','Upscale hair salon in the Bomun resort area. Full colour treatments and K-drama-worthy styling.',I('1522337360788-8b13dee7a37e'),G_WELL,95,4.7,67,['Premium'],false,'Bomun-ro, Gyeongju'),
  q('w-hs-jo-1','jeonju-trendy-hair','jeonju','wellness','hair-salon','Jeonju Trendy Hair Studio','The most in-demand salon in Jeonju city. Book 2 weeks ahead for weekend slots.',I('1560066984-138daaa70c8f'),G_WELL,70,4.7,98,['Trendy', 'Popular'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),
  q('w-hs-jo-2','hanok-hair-beauty','jeonju','wellness','hair-salon','Hanok Village Hair & Beauty','Hair + makeup studio in the hanok village. Popular for hanbok photoshoot styling packages.',I('1522337360788-8b13dee7a37e'),G_WELL,60,4.8,145,['Hanbok', 'Photo-Ready'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Sauna / Jjimjilbang ─── */
  q('w-sa-se-1','dragon-hill-spa','seoul','wellness','sauna','Dragon Hill Spa & Jjimjilbang','Seoul\'s most famous jjimjilbang — 7 floors, 15+ rooms, rooftop pool, open 24/7. A must-do experience.',I('1519494026892-80bbd2d6fd0d'),G_WELL,25,4.7,456,['HOT', 'Must-Try', '24hr'],true,'Yongsan-gu, Seoul'),
  q('w-sa-se-2','itaewon-luxury-bathhouse','seoul','wellness','sauna','Itaewon Luxury Bathhouse','Foreigner-friendly premium bathhouse. English signage throughout, locker rooms clean and modern.',I('1545579133-99bb5ad189be'),G_WELL,30,4.6,178,['Foreigner-Friendly', 'Modern'],false,'Itaewon-ro, Yongsan-gu, Seoul'),
  q('w-sa-bu-1','haeundae-spaland','busan','wellness','sauna','Haeundae Spa Land','Busan\'s largest and most famous spa — 22 themed rooms in Shinsegae Department Store.',I('1519494026892-80bbd2d6fd0d'),G_WELL,18,4.8,567,['BEST', 'Iconic'],true,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-sa-bu-2','busan-grand-jjimjilbang','busan','wellness','sauna','Busan Grand Jjimjilbang','Old-school Korean jjimjilbang near Busan station. Authentic, affordable, loved by locals.',I('1545579133-99bb5ad189be'),G_WELL,12,4.5,134,['Budget-Friendly', 'Local Favourite'],false,'Dong-gu, Busan'),
  q('w-sa-je-1','jeju-volcanic-hot-spring','jeju','wellness','sauna','Jeju Volcanic Hot Spring Spa','Natural hot spring fed by volcanic groundwater. Outdoor pools with Hallasan mountain views.',I('1519494026892-80bbd2d6fd0d'),G_WELL,28,4.9,234,['BEST', 'Natural Spring', 'Scenic'],true,'Jeju-si, Jeju'),
  q('w-sa-je-2','seogwipo-mineral-sauna','jeju','wellness','sauna','Seogwipo Natural Mineral Sauna','Rich in natural minerals from Jeju bedrock. Skin-softening waters popular with local elders.',I('1545579133-99bb5ad189be'),G_WELL,22,4.7,98,['Natural Spring'],false,'Seogwipo-si, Jeju'),
  q('w-sa-gy-1','gyeongju-bomun-hot-spring','gyeongju','wellness','sauna','Gyeongju Bomun Hot Spring','Hotel-grade hot spring facility open to non-guests. The jade sauna room is a standout.',I('1519494026892-80bbd2d6fd0d'),G_WELL,20,4.7,89,['Hot Spring'],false,'Bomun-ro, Gyeongju'),
  q('w-sa-gy-2','silla-heritage-spa','gyeongju','wellness','sauna','Silla Heritage Spa & Bath','Themed around ancient Silla royalty. Jjimjilbang rooms named after Silla queens and kings.',I('1545579133-99bb5ad189be'),G_WELL,25,4.6,67,['Cultural', 'Themed'],false,'Bomun-ro, Gyeongju'),
  q('w-sa-jo-1','jeonju-hanok-wellness-bath','jeonju','wellness','sauna','Jeonju Hanok Wellness Bath','Jjimjilbang designed in traditional hanok style. Cedar sauna, jade room, and herbal bath.',I('1519494026892-80bbd2d6fd0d'),G_WELL,18,4.7,112,['Traditional', 'Hanok-Style'],false,'Wansan-gu, Jeonju'),
  q('w-sa-jo-2','deokjin-jjimjilbang','jeonju','wellness','sauna','Deokjin Park Jjimjilbang','Affordable neighbourhood jjimjilbang popular with families. Clean, friendly staff, basic sauna done right.',I('1545579133-99bb5ad189be'),G_WELL,12,4.5,78,['Budget-Friendly', 'Family'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),

  /* ─── Massage ─── */
  q('w-ms-se-1','gangnam-premium-massage','seoul','wellness','massage','Gangnam Premium Thai & Korean Massage','Award-winning massage studio. Thai + Korean hybrid technique by certified therapists. Private rooms.',I('1544161515-4ab6ce6db874'),G_WELL,80,4.9,389,['BEST', 'Premium', 'English-Staff'],true,'Gangnam-daero, Gangnam-gu, Seoul'),
  q('w-ms-se-2','myeongdong-relaxation','seoul','wellness','massage','Myeongdong Relaxation Center','Walk-in friendly massage in the shopping district. 30/60/90 min options. Excellent value.',I('1559599238-308793637427'),G_WELL,55,4.6,234,['Walk-In', 'Value'],false,'Myeongdong-gil, Jung-gu, Seoul'),
  q('w-ms-bu-1','haeundae-ocean-massage','busan','wellness','massage','Haeundae Ocean Breeze Massage','Seaside massage studio with ocean sounds playing throughout. Deep tissue and hot stone specialties.',I('1544161515-4ab6ce6db874'),G_WELL,70,4.8,198,['Scenic', 'Deep Tissue'],false,'Haeundae-ro, Haeundae-gu, Busan'),
  q('w-ms-bu-2','nampo-wellness-studio','busan','wellness','massage','Nampo Wellness Massage Studio','Affordable full-body massage near Nampo-dong market. Quick sessions available for busy travellers.',I('1559599238-308793637427'),G_WELL,45,4.6,145,['Affordable'],false,'Nampo-dong, Jung-gu, Busan'),
  q('w-ms-je-1','jeju-botanical-spa','jeju','wellness','massage','Jeju Botanical Spa & Massage','Aromatherapy massage using Jeju-grown green tea and citrus essential oils. Nature-inspired retreat.',I('1544161515-4ab6ce6db874'),G_WELL,90,4.9,212,['BEST', 'Aromatherapy', 'Organic'],true,'Aewol-eup, Jeju-si, Jeju'),
  q('w-ms-je-2','seogwipo-citrus-spa','jeju','wellness','massage','Seogwipo Citrus Aromatherapy Spa','Hallabong mandarin massage oil — only possible in Jeju. Couples room available.',I('1559599238-308793637427'),G_WELL,75,4.8,134,['Unique', 'Couples'],false,'Seogwipo-si, Jeju'),
  q('w-ms-gy-1','gyeongju-royal-massage','gyeongju','wellness','massage','Gyeongju Royal Heritage Massage','Massage inspired by Silla-era royal wellness practices. Unique herbal compress technique.',I('1544161515-4ab6ce6db874'),G_WELL,65,4.7,87,['Cultural', 'Traditional'],false,'Hwangnam-dong, Gyeongju'),
  q('w-ms-gy-2','bomun-lake-spa','gyeongju','wellness','massage','Bomun Lake Relaxation Spa','Lake-view massage rooms. Couples and individual packages with free hot spring access after session.',I('1559599238-308793637427'),G_WELL,80,4.7,76,['Scenic', 'Couples'],false,'Bomun-ro, Gyeongju'),
  q('w-ms-jo-1','jeonju-traditional-massage','jeonju','wellness','massage','Jeonju Traditional Korean Massage','Dry Korean-style massage (an-ma) by third-generation masseurs. Strong pressure, complete relaxation.',I('1544161515-4ab6ce6db874'),G_WELL,50,4.8,134,['Traditional', 'Deep Pressure'],false,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('w-ms-jo-2','hanok-body-mind-spa','jeonju','restaurants','massage','Hanok Village Body & Mind Spa','Spa inside a renovated hanok building. Scented candles, hanji paper décor, and full-body oil massage.',I('1559599238-308793637427'),G_WELL,65,4.7,98,['Boutique', 'Hanok-Style'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ════════════════════════════════════════════════════════════════
     🎯  ACTIVITIES — Local Experience
  ════════════════════════════════════════════════════════════════ */
  q('a-le-se-1','bukchon-hanok-walking-tour','seoul','activities','local-experience','Bukchon Hanok Village Walking Tour','Explore the 600-year-old hanok alleys with a local guide. Hanbok rental included for photo stops.',I('1549488697-deead16fbe9b'),G_ACT,45,4.8,312,['HOT', 'English Guide', 'Hanbok'],false,'Bukchon-ro, Jongno-gu, Seoul'),
  q('a-le-se-2','hongdae-street-art-tour','seoul','activities','local-experience','Hongdae Street Art & Nightlife Tour','Evening tour of Seoul\'s youth culture district — street artists, hidden bars, K-indie music venues.',I('1566552881560-0be862a7c445'),G_ACT,40,4.7,234,['Evening', 'Youth Culture'],false,'Hongdae, Mapo-gu, Seoul'),
  q('a-le-bu-1','gamcheon-culture-village','busan','activities','local-experience','Gamcheon Culture Village Tour','The "Machu Picchu of Busan" — colourful hillside village with art installations and stunning views.',I('1549488697-deead16fbe9b'),G_ACT,35,4.8,445,['BEST', 'Instagram-Worthy'],true,'Gamcheon-dong, Saha-gu, Busan'),
  q('a-le-bu-2','busan-fish-market-tour','busan','activities','local-experience','Busan Fish Market & Harbor Experience','Morning trip to Jagalchi fish market with a local fisherman guide. Watch auctions, taste raw fish.',I('1566552881560-0be862a7c445'),G_ACT,50,4.8,267,['Authentic', 'Morning Tour'],false,'Jagalchi Market, Jung-gu, Busan'),
  q('a-le-je-1','hallasan-haenyeo-experience','jeju','activities','local-experience','Hallasan Haenyeo Cultural Experience','Meet real haenyeo divers, hear their stories, and try basic freediving techniques in supervised waters.',I('1549488697-deead16fbe9b'),G_ACT,65,4.9,198,['BEST', 'Unique', 'Cultural'],true,'Seogwipo-si, Jeju'),
  q('a-le-je-2','seongsan-sunrise-hike','jeju','activities','local-experience','Seongsan Sunrise Peak Guided Hike','Wake up at 5am to witness Jeju\'s famous sunrise from the UNESCO crater rim. Worth every step.',I('1566552881560-0be862a7c445'),G_ACT,40,4.9,334,['HOT', 'UNESCO', 'Sunrise'],false,'Seongsan-eup, Seogwipo-si, Jeju'),
  q('a-le-gy-1','royal-tumuli-heritage-walk','gyeongju','activities','local-experience','Royal Tumuli & Silla Heritage Walk','Walk among the ancient burial mounds of Silla kings. Expert historian guide, includes Anapji Pond.',I('1549488697-deead16fbe9b'),G_ACT,45,4.8,178,['Historical', 'UNESCO'],false,'Hwangnam-dong, Gyeongju'),
  q('a-le-gy-2','gyeongju-night-cycling','gyeongju','activities','local-experience','Gyeongju Night Cycling Tour','Cycle past lit-up ancient tumuli, pagodas, and temples after dark. Magical and unforgettable.',I('1566552881560-0be862a7c445'),G_ACT,35,4.8,145,['Unique', 'Night Tour'],false,'Gyeongju'),
  q('a-le-jo-1','jeonju-hanbok-village-tour','jeonju','activities','local-experience','Jeonju Hanbok & Village Experience','Dress in traditional hanbok and explore the 800-house hanok village with a cultural storyteller.',I('1549488697-deead16fbe9b'),G_ACT,40,4.9,289,['BEST', 'Hanbok', 'Cultural'],true,'Gyo-dong, Wansan-gu, Jeonju'),
  q('a-le-jo-2','jeonju-craft-tour','jeonju','activities','local-experience','Jeonju Traditional Craft Tour','Visit three artisan workshops — hanji (paper), fan-making, and lacquerware. Create your own souvenir.',I('1566552881560-0be862a7c445'),G_ACT,38,4.7,134,['Artisan', 'Craft'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Cooking Classes ─── */
  q('a-cc-se-2','seoul-street-food-workshop','seoul','activities','cooking-classes','K-Street Food Cooking Workshop','Master tteokbokki, odeng, and hotteok in a lively street-food-inspired kitchen. No experience needed.',I('1466637574441-749b8f19452f'),G_ACT,50,4.8,212,['HOT', 'Beginner-Friendly'],false,'Insadong, Jongno-gu, Seoul'),
  q('a-cc-se-3','seoul-tteok-making-class','seoul','activities','cooking-classes','Seoul Tteok (Rice Cake) Making Class','Learn to make 5 types of traditional Korean rice cakes with a master tteok artisan. Take home your creations.',I('1547592180-85f173990554'),G_ACT,45,4.7,167,['Traditional', 'Take-Home'],false,'Nakwon-dong, Jongno-gu, Seoul'),
  q('a-cc-bu-1','busan-seafood-cooking','busan','activities','cooking-classes','Busan Seafood & Doenjang Cooking','Cook iconic Busan dishes — haemul pajeon (seafood pancake), sundubu jjigae — with local ingredients.',I('1466637574441-749b8f19452f'),G_ACT,55,4.8,156,['Local Specialty', 'Seafood'],false,'Haeundae-gu, Busan'),
  q('a-cc-bu-2','busan-pajeon-makgeolli','busan','activities','cooking-classes','Busan Pajeon & Makgeolli Class','Make the perfect Korean pancake and pair it with homemade makgeolli rice wine. Fun for all ages.',I('1547592180-85f173990554'),G_ACT,40,4.7,112,['Fun', 'Pairs Well'],false,'Nampo-dong, Jung-gu, Busan'),
  q('a-cc-je-1','jeju-black-pork-cooking','jeju','activities','cooking-classes','Jeju Black Pork Cooking Experience','Learn to prepare Jeju\'s prized black pig from scratch — seasoning, grilling, and proper ssam wrapping.',I('1466637574441-749b8f19452f'),G_ACT,70,4.9,198,['BEST', 'Local Specialty'],true,'Doma-ro, Jeju-si, Jeju'),
  q('a-cc-je-2','jeju-seasonal-food-class','jeju','activities','cooking-classes','Jeju Citrus & Seasonal Food Class','Jeju hallabong jam, citrus chicken, and seasonal side dishes using farm-fresh Jeju produce.',I('1547592180-85f173990554'),G_ACT,55,4.8,134,['Seasonal', 'Local Produce'],false,'Aewol-eup, Jeju-si, Jeju'),
  q('a-cc-gy-1','gyeongju-royal-cuisine-class','gyeongju','activities','cooking-classes','Gyeongju Silla Royal Cuisine Class','Recreate ancient Silla banquet dishes. Hands-on with a culinary history professor as your guide.',I('1466637574441-749b8f19452f'),G_ACT,65,4.8,87,['Historical', 'Unique'],false,'Gyeongju'),
  q('a-cc-gy-2','gyeongju-rice-wine-making','gyeongju','activities','cooking-classes','Gyeongju Traditional Rice Wine Making','Brew your own Gyeongju beopju (traditional rice wine) — a UNESCO Intangible Heritage product.',I('1547592180-85f173990554'),G_ACT,55,4.7,76,['UNESCO', 'Craft'],false,'Gyeongju'),
  q('a-cc-jo-1','jeonju-bibimbap-masterclass','jeonju','activities','cooking-classes','Jeonju Bibimbap Cooking Masterclass','Cook the real Jeonju bibimbap with 30 toppings — from the home of bibimbap. Certificate awarded.',I('1466637574441-749b8f19452f'),G_ACT,60,4.9,267,['BEST', 'Certificate'],true,'Pungnam-ro, Wansan-gu, Jeonju'),
  q('a-cc-jo-2','jeonju-fermented-workshop','jeonju','activities','cooking-classes','Jeonju Fermented Food Workshop','Make kimchi, ganjang (soy sauce), and doenjang — Jeonju\'s world-famous fermentation traditions.',I('1547592180-85f173990554'),G_ACT,50,4.8,145,['Traditional', 'Fermentation'],false,'Wansan-gu, Jeonju'),

  /* ─── Traditional Cultural Tours ─── */
  q('a-tc-se-1','gyeongbokgung-hanbok-tour','seoul','activities','traditional-cultural-tours','Gyeongbokgung Palace & Hanbok Tour','Full guided tour of the main Joseon palace in traditional hanbok. Guard changing ceremony included.',I('1535192952584-91d9cf7e1c0e'),G_ACT,50,4.8,456,['HOT', 'Hanbok', 'UNESCO'],true,'Gyeongbokgung, Jongno-gu, Seoul'),
  q('a-tc-se-2','namsan-seoul-history-walk','seoul','activities','traditional-cultural-tours','Namsan Tower & Seoul History Walk','From ancient fortress walls to N Seoul Tower — a journey through 2,000 years of Seoul history.',I('1582979512210-99b6a53386f9'),G_ACT,40,4.7,267,['Historical', 'Walking Tour'],false,'Namsan, Jung-gu, Seoul'),
  q('a-tc-bu-1','beomeosa-templestay','busan','activities','traditional-cultural-tours','Busan Templestay at Beomeo-sa','Overnight or day templestay at 1,300-year-old Beomeo-sa. Meditation, chanting, and temple food.',I('1535192952584-91d9cf7e1c0e'),G_ACT,65,4.9,189,['BEST', 'Templestay', 'Spiritual'],true,'Beomeosa-ro, Geumjeong-gu, Busan'),
  q('a-tc-bu-2','biff-square-culture-walk','busan','activities','traditional-cultural-tours','BIFF Square Busan Culture Walk','From traditional Nampodong to modern film festival grounds — Busan\'s cultural evolution in one walk.',I('1582979512210-99b6a53386f9'),G_ACT,35,4.6,134,['Cultural', 'Film'],false,'Nampo-dong, Jung-gu, Busan'),
  q('a-tc-je-1','jeju-stone-park-tour','jeju','activities','traditional-cultural-tours','Jeju Stone Park & Mythology Tour','Learn Jeju\'s unique Samseong (Three Clans) creation mythology at the open-air stone sculpture park.',I('1535192952584-91d9cf7e1c0e'),G_ACT,40,4.7,134,['Cultural', 'Mythology'],false,'Jeju-si, Jeju'),
  q('a-tc-je-2','hallasan-shaman-experience','jeju','activities','traditional-cultural-tours','Hallasan Shaman Culture Experience','Meet a Jeju shaman (manshin) and participate in a traditional gut ceremony. Rare and profound.',I('1582979512210-99b6a53386f9'),G_ACT,55,4.8,98,['Unique', 'Spiritual'],false,'Jeju'),
  q('a-tc-gy-1','bulguksa-seokguram-tour','gyeongju','activities','traditional-cultural-tours','Bulguksa Temple & Seokguram Grotto Tour','UNESCO World Heritage site tour with expert art historian guide. The pinnacle of Korean Buddhism.',I('1535192952584-91d9cf7e1c0e'),G_ACT,55,4.9,312,['BEST', 'UNESCO', 'Must-Do'],true,'Bulguksa-ro, Gyeongju'),
  q('a-tc-gy-2','anapji-silla-night-tour','gyeongju','activities','traditional-cultural-tours','Anapji Pond Silla Kingdom Night Tour','Evening guided tour of the illuminated royal garden pond. Ancient splendour after dark.',I('1582979512210-99b6a53386f9'),G_ACT,35,4.8,189,['Night Tour', 'Scenic'],false,'Wolseong-ro, Gyeongju'),
  q('a-tc-jo-1','jeonju-artisan-hanok-tour','jeonju','activities','traditional-cultural-tours','Jeonju Hanok Village Artisan Tour','Meet master artisans of hanji, pottery, and traditional music inside a living hanok village.',I('1535192952584-91d9cf7e1c0e'),G_ACT,40,4.8,178,['Artisan', 'Cultural'],false,'Gyo-dong, Wansan-gu, Jeonju'),
  q('a-tc-jo-2','jeonju-paper-making-class','jeonju','activities','traditional-cultural-tours','Jeonju Paper Making & Craft Class','Make traditional hanji paper and create a souvenir notebook. UNESCO Intangible Heritage craft.',I('1582979512210-99b6a53386f9'),G_ACT,38,4.7,134,['Craft', 'UNESCO'],false,'Gyo-dong, Wansan-gu, Jeonju'),

  /* ─── Sports ─── */
  q('a-sp-se-1','han-river-kayaking','seoul','activities','sports','Han River Kayaking & Cycling','Kayak on the Han River then cycle along the riverside path. Equipment and guide included.',I('1574680096145-d05b474e2155'),G_ACT,45,4.7,178,['HOT', 'Outdoor'],false,'Banpo Hangang Park, Seoul'),
  q('a-sp-se-2','seoul-esports-experience','seoul','activities','sports','Seoul E-Sports & PC Bang Experience','Visit a professional esports arena, watch a live match, and play in a premium PC bang. The full gamer package.',I('1571019613454-1cb2f99b2d8b'),G_ACT,35,4.7,234,['Unique', 'Gaming'],false,'Jongno-gu, Seoul'),
  q('a-sp-bu-1','busan-surf-lessons','busan','activities','sports','Busan Surfing Lessons at Songjeong','Korea\'s best surf beach. 2-hour beginner lesson with certified instructor. Board and wetsuit included.',I('1574680096145-d05b474e2155'),G_ACT,60,4.8,267,['BEST', 'Beginner-Friendly', 'Beach'],true,'Songjeong Beach, Haeundae-gu, Busan'),
  q('a-sp-bu-2','gwangalli-night-run','busan','activities','sports','Gwangalli Night Marathon & Running','Guided night run along Gwangalli Beach with the illuminated bridge as backdrop. All levels welcome.',I('1571019613454-1cb2f99b2d8b'),G_ACT,30,4.7,112,['Night', 'Running'],false,'Gwangalli Beach, Suyeong-gu, Busan'),
  q('a-sp-je-1','jeju-scuba-diving','jeju','activities','sports','Jeju Scuba Diving & Snorkeling','Crystal-clear Jeju waters — dive with haenyeo divers, spot tropical fish and underwater lava formations.',I('1574680096145-d05b474e2155'),G_ACT,85,4.9,198,['BEST', 'Diving', 'Nature'],true,'Seogwipo-si, Jeju'),
  q('a-sp-je-2','jeju-horseback-riding','jeju','activities','sports','Jeju Horseback Riding Tour','Jeju is famous for its horses. Trail ride through volcanic farmland with Hallasan mountain views.',I('1571019613454-1cb2f99b2d8b'),G_ACT,65,4.8,156,['Nature', 'Beginner-Friendly'],false,'Jeju'),
  q('a-sp-gy-1','gyeongju-bike-tour','gyeongju','activities','sports','Gyeongju Bike Tour of Ancient Ruins','Cycle between Silla tombs, temples, and UNESCO sites. The flattest and most scenic city bike tour in Korea.',I('1574680096145-d05b474e2155'),G_ACT,35,4.8,145,['HOT', 'Cycling', 'UNESCO'],false,'Gyeongju'),
  q('a-sp-gy-2','bomun-pedal-boat','gyeongju','activities','sports','Bomun Lake Pedal Boat & Leisure','Relaxed pedal boat rental on Bomun Lake. Gentle exercise with beautiful mountain and lake views.',I('1571019613454-1cb2f99b2d8b'),G_ACT,20,4.5,87,['Family-Friendly', 'Relaxed'],false,'Bomun-ro, Gyeongju'),
  q('a-sp-jo-1','jeonju-traditional-archery','jeonju','activities','sports','Jeonju Archery & Traditional Sports','Try Korean traditional archery (gungdo) and ssireum wrestling in a purpose-built cultural sports park.',I('1574680096145-d05b474e2155'),G_ACT,30,4.7,98,['Traditional', 'Cultural'],false,'Wansan-gu, Jeonju'),
  q('a-sp-jo-2','deokjin-trail-running','jeonju','activities','sports','Deokjin Park Trail Running & Hiking','Morning trail run through the lotus-covered park with certified running coach. Group runs every weekend.',I('1571019613454-1cb2f99b2d8b'),G_ACT,25,4.6,67,['Running', 'Morning'],false,'Deokjin-dong, Deokjin-gu, Jeonju'),

  /* ════════════════════════════════════════════════════════════════
     💡  TIPS & TREND — Travel Tips
  ════════════════════════════════════════════════════════════════ */
  q('t-tt-se-1','seoul-essential-apps','seoul','tips-and-trend','travel-tips','Essential Apps Every Seoul Traveler Needs','Naver Map, KakaoTaxi, Coupang Eats, Papago — the 10 apps that make Seoul life effortless.',I('1501785888041-af3ef285b470'),G_TIPS,0,0,0,['Guide', 'Essential']),
  q('t-tt-se-2','seoul-budget-travel','seoul','tips-and-trend','travel-tips','Seoul on a Budget: Best Free Things To Do','Free palaces, free hiking, free museums — how to spend an amazing week in Seoul for under $50/day.',I('1476514525535-07fb3b4ae5f1'),G_TIPS,0,0,0,['Budget', 'Free']),
  q('t-tt-bu-1','busan-first-timers-guide','busan','tips-and-trend','travel-tips','Busan Travel Guide for First-Timers','Everything you need to know before visiting Busan — neighborhoods, beaches, transport, and food.',I('1501785888041-af3ef285b470'),G_TIPS,0,0,0,['Guide', 'Beginner']),
  q('t-tt-bu-2','busan-best-neighborhoods','busan','tips-and-trend','travel-tips','Best Neighborhoods to Stay in Busan','Haeundae for beach lovers, Nampo for foodies, Seomyeon for nightlife — pick your Busan base.',I('1476514525535-07fb3b4ae5f1'),G_TIPS,0,0,0,['Guide', 'Accommodation']),
  q('t-tt-je-1','jeju-car-rental-guide','jeju','tips-and-trend','travel-tips','How to Rent a Car in Jeju Island','International license, best rental companies, insurance tips, and driving rules in Jeju explained.',I('1501785888041-af3ef285b470'),G_TIPS,0,0,0,['Guide', 'Driving']),
  q('t-tt-je-2','jeju-3-day-itinerary','jeju','tips-and-trend','travel-tips','Jeju Island 3-Day Itinerary Guide','The perfect 3-day plan covering both coasts, Hallasan, Seongsan, and the best food stops.',I('1476514525535-07fb3b4ae5f1'),G_TIPS,0,0,0,['Itinerary', 'Guide']),
  q('t-tt-gy-1','gyeongju-day-trip-guide','gyeongju','tips-and-trend','travel-tips','Gyeongju Day Trip Guide from Seoul','2.5 hours by KTX — how to plan the perfect day trip to see Bulguksa, tumuli, and back by dinner.',I('1501785888041-af3ef285b470'),G_TIPS,0,0,0,['Day Trip', 'KTX']),
  q('t-tt-gy-2','best-time-visit-gyeongju','gyeongju','tips-and-trend','travel-tips','Best Time to Visit Gyeongju','Cherry blossoms in spring, starry skies in autumn — when to visit and what to expect each season.',I('1476514525535-07fb3b4ae5f1'),G_TIPS,0,0,0,['Seasonal', 'Guide']),
  q('t-tt-jo-1','jeonju-hanok-complete-guide','jeonju','tips-and-trend','travel-tips','Jeonju Hanok Village Complete Guide','Map, top food stops, hanbok rental spots, and hidden alleys — the definitive Jeonju travel guide.',I('1501785888041-af3ef285b470'),G_TIPS,0,0,0,['Guide', 'Comprehensive']),
  q('t-tt-jo-2','jeonju-ktx-vs-bus','jeonju','tips-and-trend','travel-tips','Getting to Jeonju from Seoul: KTX vs Bus','KTX is faster, express bus is cheaper — we break down both options with times, costs, and tips.',I('1476514525535-07fb3b4ae5f1'),G_TIPS,0,0,0,['Transport', 'Guide']),

  /* ─── Trend Now ─── */
  q('t-tn-se-1','seoul-hottest-cafes-2026','seoul','tips-and-trend','trend-now','Seoul\'s Hottest New Café Districts 2026','Seongsu-dong, Mangwon, Euljiro — the café neighbourhoods taking over Seoul right now.',I('1540575467063-178a50c2df87'),G_TIPS,0,0,0,['Trending', 'Cafés']),
  q('t-tn-se-2','kpop-filming-locations','seoul','tips-and-trend','trend-now','K-Pop & K-Drama Filming Locations in Seoul','From Goblin alleys to BTS photoshoot spots — the ultimate fan location guide for Seoul.',I('1522337660859-02fbefca4702'),G_TIPS,0,0,0,['K-Pop', 'K-Drama', 'Fan']),
  q('t-tn-bu-1','busan-coolest-city','busan','tips-and-trend','trend-now','Why Busan is Korea\'s Coolest City Right Now','Surf culture, indie music, rooftop cafés, and international art festivals — Busan\'s golden era.',I('1540575467063-178a50c2df87'),G_TIPS,0,0,0,['Trending']),
  q('t-tn-bu-2','busan-arts-culture-scene','busan','tips-and-trend','trend-now','Busan\'s Emerging Arts & Culture Scene','From the UN Memorial Park to Busan Museum of Art — a new generation of Busan creatives.',I('1522337660859-02fbefca4702'),G_TIPS,0,0,0,['Arts', 'Culture']),
  q('t-tn-je-1','jeju-digital-nomad','jeju','tips-and-trend','trend-now','Jeju\'s Digital Nomad Paradise: Work & Travel','Jeju is now Korea\'s top remote work destination — co-working cafés, fast internet, nature.',I('1540575467063-178a50c2df87'),G_TIPS,0,0,0,['Digital Nomad', 'Remote Work']),
  q('t-tn-je-2','jeju-ocean-view-cafes','jeju','tips-and-trend','trend-now','Jeju\'s Trendy Cafés with Ocean Views','Curved glass buildings on cliff edges, matcha lattes with Hallasan views — Jeju café culture.',I('1522337660859-02fbefca4702'),G_TIPS,0,0,0,['Cafés', 'Scenic']),
  q('t-tn-gy-1','gyeongju-aesthetic-2026','gyeongju','tips-and-trend','trend-now','The Aesthetic Appeal of Gyeongju in 2026','Why photographers and creatives are flocking to Gyeongju — cherry blossom, ancient stone, golden hour.',I('1540575467063-178a50c2df87'),G_TIPS,0,0,0,['Photography', 'Aesthetic']),
  q('t-tn-gy-2','gyeongju-new-hot-destination','gyeongju','tips-and-trend','trend-now','Why Gyeongju is the New Hot Destination','Slow travel, heritage tourism, and Instagram magic — Gyeongju\'s quiet rise to fame.',I('1522337660859-02fbefca4702'),G_TIPS,0,0,0,['Trending', 'Slow Travel']),
  q('t-tn-jo-1','jeonju-street-food-instagram','jeonju','tips-and-trend','trend-now','Jeonju\'s Instagram-Worthy Street Food Scene','Chocolate makgeolli, rainbow tteokbokki, giant hotteok — Jeonju food is made for the camera.',I('1540575467063-178a50c2df87'),G_TIPS,0,0,0,['Food', 'Instagram']),
  q('t-tn-jo-2','jeonju-food-capital-2026','jeonju','tips-and-trend','trend-now','Jeonju: Korea\'s Food Capital for 2026','Named top food city by multiple travel outlets — why every Korean foodie is making the pilgrimage.',I('1522337660859-02fbefca4702'),G_TIPS,0,0,0,['Food', 'Trending']),

  /* ─── Smoking Spots ─── */
  q('t-ss-se-1','myeongdong-smoking-areas','seoul','tips-and-trend','smoking-spots','Official Smoking Areas in Myeongdong','Map of all designated smoking zones in the Myeongdong shopping district. Updated 2026.',I('1529156069898-49953e39b3ac'),G_TIPS,0,0,0,['Map', 'Guide']),
  q('t-ss-se-2','hongdae-sinchon-smoking','seoul','tips-and-trend','smoking-spots','Where to Smoke Near Hongdae & Sinchon','Night-out guide to designated smoking areas in Seoul\'s youth districts — no fines, no trouble.',I('1482938289607-e9573fc25ebb'),G_TIPS,0,0,0,['Map', 'Night Out']),
  q('t-ss-bu-1','haeundae-smoking-zones','busan','tips-and-trend','smoking-spots','Smoking Areas Near Haeundae Beach','All designated zones near the beach strip, hotels, and BEXCO convention center.',I('1529156069898-49953e39b3ac'),G_TIPS,0,0,0,['Map', 'Beach Area']),
  q('t-ss-bu-2','busan-station-smoking','busan','tips-and-trend','smoking-spots','Busan Station & Seomyeon Smoking Zones','Pocket guide to smoking areas in Busan\'s two busiest transit hubs. Avoid hefty fines.',I('1482938289607-e9573fc25ebb'),G_TIPS,0,0,0,['Map', 'Transit']),
  q('t-ss-je-1','jeju-city-smoking-spots','jeju','tips-and-trend','smoking-spots','Designated Smoking Spots in Jeju City','Jeju city centre smoking zones near the airport, tourist street, and harbour.',I('1529156069898-49953e39b3ac'),G_TIPS,0,0,0,['Map', 'Guide']),
  q('t-ss-je-2','jeju-tourist-smoking-rules','jeju','tips-and-trend','smoking-spots','Smoking Rules & Areas for Jeju Tourists','Jeju has strict outdoor smoking rules. Know before you go — fines can reach ₩100,000.',I('1482938289607-e9573fc25ebb'),G_TIPS,0,0,0,['Rules', 'Important']),
  q('t-ss-gy-1','gyeongju-historic-smoking','gyeongju','tips-and-trend','smoking-spots','Smoking Areas Near Gyeongju Historic Sites','Smoking is strictly prohibited near UNESCO heritage sites — find the nearest legal zones.',I('1529156069898-49953e39b3ac'),G_TIPS,0,0,0,['Map', 'UNESCO Area']),
  q('t-ss-gy-2','gyeongju-tourist-smoking-guide','gyeongju','tips-and-trend','smoking-spots','Gyeongju Tourist Smoking Zone Guide','Full map of smoking zones for visitors to the Gyeongju Historic Zone.',I('1482938289607-e9573fc25ebb'),G_TIPS,0,0,0,['Map', 'Guide']),
  q('t-ss-jo-1','jeonju-hanok-smoking','jeonju','tips-and-trend','smoking-spots','Smoking Spots in Jeonju Hanok Village Area','Fire risk is high in the hanok village — designated smoking spots are at the periphery.',I('1529156069898-49953e39b3ac'),G_TIPS,0,0,0,['Map', 'Important']),
  q('t-ss-jo-2','jeonju-smoking-zone-map','jeonju','tips-and-trend','smoking-spots','Jeonju City Smoking Zone Map','Comprehensive guide to Jeonju\'s official smoking areas by district.',I('1482938289607-e9573fc25ebb'),G_TIPS,0,0,0,['Map', 'Guide']),

  /* ─── Public Transportation ─── */
  q('t-pt-se-2','seoul-airport-limousine-bus','seoul','tips-and-trend','public-transportation','Seoul Airport Limousine Bus Guide','All limousine bus routes from Incheon & Gimpo airports — stops, costs, and exact times.',I('1555993539-1732b0258235'),G_TIPS,0,0,0,['Airport', 'Guide']),
  q('t-pt-se-3','kakao-taxi-map-guide','seoul','tips-and-trend','public-transportation','How to Use KakaoTaxi & Kakao Map in Seoul','Step-by-step guide to calling taxis and navigating Seoul with Kakao apps — even without Korean.',I('1554041839-bc64b14f30a5'),G_TIPS,0,0,0,['App', 'Guide']),
  q('t-pt-bu-1','busan-metro-guide','busan','tips-and-trend','public-transportation','Busan Metro System Guide for Tourists','4 lines, 90+ stations — how to navigate Busan by subway with T-money card tips.',I('1555993539-1732b0258235'),G_TIPS,0,0,0,['Subway', 'Guide']),
  q('t-pt-bu-2','busan-transport-comparison','busan','tips-and-trend','public-transportation','Getting Around Busan: Bus vs Metro vs Taxi','Cost and time comparison for getting between Busan\'s main districts. When to choose what.',I('1554041839-bc64b14f30a5'),G_TIPS,0,0,0,['Comparison', 'Guide']),
  q('t-pt-je-1','jeju-without-car','jeju','tips-and-trend','public-transportation','Getting Around Jeju Without a Car','Bus routes, taxi apps, and e-scooters — it\'s possible to explore Jeju without renting a car.',I('1555993539-1732b0258235'),G_TIPS,0,0,0,['Bus', 'Budget']),
  q('t-pt-je-2','jeju-coastal-bus-route','jeju','tips-and-trend','public-transportation','Jeju Bus 810 & 820: Coastal Route Guide','The two circular coastal bus routes that cover almost every tourist spot in Jeju.',I('1554041839-bc64b14f30a5'),G_TIPS,0,0,0,['Bus', 'Scenic']),
  q('t-pt-gy-1','gyeongju-getting-around','gyeongju','tips-and-trend','public-transportation','Getting to Gyeongju & Moving Around','KTX from Seoul (2h), then bus or taxi to sites. Complete transport guide for Gyeongju visitors.',I('1555993539-1732b0258235'),G_TIPS,0,0,0,['KTX', 'Guide']),
  q('t-pt-gy-2','gyeongju-ktx-bus-guide','gyeongju','tips-and-trend','public-transportation','Gyeongju KTX & Local Bus Guide','Which KTX station to use, which local bus numbers reach each major site, and taxi costs.',I('1554041839-bc64b14f30a5'),G_TIPS,0,0,0,['KTX', 'Bus']),
  q('t-pt-jo-1','jeonju-ktx-terminal-guide','jeonju','tips-and-trend','public-transportation','Jeonju KTX & Bus Terminal Guide','All transport options from Seoul to Jeonju — KTX to Jeonju Station, express buses, costs.',I('1555993539-1732b0258235'),G_TIPS,0,0,0,['KTX', 'Guide']),
  q('t-pt-jo-2','jeonju-hanok-village-transport','jeonju','tips-and-trend','public-transportation','Getting Around Jeonju Hanok Village','Walking is best, but here\'s the bus and taxi guide for Jeonju city including the hanok village.',I('1554041839-bc64b14f30a5'),G_TIPS,0,0,0,['Walking', 'Guide']),
];
