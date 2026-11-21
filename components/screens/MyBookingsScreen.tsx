'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { BookingStatus } from '@/lib/types';

export default function MyBookingsScreen() {
  const router = useRouter();
  const { bookings, currentUser } = useApp();
  const [selectedTab, setSelectedTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Completed'>('All');

  const tabs: ('All' | 'Pending' | 'Approved' | 'Rejected' | 'Completed')[] = [
    'All',
    'Pending',
    'Approved',
    'Rejected',
  ];

  // Filter bookings for current user (or show all if admin)
  const userBookings =
    currentUser.role === 'admin'
      ? bookings
      : bookings.filter((b) => b.userId === currentUser.id || b.userEmail === currentUser.email);

  const filteredBookings = userBookings.filter((b) => {
    if (selectedTab === 'All') return true;
    return b.status.toLowerCase() === selectedTab.toLowerCase();
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="text-[10px] font-bold text-[#16A34A] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full">
            Status: Approved
          </span>
        );
      case 'pending':
        return (
          <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">
            Status: Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2.5 py-0.5 rounded-full">
            Status: Rejected
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-[#89817D] bg-gray-100 px-2.5 py-0.5 rounded-full">
            Status: {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 9:
          Back arrow, "My Bookings" */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-[#29201D]">My Bookings</h2>
      </div>

      {/* Tabs matching reference Screen 9:
          [All] [Pending] [Approved] [Rejected] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTab === tab
                ? 'bg-[#E77B52] text-white shadow-sm'
                : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Booking Cards matching reference Screen 9:
          Laptop (22 Nov, 10:00 AM, Status: Approved)
          Projector (25 Nov, 02:00 PM, Status: Pending)
          Camera (28 Nov, 11:00 AM, Status: Rejected) */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#F2DED4] p-6">
            <p className="text-xs font-bold text-[#29201D]">No bookings found</p>
            <p className="text-[11px] text-[#89817D] mt-1">
              You haven't made any {selectedTab !== 'All' ? selectedTab.toLowerCase() : ''} bookings yet.
            </p>
            <Link
              href="/resources"
              className="inline-block mt-3 px-3.5 py-1.5 bg-[#E77B52] text-white rounded-xl text-xs font-semibold"
            >
              Browse Equipment
            </Link>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md hover:border-[#E77B52]/40 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={b.resourceImage}
                  alt={b.resourceName}
                  className="w-14 h-14 rounded-xl object-cover border border-[#F5E5DC] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-snug">
                    {b.resourceName}
                  </h4>
                  <p className="text-[11px] text-[#89817D] mt-0.5">
                    {b.bookingDate}, {b.startTime}
                  </p>
                  <div className="mt-1.5">{getStatusBadge(b.status)}</div>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-[#FFF7F1] text-[#89817D] group-hover:text-[#E77B52] group-hover:bg-[#FCEEE5] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
