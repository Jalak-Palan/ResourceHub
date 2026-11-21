import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ResourceModel } from '@/models/Resource';
import { INITIAL_RESOURCES } from '@/lib/mock-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const db = await connectToDatabase();
    if (db) {
      let query: any = { isActive: true };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const resources = await ResourceModel.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, source: 'mongodb', data: resources });
    }

    // Demo Mode fallback
    let filtered = [...INITIAL_RESOURCES];
    if (category && category !== 'All') {
      filtered = filtered.filter((r) => r.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, source: 'demo', data: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectToDatabase();

    if (db) {
      const created = await ResourceModel.create(body);
      return NextResponse.json({ success: true, source: 'mongodb', data: created }, { status: 201 });
    }

    const demoResource = {
      ...body,
      id: `res-${Date.now()}`,
      isActive: true,
    };
    return NextResponse.json({ success: true, source: 'demo', data: demoResource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
