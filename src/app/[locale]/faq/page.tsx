'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';

const faqs = [
  {
    category: 'Booking',
    icon: '📅',
    items: [
      {
        q: 'How do I make a booking on MUGOONG?',
        a: 'Browse listings, select the experience you want, choose your date and number of guests, then complete the booking form. You will receive a confirmation email within 24 hours.',
      },
      {
        q: 'Do I need to create an account to book?',
        a: 'Yes, a free MUGOONG account is required to make bookings. This allows you to view your booking history and manage reservations.',
      },
      {
        q: 'How will I know my booking is confirmed?',
        a: 'You will receive a confirmation email at the address used during booking. Some experiences require manual confirmation from the partner, in which case we will notify you within 24 hours.',
      },
      {
        q: 'Can I modify my booking after it is confirmed?',
        a: 'Booking modifications depend on the individual partner\'s policy. Please contact us at support@mugoong.com with your booking confirmation number and we will assist you.',
      },
      {
        q: 'Is there a booking fee?',
        a: 'Some listings require a small booking deposit or reservation fee. This will be clearly displayed on the listing page before you complete your booking.',
      },
    ],
  },
  {
    category: 'Payment & Refunds',
    icon: '💳',
    items: [
      {
        q: 'What payment methods does MUGOONG accept?',
        a: 'We accept major international credit and debit cards including Visa, Mastercard, JCB, UnionPay, and Alipay, processed securely via Eximbay.',
      },
      {
        q: 'What currency are prices displayed in?',
        a: 'All prices are displayed in Korean Won (₩ KRW) unless otherwise stated on the listing.',
      },
      {
        q: 'What is MUGOONG\'s cancellation policy?',
        a: '72+ hours before the experience: full refund. 24–72 hours before: 50% refund. Less than 24 hours or no-show: no refund. Please review our full Refund & Cancellation Policy for details.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Approved refunds are processed within 5–10 business days back to your original payment method.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payments are processed by Eximbay, a licensed Korean payment gateway. MUGOONG never stores your card details.',
      },
    ],
  },
  {
    category: 'Experiences & Partners',
    icon: '🗺️',
    items: [
      {
        q: 'Are the experiences on MUGOONG available in English?',
        a: 'Many of our partner experiences offer English-speaking staff or guides. Look for the "English-speaking staff available" badge on listing pages.',
      },
      {
        q: 'Can I request a custom group booking?',
        a: 'Yes. Contact us at support@mugoong.com or use the inquiry option on the listing page and we will coordinate with the partner on your behalf.',
      },
      {
        q: 'Are the prices on MUGOONG the same as walking in?',
        a: 'Prices may vary. Some partners offer exclusive rates through MUGOONG. Any booking or reservation fee is clearly shown before payment.',
      },
      {
        q: 'What happens if a partner cancels my booking?',
        a: 'If a partner cancels, you will receive a 100% full refund including any service fees. We will notify you immediately and help you find an alternative where possible.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: '👤',
    items: [
      {
        q: 'How do I create a MUGOONG account?',
        a: 'Click "Sign In" at the top of the page and select "Create Account". You can register with your email address.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'On the login page, click "Forgot password?" and enter your registered email. You will receive a reset link within a few minutes.',
      },
      {
        q: 'How do I delete my account?',
        a: 'To request account deletion, email us at support@mugoong.com with the subject "Account Deletion Request". We will process your request within 7 business days.',
      },
      {
        q: 'How is my personal data used?',
        a: 'Your data is used solely to facilitate bookings and improve your experience. We do not sell personal data to third parties. See our Privacy Policy for full details.',
      },
    ],
  },
  {
    category: 'About MUGOONG',
    icon: '🌸',
    items: [
      {
        q: 'What is MUGOONG?',
        a: 'MUGOONG is an online booking platform connecting international travelers and expatriates with authentic local experiences across Korea — from restaurants and wellness to activities and cultural tours.',
      },
      {
        q: 'Is MUGOONG available in multiple languages?',
        a: 'Yes. MUGOONG is available in English, Korean, Japanese, Chinese, French, German, and Spanish. Select your preferred language from the top menu.',
      },
      {
        q: 'How can I list my business on MUGOONG?',
        a: 'If you are a business in Korea interested in partnering with MUGOONG, please contact us at support@mugoong.com with details about your service.',
      },
      {
        q: 'How do I contact MUGOONG support?',
        a: 'Email us at support@mugoong.com. We respond within 1–2 business days.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Booking');

  const toggle = (key: string) => setOpenItem(openItem === key ? null : key);

  const activeGroup = faqs.find((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
        <div className="container-main">
          <nav className="mb-2 flex items-center gap-2 text-sm text-primary-200">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">FAQ</span>
          </nav>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Frequently Asked Questions</h1>
          <p className="mt-1 text-sm text-primary-100">Find answers to common questions about bookings, payments, and more.</p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="mx-auto max-w-4xl">
          {/* Category tabs */}
          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
            {faqs.map((group) => (
              <button
                key={group.category}
                onClick={() => setActiveCategory(group.category)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === group.category
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{group.icon}</span>
                {group.category}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          {activeGroup && (
            <div className="space-y-3">
              {activeGroup.items.map((item, i) => {
                const key = `${activeCategory}-${i}`;
                const isOpen = openItem === key;
                return (
                  <div key={key} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="pr-4 text-sm font-semibold text-gray-900">{item.q}</span>
                      <span className={`shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-6 py-4">
                        <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Still need help */}
          <div className="mt-10 rounded-2xl bg-primary-50 p-6 text-center">
            <p className="text-sm font-semibold text-primary-800">Still have questions?</p>
            <p className="mt-1 text-sm text-primary-600">Our support team is here to help.</p>
            <a
              href="mailto:support@mugoong.com"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
