'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface BookingFormScreenProps {
  resourceId?: string;
}

export default function BookingFormScreen({
  resourceId = 'res-laptop-1',
}: BookingFormScreenProps) {
  const router = useRouter();
  const { resources, createBooking } = useApp();

  const resource =
    resources.find((r) => r.id === resourceId) || resources[0];

  const [bookingDate, setBookingDate] = useState('2026-11-22');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [purpose, setPurpose] = useState('Project Presentation');
  const [errorMessage, setErrorMessage] = useState('');

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  const purposes = [
    'Project Presentation',
    'Laboratory Experiment / Research',
    'Class Seminar & Lecture',
    'Student Club Activity',
    'Exam / Academic Assessment',
    'Other Academic Purpose',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resource) {
      setErrorMessage('Please select a valid resource');
      return;
    }

    const [startTime, endTime] = selectedTimeSlot.split(' - ');

    const result = createBooking({
      resourceId: resource.id,
      bookingDate,
      startTime: startTime || '10:00 AM',
      endTime: endTime || '11:00 AM',
      purpose,
    });

    if (result.success && result.booking) {
      router.push(`/booking-success?id=${encodeURIComponent(result.booking.bookingId)}`);
    } else {
      setErrorMessage(result.error || 'Failed to complete booking.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 bg-[#FFF7F1] pb-6">
      <div>
        {/* Header matching reference Screen 7:
            Back arrow, "Book Resource" */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-[#29201D]">Book Resource</h2>
        </div>

        {/* Selected Resource Mini Card matching reference */}
        {resource && (
          <div className="flex items-center gap-3.5 p-3 bg-white rounded-2xl border border-[#F2DED4] shadow-sm mb-4">
            <img
              src={resource.image}
              alt={resource.name}
              className="w-14 h-14 rounded-xl object-cover border border-[#F5E5DC]"
            />
            <div>
              <h3 className="text-xs font-bold text-[#29201D] leading-snug">{resource.name}</h3>
              <p className="text-[11px] text-[#89817D] line-clamp-1">{resource.description}</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-[#16A34A] bg-[#E8F8EE] px-2 py-0.5 rounded-full">
                {resource.availableQuantity} units available
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form id="booking-form" onSubmit={handleConfirm} className="space-y-4">
          {/* Select Date Card matching reference:
              Label "Select Date", date picker box with calendar icon */}
          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1.5">
              Select Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-[#E77B52] absolute left-3.5 pointer-events-none" />
              <input
                type="date"
                value={bookingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-semibold text-[#29201D] shadow-sm focus:outline-none focus:border-[#E77B52]"
                required
              />
            </div>
          </div>

          {/* Select Time Slot matching reference:
              Label "Select Time", clock icon */}
          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1.5">
              Select Time
            </label>
            <div className="relative flex items-center mb-2">
              <Clock className="w-4 h-4 text-[#E77B52] absolute left-3.5 pointer-events-none" />
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-semibold text-[#29201D] shadow-sm focus:outline-none focus:border-[#E77B52] appearance-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Slot Pills */}
            <div className="grid grid-cols-2 gap-1.5">
              {timeSlots.slice(0, 4).map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold text-center transition-all ${
                    selectedTimeSlot === slot
                      ? 'bg-[#E77B52] text-white shadow-sm'
                      : 'bg-white text-[#89817D] border border-[#F2DED4] hover:bg-[#FFF7F1]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose Dropdown matching reference */}
          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1.5">
              Purpose
            </label>
            <div className="relative flex items-center">
              <FileText className="w-4 h-4 text-[#E77B52] absolute left-3.5 pointer-events-none" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white rounded-2xl border border-[#F2DED4] text-xs font-semibold text-[#29201D] shadow-sm focus:outline-none focus:border-[#E77B52]"
              >
                {purposes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Confirm Booking Button matching reference Screen 7 */}
      <div className="pt-4">
        <button
          type="submit"
          form="booking-form"
          className="w-full py-3.5 px-4 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-2xl font-bold text-xs shadow-md shadow-[#E77B52]/20 transition-all active:scale-[0.98]"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
