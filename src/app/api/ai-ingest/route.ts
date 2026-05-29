import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantSlug, title, content } = body;

    if (!tenantSlug || !title || !content) {
      return NextResponse.json(
        { error: "Os campos tenantSlug, title e content são obrigatórios" },
        { status: 400 }
      );
    }

    const tenantRow = await db
      .prepare("SELECT id FROM tenants WHERE slug = ?")
      .get(tenantSlug);
    const tenant = tenantRow as unknown as { id: number } | undefined;

    if (!tenant) {
      return NextResponse.json({ error: "Tenant não encontrado" }, { status: 404 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const result = await db.prepare(`
      INSERT INTO posts (tenant_id, title, slug, content, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'published', datetime('now'), datetime('now'))
    `).run(tenant.id, title, slug, content);

    const post = await db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}