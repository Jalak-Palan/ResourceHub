import { NextResponse } from 'next/server';
import pool, { initDatabase } from '@/lib/db';
import { Resource } from '@/lib/types';

// Map PostgreSQL snake_case row to camelCase Resource interface
function mapResourceRow(row: any): Resource {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    image: row.image,
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || []),
    totalQuantity: parseInt(row.total_quantity, 10),
    availableQuantity: parseInt(row.available_quantity, 10),
    location: row.location,
    rating: parseFloat(row.rating) || 4.5,
    reviewsCount: parseInt(row.reviews_count, 10) || 0,
    isActive: row.is_active,
  };
}

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let queryText = 'SELECT * FROM resources WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await pool.query(queryText, params);
    const resources = result.rows.map(mapResourceRow);

    return NextResponse.json({ success: true, source: 'postgresql', data: resources });
  } catch (error: any) {
    console.error('Error fetching resources from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const body = await request.json();
    const {
      name,
      description,
      category,
      image,
      specifications = [],
      totalQuantity = 1,
      availableQuantity = 1,
      location = 'Campus Lab',
    } = body;

    const id = `res-${Date.now()}`;
    const specsJson = JSON.stringify(specifications);

    const queryText = `
      INSERT INTO resources (
        id, name, description, category, image, specifications,
        total_quantity, available_quantity, location, rating, reviews_count, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, 4.8, 1, TRUE)
      RETURNING *;
    `;

    const result = await pool.query(queryText, [
      id,
      name,
      description,
      category,
      image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      specsJson,
      totalQuantity,
      availableQuantity,
      location,
    ]);

    const created = mapResourceRow(result.rows[0]);

    // Also insert system notification in PostgreSQL
    await pool.query(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      `notif-${Date.now()}`,
      'user-3',
      'New resource added',
      `${name} (${category}) was added to inventory.`,
      'system',
      false,
      'Just now',
    ]);

    return NextResponse.json({ success: true, source: 'postgresql', data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating resource in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
