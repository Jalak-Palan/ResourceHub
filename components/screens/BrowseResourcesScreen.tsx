'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ResourceCategory } from '@/lib/types';

export default function BrowseResourcesScreen() {
  const router = useRouter();
  const {
    resources,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const categories: (ResourceCategory | 'All')[] = [
    'All',
    'Laptops',
    'Projectors',
    'Cameras',
    'Lab Equip.',
    'Meeting Rooms',
    'Others',
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 5:
          Back arrow, "Resources" */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold text-[#29201D]">Resources</h2>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-[#89817D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-medium text-[#29201D] placeholder-[#B5ACA7] focus:outline-none focus:border-[#E77B52] focus:ring-2 focus:ring-[#E77B52]/20 shadow-sm"
        />
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#E77B52] text-white shadow-sm shadow-[#E77B52]/25'
                : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources Cards List matching reference Screen 5:
          Laptop, Projector, Camera, Meeting Room cards with image, name, subtitle, available count, right chevron */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#F2DED4] p-6">
            <p className="text-xs font-bold text-[#29201D]">No resources found</p>
            <p className="text-[11px] text-[#89817D] mt-1">
              Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 px-3.5 py-1.5 bg-[#E77B52] text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              onClick={() => router.push(`/resources/${res.id}`)}
              className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md hover:border-[#E77B52]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#F5E5DC] group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-snug">
                    {res.name}
                  </h4>
                  <p className="text-[11px] text-[#89817D] line-clamp-1">{res.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
                      Available: {res.availableQuantity}
                    </span>
                    <span className="text-[10px] text-[#89817D]">
                      Total: {res.totalQuantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1.5 rounded-xl bg-[#FFF7F1] text-[#89817D] group-hover:text-[#E77B52] group-hover:bg-[#FCEEE5] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
