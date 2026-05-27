// src/app/api/tenants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db'; // ✅ correto

// GET /api/tenants — lista todos os tenants
export async function GET() {
  try {
    const stmt = db.prepare('SELECT * FROM tenants ORDER BY created_at DESC');
    const tenants = stmt.all();
    return NextResponse.json(tenants, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/tenants — cria um novo tenant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, primary_color, secondary_color, sections } = body;

    // Validações básicas
    if (!slug || !name) {
      return NextResponse.json({ error: 'Slug e name são obrigatórios' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO tenants (slug, name, primary_color, secondary_color, sections)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      slug,
      name,
      primary_color || '#3B82F6',
      secondary_color || '#1E3A5F',
      typeof sections === 'string' ? sections : JSON.stringify(sections || [])
    );

    const newTenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error: any) {
    // Trata violação de UNIQUE (slug duplicado)
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}