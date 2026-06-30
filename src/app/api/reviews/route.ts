import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function checkIsAdmin(supabase: any, email: string): Promise<boolean> {
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .single();
  return !!data;
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

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = req.nextUrl;
  const listingId = searchParams.get('listing_id');
  const userMe = searchParams.get('user') === 'me';

  if (userMe) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([]);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    return NextResponse.json(data ?? []);
  }

  if (!listingId) return NextResponse.json({ error: 'listing_id required' }, { status: 400 });

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  let canReview = false;
  let isAdmin = false;
  let myReview = null;
  let bookingDate: string | null = null;

  if (user) {
    myReview = (reviews ?? []).find((r: any) => r.user_id === user.id) ?? null;
    isAdmin = await checkIsAdmin(supabase, user.email!);

    if (!myReview) {
      if (isAdmin) {
        canReview = true;
      } else {
        const { data: booking } = await supabase
          .from('bookings')
          .select('id, booking_date')
          .eq('listing_id', listingId)
          .eq('user_id', user.id)
          .in('status', ['confirmed', 'completed'])
          .order('booking_date', { ascending: false })
          .limit(1)
          .single();

        if (booking) {
          const deadline = new Date(booking.booking_date + 'T00:00:00');
          deadline.setDate(deadline.getDate() + 14);
          if (new Date() <= deadline) {
            canReview = true;
            bookingDate = booking.booking_date;
          }
        }
      }
    }
  }

  return NextResponse.json({ reviews: reviews ?? [], canReview, isAdmin, myReview, bookingDate });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { listing_id, listing_title, rating, title, content, custom_name, nationality } = body;

  if (!listing_id || !rating || !content?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (content.trim().length < 10) {
    return NextResponse.json({ error: 'Review must be at least 10 characters' }, { status: 400 });
  }

  const isAdmin = await checkIsAdmin(supabase, user.email!);
  const today = new Date().toISOString().split('T')[0];

  let reviewer_name: string;
  let reviewer_nationality: string;
  let booking_id: string | null = null;
  let booking_date: string;

  if (isAdmin) {
    reviewer_name = custom_name?.trim() || user.email?.split('@')[0] || 'MUGOONG Team';
    reviewer_nationality = nationality || '';
    booking_date = today;
  } else {
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, booking_date')
      .eq('listing_id', listing_id)
      .eq('user_id', user.id)
      .in('status', ['confirmed', 'completed'])
      .order('booking_date', { ascending: false })
      .limit(1)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'A confirmed booking is required to leave a review' }, { status: 403 });
    }

    const deadline = new Date(booking.booking_date + 'T00:00:00');
    deadline.setDate(deadline.getDate() + 14);
    if (new Date() > deadline) {
      return NextResponse.json({ error: 'Review window has expired (2 weeks from booking date)' }, { status: 403 });
    }

    booking_id = booking.id;
    booking_date = booking.booking_date;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name, nationality')
      .eq('id', user.id)
      .single();
    reviewer_name = profile?.name || user.email?.split('@')[0] || 'Guest';
    reviewer_nationality = profile?.nationality || '';
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      listing_id,
      listing_title: listing_title || '',
      user_id: user.id,
      reviewer_name,
      nationality: reviewer_nationality,
      booking_id,
      booking_date,
      rating,
      title: title?.trim() || '',
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'You have already reviewed this listing' }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await syncListingRating(supabase, listing_id);
  return NextResponse.json(data, { status: 201 });
}
