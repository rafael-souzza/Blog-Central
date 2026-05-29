import Link from "next/link";
import { notFound } from "next/navigation";
import db from "../../../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  sections: string;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  created_at: string;
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
      "SELECT id, title, slug, status, created_at FROM posts WHERE tenant_id = ? AND status = 'published' ORDER BY created_at DESC"
    )
    .all(tenant.id);
  const posts = postsRows as unknown as Post[];

  return (
    <main>
      <h1>{tenant.name}</h1>
      {posts.length === 0 ? (
        <p>Nenhum post publicado ainda.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${tenant.slug}/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}