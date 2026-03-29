-- ============================================
-- MUGOONG Database Schema
-- Reference snapshot only.
-- The automated deployment source of truth lives in supabase/migrations/.
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. LISTINGS TABLE (CMS content)
-- ============================================
CREATE TABLE public.listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  gallery TEXT[] DEFAULT '{}',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  menu_items JSONB DEFAULT '[]',
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  operating_hours TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  author_id UUID REFERENCES auth.users(id)
);

-- Indexes for fast filtering
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_listings_subcategory ON public.listings(subcategory);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_published ON public.listings(published);
CREATE INDEX idx_listings_featured ON public.listings(featured);
CREATE INDEX idx_listings_slug ON public.listings(slug);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  listing_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL DEFAULT '',
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT NOT NULL DEFAULT '',
  admin_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_listing ON public.bookings(listing_id);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. ADMIN USERS TABLE
-- ============================================
CREATE TABLE public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  auth_user_id UUID REFERENCES auth.users(id)
);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Listings: public can read published, authenticated can manage
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published listings"
  ON public.listings FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage listings"
  ON public.listings FOR ALL
  USING (auth.role() = 'authenticated');

-- Bookings: anyone can insert, authenticated can manage
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage bookings"
  ON public.bookings FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin users: only authenticated can read
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read admin users"
  ON public.admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- 5. STORAGE BUCKET for images
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

CREATE POLICY "Authenticated can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update listing images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'listings' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete listing images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listings' AND auth.role() = 'authenticated');
