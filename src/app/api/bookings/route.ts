import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import nodemailer from 'nodemailer';

const BUSINESS_EMAILS = ['Eastorykr@gmail.com', 'Dakota@mugoong.com', 'sendainoodle@gmail.com'];
const LOGO_URL = 'https://mugoong.com/logo.png';
const SITE_URL = 'https://mugoong.com';

const fmtDate = (d: string) => {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return d; }
};
const fmtKRW = (n: number) => `₩${n.toLocaleString()}`;

function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return null;
  return { transporter: nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailPass } }), gmailUser };
}

/* ─── Shared email wrapper ─── */
function emailWrapper(title: string, headerSub: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#EDE8E1;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#1A0B06;border-radius:16px 16px 0 0;padding:36px 48px;text-align:center;">
          <img src="${LOGO_URL}" alt="MUGOONG" width="72" height="72" style="display:block;margin:0 auto;border-radius:8px;" />
          <p style="margin:14px 0 0;color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">Korea's Local Life</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">${headerSub}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#FFFFFF;padding:40px 48px;">${bodyHtml}</td></tr>

        <!-- Footer -->
        <tr><td style="background:#F5F0EB;border-radius:0 0 16px 16px;padding:24px 48px;text-align:center;border-top:1px solid #E8E1D8;">
          <p style="margin:0;font-size:12px;color:#9A8880;">© 2026 MUGOONG · Korea's Local Life Platform</p>
          <p style="margin:4px 0 0;font-size:12px;">
            <a href="${SITE_URL}" style="color:#6B5149;text-decoration:none;">mugoong.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Admin internal notification ─── */
async function sendAdminBookingEmail(booking: BookingPayload, bookingNumber: string | null) {
  const conn = createTransporter();
  if (!conn) { console.log('[Email] Creds not set — skipping admin email'); return; }

  const paymentLabel = booking.booking_type === 'free' ? 'Booking Request (No Payment)'
    : booking.booking_type === 'deposit' ? 'Booking Fee (Deposit)'
    : 'Full Payment';

  const statusColor = booking.booking_type === 'free' ? { bg: '#EDE8E1', text: '#5C3D2E' }
    : booking.booking_type === 'deposit' ? { bg: '#FEF3C7', text: '#92400E' }
    : { bg: '#D1FAE5', text: '#065F46' };

  let guestRows = '';
  if (booking.adults !== null && booking.children !== null) {
    if (booking.adults > 0) guestRows += row('Adult (13+)', `${booking.adults} person(s)`);
    if (booking.children > 0) guestRows += row('Child (≤ 12)', `${booking.children} person(s)`);
  } else if (booking.age_pricing_breakdown.length > 0) {
    booking.age_pricing_breakdown.forEach(t => {
      if (t.count > 0) guestRows += row(t.label, `${t.count} × ${fmtKRW(t.price)}`);
    });
  } else {
    guestRows = row('Guests', `${booking.guests} person(s)`);
  }

  let serviceRows = '';
  if (booking.selected_items.length > 0) {
    serviceRows = `<tr><td colspan="2" style="padding:10px 14px 4px;font-size:11px;font-weight:600;color:#9A8880;text-transform:uppercase;letter-spacing:0.08em;">Selected Services</td></tr>`;
    booking.selected_items.forEach(item => {
      serviceRows += row(item.name + (item.description ? `<br><span style="font-size:11px;color:#9A8880;">${item.description}</span>` : ''), fmtKRW(item.price));
    });
  }

  const totalRow = booking.total_price > 0
    ? `<tr style="border-top:2px solid #E8E1D8;"><td style="padding:14px;font-weight:700;color:#1A0B06;font-size:15px;">Total</td><td style="padding:14px;text-align:right;font-weight:700;color:#1A0B06;font-size:15px;">${fmtKRW(booking.total_price)}</td></tr>`
    : `<tr><td colspan="2" style="padding:12px 14px;font-size:13px;color:#5C3D2E;font-weight:600;">No payment — request only</td></tr>`;

  const body = `
    <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#1A0B06;letter-spacing:-0.02em;">New Booking</p>
    <p style="margin:0 0 24px;font-size:15px;color:#5C3D2E;">${booking.listing_title}</p>

    <span style="display:inline-block;background:${statusColor.bg};color:${statusColor.text};border-radius:999px;padding:5px 16px;font-size:12px;font-weight:600;letter-spacing:0.04em;margin-bottom:28px;">${paymentLabel}</span>

    ${bookingNumber ? `<p style="margin:0 0 20px;font-size:12px;color:#9A8880;font-family:monospace;">Booking Ref: <strong style="color:#1A0B06;">${bookingNumber}</strong></p>` : ''}

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E1D8;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      ${rowAlt('Experience', booking.listing_title, true)}
      ${booking.listing_category ? rowAlt('Category', booking.listing_category + (booking.listing_subcategory ? ` / ${booking.listing_subcategory}` : ''), false) : ''}
      ${rowAlt('Date', fmtDate(booking.booking_date), true)}
      ${rowAlt('Time', booking.booking_time, false)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E1D8;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      ${guestRows}
      ${serviceRows}
      ${totalRow}
    </table>

    <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#1A0B06;">Customer</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8E1D8;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      ${rowAlt('Name', booking.customer_name, true)}
      ${rowAlt('Email', `<a href="mailto:${booking.customer_email}" style="color:#5C3D2E;">${booking.customer_email}</a>`, false)}
      ${booking.customer_phone ? rowAlt('Phone', booking.customer_phone, true) : ''}
      ${booking.notes ? rowAlt('Note', booking.notes, false) : ''}
    </table>

    <div style="text-align:center;">
      <a href="${SITE_URL}/admin/bookings" style="display:inline-block;background:#1A0B06;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.05em;padding:14px 36px;border-radius:8px;">VIEW IN DASHBOARD</a>
    </div>
  `;

  const html = emailWrapper(`New Booking — ${booking.listing_title}`, `Admin Notification`, body);

  const { transporter, gmailUser } = conn;
  await transporter.sendMail({
    from: `MUGOONG Bookings <${gmailUser}>`,
    to: BUSINESS_EMAILS,
    replyTo: booking.customer_email,
    subject: `[New Booking] ${booking.listing_title} · ${booking.customer_name} · ${booking.booking_date}`,
    html,
  });
}

/* ─── Customer receipt email ─── */
async function sendCustomerReceiptEmail(booking: BookingPayload, bookingNumber: string | null) {
  const conn = createTransporter();
  if (!conn) return;

  let guestSummary = '';
  if (booking.adults !== null && booking.children !== null) {
    const parts = [];
    if (booking.adults > 0) parts.push(`${booking.adults} Adult${booking.adults > 1 ? 's' : ''}`);
    if (booking.children > 0) parts.push(`${booking.children} Child${booking.children > 1 ? 'ren' : ''}`);
    guestSummary = parts.join(', ');
  } else {
    guestSummary = `${booking.guests} Guest${booking.guests > 1 ? 's' : ''}`;
  }

  const isPayment = booking.total_price > 0;
  const ref = bookingNumber ?? `#${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  let serviceRows = '';
  if (booking.selected_items.length > 0) {
    booking.selected_items.forEach(item => {
      serviceRows += `<tr style="border-top:1px solid #F0EBE5;"><td style="padding:10px 0;font-size:13px;color:#5C3D2E;">${item.name}</td><td style="padding:10px 0;text-align:right;font-size:13px;color:#1A0B06;font-weight:600;">${fmtKRW(item.price)}</td></tr>`;
    });
  }

  const body = `
    <p style="margin:0 0 4px;font-size:13px;color:#9A8880;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;">Booking Received</p>
    <p style="margin:0 0 28px;font-size:24px;font-weight:700;color:#1A0B06;letter-spacing:-0.02em;">${booking.listing_title}</p>

    <div style="background:#F5F0EB;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      ${bookingNumber ? `<p style="margin:0 0 14px;font-size:11px;color:#9A8880;font-family:monospace;letter-spacing:0.08em;">BOOKING REFERENCE</p>
      <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#1A0B06;letter-spacing:0.04em;">${ref}</p>
      <hr style="border:none;border-top:1px solid #E8E1D8;margin:0 0 20px;" />` : ''}
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#9A8880;width:40%;">Date</td>
          <td style="padding:6px 0;font-size:13px;color:#1A0B06;font-weight:600;">${fmtDate(booking.booking_date)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#9A8880;">Time</td>
          <td style="padding:6px 0;font-size:13px;color:#1A0B06;font-weight:600;">${booking.booking_time}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#9A8880;">Guests</td>
          <td style="padding:6px 0;font-size:13px;color:#1A0B06;font-weight:600;">${guestSummary}</td>
        </tr>
        ${booking.customer_phone ? `<tr><td style="padding:6px 0;font-size:13px;color:#9A8880;">Phone</td><td style="padding:6px 0;font-size:13px;color:#1A0B06;">${booking.customer_phone}</td></tr>` : ''}
      </table>
    </div>

    ${serviceRows || isPayment ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${serviceRows}
      ${isPayment ? `<tr style="border-top:2px solid #E8E1D8;"><td style="padding:14px 0;font-size:15px;font-weight:700;color:#1A0B06;">Total</td><td style="padding:14px 0;text-align:right;font-size:15px;font-weight:700;color:#1A0B06;">${fmtKRW(booking.total_price)}</td></tr>` : ''}
    </table>
    ` : ''}

    <div style="background:#1A0B06;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#FFFFFF;">What happens next?</p>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.7;">
        Our team will review your request and send a confirmation within <strong style="color:#FFFFFF;">24 hours</strong>.
        Once confirmed, you'll receive another email with full details.
      </p>
    </div>

    ${booking.notes ? `<div style="border-left:3px solid #E8E1D8;padding:10px 16px;margin-bottom:28px;"><p style="margin:0;font-size:12px;color:#9A8880;margin-bottom:4px;">Your note</p><p style="margin:0;font-size:13px;color:#5C3D2E;">${booking.notes}</p></div>` : ''}

    <p style="margin:0;font-size:13px;color:#9A8880;line-height:1.7;">
      Questions? Email us at <a href="mailto:support@mugoong.com" style="color:#5C3D2E;text-decoration:none;font-weight:600;">support@mugoong.com</a> and include your booking reference.
    </p>
  `;

  const html = emailWrapper(
    `Booking Received — ${booking.listing_title}`,
    `Hi ${booking.customer_name}, we've got your request.`,
    body,
  );

  const { transporter, gmailUser } = conn;
  await transporter.sendMail({
    from: `MUGOONG <${gmailUser}>`,
    to: booking.customer_email,
    replyTo: 'support@mugoong.com',
    subject: `Booking received — ${booking.listing_title} · ${booking.booking_date}`,
    html,
  });
}

/* ─── Table row helpers ─── */
function row(label: string, value: string) {
  return `<tr><td style="padding:10px 14px;font-size:13px;color:#9A8880;width:42%;">${label}</td><td style="padding:10px 14px;font-size:13px;color:#1A0B06;text-align:right;font-weight:600;">${value}</td></tr>`;
}
function rowAlt(label: string, value: string, shade: boolean) {
  return `<tr style="background:${shade ? '#FAF7F4' : '#FFFFFF'};"><td style="padding:10px 14px;font-size:13px;color:#9A8880;width:42%;">${label}</td><td style="padding:10px 14px;font-size:13px;color:#1A0B06;">${value}</td></tr>`;
}

/* ─── Types ─── */
interface BookingPayload {
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
}

/* ─── POST handler ─── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      listing_id, listing_title, listing_category, listing_subcategory,
      customer_name, customer_email, customer_phone,
      booking_date, booking_time, guests,
      total_price, booking_type, notes,
      selected_items, age_pricing_breakdown, adults, children,
    } = body;

    if (!listing_title || !customer_name || !customer_email || !booking_date || !booking_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload: BookingPayload = {
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
    };

    /* 1. Save to DB — get booking_number */
    let savedBooking: any = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
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
        user_id: sessionUser?.id ?? null,
      }).select().single();
      if (error) console.error('[DB] Booking insert failed:', error.message);
      else savedBooking = data;
    } catch (dbErr: any) {
      console.error('[DB] Booking insert error:', dbErr.message);
    }

    const bookingNumber: string | null = savedBooking?.booking_number ?? null;

    /* 2. Send admin notification + customer receipt in parallel */
    await Promise.allSettled([
      sendAdminBookingEmail(payload, bookingNumber),
      sendCustomerReceiptEmail(payload, bookingNumber),
    ]);

    return NextResponse.json({ success: true, booking: savedBooking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
