// src/app/page.tsx
import Link from "next/link";
import db from "../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
}

interface Post {
  title: string;
  slug: string;
  content: string;
}

export default async function HomePage() {
  // Busca todos os tenants cadastrados
  const tenants = db
    .prepare("SELECT id, slug, name FROM tenants")
    .all() as Tenant[];

  // Busca posts publicados
  const posts = db
    .prepare(
      "SELECT title, slug, content FROM posts WHERE status = 'published' ORDER BY created_at DESC"
    )
    .all() as Post[];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="w-full max-w-3xl py-16 px-8 bg-white dark:bg-black rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-black dark:text-zinc-50 mb-6">
          Bem-vindo ao Blog Central
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center mb-8">
          Escolha um blog para visitar:
        </p>
        <ul className="flex flex-col gap-4 mb-12">
          {tenants.map((tenant) => (
            <li key={tenant.id} className="text-center">
              <Link
                href={`/blog/${tenant.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-xl"
              >
                {tenant.name}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
          Últimos posts publicados
        </h2>
        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Nenhum post publicado ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug} className="border-b pb-4">
                <Link
                  href={`/meu-blog/${post.slug}`}
                  className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-gray-700 dark:text-zinc-400 line-clamp-2">
                  {post.content.slice(0, 100)}...
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
