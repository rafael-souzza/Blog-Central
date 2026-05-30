import Link from "next/link";
import { notFound } from "next/navigation";
import db from "../../../../lib/db";

interface Tenant {
  id: number;
  name: string;
  primary_color: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  created_at: string;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;

  const tenantRow = await db
    .prepare("SELECT id, name, primary_color FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as Tenant | undefined;
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

      <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ color: tenant.primary_color || "#3B82F6" }}>
        {post.title}
      </h1>

      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}