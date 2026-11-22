import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';
import { Booking } from '@/lib/types';
import { generateBookingId } from '@/lib/utils';

function mapBookingRow(row: any): Booking {
  return {
    id: row.id,
    bookingId: row.booking_id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    userRole: row.user_role,
    resourceId: row.resource_id,
    resourceName: row.resource_name,
    resourceImage: row.resource_image,
    resourceCategory: row.resource_category,
    bookingDate: row.booking_date,
    startTime: row.start_time,
    endTime: row.end_time,
    purpose: row.purpose,
    status: row.status,
    issueDate: row.issue_date,
    expectedReturnDate: row.expected_return_date,
    actualReturnDate: row.actual_return_date,
    isOverdue: row.is_overdue,
    createdAt: row.created_at,
  };
}

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let queryText = 'SELECT * FROM bookings WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      params.push(userId);
      queryText += ` AND user_id = $${params.length}`;
    }

    if (status && status !== 'All') {
      params.push(status.toLowerCase());
      queryText += ` AND status = $${params.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await pool.query(queryText, params);
    const bookings = result.rows.map(mapBookingRow);

    return NextResponse.json({ success: true, source: 'postgresql', data: bookings });
  } catch (error: any) {
    console.error('Error fetching bookings from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    await initDatabase();
    await client.query('BEGIN');

    const body = await request.json();
    const {
      resourceId,
      bookingDate,
      startTime,
      endTime,
      purpose,
      userId = 'user-1',
      userName = 'Jalak Palan',
      userEmail = 'jalak@gmail.com',
      userRole = 'student',
    } = body;

    // Check resource availability in PostgreSQL
    const resResult = await client.query(
      'SELECT * FROM resources WHERE id = $1 FOR UPDATE',
      [resourceId]
    );

    if (resResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    const resource = resResult.rows[0];
    if (resource.available_quantity <= 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: `No units available for ${resource.name}` },
        { status: 400 }
      );
    }

    // Decrement available quantity in PostgreSQL
    await client.query(
      'UPDATE resources SET available_quantity = available_quantity - 1 WHERE id = $1',
      [resourceId]
    );

    const bookingId = generateBookingId();
    const id = `book-${Date.now()}`;

    // Insert booking
    const bookingQuery = `
      INSERT INTO bookings (
        id, booking_id, user_id, user_name, user_email, user_role,
        resource_id, resource_name, resource_image, resource_category,
        booking_date, start_time, end_time, purpose, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending')
      RETURNING *;
    `;

    const bookingResult = await client.query(bookingQuery, [
      id,
      bookingId,
      userId,
      userName,
      userEmail,
      userRole,
      resourceId,
      resource.name,
      resource.image,
      resource.category,
      bookingDate,
      startTime,
      endTime,
      purpose,
    ]);

    // Insert user & admin notifications into PostgreSQL
    await client.query(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, booking_id, created_at)
      VALUES
      ($1, $2, $3, $4, 'reminder', FALSE, $5, 'Just now'),
      ($6, 'user-3', $7, $8, 'new_request', FALSE, $5, 'Just now')
    `, [
      `notif-${Date.now()}-user`,
      userId,
      'Booking Submitted',
      `Your request for ${resource.name} (${bookingId}) on ${bookingDate} is pending approval.`,
      bookingId,
      `notif-${Date.now()}-admin`,
      'New booking request',
      `${userName} requested ${resource.name} on ${bookingDate}. Needs approval.`,
    ]);

    await client.query('COMMIT');
    const createdBooking = mapBookingRow(bookingResult.rows[0]);

    return NextResponse.json({ success: true, source: 'postgresql', data: createdBooking }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating booking in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PATCH(request: Request) {
  const client = await pool.connect();
  try {
    await initDatabase();
    await client.query('BEGIN');

    const body = await request.json();
    const { bookingId, status, reason, isReturned } = body;

    // Get current booking
    const bookingRes = await client.query(
      'SELECT * FROM bookings WHERE booking_id = $1 FOR UPDATE',
      [bookingId]
    );

    if (bookingRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookingRes.rows[0];
    const oldStatus = booking.status;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const tomorrowStr = new Date(Date.now() + 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    let newStatus = status || oldStatus;
    let actualReturnDate = booking.actual_return_date;
    let isOverdue = booking.is_overdue;
    let issueDate = booking.issue_date;
    let expectedReturnDate = booking.expected_return_date;

    if (isReturned) {
      newStatus = 'completed';
      actualReturnDate = todayStr;
      isOverdue = false;
      // Increment available inventory in PostgreSQL
      await client.query(
        'UPDATE resources SET available_quantity = LEAST(total_quantity, available_quantity + 1) WHERE id = $1',
        [booking.resource_id]
      );
    } else if (status === 'approved') {
      issueDate = todayStr;
      expectedReturnDate = tomorrowStr;
    } else if (status === 'rejected' || status === 'cancelled') {
      // Restore inventory if previously decremented
      if (oldStatus === 'pending' || oldStatus === 'approved') {
        await client.query(
          'UPDATE resources SET available_quantity = LEAST(total_quantity, available_quantity + 1) WHERE id = $1',
          [booking.resource_id]
        );
      }
    }

    const updateQuery = `
      UPDATE bookings
      SET status = $1, issue_date = $2, expected_return_date = $3,
          actual_return_date = $4, is_overdue = $5, updated_at = NOW()
      WHERE booking_id = $6
      RETURNING *;
    `;

    const updatedRes = await client.query(updateQuery, [
      newStatus,
      issueDate,
      expectedReturnDate,
      actualReturnDate,
      isOverdue,
      bookingId,
    ]);

    // Insert status notification
    const notifTitle =
      newStatus === 'approved'
        ? 'Your booking is approved'
        : newStatus === 'rejected'
        ? 'Your booking is rejected'
        : isReturned
        ? 'Equipment Returned'
        : `Booking status updated to ${newStatus}`;

    const notifMsg =
      newStatus === 'approved'
        ? `Your booking for ${booking.resource_name} (${bookingId}) has been approved.`
        : newStatus === 'rejected'
        ? `Your booking for ${booking.resource_name} was rejected.${reason ? ` Reason: ${reason}` : ''}`
        : isReturned
        ? `${booking.resource_name} (${bookingId}) checked in and returned.`
        : `Booking ${bookingId} is now ${newStatus}.`;

    await client.query(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, booking_id, created_at)
      VALUES ($1, $2, $3, $4, $5, FALSE, $6, 'Just now')
    `, [
      `notif-${Date.now()}`,
      booking.user_id,
      notifTitle,
      notifMsg,
      newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'reminder',
      bookingId,
    ]);

    await client.query('COMMIT');
    const updatedBooking = mapBookingRow(updatedRes.rows[0]);

    return NextResponse.json({ success: true, source: 'postgresql', data: updatedBooking });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error updating booking status in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
