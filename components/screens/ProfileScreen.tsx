'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Calendar,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/ui/Modal';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout, unreadCount } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Menu items according to Prompt instruction:
  // "My Vehicles should NOT appear; this is an equipment booking application."
  // Menu items: My Bookings, Notifications, Help and Support, About App
  const menuItems = [
    {
      label: 'My Bookings',
      icon: Calendar,
      action: () => router.push('/bookings'),
    },
    {
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount,
      action: () => router.push('/notifications'),
    },
    {
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => setShowHelpModal(true),
    },
    {
      label: 'About App',
      icon: Info,
      action: () => setShowAboutModal(true),
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      <div>
        {/* Header matching reference Screen 10:
            "Profile", Settings icon */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#29201D]">Profile</h2>
          <button
            onClick={() => alert('Settings menu: Profile preferences, Notification toggles')}
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar, Name and Email matching reference */}
        <div className="text-center py-4">
          <div className="relative inline-block">
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#22C55E] border-2 border-white rounded-full" />
          </div>
          <h3 className="text-base font-extrabold text-[#29201D] mt-2.5">
            {currentUser.name}
          </h3>
          <p className="text-xs text-[#89817D]">{currentUser.email}</p>
          <div className="mt-1.5 inline-block px-2.5 py-0.5 bg-[#FCEEE5] text-[#E77B52] rounded-full text-[10px] font-bold uppercase tracking-wider">
            {currentUser.role} • {currentUser.studentId || 'ID: #RH-2026'}
          </div>
        </div>

        {/* Menu Items Card List matching reference Screen 10 */}
        <div className="bg-white rounded-2xl border border-[#F2DED4] shadow-sm divide-y divide-[#F5E5DC] overflow-hidden my-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3.5 hover:bg-[#FFF7F1] transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#FFF7F1] flex items-center justify-center text-[#E77B52] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#29201D]">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && item.badge > 0 ? (
                    <span className="px-1.5 py-0.5 bg-[#E77B52] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                  <ChevronRight className="w-4 h-4 text-[#89817D] group-hover:text-[#E77B52] transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button matching reference Screen 10:
          Peach/orange button at bottom */}
      <div className="pt-3">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3 px-4 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#E77B52]/20 transition-all active:scale-[0.98]"
        >
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out of your ResourceHub session?"
        confirmText="Log Out"
        variant="danger"
        onConfirm={() => {
          logout();
          router.push('/login');
        }}
      />

      {/* About Modal */}
      <Modal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About ResourceHub"
        cancelText="Close"
      >
        <div className="text-xs text-[#29201D] space-y-2">
          <p className="font-semibold">ResourceHub – Equipment & Resource Booking System</p>
          <p className="text-[#89817D]">
            A state-of-the-art resource allocation and equipment booking platform designed for colleges, research laboratories, and modern academic departments.
          </p>
          <div className="p-2.5 bg-[#FFF7F1] rounded-xl border border-[#F5E5DC] text-[11px] text-[#89817D]">
            <span className="font-bold text-[#E77B52]">Version: 2.4.0</span> • Built with Next.js App Router, Tailwind CSS, and MongoDB.
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Help & Support"
        cancelText="Close"
      >
        <div className="text-xs text-[#29201D] space-y-2.5">
          <p className="text-[#89817D]">
            Need assistance with your equipment reservation or reporting a hardware issue?
          </p>
          <div className="p-2.5 bg-[#FFF7F1] rounded-xl border border-[#F5E5DC] space-y-1">
            <p className="font-semibold text-[#29201D]">Support Desk</p>
            <p className="text-[11px] text-[#89817D]">Email: support@resourcehub.edu</p>
            <p className="text-[11px] text-[#89817D]">Phone: +1 (555) 019-2834 (IT Lab Wing 2)</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
