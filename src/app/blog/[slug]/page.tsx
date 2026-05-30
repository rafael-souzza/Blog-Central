import Link from "next/link";
import { notFound } from "next/navigation";
import db from "../../../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  sections: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  section: string | null;
  created_at: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").substring(0, 180);
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { slug } = await params;
  const { section } = await searchParams;

  const tenantRow = await db
    .prepare("SELECT * FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as Tenant | undefined;
  if (!tenant) return notFound();

  const primaryColor = tenant.primary_color || "#002b50";
  const secondaryColor = "#fbcd39";

  let postsRows: any[];
  if (section) {
    postsRows = await db
      .prepare("SELECT id, title, slug, content, section, created_at FROM posts WHERE tenant_id = ? AND status = 'published' AND section = ? ORDER BY created_at DESC")
      .all(tenant.id, section);
  } else {
    postsRows = await db
      .prepare("SELECT id, title, slug, content, section, created_at FROM posts WHERE tenant_id = ? AND status = 'published' ORDER BY created_at DESC")
      .all(tenant.id);
  }
  const posts = postsRows as unknown as Post[];

  // Post em destaque (primeiro)
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div>
      {section && (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: primaryColor, paddingBottom: 8, borderBottom: "2px solid " + secondaryColor }}>
            {section}
          </h1>
        </div>
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, backgroundColor: "#fff", borderRadius: 8, border: "1px solid #e0e0e0" }}>
          <p style={{ color: "#666" }}>Nenhum post publicado ainda.</p>
        </div>
      ) : (
        <>
          {/* Destaque */}
          {featured && !section && (
            <div style={{ marginBottom: 24 }}>
              <Link href={`/blog/${tenant.slug}/${featured.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #e0e0e0" }}>
                  <div style={{ padding: 24 }}>
                    {featured.section && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: secondaryColor, textTransform: "uppercase", marginBottom: 8, display: "inline-block" }}>
                        {featured.section}
                      </span>
                    )}
                    <h1 style={{ fontSize: 36, fontWeight: 700, color: primaryColor, margin: "8px 0" }}>
                      {featured.title}
                    </h1>
                    <p style={{ fontSize: 16, color: "#444", lineHeight: 1.6, marginBottom: 12 }}>
                      {stripHtml(featured.content)}...
                    </p>
                    <p style={{ fontSize: 13, color: "#999" }}>
                      {new Date(featured.created_at + "Z").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid de posts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {(section ? posts : rest).map((post) => (
              <Link key={post.id} href={`/blog/${tenant.slug}/${post.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #e0e0e0", height: "100%" }}>
                  <div style={{ padding: 20 }}>
                    {post.section && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: secondaryColor, textTransform: "uppercase" }}>
                        {post.section}
                      </span>
                    )}
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: primaryColor, margin: "8px 0" }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>
                      {stripHtml(post.content)}...
                    </p>
                    <p style={{ fontSize: 12, color: "#999", marginTop: 12 }}>
                      {new Date(post.created_at + "Z").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}