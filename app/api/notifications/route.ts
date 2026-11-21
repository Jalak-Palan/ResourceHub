import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { NotificationModel } from '@/models/Notification';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const db = await connectToDatabase();
    if (db) {
      const query = userId ? { userId } : {};
      const notifs = await NotificationModel.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, source: 'mongodb', data: notifs });
    }

    return NextResponse.json({ success: true, source: 'demo', data: INITIAL_NOTIFICATIONS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll, userId } = body;

    const db = await connectToDatabase();
    if (db) {
      if (markAll) {
        await NotificationModel.updateMany({ userId }, { $set: { isRead: true } });
      } else if (id) {
        await NotificationModel.findByIdAndUpdate(id, { $set: { isRead: true } });
      }
      return NextResponse.json({ success: true, source: 'mongodb' });
    }

    return NextResponse.json({ success: true, source: 'demo' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}
