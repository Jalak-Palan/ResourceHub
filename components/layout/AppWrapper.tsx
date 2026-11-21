'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader';
import Sidebar from '@/components/navigation/Sidebar';
import BottomNav from '@/components/navigation/BottomNav';
import PhoneMockup from './PhoneMockup';
import ScreenShowcaseDeck from '@/components/screens/ScreenShowcaseDeck';
import { useApp } from '@/context/AppContext';

export default function AppWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { viewMode } = useApp();

  const isAuthPage =
    pathname === '/login' || pathname === '/signup' || pathname === '/welcome';

  return (
    <div className="min-h-screen bg-[#FFF7F1] flex flex-col font-sans text-[#29201D] selection:bg-[#F8D8C8] selection:text-[#29201D]">
      {/* Top Header matching reference */}
      <TopHeader />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* If user toggled 15-screen preview deck */}
        {viewMode === 'preview-deck' ? (
          <div className="flex-1 w-full bg-[#FFF7F1] overflow-x-hidden">
            <ScreenShowcaseDeck />
          </div>
        ) : viewMode === 'device-frame' ? (
          /* Phone mockup view matching mobile reference image */
          <div className="flex-1 flex items-center justify-center py-8 px-4 bg-[#FFF0E6]/50 min-h-[calc(100vh-65px)]">
            <PhoneMockup className="h-[760px]">{children}</PhoneMockup>
          </div>
        ) : (
          /* Responsive standard desktop/tablet/mobile layout */
          <div className="flex-1 flex w-full max-w-7xl mx-auto">
            {!isAuthPage && <Sidebar />}
            <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-y-auto">
              {children}
            </main>
          </div>
        )}
      </div>

      {/* Bottom navigation on mobile devices */}
      {viewMode === 'responsive' && !isAuthPage && <BottomNav />}
    </div>
  );
}
