import Link from "next/link";
import db from "../../lib/db";

interface Tenant {
  name: string;
  slug: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  font_family: string | null;
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;

  // Busca os dados do tenant para aplicar a identidade visual
  let tenant: Tenant | null = null;
  if (slug) {
    const row = await db
      .prepare("SELECT name, slug, primary_color, secondary_color, logo_url, font_family FROM tenants WHERE slug = ?")
      .get(slug);
    tenant = row as unknown as Tenant | null;
  }

  const primaryColor = tenant?.primary_color || "#3B82F6";
  const secondaryColor = tenant?.secondary_color || "#1E3A5F";
  const logoUrl = tenant?.logo_url || null;
  const fontFamily = tenant?.font_family || "Inter, sans-serif";

  return (
    <html lang="pt-BR">
      <head>
        {fontFamily !== "Inter, sans-serif" && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@300;400;700&display=swap`}
            rel="stylesheet"
          />
        )}
      </head>
      <body style={{ fontFamily }}>
        <div className="min-h-screen bg-gray-50">
          <header className="border-b border-gray-200" style={{ backgroundColor: primaryColor }}>
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-white flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={tenant?.name || "Blog"} className="h-8" />
                ) : (
                  tenant?.name || "Blog Central"
                )}
              </Link>
              <nav className="flex gap-4">
                <Link href="/" className="text-sm text-white/80 hover:text-white">
                  Início
                </Link>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-gray-200 bg-white mt-16">
            <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} {tenant?.name || "Blog Central"}. Todos os direitos reservados.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}