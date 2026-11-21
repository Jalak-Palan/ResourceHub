'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function IssueReturnHistoryScreen() {
  const router = useRouter();
  const { bookings, markAsReturned } = useApp();

  // History includes approved, completed, and overdue bookings
  const historyBookings = bookings.filter(
    (b) => b.issueDate || b.status === 'completed' || b.isOverdue || b.status === 'approved'
  );

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 14:
          Back arrow, "Issue & Return History" */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-[#29201D]">
          Issue & Return History
        </h2>
      </div>

      {/* History Items matching reference Screen 14:
          - Laptop (Issued: 20 Nov, Returned: 21 Nov) -> [Returned] badge (soft green)
          - Projector (Issued: 18 Nov, Returned: 19 Nov) -> [Returned] badge
          - Camera (Issued: 16 Nov, Returned: 17 Nov) -> [Returned] badge
          Plus interactive "Mark as Returned" for currently issued equipment! */}
      <div className="space-y-3">
        {historyBookings.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-[#F2DED4] text-center text-xs text-[#89817D]">
            No equipment checkout records yet.
          </div>
        ) : (
          historyBookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.resourceImage}
                  alt={b.resourceName}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#F5E5DC]"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-tight">
                    {b.resourceName}
                  </h4>
                  <p className="text-[11px] text-[#89817D] mt-0.5">
                    Issued: {b.issueDate || b.bookingDate}
                  </p>
                  <p className="text-[11px] text-[#89817D]">
                    Returned:{' '}
                    {b.actualReturnDate
                      ? b.actualReturnDate
                      : b.isOverdue
                      ? 'Overdue'
                      : 'Pending Check-in'}
                  </p>
                  <p className="text-[10px] text-[#89817D]">
                    Student: <span className="font-semibold text-[#29201D]">{b.userName}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge or Return Action matching reference */}
              <div className="flex flex-col items-end gap-1.5">
                {b.actualReturnDate || b.status === 'completed' ? (
                  <span className="text-[11px] font-bold text-[#16A34A] bg-[#E8F8EE] border border-[#BBF7D0] px-3 py-1 rounded-xl">
                    Returned
                  </span>
                ) : b.isOverdue ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] border border-[#FECACA] px-2.5 py-0.5 rounded-xl">
                      Overdue
                    </span>
                    <button
                      onClick={() => markAsReturned(b.bookingId)}
                      className="text-[10px] font-bold text-[#E77B52] bg-[#FCEEE5] hover:bg-[#E77B52] hover:text-white px-2 py-0.5 rounded-lg transition-colors"
                    >
                      Check In
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => markAsReturned(b.bookingId)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#E77B52] bg-[#FCEEE5] hover:bg-[#E77B52] hover:text-white px-3 py-1 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Check In</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
