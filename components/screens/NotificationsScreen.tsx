'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NotificationType } from '@/lib/types';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const userNotifs =
    currentUser.role === 'admin'
      ? notifications
      : notifications.filter((n) => n.userId === currentUser.id || n.userId === 'user-1');

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'approved':
        return (
          <div className="w-8 h-8 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#16A34A] shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
        );
      case 'rejected':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'reminder':
      case 'overdue':
        return (
          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-[#FCEEE5] flex items-center justify-center text-[#E77B52] shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 15:
          Back arrow, "Notifications", "Mark all read" */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-[#29201D]">Notifications</h2>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-[#E77B52] hover:underline flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List matching reference Screen 15:
          1. "Your booking is approved" (22 Nov, 09:30 AM)
          2. "Maintenance scheduled" (21 Nov, 06:00 PM)
          3. "New resource added" (20 Nov, 02:15 PM)
          4. "Your booking is rejected" (19 Nov, 01:20 PM) */}
      <div className="space-y-3">
        {userNotifs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-[#F2DED4] text-center text-xs text-[#89817D]">
            No notifications right now.
          </div>
        ) : (
          userNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                item.isRead
                  ? 'bg-white border-[#F2DED4] shadow-sm opacity-90'
                  : 'bg-white border-[#E77B52]/40 shadow-md ring-1 ring-[#E77B52]/10'
              }`}
            >
              {getNotifIcon(item.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#89817D] whitespace-nowrap">
                    {item.createdAt}
                  </span>
                </div>
                <p className="text-[11px] text-[#89817D] mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#E77B52] shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
