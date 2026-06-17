import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Terms of Service — MUGOONG',
  description: 'Terms and conditions for using the MUGOONG platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="container-main">
          <nav className="mb-2 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Terms of Service</span>
          </nav>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Terms of Service</h1>
          <p className="mt-1 text-sm text-primary-100">Last updated: June 2025</p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm lg:p-12">
          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">1. About MUGOONG</h2>
              <p>MUGOONG ("we", "our", or "the platform") is an online travel and experience booking platform operated by Blossom MUGOONG, based in the Republic of Korea. We connect foreign travelers and expatriates with local service providers offering restaurants, wellness, activities, and lifestyle experiences across Korea.</p>
              <p className="mt-2">By accessing or using mugoong.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">2. Services</h2>
              <p>MUGOONG provides a marketplace where users can discover, browse, and book experiences offered by third-party service providers ("Partners"). MUGOONG acts as an intermediary and is not itself the provider of the listed services.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Restaurant reservations and food experiences</li>
                <li>Wellness services (skin clinics, massage, spa)</li>
                <li>Cultural activities and tours</li>
                <li>Travel tips and local guides</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">3. User Accounts</h2>
              <p>To make a booking, you must create an account using a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. MUGOONG reserves the right to suspend or terminate accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">4. Bookings and Payments</h2>
              <p>When you complete a booking on MUGOONG, you enter into a direct agreement with the Partner. MUGOONG facilitates payment on behalf of the Partner via Eximbay, a licensed payment service provider.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>All prices displayed are in USD unless otherwise stated.</li>
                <li>Payment is processed securely at the time of booking.</li>
                <li>A booking confirmation will be sent to your registered email address.</li>
                <li>MUGOONG may charge a service fee, which will be clearly disclosed before payment.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">5. Cancellations and Refunds</h2>
              <p>Cancellation and refund policies vary by Partner. Please review the specific cancellation policy on each listing page before booking. MUGOONG's general refund policy is detailed in our <Link href="/refund-policy" className="text-primary-600 underline hover:text-primary-700">Refund & Cancellation Policy</Link>.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">6. User Conduct</h2>
              <p>Users agree not to:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Provide false or misleading information during registration or booking</li>
                <li>Use the platform for any unlawful purpose</li>
                <li>Attempt to circumvent the booking system or contact Partners directly to avoid fees</li>
                <li>Post false reviews or manipulate ratings</li>
                <li>Scrape, copy, or redistribute platform content without written permission</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">7. Intellectual Property</h2>
              <p>All content on MUGOONG—including logos, text, images, and software—is the property of Blossom MUGOONG or its licensors and is protected under applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">8. Disclaimer of Warranties</h2>
              <p>MUGOONG provides the platform "as is" without warranties of any kind. We do not guarantee the quality, safety, or accuracy of Partner services. Users assume all risks associated with the use of services booked through the platform.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, MUGOONG shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or any services booked through it. Our total liability shall not exceed the amount paid by you for the specific booking giving rise to the claim.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">10. Governing Law</h2>
              <p>These Terms are governed by the laws of the Republic of Korea. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Seoul, Republic of Korea.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">11. Changes to Terms</h2>
              <p>MUGOONG reserves the right to modify these Terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the updated Terms.</p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-gray-900">12. Contact</h2>
              <p>For questions regarding these Terms, please contact us at: <a href="mailto:support@mugoong.com" className="text-primary-600 underline hover:text-primary-700">support@mugoong.com</a></p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
