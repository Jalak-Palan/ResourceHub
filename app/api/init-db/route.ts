import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();

    const usersCount = await pool.query('SELECT COUNT(*) FROM users;');
    const resCount = await pool.query('SELECT COUNT(*) FROM resources;');
    const bookCount = await pool.query('SELECT COUNT(*) FROM bookings;');
    const notifCount = await pool.query('SELECT COUNT(*) FROM notifications;');

    return NextResponse.json({
      success: true,
      database: 'PostgreSQL',
      status: 'Connected & Initialized',
      counts: {
        users: parseInt(usersCount.rows[0].count, 10),
        resources: parseInt(resCount.rows[0].count, 10),
        bookings: parseInt(bookCount.rows[0].count, 10),
        notifications: parseInt(notifCount.rows[0].count, 10),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Database error' },
      { status: 500 }
    );
  }
}
