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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Central</h1>
          <p className="text-gray-500 mt-1">Escolha um blog para visitar</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Lista de blogs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <Link
                key={tenant.id}
                href={`/blog/${tenant.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 text-lg">
                  {tenant.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  /{tenant.slug}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Últimos posts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Últimos posts publicados
          </h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">Nenhum post publicado ainda.</p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.tenant_slug}/${post.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {post.tenant_name} •{" "}
                    {new Date(post.created_at + "Z").toLocaleDateString("pt-BR")}
                  </p>
                  <h3 className="font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {stripHtml(post.content)}...
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blog Central. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}