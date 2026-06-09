import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const BUSINESS_EMAILS = ['Eastorykr@gmail.com', 'Dakota@mugoong.com'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      listing_id,
      listing_title,
      listing_category,
      listing_subcategory,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      booking_time,
      guests,
      total_price,
      booking_type,
      notes,
      selected_items,
      age_pricing_breakdown,
      adults,
      children,
    } = body;

    if (!listing_title || !customer_name || !customer_email || !booking_date || !booking_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const bookingNotes = JSON.stringify({
      customer_notes: notes ?? '',
      booking_type: booking_type ?? 'free',
      selected_items: selected_items ?? [],
      age_pricing_breakdown: age_pricing_breakdown ?? [],
      adults: adults ?? null,
      children: children ?? null,
      listing_category: listing_category ?? '',
      listing_subcategory: listing_subcategory ?? '',
    });

    const { data, error } = await supabase.from('bookings').insert({
      listing_id: listing_id ?? null,
      listing_title,
      customer_name,
      customer_email,
      customer_phone: customer_phone ?? '',
      booking_date,
      booking_time,
      guests: guests ?? 1,
      total_price: total_price ?? 0,
      currency: 'KRW',
      status: 'pending',
      notes: bookingNotes,
      admin_notes: '',
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    /* ── Send email notification (non-blocking) ── */
    sendBookingEmail({
      listing_title,
      listing_category: listing_category ?? '',
      listing_subcategory: listing_subcategory ?? '',
      customer_name,
      customer_email,
      customer_phone: customer_phone ?? '',
      booking_date,
      booking_time,
      guests: guests ?? 1,
      total_price: total_price ?? 0,
      booking_type: booking_type ?? 'free',
      notes: notes ?? '',
      selected_items: selected_items ?? [],
      age_pricing_breakdown: age_pricing_breakdown ?? [],
      adults: adults ?? null,
      children: children ?? null,
    }).catch((err) => console.error('[Email] Failed to send booking notification:', err));

    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendBookingEmail(booking: {
  listing_title: string;
  listing_category: string;
  listing_subcategory: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  total_price: number;
  booking_type: string;
  notes: string;
  selected_items: { name: string; price: number; description?: string }[];
  age_pricing_breakdown: { label: string; price: number; count: number }[];
  adults: number | null;
  children: number | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not set — skipping email. Booking details:', JSON.stringify(booking, null, 2));
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

  const fmtDate = (d: string) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch { return d; }
  };

  const fmtKRW = (n: number) => `₩${n.toLocaleString()}`;

  const paymentLabel = booking.booking_type === 'free' ? 'Booking Request (No Payment)'
    : booking.booking_type === 'deposit' ? 'Booking Fee (Deposit)'
    : 'Full Payment';

  /* ── Build guest/pricing rows ── */
  let guestRows = '';
  if (booking.adults !== null && booking.children !== null) {
    if (booking.adults > 0) guestRows += `<tr><td style="padding:8px 12px;color:#374151;">Adult (13+)</td><td style="padding:8px 12px;text-align:right;color:#374151;">${booking.adults} person(s)</td></tr>`;
    if (booking.children > 0) guestRows += `<tr><td style="padding:8px 12px;color:#374151;">Child (≤ 12)</td><td style="padding:8px 12px;text-align:right;color:#374151;">${booking.children} person(s)</td></tr>`;
  } else if (booking.age_pricing_breakdown.length > 0) {
    booking.age_pricing_breakdown.forEach(t => {
      if (t.count > 0) guestRows += `<tr><td style="padding:8px 12px;color:#374151;">${t.label}</td><td style="padding:8px 12px;text-align:right;color:#374151;">${t.count} × ${fmtKRW(t.price)}</td></tr>`;
    });
  } else {
    guestRows = `<tr><td style="padding:8px 12px;color:#374151;">Guests</td><td style="padding:8px 12px;text-align:right;color:#374151;">${booking.guests} person(s)</td></tr>`;
  }

  let selectedItemRows = '';
  if (booking.selected_items.length > 0) {
    selectedItemRows = `
      <tr><td colspan="2" style="padding:12px 12px 4px;font-weight:600;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Selected Services</td></tr>
      ${booking.selected_items.map(item => `
        <tr>
          <td style="padding:6px 12px;color:#374151;">${item.name}${item.description ? `<br><span style="font-size:11px;color:#9CA3AF">${item.description}</span>` : ''}</td>
          <td style="padding:6px 12px;text-align:right;color:#374151;">${fmtKRW(item.price)}</td>
        </tr>
      `).join('')}
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Booking — ${booking.listing_title}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#4F46E5;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.7);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Mugoong Platform</p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">New Booking Received</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">${booking.listing_title}</p>
        </td></tr>

        <!-- Status badge -->
        <tr><td style="background:#ffffff;padding:20px 40px 0;text-align:center;">
          <span style="display:inline-block;background:${booking.booking_type === 'free' ? '#D1FAE5' : booking.booking_type === 'deposit' ? '#FEF3C7' : '#DBEAFE'};color:${booking.booking_type === 'free' ? '#065F46' : booking.booking_type === 'deposit' ? '#92400E' : '#1E40AF'};border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;">${paymentLabel}</span>
        </td></tr>

        <!-- Booking details table -->
        <tr><td style="background:#ffffff;padding:24px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
            <tr style="background:#F9FAFB;"><th style="padding:12px;text-align:left;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Field</th><th style="padding:12px;text-align:right;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Detail</th></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Booking Product</td><td style="padding:10px 12px;text-align:right;font-weight:600;color:#111827;">${booking.listing_title}</td></tr>
            <tr style="border-top:1px solid #F3F4F6;background:#F9FAFB;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Category</td><td style="padding:10px 12px;text-align:right;color:#374151;">${booking.listing_category}${booking.listing_subcategory ? ` / ${booking.listing_subcategory}` : ''}</td></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Date</td><td style="padding:10px 12px;text-align:right;font-weight:600;color:#111827;">${fmtDate(booking.booking_date)}</td></tr>
            <tr style="border-top:1px solid #F3F4F6;background:#F9FAFB;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Time</td><td style="padding:10px 12px;text-align:right;color:#374151;">${booking.booking_time}</td></tr>
          </table>
        </td></tr>

        <!-- Guest breakdown -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <p style="margin:0 0 12px;font-weight:600;color:#374151;">Guest Breakdown</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
            ${guestRows}
            ${selectedItemRows}
            ${booking.total_price > 0 ? `<tr style="background:#EEF2FF;border-top:2px solid #E5E7EB;"><td style="padding:12px;font-weight:700;color:#4F46E5;font-size:15px;">Total Amount</td><td style="padding:12px;text-align:right;font-weight:700;color:#4F46E5;font-size:15px;">${fmtKRW(booking.total_price)}</td></tr>` : `<tr style="background:#D1FAE5;"><td colspan="2" style="padding:12px;font-weight:600;color:#065F46;text-align:center;">No payment required — request only</td></tr>`}
          </table>
        </td></tr>

        <!-- Customer info -->
        <tr><td style="background:#ffffff;padding:0 40px 24px;">
          <p style="margin:0 0 12px;font-weight:600;color:#374151;">Customer Information</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
            <tr><td style="padding:10px 12px;color:#6B7280;font-size:13px;width:40%;">Name</td><td style="padding:10px 12px;font-weight:600;color:#111827;">${booking.customer_name}</td></tr>
            <tr style="background:#F9FAFB;border-top:1px solid #F3F4F6;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Email</td><td style="padding:10px 12px;color:#374151;"><a href="mailto:${booking.customer_email}" style="color:#4F46E5;">${booking.customer_email}</a></td></tr>
            ${booking.customer_phone ? `<tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;">Phone</td><td style="padding:10px 12px;color:#374151;">${booking.customer_phone}</td></tr>` : ''}
            ${booking.notes ? `<tr style="background:#F9FAFB;border-top:1px solid #F3F4F6;"><td style="padding:10px 12px;color:#6B7280;font-size:13px;vertical-align:top;">Special Requests</td><td style="padding:10px 12px;color:#374151;">${booking.notes}</td></tr>` : ''}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#ffffff;padding:0 40px 32px;text-align:center;">
          <p style="color:#6B7280;font-size:14px;margin:0 0 16px;">Please confirm this booking in your admin dashboard.</p>
          <a href="https://mugoong.com/admin/bookings" style="display:inline-block;background:#4F46E5;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 32px;font-weight:600;font-size:15px;">View in Admin Dashboard →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;">This is an automated notification from <strong>Mugoong</strong> — Korea's Local Experience Platform</p>
          <p style="margin:4px 0 0;font-size:11px;color:#D1D5DB;">mugoong.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Mugoong Bookings <${fromEmail}>`,
      to: BUSINESS_EMAILS,
      reply_to: booking.customer_email,
      subject: `[New Booking] ${booking.listing_title} — ${booking.customer_name} · ${booking.booking_date}`,
      html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend API error ${res.status}: ${errBody}`);
  }
}
