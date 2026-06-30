import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function within2Weeks(bookingDate: string): boolean {
  const deadline = new Date(bookingDate + 'T00:00:00');
  deadline.setDate(deadline.getDate() + 14);
  return new Date() <= deadline;
}

async function syncListingRating(supabase: any, listingId: string) {
  const { data } = await supabase.from('reviews').select('rating').eq('listing_id', listingId);
  if (!data?.length) {
    await supabase.from('listings').update({ rating: 0, review_count: 0 }).eq('id', listingId);
    return;
  }
  const avg = data.reduce((s: number, r: any) => s + r.rating, 0) / data.length;
  await supabase.from('listings').update({
    rating: Math.round(avg * 10) / 10,
    review_count: data.length,
  }).eq('id', listingId);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  if (!within2Weeks(existing.booking_date)) {
    return NextResponse.json({ error: 'Edit window expired (2 weeks from booking date)' }, { status: 403 });
  }

  const { rating, title, content } = await req.json();
  if (!content?.trim() || content.trim().length < 10) {
    return NextResponse.json({ error: 'Review must be at least 10 characters' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .update({ rating, title: title?.trim() || '', content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await syncListingRating(supabase, existing.listing_id);
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!existing) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  if (!within2Weeks(existing.booking_date)) {
    return NextResponse.json({ error: 'Delete window expired (2 weeks from booking date)' }, { status: 403 });
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await syncListingRating(supabase, existing.listing_id);
  return NextResponse.json({ success: true });
}
