'use client';

import React from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[#29201D] text-xs font-semibold select-none">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <Battery className="w-4 h-4 stroke-[2.5] fill-current" />
      </div>
    </div>
  );
}
