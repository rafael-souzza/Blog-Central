import { NextRequest, NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {
    const tenants = await db
      .prepare("SELECT * FROM tenants ORDER BY created_at DESC")
      .all();

    return NextResponse.json(tenants, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, primary_color, secondary_color, sections } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { error: "Slug e name são obrigatórios" },
        { status: 400 }
      );
    }

    const insert = await db
      .prepare(
        `INSERT INTO tenants (slug, name, primary_color, secondary_color, sections)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(
        slug,
        name,
        primary_color || "#3B82F6",
        secondary_color || "#1E3A5F",
        typeof sections === "string" ? sections : JSON.stringify(sections || [])
      );

    if (!insert.lastInsertRowid) {
      throw new Error("Falha ao obter ID do tenant inserido");
    }

    const newTenant = await db
      .prepare("SELECT * FROM tenants WHERE id = ?")
      .get(Number(insert.lastInsertRowid));

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}