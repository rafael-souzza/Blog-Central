import Link from "next/link";
import db from "../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  tenant_id: number;
  tenant_slug: string;
  tenant_name: string;
  content: string;
  created_at: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").substring(0, 120);
}

export default async function Home() {
  const tenantsRows = await db
    .prepare("SELECT id, slug, name, primary_color FROM tenants ORDER BY id")
    .all();
  const tenants = tenantsRows as unknown as Tenant[];

  const postsRows = await db
    .prepare(
      `SELECT p.id, p.title, p.slug, p.tenant_id, p.content, p.created_at, t.slug as tenant_slug, t.name as tenant_name
       FROM posts p
       JOIN tenants t ON p.tenant_id = t.id
       WHERE p.status = 'published'
       ORDER BY p.created_at DESC
       LIMIT 10`
    )
    .all();
  const posts = postsRows as unknown as (Post & { content: string })[];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <header style={{ backgroundColor: "#002b50", color: "#fff", padding: "40px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "Roboto Slab, serif" }}>Blog Central</h1>
          <p style={{ fontSize: 16, marginTop: 8, opacity: 0.8 }}>Escolha um blog para visitar</p>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#002b50", marginBottom: 20, fontFamily: "Roboto Slab, serif" }}>Blogs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {tenants.map((tenant) => (
              <Link
                key={tenant.id}
                href={`/blog/${tenant.slug}`}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 24,
                  border: "1px solid #e0e0e0",
                  textDecoration: "none",
                  borderTop: `4px solid ${tenant.primary_color || "#002b50"}`,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#002b50", fontFamily: "Roboto Slab, serif" }}>{tenant.name}</h3>
                <p style={{ fontSize: 14, color: "#666", marginTop: 4 }}>/blog/{tenant.slug}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#002b50", marginBottom: 20, fontFamily: "Roboto Slab, serif" }}>Últimos posts</h2>
          {posts.length === 0 ? (
            <p style={{ color: "#666" }}>Nenhum post publicado ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.tenant_slug}/${post.slug}`}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 20,
                    border: "1px solid #e0e0e0",
                    textDecoration: "none",
                  }}
                >
                  <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                    {post.tenant_name} • {new Date(post.created_at + "Z").toLocaleDateString("pt-BR")}
                  </p>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#002b50", fontFamily: "Roboto Slab, serif" }}>{post.title}</h3>
                  <p style={{ fontSize: 14, color: "#444", marginTop: 4 }}>{stripHtml(post.content)}...</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={{ backgroundColor: "#002b50", color: "#fff", padding: "32px 0", marginTop: 48, textAlign: "center" }}>
        <p style={{ fontSize: 13, opacity: 0.7 }}>© {new Date().getFullYear()} Blog Central. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}