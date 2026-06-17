import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — MUGOONG',
  description: 'MUGOONG cancellation, refund, and payment policy for bookings.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="container-main">
          <nav className="mb-2 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Refund &amp; Cancellation Policy</span>
          </nav>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Refund &amp; Cancellation Policy</h1>
          <p className="mt-1 text-sm text-primary-100">Last updated: June 2025 — Applies to all bookings made via MUGOONG</p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="mx-auto max-w-3xl space-y-6">

          {/* Summary card */}
          <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6">
            <h2 className="mb-3 text-base font-bold text-primary-800">Quick Summary</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="mt-1 text-xs text-gray-600">Full refund if cancelled 72+ hours before the experience</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-yellow-500">50%</p>
                <p className="mt-1 text-xs text-gray-600">Partial refund if cancelled 24–72 hours before</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-red-500">0%</p>
                <p className="mt-1 text-xs text-gray-600">No refund for cancellations within 24 hours or no-shows</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm lg:p-12">
            <div className="space-y-8 text-sm leading-relaxed text-gray-700">

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">1. Payment Processing</h2>
                <p>All payments on MUGOONG are processed securely by <strong>Eximbay Co., Ltd.</strong>, a licensed payment gateway authorised under Korean Financial Services regulations (Registration No. 02-006-00060). Eximbay supports major international credit and debit cards including Visa, Mastercard, JCB, UnionPay, and Alipay.</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>Payment is charged at the time of booking confirmation.</li>
                  <li>All transactions are in USD (United States Dollar) unless otherwise specified on the listing.</li>
                  <li>Currency conversion is handled by your card issuer. MUGOONG is not responsible for exchange rate fluctuations.</li>
                  <li>A booking confirmation email with receipt is sent to your registered email address.</li>
                  <li>MUGOONG may charge a service fee clearly displayed before payment completion.</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">2. Cancellation & Refund Policy</h2>
                <p className="mb-3">The following standard cancellation policy applies to all bookings unless the individual listing specifies stricter terms. All cancellation windows are calculated from the scheduled start time of the experience in Korea Standard Time (KST, UTC+9).</p>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Cancellation Notice</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Refund</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Processing Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-green-50">
                        <td className="px-4 py-3 font-medium text-gray-800">72 hours or more before experience</td>
                        <td className="px-4 py-3 text-center font-bold text-green-700">100% refund</td>
                        <td className="px-4 py-3 text-gray-600">5–10 business days</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-800">24–72 hours before experience</td>
                        <td className="px-4 py-3 text-center font-bold text-yellow-600">50% refund</td>
                        <td className="px-4 py-3 text-gray-600">5–10 business days</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="px-4 py-3 font-medium text-gray-800">Less than 24 hours before experience</td>
                        <td className="px-4 py-3 text-center font-bold text-red-600">No refund</td>
                        <td className="px-4 py-3 text-gray-600">—</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="px-4 py-3 font-medium text-gray-800">No-show (failure to appear)</td>
                        <td className="px-4 py-3 text-center font-bold text-red-600">No refund</td>
                        <td className="px-4 py-3 text-gray-600">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-gray-500">* Service fees charged by MUGOONG are non-refundable. * Refunds are returned to the original payment method only.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">3. How to Cancel a Booking</h2>
                <ol className="list-decimal space-y-1 pl-5">
                  <li>Log in to your MUGOONG account.</li>
                  <li>Go to <strong>My Bookings</strong> from the account menu.</li>
                  <li>Select the booking you wish to cancel.</li>
                  <li>Click <strong>Cancel Booking</strong> and confirm.</li>
                </ol>
                <p className="mt-2">Alternatively, email us at <a href="mailto:support@mugoong.com" className="text-primary-600 underline hover:text-primary-700">support@mugoong.com</a> with your booking confirmation number. Cancellation requests must be submitted before the applicable deadline; the timestamp of your email is used to determine the cancellation window.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">4. Partner Cancellations</h2>
                <p>If a Partner (service provider) cancels your booking for any reason, you will receive a <strong>100% full refund</strong> including any service fees. We will notify you by email immediately and, where possible, help you find an alternative.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">5. Force Majeure</h2>
                <p>In the event of circumstances beyond reasonable control — including but not limited to natural disasters, government-mandated restrictions, severe weather, or public health emergencies — MUGOONG may, at its discretion, offer a full refund or free rebooking regardless of the standard cancellation window.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">6. Refund Processing</h2>
                <p>Approved refunds are processed within <strong>5–10 business days</strong> from approval. Actual credit to your account may take additional time depending on your card issuer or bank. MUGOONG is not responsible for delays caused by financial institutions.</p>
                <p className="mt-2">Refunds are issued only to the original payment method. If your card has been cancelled or expired, contact us at <a href="mailto:support@mugoong.com" className="text-primary-600 underline hover:text-primary-700">support@mugoong.com</a> so we can arrange an alternative.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">7. Disputes & Chargebacks</h2>
                <p>If you believe a charge is incorrect, please contact us at <a href="mailto:support@mugoong.com" className="text-primary-600 underline hover:text-primary-700">support@mugoong.com</a> before initiating a chargeback with your card issuer. We are committed to resolving legitimate disputes promptly. Initiating a chargeback without first contacting us may result in suspension of your MUGOONG account.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-gray-900">8. Contact</h2>
                <p>For any questions about payments or refunds:</p>
                <ul className="mt-2 list-none space-y-1">
                  <li>Email: <a href="mailto:support@mugoong.com" className="text-primary-600 underline hover:text-primary-700">support@mugoong.com</a></li>
                  <li>Response time: within 1–2 business days</li>
                </ul>
                <p className="mt-3">Payment Disputes via Eximbay: <a href="mailto:cs@eximbay.com" className="text-primary-600 underline hover:text-primary-700">cs@eximbay.com</a></p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
