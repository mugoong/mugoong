-- ============================================
-- MUGOONG content type migration
-- Run this once on an existing Supabase project
-- ============================================

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'product';

UPDATE public.listings
SET category = 'restaurants'
WHERE subcategory IN ('vegetarian', 'halal');

UPDATE public.listings
SET content_type = 'article'
WHERE category = 'tips-and-trend'
  AND subcategory IN ('travel-tips', 'trend-now', 'smoking-spots');

UPDATE public.listings
SET content_type = 'product'
WHERE content_type IS NULL
   OR content_type NOT IN ('product', 'article');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'listings_content_type_check'
  ) THEN
    ALTER TABLE public.listings
    ADD CONSTRAINT listings_content_type_check
    CHECK (content_type IN ('product', 'article'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_listings_content_type
ON public.listings(content_type);
