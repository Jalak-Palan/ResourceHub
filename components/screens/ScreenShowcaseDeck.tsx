'use client';

import React, { useState } from 'react';
import PhoneMockup from '@/components/layout/PhoneMockup';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import StudentDashboardScreen from './StudentDashboardScreen';
import BrowseResourcesScreen from './BrowseResourcesScreen';
import ResourceDetailsScreen from './ResourceDetailsScreen';
import BookingFormScreen from './BookingFormScreen';
import BookingSuccessScreen from './BookingSuccessScreen';
import MyBookingsScreen from './MyBookingsScreen';
import ProfileScreen from './ProfileScreen';
import AdminDashboardScreen from './AdminDashboardScreen';
import ManageResourcesScreen from './ManageResourcesScreen';
import BookingApprovalScreen from './BookingApprovalScreen';
import IssueReturnHistoryScreen from './IssueReturnHistoryScreen';
import NotificationsScreen from './NotificationsScreen';
import { Smartphone, LayoutGrid, Sparkles, Filter, Maximize2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ScreenShowcaseDeck() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'student' | 'admin'>('all');
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);

  const screens = [
    // Row 1: Student Onboarding & Discovery
    {
      id: 1,
      title: '1. Welcome Screen',
      section: 'student',
      route: '/welcome',
      component: <WelcomeScreen />,
    },
    {
      id: 2,
      title: '2. Login Page',
      section: 'student',
      route: '/login',
      component: <LoginScreen />,
    },
    {
      id: 3,
      title: '3. Signup Page',
      section: 'student',
      route: '/signup',
      component: <SignupScreen />,
    },
    {
      id: 4,
      title: '4. Student Dashboard',
      section: 'student',
      route: '/dashboard',
      component: <StudentDashboardScreen />,
    },
    {
      id: 5,
      title: '5. Browse Resources',
      section: 'student',
      route: '/resources',
      component: <BrowseResourcesScreen />,
    },

    // Row 2: Booking Flow & Profile
    {
      id: 6,
      title: '6. Resource Details',
      section: 'student',
      route: '/resources/res-laptop-1',
      component: <ResourceDetailsScreen />,
    },
    {
      id: 7,
      title: '7. Booking Form',
      section: 'student',
      route: '/book/res-laptop-1',
      component: <BookingFormScreen />,
    },
    {
      id: 8,
      title: '8. Success Page',
      section: 'student',
      route: '/booking-success',
      component: <BookingSuccessScreen />,
    },
    {
      id: 9,
      title: '9. My Bookings',
      section: 'student',
      route: '/bookings',
      component: <MyBookingsScreen />,
    },
    {
      id: 10,
      title: '10. Profile Page',
      section: 'student',
      route: '/profile',
      component: <ProfileScreen />,
    },

    // Row 3: Admin Section
    {
      id: 11,
      title: '11. Admin Dashboard',
      section: 'admin',
      route: '/admin',
      component: <AdminDashboardScreen />,
    },
    {
      id: 12,
      title: '12. Manage Resources',
      section: 'admin',
      route: '/admin/resources',
      component: <ManageResourcesScreen />,
    },
    {
      id: 13,
      title: '13. Booking Approval',
      section: 'admin',
      route: '/admin/bookings',
      component: <BookingApprovalScreen />,
    },
    {
      id: 14,
      title: '14. Issue & Return History',
      section: 'admin',
      route: '/admin/history',
      component: <IssueReturnHistoryScreen />,
    },
    {
      id: 15,
      title: '15. Notifications',
      section: 'student',
      route: '/notifications',
      component: <NotificationsScreen />,
    },
  ];

  const filteredScreens = screens.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.section === activeFilter;
  });

  return (
    <div className="py-6 px-4 md:px-8 max-w-[1900px] mx-auto">
      {/* Banner matching top header of reference design */}
      <div className="text-center mb-8 bg-gradient-to-b from-[#FFF7F1] to-[#FCEEE5] p-6 rounded-3xl border border-[#F5E5DC] shadow-sm max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#E77B52] border border-[#F5E5DC] shadow-sm mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete 15-Screen Design Implementation</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#29201D] tracking-tight">
          Resource<span className="text-[#E77B52]">Hub</span> UI Showcase
        </h1>
        <p className="text-sm md:text-base text-[#89817D] mt-2 font-medium">
          Book • Manage • Track — All 15 Screens Built to Match Reference Layout & Theme
        </p>

        {/* Filter Bar */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
            }`}
          >
            All 15 Screens
          </button>
          <button
            onClick={() => setActiveFilter('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'student'
                ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
            }`}
          >
            Student Screens (1-10 & 15)
          </button>
          <button
            onClick={() => setActiveFilter('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'admin'
                ? 'bg-[#E77B52] text-white shadow-md shadow-[#E77B52]/20'
                : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
            }`}
          >
            Admin Management (11-14)
          </button>
        </div>
      </div>

      {/* Grid of Phone Mockups matching the 5-columns x 3-rows layout of uploaded image! */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
        {filteredScreens.map((screen) => (
          <div key={screen.id} className="flex flex-col items-center group w-full max-w-[340px]">
            {/* Direct Open Link pill */}
            <div className="flex items-center justify-between w-full px-2 mb-2">
              <span className="text-xs font-bold text-[#29201D] truncate">
                {screen.title}
              </span>
              <Link
                href={screen.route}
                className="text-[11px] font-bold text-[#E77B52] hover:underline flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
              >
                <span>Live Route</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Mobile Mockup Card */}
            <div className="w-full transform group-hover:-translate-y-1 transition-transform duration-300">
              <PhoneMockup className="h-[680px] shadow-card group-hover:shadow-float border-[6px] border-[#29201D]">
                {screen.component}
              </PhoneMockup>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
