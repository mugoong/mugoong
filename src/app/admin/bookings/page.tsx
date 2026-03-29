'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminShell from '@/components/admin/AdminShell';
import type { BookingRow } from '@/lib/supabase/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  confirmed: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  completed: 'bg-blue-50 text-blue-700 ring-blue-200',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    const supabase = createClient();
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter) query = query.eq('status', statusFilter);

    const { data } = await query;
    setBookings(data ?? []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from('bookings').update({ status, admin_notes: adminNotes }).eq('id', id);

    if (status === 'confirmed') {
      await sendConfirmationEmail(bookings.find(b => b.id === id)!);
    }

    setSelectedBooking(null);
    setAdminNotes('');
    fetchBookings();
  };

  const sendConfirmationEmail = async (booking: BookingRow) => {
    setSendingEmail(true);
    try {
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: booking.customer_email,
          customerName: booking.customer_name,
          listingTitle: booking.listing_title,
          bookingDate: booking.booking_date,
          bookingTime: booking.booking_time,
          guests: booking.guests,
          totalPrice: booking.total_price,
        }),
      });
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage reservation requests and confirmations</p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-6 flex gap-2">
        {['', 'pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-200'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-4xl">📅</p>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No bookings yet</h3>
            <p className="mt-2 text-sm text-gray-500">Bookings will appear here when customers make reservations.</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.listing_title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <span className="text-gray-400">Customer:</span>
                      <p className="font-medium text-gray-700">{booking.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <p className="font-medium text-gray-700">{booking.customer_email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Date & Time:</span>
                      <p className="font-medium text-gray-700">{booking.booking_date} at {booking.booking_time}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Guests / Total:</span>
                      <p className="font-medium text-gray-700">{booking.guests} guests · ${booking.total_price}</p>
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Customer note:</span> {booking.notes}
                    </p>
                  )}
                  {booking.admin_notes && (
                    <p className="mt-1 text-sm text-primary-600">
                      <span className="font-medium">Admin note:</span> {booking.admin_notes}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Received: {new Date(booking.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'completed')}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">Confirm Booking</h3>
            <p className="mt-2 text-sm text-gray-500">
              Confirming will send an automatic confirmation email to <strong>{selectedBooking.customer_email}</strong>.
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
              <p><strong>{selectedBooking.listing_title}</strong></p>
              <p>{selectedBooking.booking_date} at {selectedBooking.booking_time}</p>
              <p>{selectedBooking.guests} guests · ${selectedBooking.total_price}</p>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Admin Notes (optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                placeholder="Any internal notes about this booking..."
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setSelectedBooking(null); setAdminNotes(''); }}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(selectedBooking.id, 'confirmed')}
                disabled={sendingEmail}
                className="flex-1 rounded-lg bg-primary-500 py-2.5 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
              >
                {sendingEmail ? 'Sending...' : 'Confirm & Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
