// src/app/api/tenants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM tenants ORDER BY created_at DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, primary_color, secondary_color, sections } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'Slug e name são obrigatórios' }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO tenants (slug, name, primary_color, secondary_color, sections) VALUES (?, ?, ?, ?, ?)`,
      args: [
        slug,
        name,
        primary_color || '#3B82F6',
        secondary_color || '#1E3A5F',
        typeof sections === 'string' ? sections : JSON.stringify(sections || []),
      ],
    });

    // lastInsertRowid pode ser bigint | undefined; tratamos isso
    if (result.lastInsertRowid === undefined || result.lastInsertRowid === null) {
      throw new Error('Falha ao obter ID do tenant inserido');
    }

    const newTenantResult = await db.execute({
      sql: 'SELECT * FROM tenants WHERE id = ?',
      args: [Number(result.lastInsertRowid)],
    });

    const newTenant = newTenantResult.rows[0];
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}