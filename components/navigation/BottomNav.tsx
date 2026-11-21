'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, Bell, User, LayoutDashboard, Package, CheckSquare, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, unreadCount } = useApp();

  const isAdmin = currentUser.role === 'admin';

  const studentNavItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Bookings', href: '/bookings', icon: CalendarDays },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Resources', href: '/admin/resources', icon: Package },
    { label: 'Bookings', href: '/admin/bookings', icon: CheckSquare },
    { label: 'History', href: '/admin/history', icon: Clock },
    { label: 'Notifications', href: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const items = isAdmin ? adminNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2E0D6] px-4 py-2 shadow-card lg:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 relative rounded-xl transition-all ${
                isActive ? 'text-[#E77B52]' : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-[#E77B52] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium ${
                  isActive ? 'text-[#E77B52] font-semibold' : 'text-[#89817D]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
