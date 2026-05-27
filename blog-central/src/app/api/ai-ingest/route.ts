// src/app/api/ai-ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

interface AiPostInput {
  title: string;
  content: string;
  slug: string;
  tenant_slug: string; // identificador do tenant pelo slug
  category?: string;
  image_url?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AiPostInput = await request.json();
    const { title, content, slug, tenant_slug, category, image_url, status } = body;

    // Validações básicas
    if (!title || !content || !slug || !tenant_slug) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, content, slug, tenant_slug' },
        { status: 400 }
      );
    }

    // Busca o tenant pelo slug
    const tenant = db.prepare('SELECT id FROM tenants WHERE slug = ?').get(tenant_slug) as { id: number } | undefined;
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    // Insere o post (status padrão: published, a menos que especificado)
    const stmt = db.prepare(`
      INSERT INTO posts (tenant_id, title, slug, content, image_url, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      tenant.id,
      title,
      slug,
      content,
      image_url || null,
      category || 'general',
      status || 'published'
    );

    const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    // Trata violação de UNIQUE (slug duplicado por tenant)
    if (error.message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Slug do post já existe neste tenant' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}