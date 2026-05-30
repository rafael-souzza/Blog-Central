import Link from "next/link";
import db from "../../lib/db";

interface Tenant {
  name: string;
  slug: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  font_family: string | null;
  sections: string;
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;

  let tenant: Tenant | null = null;
  if (slug) {
    const row = await db
      .prepare("SELECT name, slug, primary_color, secondary_color, logo_url, font_family, sections FROM tenants WHERE slug = ?")
      .get(slug);
    tenant = row as unknown as Tenant | null;
  }

  const primaryColor = tenant?.primary_color || "#002b50";
  const secondaryColor = tenant?.secondary_color || "#fbcd39";
  const logoUrl = tenant?.logo_url || null;
  const fontFamily = tenant?.font_family || "Roboto Slab";
  const sections: string[] = tenant?.sections ? JSON.parse(tenant.sections) : [];

  // Buscar posts recentes para a sidebar
  let recentPosts: any[] = [];
  if (tenant) {
    const tenantRow = await db.prepare("SELECT id FROM tenants WHERE slug = ?").get(slug!) as any;
    if (tenantRow) {
      const rows = await db
        .prepare("SELECT title, slug, created_at FROM posts WHERE tenant_id = ? AND status = 'published' ORDER BY created_at DESC LIMIT 5")
        .all(tenantRow.id);
      recentPosts = rows as any[];
    }
  }

  return (
    <html lang="pt-BR">
      <head>
        <link
          href={`https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@300;400;700&display=swap`}
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily, backgroundColor: "#f5f5f5", margin: 0 }}>
        {/* Top Bar */}
        <div style={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid #ddd" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 10px", display: "flex", justifyContent: "flex-end", gap: 20 }}>
            <Link href="/" style={{ fontSize: 13, color: "#000", textDecoration: "none" }}>Início</Link>
            <Link href={`/blog/${slug}`} style={{ fontSize: 13, color: "#000", textDecoration: "none" }}>Blog</Link>
            {sections.map((s: string) => (
              <Link key={s} href={`/blog/${slug}?section=${encodeURIComponent(s)}`} style={{ fontSize: 13, color: "#000", textDecoration: "none" }}>
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Bar */}
        <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href={`/blog/${slug}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
              {logoUrl ? (
                <img src={logoUrl} alt={tenant?.name || "Blog"} style={{ height: 48 }} />
              ) : (
                <span style={{ fontSize: 24, fontWeight: 700, color: primaryColor }}>{tenant?.name || "Blog Central"}</span>
              )}
            </Link>
            <div style={{ display: "flex", gap: 4 }}>
              <input
                type="text"
                placeholder="Buscar..."
                style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px 0 0 4px", fontSize: 14, width: 200 }}
              />
              <button style={{ padding: "8px 16px", backgroundColor: primaryColor, color: "#fff", border: "none", borderRadius: "0 4px 4px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                BUSCAR
              </button>
            </div>
          </div>
        </div>

        {/* Navbar de categorias */}
        <nav style={{ backgroundColor: "#fff", borderBottom: "3px solid " + secondaryColor }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 10px", display: "flex", gap: 0 }}>
            {sections.length > 0 ? sections.map((s: string) => (
              <Link
                key={s}
                href={`/blog/${slug}?section=${encodeURIComponent(s)}`}
                style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#000", textDecoration: "none", textTransform: "uppercase", borderBottom: "3px solid transparent" }}
              >
                {s}
              </Link>
            )) : (
              <Link href={`/blog/${slug}`} style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#000", textDecoration: "none" }}>Home</Link>
            )}
          </div>
        </nav>

        {/* Conteúdo principal */}
        <div style={{ maxWidth: 1280, margin: "24px auto", padding: "0 10px", display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Sidebar */}
          <aside style={{ width: 315, minWidth: 315, backgroundColor: "#fff", borderRadius: 8, padding: 20, border: "1px solid #e0e0e0" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: primaryColor, marginBottom: 16, paddingBottom: 8, borderBottom: "2px solid " + secondaryColor }}>
              Destaques
            </h3>
            {recentPosts.length === 0 ? (
              <p style={{ fontSize: 14, color: "#666" }}>Nenhum post ainda.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {recentPosts.map((p: any) => (
                  <li key={p.slug} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
                    <Link href={`/blog/${slug}/${p.slug}`} style={{ fontSize: 14, color: primaryColor, textDecoration: "none", fontWeight: 600 }}>
                      {p.title}
                    </Link>
                    <p style={{ fontSize: 12, color: "#999", margin: "4px 0 0" }}>
                      {new Date(p.created_at + "Z").toLocaleDateString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {sections.length > 0 && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: primaryColor, marginTop: 24, marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid " + secondaryColor }}>
                  Seções
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {sections.map((s: string) => (
                    <li key={s} style={{ marginBottom: 8 }}>
                      <Link href={`/blog/${slug}?section=${encodeURIComponent(s)}`} style={{ fontSize: 14, color: "#000", textDecoration: "none" }}>
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>

          {/* Conteúdo */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer style={{ backgroundColor: primaryColor, color: "#fff", padding: "40px 0 20px", marginTop: 48 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 10px", display: "flex", flexWrap: "wrap", gap: 40 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Categorias</h4>
              {sections.length > 0 ? sections.map((s: string) => (
                <p key={s} style={{ margin: "4px 0" }}>
                  <Link href={`/blog/${slug}?section=${encodeURIComponent(s)}`} style={{ color: "#fff", fontSize: 14, textDecoration: "none" }}>{s}</Link>
                </p>
              )) : (
                <p style={{ fontSize: 14 }}>Nenhuma seção definida.</p>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Institucional</h4>
              <p style={{ margin: "4px 0" }}><Link href="/" style={{ color: "#fff", fontSize: 14, textDecoration: "none" }}>Início</Link></p>
              <p style={{ margin: "4px 0" }}><Link href={`/blog/${slug}`} style={{ color: "#fff", fontSize: 14, textDecoration: "none" }}>Blog</Link></p>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Redes Sociais</h4>
              <p style={{ fontSize: 14, margin: "4px 0" }}>📘 Facebook</p>
              <p style={{ fontSize: 14, margin: "4px 0" }}>📷 Instagram</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", fontSize: 13 }}>
            © {new Date().getFullYear()} {tenant?.name || "Blog Central"}. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}