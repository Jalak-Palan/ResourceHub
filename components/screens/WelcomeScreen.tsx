'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Laptop, Projector, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { switchUserRole } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFF7F1] relative overflow-hidden">
      {/* Background soft peach glowing blobs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#FCEEE5] rounded-full blur-2xl -z-0 opacity-80" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F8D8C8]/60 rounded-full blur-xl -z-0" />

      {/* Top Branding / Tag */}
      <div className="pt-2 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-[#E77B52] border border-[#F5E5DC] shadow-sm mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ResourceHub 2026</span>
        </div>
      </div>

      {/* Center Equipment Showcase Illustration */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
        <div className="relative w-full max-w-[280px] h-[220px] flex items-center justify-center">
          {/* Soft background shape */}
          <div className="absolute inset-0 bg-[#FCEEE5] rounded-3xl -rotate-2 transform scale-95 transition-transform" />
          <div className="absolute inset-0 bg-[#F8D8C8]/50 rounded-3xl rotate-3 transform scale-90" />
          
          {/* Equipment collage with high quality images */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Laptop */}
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400"
              alt="High Performance Laptop"
              className="w-36 h-28 object-cover rounded-xl shadow-lg -rotate-6 transform hover:scale-105 transition-all border-2 border-white"
            />
            {/* Projector */}
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400"
              alt="Full HD Projector"
              className="w-28 h-20 object-cover rounded-xl shadow-lg translate-y-8 -translate-x-6 z-20 hover:scale-105 transition-all border-2 border-white"
            />
            {/* DSLR Camera */}
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400"
              alt="DSLR Camera"
              className="w-24 h-20 object-cover rounded-xl shadow-lg -translate-y-6 translate-x-2 z-10 hover:scale-105 transition-all border-2 border-white"
            />
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="text-center mt-6 max-w-xs">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#29201D] tracking-tight">
            Book Your Resources
          </h1>
          <p className="text-sm text-[#89817D] mt-2 font-medium leading-relaxed">
            Access and reserve college equipment easily.
          </p>
        </div>

        {/* Carousel Dots Indicator */}
        <div className="flex items-center gap-1.5 mt-5">
          <span className="w-5 h-1.5 rounded-full bg-[#E77B52]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E77B52]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E77B52]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E77B52]/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E77B52]/40" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 relative z-10 pb-2">
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-sm shadow-md shadow-[#E77B52]/25 transition-all active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Role Quick links */}
        <div className="flex items-center justify-center gap-3 pt-1 text-xs text-[#89817D]">
          <span>Quick Demo as:</span>
          <button
            onClick={() => {
              switchUserRole('student');
              router.push('/dashboard');
            }}
            className="font-semibold text-[#E77B52] hover:underline"
          >
            Student
          </button>
          <span>•</span>
          <button
            onClick={() => {
              switchUserRole('admin');
              router.push('/admin');
            }}
            className="font-semibold text-[#E77B52] hover:underline"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
