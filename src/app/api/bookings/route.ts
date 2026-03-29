import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let {
      listing_id,
      listing_title,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      booking_time,
      guests,
      total_price,
      notes,
    } = body;

    // Validate required fields
    if (!listing_title || !customer_name || !customer_email || !booking_date || !booking_time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    if (listing_id) {
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('title, content_type')
        .eq('id', listing_id)
        .single();

      if (listingError) {
        return NextResponse.json({ error: listingError.message }, { status: 400 });
      }

      if (listing.content_type === 'article') {
        return NextResponse.json(
          { error: 'Bookings are not available for CMS articles' },
          { status: 400 }
        );
      }

      listing_title = listing.title;
    }

    const { data, error } = await supabase.from('bookings').insert({
      listing_id,
      listing_title,
      customer_name,
      customer_email,
      customer_phone: customer_phone ?? '',
      booking_date,
      booking_time,
      guests,
      total_price: total_price ?? 0,
      currency: 'USD',
      status: 'pending',
      notes: notes ?? '',
      admin_notes: '',
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification to business email
    try {
      await sendBusinessNotification({
        listing_title,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        booking_time,
        guests,
        total_price,
      });
    } catch (emailErr) {
      console.error('Failed to send business notification:', emailErr);
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendBusinessNotification(booking: {
  listing_title: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  total_price: number;
}) {
  const businessEmail = process.env.BUSINESS_EMAIL;
  if (!businessEmail) return;

  // Uses Resend or any email service - placeholder for now
  // Will be configured with actual email service
  console.log(`
    📧 NEW BOOKING NOTIFICATION
    To: ${businessEmail}
    ---
    Listing: ${booking.listing_title}
    Customer: ${booking.customer_name} (${booking.customer_email})
    Phone: ${booking.customer_phone ?? 'N/A'}
    Date: ${booking.booking_date} at ${booking.booking_time}
    Guests: ${booking.guests}
    Total: $${booking.total_price}
    ---
    Please review and confirm in admin dashboard.
  `);
}
