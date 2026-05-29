import { notFound } from "next/navigation";
import db from "../../../../lib/db";

interface Post {
  id: number;
  tenant_id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;

  const tenantRow = await db
    .prepare("SELECT id FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as { id: number } | undefined;
  if (!tenant) return notFound();

  const postRow = await db
    .prepare("SELECT * FROM posts WHERE tenant_id = ? AND slug = ?")
    .get(tenant.id, postSlug);
  const post = postRow as unknown as Post | undefined;
  if (!post) return notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}