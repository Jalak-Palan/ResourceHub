'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  ArrowRight,
  Laptop,
  Projector,
  Camera,
  FlaskConical,
  Users,
  Grid,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ResourceCategory } from '@/lib/types';

export default function StudentDashboardScreen() {
  const router = useRouter();
  const {
    currentUser,
    resources,
    bookings,
    unreadCount,
    setSelectedCategory,
    setSearchQuery,
  } = useApp();

  const categories: { label: ResourceCategory; icon: any }[] = [
    { label: 'Laptops', icon: Laptop },
    { label: 'Projectors', icon: Projector },
    { label: 'Cameras', icon: Camera },
    { label: 'Lab Equip.', icon: FlaskConical },
    { label: 'Meeting Rooms', icon: Users },
    { label: 'Others', icon: Grid },
  ];

  const availableNow = resources.filter((r) => r.availableQuantity > 0).slice(0, 4);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Top Greeting Header matching Screen 4:
          Hamburger menu, "Hello, Jalak 👋", "Book resources, get things done!", Bell icon with badge, user avatar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors">
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#29201D] leading-tight flex items-center gap-1.5">
              <span>Hello, {currentUser.name.split(' ')[0]}</span>
              <span>👋</span>
            </h2>
            <p className="text-[11px] text-[#89817D] font-medium">Book resources, get things done!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E77B52] rounded-full ring-2 ring-white" />
            )}
          </Link>
          <Link href="/profile">
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm"
            />
          </Link>
        </div>
      </div>

      {/* Promotional Banner Card matching reference:
          Peach background with "Smart Booking Made Easy ->" and projector / laptop image */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#E77B52] to-[#EB9673] rounded-3xl p-5 text-white shadow-lg shadow-[#E77B52]/20 mb-5">
        {/* Soft background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 rounded-full blur-xl" />

        <div className="relative z-10 max-w-[65%]">
          <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
            Fast Track
          </span>
          <h3 className="text-lg font-extrabold leading-snug">Smart Booking Made Easy</h3>
          <p className="text-xs text-white/90 mt-1 line-clamp-1">
            Reserve premium gear in 2 taps
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 bg-white text-[#E77B52] rounded-xl text-xs font-bold shadow-sm hover:bg-[#FFF7F1] transition-transform active:scale-95"
          >
            <span>Explore Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projector / laptop thumbnail on right */}
        <div className="absolute -right-2 -bottom-2 w-28 h-24 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=300"
            alt="Resource"
            className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white/40 -rotate-6 transform"
          />
        </div>
      </div>

      {/* Categories Section matching reference:
          "Categories" with "See All ->"
          Grid of icons: Laptops, Projectors, Cameras, Lab Equip., Meeting Rooms, Others */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#29201D]">Categories</h3>
          <Link
            href="/resources"
            className="text-xs font-semibold text-[#E77B52] hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => {
                  setSelectedCategory(cat.label);
                  router.push('/resources');
                }}
                className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FFF5EF] rounded-2xl border border-[#F2DED4] shadow-sm hover:border-[#E77B52]/40 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FCEEE5] flex items-center justify-center text-[#E77B52] group-hover:scale-110 transition-transform mb-1.5">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#29201D] text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Now Section matching reference:
          "Available Now" with "See All ->"
          Cards with image, title, available quantity, Book action */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#29201D]">Available Now</h3>
          <Link
            href="/resources"
            className="text-xs font-semibold text-[#E77B52] hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {availableNow.map((res) => (
            <div
              key={res.id}
              onClick={() => router.push(`/resources/${res.id}`)}
              className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md hover:border-[#E77B52]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#F5E5DC] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#29201D] leading-snug">{res.name}</h4>
                  <p className="text-[11px] text-[#89817D] line-clamp-1">{res.description}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#16A34A] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
                    Available: {res.availableQuantity}
                  </span>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-[#FFF7F1] text-[#89817D] group-hover:text-[#E77B52] group-hover:bg-[#FCEEE5] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
