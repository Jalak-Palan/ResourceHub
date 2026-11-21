'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Star,
  Check,
  MapPin,
  Calendar,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ResourceDetailsScreenProps {
  resourceId?: string;
}

export default function ResourceDetailsScreen({
  resourceId = 'res-laptop-1',
}: ResourceDetailsScreenProps) {
  const router = useRouter();
  const { resources, favorites, toggleFavorite } = useApp();

  const resource =
    resources.find((r) => r.id === resourceId) ||
    resources[0] || {
      id: 'res-laptop-1',
      name: 'Laptop',
      description: 'High Performance Laptop',
      category: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      specifications: ['16GB RAM', '512GB SSD', '15.6" Display'],
      totalQuantity: 15,
      availableQuantity: 12,
      location: 'IT Lab, 2nd Floor, Room 204',
      rating: 4.5,
      reviewsCount: 124,
      isActive: true,
    };

  const isFav = favorites.includes(resource.id);

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-[#FFF7F1] pb-6">
      <div>
        {/* Header matching reference Screen 6:
            Back arrow, Title, Heart / Favorite */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(resource.id)}
            className={`p-2 rounded-xl border transition-colors shadow-sm ${
              isFav
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-[#F2DED4] text-[#89817D] hover:text-[#29201D]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Large Equipment Image Container matching reference */}
        <div className="w-full h-52 bg-white rounded-3xl p-4 border border-[#F2DED4] shadow-sm flex items-center justify-center relative overflow-hidden mb-4 group">
          <img
            src={resource.image}
            alt={resource.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-[#FFF7F1] text-[#E77B52] border border-[#F2DED4] text-[10px] font-bold px-2.5 py-1 rounded-full">
            {resource.category}
          </span>
        </div>

        {/* Title, Subtitle, and Rating */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-[#29201D] leading-tight">
                {resource.name}
              </h2>
              <p className="text-xs text-[#89817D] font-medium mt-0.5">
                {resource.description}
              </p>
            </div>
            {/* Star Rating matching reference */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-[#F2DED4] shadow-sm shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-[#29201D]">{resource.rating}</span>
              <span className="text-[10px] text-[#89817D]">({resource.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Specifications & Availability Box matching reference Screen 6:
            Left: Specifications checklist (16GB RAM, 512GB SSD, 15.6" Display)
            Right: Available box (Available / 12 Units) */}
        <div className="p-4 bg-white rounded-2xl border border-[#F2DED4] shadow-sm mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xs font-bold text-[#29201D] mb-2">Specifications</h3>
              <div className="space-y-1.5">
                {resource.specifications.slice(0, 3).map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#29201D]">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#E8F8EE] flex items-center justify-center text-[#16A34A] shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Available Box */}
            <div className="bg-[#E8F8EE] border border-[#BBF7D0] p-3 rounded-2xl text-center min-w-[90px] shrink-0">
              <span className="block text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">
                Available
              </span>
              <span className="block text-sm font-extrabold text-[#15803D] mt-0.5">
                {resource.availableQuantity} Units
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#F5E5DC] text-[11px] text-[#89817D]">
            <MapPin className="w-3.5 h-3.5 text-[#E77B52]" />
            <span>{resource.location}</span>
          </div>
        </div>
      </div>

      {/* Book Now Button matching reference Screen 6 */}
      <div className="pt-2">
        <button
          onClick={() => router.push(`/book/${resource.id}`)}
          disabled={resource.availableQuantity <= 0}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-[0.98] ${
            resource.availableQuantity > 0
              ? 'bg-[#E77B52] hover:bg-[#D3683E] text-white shadow-[#E77B52]/20'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          {resource.availableQuantity > 0 ? 'Book Now' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
