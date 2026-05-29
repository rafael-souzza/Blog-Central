import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import db from "../../../../lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const post = await db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(Number(id));

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const postId = Number(id);

    const existing = await db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(postId);

    if (!existing) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const allowedFields = ["title", "content", "slug", "category", "status", "image_url"];
    const updates: string[] = [];
    const values: any[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    values.push(postId);

    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`;
    await db.prepare(query).run(...values);

    const updatedPost = await db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(postId);

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);

    const existing = await db
      .prepare("SELECT id FROM posts WHERE id = ?")
      .get(postId);

    if (!existing) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    await db.prepare("DELETE FROM posts WHERE id = ?").run(postId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}