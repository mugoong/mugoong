import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; category: string; subcategory: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allListings = await getSupabaseListings();
  const listing = allListings.find((l) => l.slug === slug);
  if (!listing) return {};

  return {
    title: listing.title,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: [listing.image],
      type: 'article',
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { category, subcategory, slug } = await params;

  const cat = getCategoryBySlug(category);
  const sub = getSubcategoryBySlug(category, subcategory);
  const allListings = await getSupabaseListings();
  const listing = allListings.find((l) => l.slug === slug);

  if (!cat || !sub || !listing) notFound();

  return <ListingDetail listing={listing} category={cat} subcategory={sub} />;
}
