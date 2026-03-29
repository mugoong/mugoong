import { getCategoryBySlug, getSubcategoryBySlug } from '@/lib/categories';
import { getSupabaseListings } from '@/lib/api';
import ListingDetail from '@/components/ListingDetail';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; category: string; subcategory: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listings = await getSupabaseListings();
  const listing = listings.find((entry) => entry.slug === slug);

  if (!listing) {
    return {};
  }

  return {
    title: listing.title,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: [listing.image],
      type: listing.contentType === 'article' ? 'article' : 'website',
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const { category, subcategory, slug } = await params;

  const cat = getCategoryBySlug(category);
  const sub = getSubcategoryBySlug(category, subcategory);
  const listings = await getSupabaseListings();
  const listing = listings.find(
    (entry) =>
      entry.slug === slug &&
      entry.category === category &&
      entry.subcategory === subcategory
  );

  if (!cat || !sub || !listing) {
    notFound();
  }

  return <ListingDetail listing={listing} category={cat} subcategory={sub} />;
}
