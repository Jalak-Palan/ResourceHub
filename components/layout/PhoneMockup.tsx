'use client';

import React, { ReactNode } from 'react';
import StatusBar from './StatusBar';

interface PhoneMockupProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showHomeIndicator?: boolean;
}

export default function PhoneMockup({
  children,
  title,
  className = '',
  showHomeIndicator = true,
}: PhoneMockupProps) {
  return (
    <div className="flex flex-col items-center">
      {title && (
        <span className="text-xs font-semibold text-[#89817D] mb-2 tracking-wide uppercase">
          {title}
        </span>
      )}
      <div
        className={`w-full max-w-[375px] h-[780px] bg-[#FFF7F1] rounded-[44px] shadow-[0_20px_50px_rgba(41,32,29,0.12)] border-[8px] border-[#29201D] overflow-hidden flex flex-col relative ${className}`}
      >
        {/* Dynamic Island / Notch Speaker */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#29201D] rounded-full z-50 pointer-events-none" />
        
        {/* Status Bar */}
        <StatusBar />

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Home Bar Indicator */}
        {showHomeIndicator && (
          <div className="w-full flex justify-center pb-2 pt-1 bg-transparent pointer-events-none">
            <div className="w-32 h-1 bg-[#29201D]/20 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
