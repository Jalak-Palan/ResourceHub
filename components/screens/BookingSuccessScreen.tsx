'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Sparkles, Calendar, Clock, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/context/AppContext';

function BookingSuccessContent({
  bookingIdOverride,
}: {
  bookingIdOverride?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings } = useApp();

  const queryId = searchParams ? searchParams.get('id') : null;
  const bookingId = bookingIdOverride || queryId || '#RH20261122001';
  const booking = bookings.find((b) => b.bookingId === bookingId) || bookings[0];

  useEffect(() => {
    // Fire confetti celebration matching reference screen 8
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#E77B52', '#F8D8C8', '#22C55E', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFF7F1] relative overflow-hidden text-center">
      {/* Background confetti dots decoration matching reference */}
      <div className="absolute top-10 left-8 w-2 h-2 rounded-full bg-[#E77B52]/40" />
      <div className="absolute top-16 right-10 w-2.5 h-2.5 rounded-full bg-[#22C55E]/40" />
      <div className="absolute top-36 left-14 w-2 h-2 rounded-full bg-[#F59E0B]/40" />
      <div className="absolute top-40 right-16 w-3 h-3 rounded-full bg-[#E77B52]/50" />

      <div className="my-auto py-4 flex flex-col items-center">
        {/* Big Green Circle with Checkmark matching reference Screen 8 */}
        <div className="w-20 h-20 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-lg shadow-[#22C55E]/30 mb-5 relative group">
          <Check className="w-10 h-10 stroke-[3]" />
          <div className="absolute -inset-2 rounded-full bg-[#22C55E]/20 animate-ping pointer-events-none -z-10" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-extrabold text-[#29201D] tracking-tight">
          Booking Confirmed!
        </h2>
        <p className="text-xs text-[#89817D] mt-2 max-w-xs font-medium leading-relaxed">
          Your booking has been successfully submitted.
        </p>

        {/* Booking ID badge matching reference Screen 8:
            "#RH20261122001" in rounded soft container */}
        <div className="mt-5 px-5 py-2.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm">
          <span className="block text-[10px] font-bold text-[#89817D] uppercase tracking-wider">
            Booking ID
          </span>
          <span className="block text-sm font-extrabold text-[#29201D] mt-0.5 tracking-wide">
            {bookingId}
          </span>
        </div>

        {/* Summary Card */}
        {booking && (
          <div className="mt-4 p-3 bg-white/60 rounded-2xl border border-[#F2DED4] max-w-xs w-full text-left space-y-1 text-xs">
            <div className="flex items-center justify-between text-[#89817D]">
              <span>Equipment:</span>
              <span className="font-bold text-[#29201D]">{booking.resourceName}</span>
            </div>
            <div className="flex items-center justify-between text-[#89817D]">
              <span>Slot:</span>
              <span className="font-semibold text-[#29201D]">
                {booking.bookingDate} ({booking.startTime})
              </span>
            </div>
            <div className="flex items-center justify-between text-[#89817D]">
              <span>Status:</span>
              <span className="font-bold text-[#15803D] bg-[#E8F8EE] px-2 py-0.5 rounded-full text-[10px]">
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Button matching reference Screen 8:
          "View My Bookings" */}
      <div className="pt-2">
        <Link
          href="/bookings"
          className="w-full flex items-center justify-center py-3.5 px-4 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#E77B52]/20 transition-all active:scale-[0.98]"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessScreen({
  bookingIdOverride,
}: {
  bookingIdOverride?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-6 text-xs text-[#89817D]">
          Loading booking details...
        </div>
      }
    >
      <BookingSuccessContent bookingIdOverride={bookingIdOverride} />
    </Suspense>
  );
}
