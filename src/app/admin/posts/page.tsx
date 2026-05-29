import Link from "next/link";
import db from "../../../lib/db";
import DeleteButton from "./DeleteButton";

interface Post {
  id: number;
  title: string;
  slug: string;
  tenant_id: number;
  tenant_slug: string;
  tenant_name: string;
  content: string;
  status: string;
  created_at: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").substring(0, 120);
}

export default async function AdminPostsPage() {
  const rows = await db
    .prepare(
      `SELECT p.id, p.title, p.slug, p.tenant_id, p.content, t.slug as tenant_slug, t.name as tenant_name, p.status, p.created_at
       FROM posts p
       JOIN tenants t ON p.tenant_id = t.id
       ORDER BY p.created_at DESC`
    )
    .all();
  const posts = rows as unknown as Post[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
        <Link
          href="/admin/posts/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Novo Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">Nenhum post encontrado.</p>
          <p className="text-gray-400 text-sm mt-1">Clique em "Novo Post" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {post.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at + "Z").toLocaleDateString("pt-BR")}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                Blog: <span className="font-medium">{post.tenant_name}</span>
              </p>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {stripHtml(post.content)}
              </p>

              <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/admin/posts/${post.id}/editar`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Editar
                </Link>
                <span className="text-gray-300">|</span>
                <DeleteButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}