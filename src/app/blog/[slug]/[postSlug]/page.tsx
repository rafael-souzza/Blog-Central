import Link from "next/link";
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
    .prepare("SELECT id, name FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as { id: number; name: string } | undefined;
  if (!tenant) return notFound();

  const postRow = await db
    .prepare("SELECT * FROM posts WHERE tenant_id = ? AND slug = ? AND status = 'published'")
    .get(tenant.id, postSlug);
  const post = postRow as unknown as Post | undefined;
  if (!post) return notFound();

  return (
    <article>
      <Link
        href={`/blog/${slug}`}
        className="text-blue-600 hover:underline text-sm mb-4 inline-block"
      >
        ← Voltar para {tenant.name}
      </Link>

      <p className="text-sm text-gray-400 mb-2">
        {new Date(post.created_at + "Z").toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}