'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Listing } from '@/types';

export default function BookingForm({ listing }: { listing: Listing }) {
  const t = useTranslations('booking');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = listing.price * guests;

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          listing_title: listing.title,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          booking_date: date,
          booking_time: time,
          guests,
          total_price: total,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
        <div className="mb-4 text-5xl">🎉</div>
        <h3 className="text-lg font-bold text-gray-900">Booking Request Sent!</h3>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;ve received your reservation request for <strong>{listing.title}</strong>.
        </p>
        <div className="mt-4 rounded-lg bg-primary-50 p-4 text-left text-sm">
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {time}</p>
          <p><strong>Guests:</strong> {guests}</p>
          <p><strong>Total:</strong> ${total}</p>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          You&apos;ll receive a confirmation email within 24 hours at <strong>{email}</strong>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleBooking} className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-1 text-lg font-bold text-gray-900">{t('title')}</h3>
      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-sm text-gray-500">From</span>
        <span className="text-3xl font-bold text-primary-600">${listing.price}</span>
        <span className="text-sm text-gray-500">/ person</span>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Your Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="+82-10-XXXX-XXXX"
          />
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('selectDate')} *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Time */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('selectTime')} *
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="">{t('selectTime')}</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('guests')}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600"
            >
              −
            </button>
            <span className="w-12 text-center text-lg font-semibold text-gray-800">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests(Math.min(20, guests + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600"
            >
              +
            </button>
            <span className="text-sm text-gray-500">
              {guests === 1 ? t('guest') : t('guestsPlural')}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Special Requests (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Any dietary restrictions, allergies, or special requests..."
          />
        </div>

        {/* Total */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              ${listing.price} × {guests} {guests === 1 ? t('guest') : t('guestsPlural')}
            </span>
            <span className="text-xl font-bold text-gray-900">${total}</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-500 py-4 text-base font-semibold text-white transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Request Booking'}
        </button>

        {/* Trust signals */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('instantConfirmation')}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            No payment required — pay at venue
          </div>
        </div>
      </div>
    </form>
  );
}
