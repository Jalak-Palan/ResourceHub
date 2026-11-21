'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  CalendarDays,
  Bell,
  User,
  LayoutDashboard,
  Package,
  CheckSquare,
  Clock,
  LogOut,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, unreadCount, logout } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const studentLinks = [
    { label: 'Welcome / Intro', href: '/welcome', icon: Sparkles },
    { label: 'Student Dashboard', href: '/dashboard', icon: Home },
    { label: 'Browse Resources', href: '/resources', icon: Layers },
    { label: 'My Bookings', href: '/bookings', icon: CalendarDays },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Student Profile', href: '/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Resources', href: '/admin/resources', icon: Package },
    { label: 'Booking Requests', href: '/admin/bookings', icon: CheckSquare },
    { label: 'Issue & Return History', href: '/admin/history', icon: Clock },
    { label: 'System Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const currentLinks = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F3E2D8] min-h-[calc(100vh-65px)] p-4 justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-[#FFF7F1] rounded-2xl border border-[#F5E5DC] flex items-center gap-3">
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#29201D] truncate">{currentUser.name}</h4>
            <p className="text-xs text-[#89817D] capitalize truncate">
              {currentUser.role} • {currentUser.department?.split(' ')[0] || 'Member'}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#89817D] px-3 mb-2">
            {isAdmin ? 'Admin Management' : 'Student Navigation'}
          </p>
          <div className="space-y-1">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#E77B52] text-white shadow-sm shadow-[#E77B52]/20'
                      : 'text-[#89817D] hover:text-[#29201D] hover:bg-[#FFF7F1]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-[#E77B52]' : 'bg-[#E77B52] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Switch Section */}
        <div className="pt-4 border-t border-[#F5E5DC]">
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#89817D] px-3 mb-2">
            Quick Switch
          </p>
          <div className="space-y-1">
            {!isAdmin ? (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-[#E77B52] hover:bg-[#FFF7F1] rounded-xl transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Switch to Admin View</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-[#E77B52] hover:bg-[#FFF7F1] rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Switch to Student View</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-[#F5E5DC]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
