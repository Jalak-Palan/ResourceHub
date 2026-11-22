import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const { id } = params;
    const body = await request.json();

    const {
      name,
      description,
      category,
      totalQuantity,
      availableQuantity,
      location,
      image,
      isActive,
    } = body;

    let updates: string[] = [];
    let values: any[] = [];

    if (name !== undefined) {
      values.push(name);
      updates.push(`name = $${values.length}`);
    }
    if (description !== undefined) {
      values.push(description);
      updates.push(`description = $${values.length}`);
    }
    if (category !== undefined) {
      values.push(category);
      updates.push(`category = $${values.length}`);
    }
    if (totalQuantity !== undefined) {
      values.push(totalQuantity);
      updates.push(`total_quantity = $${values.length}`);
    }
    if (availableQuantity !== undefined) {
      values.push(availableQuantity);
      updates.push(`available_quantity = $${values.length}`);
    }
    if (location !== undefined) {
      values.push(location);
      updates.push(`location = $${values.length}`);
    }
    if (image !== undefined) {
      values.push(image);
      updates.push(`image = $${values.length}`);
    }
    if (isActive !== undefined) {
      values.push(isActive);
      updates.push(`is_active = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'No fields to update' });
    }

    values.push(id);
    const queryText = `
      UPDATE resources
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(queryText, values);
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, source: 'postgresql', data: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating resource in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase();
    const { id } = params;

    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *;', [id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, source: 'postgresql', message: 'Resource deleted' });
  } catch (error: any) {
    console.error('Error deleting resource in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
