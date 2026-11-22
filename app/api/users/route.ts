import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';
import { User } from '@/lib/types';

function mapUserRow(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    profileImage: row.profile_image,
    department: row.department,
    studentId: row.student_id,
    phone: row.phone,
  };
}

export async function GET() {
  try {
    await initDatabase();
    const result = await pool.query('SELECT * FROM users ORDER BY created_at ASC;');
    const users = result.rows.map(mapUserRow);
    return NextResponse.json({ success: true, source: 'postgresql', data: users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();
    const { name, email, role = 'student', department, studentId, phone } = body;

    const id = `user-${Date.now()}`;
    const profileImage =
      role === 'admin'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
        : role === 'staff'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

    const result = await pool.query(`
      INSERT INTO users (id, name, email, role, profile_image, department, student_id, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role
      RETURNING *;
    `, [id, name, email, role, profileImage, department, studentId, phone]);

    const user = mapUserRow(result.rows[0]);
    return NextResponse.json({ success: true, source: 'postgresql', data: user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
