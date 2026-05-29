import Link from "next/link";
import db from "../../../lib/db";

interface Tenant {
  id: number;
  slug: string;
  name: string;
  created_at: string;
}

export default async function AdminTenantsPage() {
  const rows = await db
    .prepare("SELECT id, slug, name, created_at FROM tenants ORDER BY created_at DESC")
    .all();
  const tenants = rows as unknown as Tenant[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blogs (Tenants)</h2>
        <Link
          href="/admin/tenants/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Novo Blog
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">Nenhum blog criado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 text-lg">{tenant.name}</h3>
              <p className="text-sm text-gray-400 mt-1">/{tenant.slug}</p>
              <p className="text-xs text-gray-400 mt-2">
                Criado em {new Date(tenant.created_at + "Z").toLocaleDateString("pt-BR")}
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`/blog/${tenant.slug}`}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Ver blog →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}