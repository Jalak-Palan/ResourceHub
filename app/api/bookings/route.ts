import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BookingModel } from '@/models/Booking';
import { ResourceModel } from '@/models/Resource';
import { INITIAL_BOOKINGS } from '@/lib/mock-data';
import { generateBookingId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const db = await connectToDatabase();
    if (db) {
      let query: any = {};
      if (userId) query.userId = userId;
      if (status && status !== 'All') query.status = status.toLowerCase();

      const bookings = await BookingModel.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, source: 'mongodb', data: bookings });
    }

    let filtered = [...INITIAL_BOOKINGS];
    if (userId) filtered = filtered.filter((b) => b.userId === userId);
    if (status && status !== 'All') {
      filtered = filtered.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({ success: true, source: 'demo', data: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resourceId, bookingDate, startTime, endTime, purpose, userId, userName, userEmail } = body;

    const db = await connectToDatabase();
    if (db) {
      const resource = await ResourceModel.findById(resourceId);
      if (!resource || resource.availableQuantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'Resource unavailable for requested slot.' },
          { status: 400 }
        );
      }

      const bookingId = generateBookingId();
      const booking = await BookingModel.create({
        bookingId,
        userId: userId || 'user-1',
        userName: userName || 'Student Scholar',
        userEmail: userEmail || 'student@resourcehub.edu',
        resourceId,
        resourceName: resource.name,
        resourceImage: resource.image,
        resourceCategory: resource.category,
        bookingDate,
        startTime,
        endTime,
        purpose,
        status: 'pending',
      });

      // Decrement quantity
      await ResourceModel.findByIdAndUpdate(resourceId, {
        $inc: { availableQuantity: -1 },
      });

      return NextResponse.json({ success: true, source: 'mongodb', data: booking }, { status: 201 });
    }

    // Demo Mode fallback
    const newBookingId = generateBookingId();
    const demoBooking = {
      id: `book-${Date.now()}`,
      bookingId: newBookingId,
      userId: userId || 'user-1',
      userName: userName || 'Jalak Palan',
      userEmail: userEmail || 'jalak@gmail.com',
      resourceId,
      resourceName: body.resourceName || 'Equipment',
      resourceImage: body.resourceImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      resourceCategory: body.resourceCategory || 'Laptops',
      bookingDate,
      startTime,
      endTime,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, source: 'demo', data: demoBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
