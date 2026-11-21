'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GraduationCap, Users, Shield, Wrench, Smartphone, Monitor, Grid } from 'lucide-react';

export default function TopHeader() {
  const { currentUser, switchUserRole, viewMode, setViewMode, activeScreenId } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFF7F1]/95 backdrop-blur-md border-b border-[#F5E5DC] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Logo & Name exactly matching the reference top left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#E77B52] flex items-center justify-center text-white shadow-md shadow-[#E77B52]/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold tracking-tight text-[#29201D]">Resource</span>
                <span className="text-xl font-bold tracking-tight text-[#E77B52]">Hub</span>
              </div>
              <p className="text-[11px] font-medium text-[#89817D] -mt-1 hidden sm:block">
                Equipment & Resource Booking System
              </p>
            </div>
          </Link>

          {/* Vertical divider and tagline matching reference header */}
          <div className="hidden lg:flex items-center h-8 pl-4 border-l border-[#EAD7CD]">
            <span className="text-xs font-semibold tracking-wide text-[#29201D]">
              Book • Manage • Track
            </span>
            <span className="text-xs text-[#89817D] ml-2 font-normal">
              — All Your Resources in One Place
            </span>
          </div>
        </div>

        {/* Right Controls: Role Switcher & View Switcher */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* Quick Screen Showcase / View Mode Toggles */}
          <div className="flex items-center bg-white/80 p-1 rounded-xl border border-[#F2DED4] shadow-sm">
            <button
              onClick={() => setViewMode('preview-deck')}
              title="Interactive 15-Screen Showcase Deck"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'preview-deck'
                  ? 'bg-[#E77B52] text-white shadow-sm'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">15 Screens</span>
            </button>

            <button
              onClick={() => setViewMode('device-frame')}
              title="Mobile Device Mockup View (Reference Match)"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'device-frame'
                  ? 'bg-[#E77B52] text-white shadow-sm'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile Frame</span>
            </button>

            <button
              onClick={() => setViewMode('responsive')}
              title="Full Responsive Web View"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                viewMode === 'responsive'
                  ? 'bg-[#E77B52] text-white shadow-sm'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web App</span>
            </button>
          </div>

          {/* Role Switcher Pills matching reference top right: [Students] [Admin] [Garage/Staff] */}
          <div className="flex items-center bg-[#FCEEE5]/80 p-1 rounded-xl border border-[#F0D5C7]">
            <button
              onClick={() => switchUserRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currentUser.role === 'student'
                  ? 'bg-white text-[#E77B52] shadow-sm font-bold'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students</span>
            </button>

            <button
              onClick={() => switchUserRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-[#E77B52] text-white shadow-sm font-bold'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => switchUserRole('staff')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                currentUser.role === 'staff'
                  ? 'bg-white text-[#E77B52] shadow-sm font-bold'
                  : 'text-[#89817D] hover:text-[#29201D]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Garage/Staff</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
