import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy — MUGOONG',
  description: 'How MUGOONG collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="container-main">
          <nav className="mb-2 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Privacy Policy</h1>
          <p className="mt-1 text-sm text-primary-100">Last updated: June 2025</p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm lg:p-12">
          <div className="space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">1. Data Controller</h2>
              <p>MUGOONG is operated by Blossom MUGOONG, Republic of Korea. We are responsible for the collection and processing of your personal information in accordance with Korea's Personal Information Protection Act (PIPA, 개인정보 보호법) and, where applicable, the EU General Data Protection Regulation (GDPR).</p>
              <p className="mt-2">Contact: <a href="mailto:privacy@mugoong.com" className="text-primary-600 underline hover:text-primary-700">privacy@mugoong.com</a></p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">2. Information We Collect</h2>
              <p className="mb-2 font-medium text-gray-800">2.1 Information you provide directly:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Name and email address (during account registration)</li>
                <li>Password (stored in encrypted form; we never see your plain-text password)</li>
                <li>Phone number (optional, for booking notifications)</li>
                <li>Booking details including date, time, party size, and special requests</li>
                <li>Payment information — processed by Eximbay; MUGOONG does not store card numbers</li>
                <li>Review content and ratings you submit</li>
              </ul>
              <p className="mb-2 mt-4 font-medium text-gray-800">2.2 Information collected automatically:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>IP address and approximate location (country/city level)</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring URLs and search terms used to reach MUGOONG</li>
                <li>Cookies and similar tracking technologies (see Section 7)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">3. How We Use Your Information</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>To create and manage your account</li>
                <li>To process bookings and send booking confirmations</li>
                <li>To facilitate payment via Eximbay</li>
                <li>To send transactional emails (booking confirmation, cancellation, reminders)</li>
                <li>To respond to your inquiries and support requests</li>
                <li>To improve our platform, listings, and recommendations</li>
                <li>To detect fraud and ensure platform security</li>
                <li>To comply with legal obligations</li>
                <li>With your consent: to send promotional emails about new listings and offers</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">4. Legal Basis for Processing (GDPR)</h2>
              <p>Where GDPR applies, we process your data on the following legal bases:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><span className="font-medium">Contract performance:</span> processing required to fulfill your booking</li>
                <li><span className="font-medium">Legitimate interests:</span> fraud prevention, analytics, platform improvement</li>
                <li><span className="font-medium">Consent:</span> marketing emails (you may withdraw at any time)</li>
                <li><span className="font-medium">Legal obligation:</span> tax records and regulatory compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">5. Sharing Your Information</h2>
              <p>We do not sell your personal information. We share it only with:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><span className="font-medium">Service Partners:</span> name, contact info, and booking details shared with the Partner to fulfill your booking</li>
                <li><span className="font-medium">Eximbay:</span> payment data for transaction processing</li>
                <li><span className="font-medium">Supabase:</span> database and authentication infrastructure (servers in South Korea/AWS)</li>
                <li><span className="font-medium">Vercel:</span> website hosting infrastructure</li>
                <li><span className="font-medium">Legal authorities:</span> if required by applicable law or court order</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">6. Data Retention</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Account data: retained while your account is active and for 3 years after deletion</li>
                <li>Booking records: 5 years (required for accounting and tax purposes under Korean law)</li>
                <li>Marketing preferences: until you withdraw consent</li>
                <li>Log data: 90 days</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">7. Cookies</h2>
              <p>We use essential cookies to keep you logged in and maintain your session. We use analytics cookies (anonymous) to understand how visitors use the platform. We do not use advertising or third-party tracking cookies. You can disable cookies in your browser settings, but this may affect platform functionality.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">8. Your Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li><span className="font-medium">Access:</span> request a copy of your personal data</li>
                <li><span className="font-medium">Correction:</span> update inaccurate or incomplete data</li>
                <li><span className="font-medium">Deletion:</span> request deletion of your account and personal data</li>
                <li><span className="font-medium">Portability:</span> receive your data in a machine-readable format</li>
                <li><span className="font-medium">Restriction:</span> restrict processing in certain circumstances</li>
                <li><span className="font-medium">Objection:</span> object to processing based on legitimate interests</li>
                <li><span className="font-medium">Withdraw consent:</span> opt out of marketing at any time via the unsubscribe link</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, email us at <a href="mailto:privacy@mugoong.com" className="text-primary-600 underline hover:text-primary-700">privacy@mugoong.com</a>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">9. Children's Privacy</h2>
              <p>MUGOONG is not directed at children under 14 years of age. We do not knowingly collect personal information from children under 14. If you believe we have collected such information, please contact us and we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">10. Security</h2>
              <p>We use industry-standard security measures including TLS encryption for data in transit, encrypted password storage, and access controls. No system is completely secure; if you become aware of any security issue, please notify us immediately.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify registered users by email of significant changes. Continued use of MUGOONG after changes are posted constitutes your acceptance.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">12. Contact & Complaints</h2>
              <p>Personal Information Protection Officer (개인정보보호책임자):</p>
              <p className="mt-1">Email: <a href="mailto:privacy@mugoong.com" className="text-primary-600 underline hover:text-primary-700">privacy@mugoong.com</a></p>
              <p className="mt-2 text-xs text-gray-500">If you are an EU resident and are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
