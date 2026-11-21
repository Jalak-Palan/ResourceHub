'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Package,
  CalendarCheck,
  Bell,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { getStats, bookings, unreadCount } = useApp();
  const stats = getStats();

  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 11:
          "Admin Dashboard", Bell icon with unread badge */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#29201D]">Admin Dashboard</h2>
          <p className="text-[11px] text-[#89817D]">Resource & Booking Control Center</p>
        </div>

        <Link
          href="/notifications"
          className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E77B52] rounded-full ring-2 ring-white" />
          )}
        </Link>
      </div>

      {/* 3 Metric Stats Cards matching reference Screen 11:
          120 Total Users | 35 Total Resources | 245 Total Bookings */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {/* Total Users */}
        <div className="bg-white p-3 rounded-2xl border border-[#F2DED4] shadow-sm text-center">
          <div className="w-7 h-7 rounded-xl bg-[#FCEEE5] flex items-center justify-center text-[#E77B52] mx-auto mb-1.5">
            <Users className="w-4 h-4" />
          </div>
          <span className="block text-base font-extrabold text-[#29201D]">
            {stats.totalUsers}
          </span>
          <span className="block text-[10px] font-semibold text-[#89817D] uppercase tracking-tight mt-0.5">
            Total Users
          </span>
        </div>

        {/* Total Resources */}
        <div className="bg-white p-3 rounded-2xl border border-[#F2DED4] shadow-sm text-center">
          <div className="w-7 h-7 rounded-xl bg-[#FCEEE5] flex items-center justify-center text-[#E77B52] mx-auto mb-1.5">
            <Package className="w-4 h-4" />
          </div>
          <span className="block text-base font-extrabold text-[#29201D]">
            {stats.totalResources}
          </span>
          <span className="block text-[10px] font-semibold text-[#89817D] uppercase tracking-tight mt-0.5">
            Total Resources
          </span>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-3 rounded-2xl border border-[#F2DED4] shadow-sm text-center">
          <div className="w-7 h-7 rounded-xl bg-[#FCEEE5] flex items-center justify-center text-[#E77B52] mx-auto mb-1.5">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <span className="block text-base font-extrabold text-[#29201D]">
            {stats.totalBookings}
          </span>
          <span className="block text-[10px] font-semibold text-[#89817D] uppercase tracking-tight mt-0.5">
            Total Bookings
          </span>
        </div>
      </div>

      {/* Booking Trends Chart matching reference Screen 11:
          Title "Booking Trends", Area/curve chart with Sep, Oct, Nov, Dec */}
      <div className="bg-white p-4 rounded-3xl border border-[#F2DED4] shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#E77B52]" />
            <h3 className="text-xs font-bold text-[#29201D]">Booking Trends</h3>
          </div>
          <span className="text-[10px] font-bold text-[#16A34A] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
            +18.4% this mo
          </span>
        </div>

        {/* Dynamic Curved SVG Area Chart */}
        <div className="relative h-28 w-full mt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="peachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E77B52" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E77B52" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Horizontal guide lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#F5E5DC" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="#F5E5DC" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="300" y2="80" stroke="#F5E5DC" />

            {/* Smooth area under curve */}
            <path
              d="M 10 75 Q 70 65, 110 45 T 200 50 T 290 20 L 290 85 L 10 85 Z"
              fill="url(#peachGradient)"
            />

            {/* Curved trend line */}
            <path
              d="M 10 75 Q 70 65, 110 45 T 200 50 T 290 20"
              fill="none"
              stroke="#E77B52"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data points */}
            <circle cx="10" cy="75" r="3" fill="#E77B52" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="110" cy="45" r="3" fill="#E77B52" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="200" cy="50" r="3" fill="#E77B52" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="290" cy="20" r="4" fill="#E77B52" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Month labels matching reference: Sep, Oct, Nov, Dec */}
          <div className="flex justify-between text-[10px] font-semibold text-[#89817D] mt-2 px-2">
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Pending Bookings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#29201D]">Pending Requests</h3>
          <Link
            href="/admin/bookings"
            className="text-[11px] font-bold text-[#E77B52] hover:underline flex items-center gap-1"
          >
            <span>Review All ({pendingBookings.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-[#F2DED4] text-center text-xs text-[#89817D]">
            All requests reviewed! No pending bookings.
          </div>
        ) : (
          pendingBookings.slice(0, 2).map((b) => (
            <div
              key={b.id}
              className="p-3 bg-white rounded-2xl border border-[#F2DED4] shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={b.resourceImage}
                  alt={b.resourceName}
                  className="w-11 h-11 rounded-xl object-cover border border-[#F5E5DC]"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#29201D]">{b.resourceName}</h4>
                  <p className="text-[10px] text-[#89817D]">
                    {b.userName} • {b.bookingDate}
                  </p>
                </div>
              </div>

              <Link
                href="/admin/bookings"
                className="px-3 py-1.5 bg-[#E77B52] text-white text-[11px] font-bold rounded-xl shadow-sm hover:bg-[#D3683E] transition-colors"
              >
                Review
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
