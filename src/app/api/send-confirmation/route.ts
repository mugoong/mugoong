import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerEmail,
      customerName,
      listingTitle,
      bookingDate,
      bookingTime,
      guests,
      totalPrice,
    } = body;

    // Placeholder: integrate with Resend, SendGrid, or Nodemailer
    // For now, log the email that would be sent
    console.log(`
      📧 CONFIRMATION EMAIL
      To: ${customerEmail}
      Subject: Your MUGOONG Booking is Confirmed!
      ---
      Dear ${customerName},

      Great news! Your booking has been confirmed.

      📋 Booking Details:
      - Experience: ${listingTitle}
      - Date: ${bookingDate}
      - Time: ${bookingTime}
      - Guests: ${guests}
      - Total: $${totalPrice}

      What's next:
      - Please arrive 10 minutes before your scheduled time
      - Show this confirmation email at the venue
      - For any changes, contact us at ${process.env.BUSINESS_EMAIL}

      Thank you for choosing MUGOONG!
      We hope you have an amazing experience in Korea.

      Best regards,
      The MUGOONG Team
    `);

    // TODO: Replace with actual email service integration
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'MUGOONG <bookings@mugoong.com>',
    //   to: customerEmail,
    //   subject: 'Your MUGOONG Booking is Confirmed!',
    //   html: emailTemplate,
    // });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
