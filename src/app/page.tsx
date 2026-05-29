import Link from "next/link";
import db from "../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  tenant_id: number;
  created_at: string;
}

export default async function Home() {
  const tenantsRows = await db
    .prepare("SELECT id, slug, name FROM tenants ORDER BY id")
    .all();
  const tenants = tenantsRows as unknown as Tenant[];

  const postsRows = await db
    .prepare(
      "SELECT p.id, p.title, p.slug, p.tenant_id, p.created_at, t.slug as tenant_slug FROM posts p JOIN tenants t ON p.tenant_id = t.id WHERE p.status = 'published' ORDER BY p.created_at DESC LIMIT 10"
    )
    .all();
  const posts = postsRows as unknown as (Post & { tenant_slug: string })[];

  return (
    <main>
      <h1>Bem-vindo ao Blog Central</h1>
      <p>Escolha um blog para visitar:</p>
      <ul>
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <Link href={`/blog/${tenant.slug}`}>{tenant.name}</Link>
          </li>
        ))}
      </ul>
      <h2>Últimos posts publicados</h2>
      {posts.length === 0 ? (
        <p>Nenhum post publicado ainda.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.tenant_slug}/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}