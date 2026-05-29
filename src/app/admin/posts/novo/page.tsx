"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title || !content || !tenantSlug) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/ai-ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tenantSlug, slug: slug || undefined }),
      credentials: "include",
    });

    if (res.ok) {
      router.push("/admin/posts");
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao criar post.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Post</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Título do post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (opcional)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="slug-do-post"
          />
          <p className="text-xs text-gray-400 mt-1">Deixe em branco para gerar automaticamente do título.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug do Blog (Tenant) *</label>
          <input
            type="text"
            required
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="meu-blog"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo *</label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
            placeholder="Escreva o conteúdo do post..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            {loading ? "Criando..." : "Criar Post"}
          </button>
          <Link href="/admin/posts" className="text-gray-500 hover:text-gray-700 text-sm">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}