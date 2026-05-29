"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setError("");
        const res = await fetch(`/api/posts/${postId}`, { credentials: "include" });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Erro ao carregar post");
          return;
        }
        const data = await res.json();
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setContent(data.content || "");
        setStatus(data.status || "draft");
      } catch {
        setError("Erro de conexão ao carregar post");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!title || !content) {
      setError("Preencha título e conteúdo.");
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug: slug || undefined, content, status }),
      credentials: "include",
    });

    if (res.ok) {
      router.push("/admin/posts");
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao atualizar post.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">{error}</p>
        <Link href="/admin/posts" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          ← Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Post #{postId}</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <Link href="/admin/posts" className="text-gray-500 hover:text-gray-700 text-sm">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}