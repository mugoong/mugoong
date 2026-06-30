import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const bookingNumber = searchParams.get('booking_number')?.trim().toUpperCase();
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!bookingNumber || !email) {
    return NextResponse.json({ error: 'Booking number and email are required' }, { status: 400 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

  const { data, error } = await supabase
    .from('bookings')
    .select('id, booking_number, listing_title, booking_date, booking_time, guests, total_price, currency, status, created_at, customer_name, customer_email')
    .ilike('booking_number', bookingNumber)
    .ilike('customer_email', email)
    .is('user_id', null)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No booking found. Please check your booking number and email.' }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    booking_number: data.booking_number,
    listing_title: data.listing_title,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    guests: data.guests,
    total_price: data.total_price,
    currency: data.currency,
    status: data.status,
    created_at: data.created_at,
    customer_name: data.customer_name,
  });
}
