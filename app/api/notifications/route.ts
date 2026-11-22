import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';
import { NotificationItem } from '@/lib/types';

function mapNotifRow(row: any): NotificationItem {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    isRead: row.is_read,
    bookingId: row.booking_id,
    createdAt: row.created_at || 'Just now',
  };
}

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let queryText = 'SELECT * FROM notifications WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      params.push(userId);
      queryText += ` AND (user_id = $${params.length} OR user_id = 'user-1' OR user_id = 'user-3')`;
    }

    queryText += ' ORDER BY timestamp DESC';

    const result = await pool.query(queryText, params);
    const notifs = result.rows.map(mapNotifRow);

    return NextResponse.json({ success: true, source: 'postgresql', data: notifs });
  } catch (error: any) {
    console.error('Error fetching notifications from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();
    const { id, markAll, userId } = body;

    if (markAll) {
      if (userId) {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1;', [userId]);
      } else {
        await pool.query('UPDATE notifications SET is_read = TRUE;');
      }
    } else if (id) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1;', [id]);
    }

    return NextResponse.json({ success: true, source: 'postgresql' });
  } catch (error: any) {
    console.error('Error updating notifications in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}
