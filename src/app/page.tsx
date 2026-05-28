// src/app/page.tsx
import Link from "next/link";
import db from "../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
}

export default async function HomePage() {
  // Busca todos os tenants cadastrados
  const tenantsResult = await db.execute({
    sql: "SELECT id, slug, name FROM tenants",
    args: [],
  });
  const tenants = tenantsResult.rows as unknown as Tenant[];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="w-full max-w-3xl py-16 px-8 bg-white dark:bg-black rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-black dark:text-zinc-50 mb-6">
          Bem-vindo ao Blog Central
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center mb-8">
          Escolha um blog para visitar:
        </p>
        <ul className="flex flex-col gap-4">
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
      </main>
    </div>
  );
}
