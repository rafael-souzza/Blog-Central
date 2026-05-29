import Link from "next/link";
import { notFound } from "next/navigation";
import db from "../../../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  created_at: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").substring(0, 200);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tenantRow = await db
    .prepare("SELECT * FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as Tenant | undefined;
  if (!tenant) return notFound();

  const postsRows = await db
    .prepare(
      "SELECT id, title, slug, content, status, created_at FROM posts WHERE tenant_id = ? AND status = 'published' ORDER BY created_at DESC"
    )
    .all(tenant.id);
  const posts = postsRows as unknown as Post[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
        <p className="text-gray-500 mt-1">Blog</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Nenhum post publicado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${tenant.slug}/${post.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-400 mb-1">
                {new Date(post.created_at + "Z").toLocaleDateString("pt-BR")}
              </p>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {stripHtml(post.content)}...
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}