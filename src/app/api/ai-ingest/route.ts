// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Parâmetro tenant_id é obrigatório' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT * FROM posts WHERE tenant_id = ? ORDER BY created_at DESC',
      args: [Number(tenantId)],
    });

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}