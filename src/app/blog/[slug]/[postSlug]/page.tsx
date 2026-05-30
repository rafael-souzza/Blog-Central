import Link from "next/link";
import { notFound } from "next/navigation";
import db from "../../../../lib/db";

interface Tenant {
  name: string;
  primary_color: string;
}

interface Post {
  title: string;
  content: string;
  section: string | null;
  created_at: string;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;

  const tenantRow = await db
    .prepare("SELECT name, primary_color FROM tenants WHERE slug = ?")
    .get(slug);
  const tenant = tenantRow as unknown as Tenant | undefined;
  if (!tenant) return notFound();

  const postRow = await db
    .prepare("SELECT * FROM posts WHERE tenant_id = (SELECT id FROM tenants WHERE slug = ?) AND slug = ? AND status = 'published'")
    .get(slug, postSlug);
  const post = postRow as unknown as Post | undefined;
  if (!post) return notFound();

  const primaryColor = tenant.primary_color || "#002b50";
  const secondaryColor = "#fbcd39";

  // Buscar posts relacionados da mesma seção
  let relatedPosts: any[] = [];
  if (post.section) {
    const rows = await db
      .prepare("SELECT title, slug FROM posts WHERE tenant_id = (SELECT id FROM tenants WHERE slug = ?) AND section = ? AND slug != ? AND status = 'published' LIMIT 3")
      .all(slug, post.section, postSlug);
    relatedPosts = rows as any[];
  }

  return (
    <article>
      <Link href={`/blog/${slug}`} style={{ fontSize: 14, color: primaryColor, textDecoration: "none" }}>
        ← Voltar para {tenant.name}
      </Link>

      {post.section && (
        <span style={{ display: "inline-block", marginTop: 16, fontSize: 12, fontWeight: 700, color: secondaryColor, textTransform: "uppercase" }}>
          {post.section}
        </span>
      )}

      <h1 style={{ fontSize: 36, fontWeight: 700, color: primaryColor, margin: "12px 0" }}>
        {post.title}
      </h1>

      <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
        {new Date(post.created_at + "Z").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div style={{ fontSize: 16, lineHeight: 1.6, color: "#333" }} dangerouslySetInnerHTML={{ __html: post.content }} />

      {relatedPosts.length > 0 && (
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: primaryColor, marginBottom: 16 }}>
            Posts relacionados
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {relatedPosts.map((rp: any) => (
              <li key={rp.slug} style={{ marginBottom: 8 }}>
                <Link href={`/blog/${slug}/${rp.slug}`} style={{ fontSize: 14, color: primaryColor, textDecoration: "none" }}>
                  {rp.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}