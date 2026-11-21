'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Clock, Calendar, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BookingStatus } from '@/lib/types';
import Modal from '@/components/ui/Modal';

export default function BookingApprovalScreen() {
  const router = useRouter();
  const { bookings, updateBookingStatus } = useApp();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Schedule overlap or maintenance slot');

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const filtered = bookings.filter((b) => b.status === selectedTab);

  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, 'approved');
  };

  const handleRejectConfirm = () => {
    if (rejectingBookingId) {
      updateBookingStatus(rejectingBookingId, 'rejected', rejectReason);
      setRejectingBookingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 13:
          Back arrow, "Booking Requests" */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-[#29201D]">Booking Requests</h2>
      </div>

      {/* Tabs matching reference Screen 13:
          [Pending (3)] (active with badge) [Approved] [Rejected] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
            selectedTab === 'pending'
              ? 'bg-[#E77B52] text-white shadow-sm'
              : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
          }`}
        >
          <span>Pending</span>
          {pendingCount > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedTab === 'pending' ? 'bg-white text-[#E77B52]' : 'bg-[#E77B52] text-white'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSelectedTab('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'approved'
              ? 'bg-[#E77B52] text-white shadow-sm'
              : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setSelectedTab('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'rejected'
              ? 'bg-[#E77B52] text-white shadow-sm'
              : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Booking Requests List matching reference Screen 13:
          Laptop (22 Nov, 10:00 AM) -> [Approve] [Reject]
          Projector (22 Nov, 02:00 PM) -> [Approve] [Reject]
          Camera (23 Nov, 11:00 AM) -> [Approve] [Reject] */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-[#F2DED4] text-center text-xs text-[#89817D]">
            No {selectedTab} booking requests at the moment.
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="p-3.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={b.resourceImage}
                  alt={b.resourceName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#F5E5DC]"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-tight">
                    {b.resourceName}
                  </h4>
                  <p className="text-[11px] text-[#89817D] mt-0.5">
                    {b.bookingDate}, {b.startTime}
                  </p>
                  <p className="text-[10px] text-[#89817D]">
                    By: <span className="font-semibold text-[#29201D]">{b.userName}</span> ({b.purpose})
                  </p>
                </div>
              </div>

              {/* Action Buttons matching reference:
                  [Approve] (green button with soft green border)
                  [Reject] (red button) */}
              {b.status === 'pending' ? (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleApprove(b.bookingId)}
                    className="px-3.5 py-1.5 bg-[#E8F8EE] hover:bg-[#D1F2DD] text-[#16A34A] border border-[#BBF7D0] text-xs font-bold rounded-xl transition-colors active:scale-95"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => setRejectingBookingId(b.bookingId)}
                    className="px-3.5 py-1.5 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#DC2626] border border-[#FECACA] text-xs font-bold rounded-xl transition-colors active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="self-end sm:self-center">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-xl ${
                      b.status === 'approved'
                        ? 'bg-[#E8F8EE] text-[#16A34A]'
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingBookingId}
        onClose={() => setRejectingBookingId(null)}
        title="Reject Booking Request"
        description="Please specify a reason for declining this equipment reservation:"
        confirmText="Confirm Rejection"
        variant="danger"
        onConfirm={handleRejectConfirm}
      >
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={3}
          className="w-full p-2.5 bg-[#FFF7F1] rounded-xl border border-[#F2DED4] text-xs font-medium text-[#29201D]"
        />
      </Modal>
    </div>
  );
}
