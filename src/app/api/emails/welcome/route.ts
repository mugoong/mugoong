import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const LOGO_URL = 'https://mugoong.com/logo.png';
const SITE_URL = 'https://mugoong.com';

function createTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return null;
  return { transporter: nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailPass } }), gmailUser };
}

function welcomeEmailHtml(name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to MUGOONG</title></head>
<body style="margin:0;padding:0;background:#EDE8E1;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#1A0B06;border-radius:16px 16px 0 0;padding:48px 48px 40px;text-align:center;">
          <img src="${LOGO_URL}" alt="MUGOONG" width="80" height="80" style="display:block;margin:0 auto;border-radius:12px;" />
          <p style="margin:16px 0 0;color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Korea's Local Life</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#FFFFFF;padding:48px 48px 40px;">

          <p style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1A0B06;letter-spacing:-0.02em;">Welcome, ${name}!</p>
          <p style="margin:0 0 32px;font-size:16px;color:#5C3D2E;line-height:1.6;">
            You're now part of MUGOONG — your guide to Korea's local life.<br />
            Discover hidden restaurants, wellness spots, cultural experiences, and more curated just for travelers like you.
          </p>

          <!-- Divider -->
          <div style="border-top:1px solid #EDE8E1;margin:0 0 32px;"></div>

          <p style="margin:0 0 20px;font-size:13px;font-weight:600;color:#9A8880;letter-spacing:0.08em;text-transform:uppercase;">What you can do now</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
            <tr>
              <td style="padding:12px 16px;background:#F5F0EB;border-radius:10px;margin-bottom:12px;display:block;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">🍜</span>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0;font-size:14px;font-weight:600;color:#1A0B06;">Browse Experiences</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#9A8880;line-height:1.5;">Restaurants, wellness, activities, and local tips all in one place</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#F5F0EB;border-radius:10px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">📅</span>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0;font-size:14px;font-weight:600;color:#1A0B06;">Book in Seconds</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#9A8880;line-height:1.5;">Reserve experiences and track all your bookings in My Account</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#F5F0EB;border-radius:10px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:36px;vertical-align:top;padding-top:2px;">
                      <span style="font-size:20px;">⭐</span>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0;font-size:14px;font-weight:600;color:#1A0B06;">Leave Reviews</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#9A8880;line-height:1.5;">Share your honest experience after visiting — help other travelers</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA Buttons -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td align="center" style="padding-bottom:12px;">
                <a href="${SITE_URL}" style="display:inline-block;background:#1A0B06;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.05em;padding:16px 40px;border-radius:10px;width:100%;box-sizing:border-box;text-align:center;">
                  Explore MUGOONG →
                </a>
              </td>
            </tr>
            <tr>
              <td align="center">
                <a href="${SITE_URL}/app" style="display:inline-block;background:#FFFFFF;color:#1A0B06;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;padding:15px 40px;border-radius:10px;border:2px solid #1A0B06;width:100%;box-sizing:border-box;text-align:center;">
                  Download the App
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0;font-size:13px;color:#9A8880;line-height:1.7;text-align:center;">
            Questions? Reach us at <a href="mailto:support@mugoong.com" style="color:#5C3D2E;text-decoration:none;font-weight:600;">support@mugoong.com</a>
          </p>

        </td></tr>

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

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });

    const conn = createTransporter();
    if (!conn) {
      console.log('[Welcome Email] SMTP creds not set — skipping');
      return NextResponse.json({ success: true, skipped: true });
    }

    const { transporter, gmailUser } = conn;
    await transporter.sendMail({
      from: `MUGOONG <${gmailUser}>`,
      to: email,
      replyTo: 'support@mugoong.com',
      subject: `Welcome to MUGOONG, ${name}! 🌸`,
      html: welcomeEmailHtml(name),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Welcome Email]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
