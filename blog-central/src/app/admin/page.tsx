// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
}

interface Post {
  id: number;
  tenant_id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  status: string;
}

export default function AdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  useEffect(() => {
    fetch('/api/tenants')
      .then((res) => res.json())
      .then(setTenants)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedTenant === null) return;
    fetch(`/api/posts?tenant_id=${selectedTenant}`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, [selectedTenant]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug || !newName) return;
    setLoading(true);
    const res = await fetch('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: newSlug, name: newName, primary_color: newColor }),
    });
    if (res.ok) {
      const tenant = await res.json();
      setTenants([tenant, ...tenants]);
      setNewSlug('');
      setNewName('');
      setNewColor('#6366f1');
    } else {
      const err = await res.json();
      alert(err.error || 'Erro ao criar tenant');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50" translate="no">
      {/* Header com gradiente */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Blog Central</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 backdrop-blur">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/90 font-medium">Admin</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda */}
          <div className="lg:col-span-1 space-y-6">
            {/* Criar Tenant */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                Criar Blog
              </h2>
              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Identificador (slug)</label>
                  <input
                    type="text"
                    placeholder="meu-blog"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do Blog</label>
                  <input
                    type="text"
                    placeholder="Meu Blog"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cor principal</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">{newColor}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? 'Criando...' : 'Criar Blog'}
                </button>
              </form>
            </div>

            {/* Lista de Tenants */}
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                Seus Blogs
              </h2>
              {tenants.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum blog ainda.</p>
              ) : (
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => setSelectedTenant(tenant.id)}
                      className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all ${
                        selectedTenant === tenant.id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-sm'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-indigo-50/50 hover:border-indigo-100'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: tenant.primary_color }}>
                          <span className="text-white font-bold text-sm">{tenant.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800">{tenant.name}</p>
                        <p className="text-sm text-gray-500">/{tenant.slug}</p>
                      </div>
                      {selectedTenant === tenant.id && (
                        <div className="ml-auto w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coluna direita: Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 border border-white/50 p-6">
              {selectedTenant === null ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-500 mb-1">Selecione um blog</p>
                  <p className="text-sm text-gray-400">para visualizar e gerenciar seus posts</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      {tenants.find((t) => t.id === selectedTenant)?.name}
                    </h2>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {posts.length} post{posts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-500 mb-2">Nenhum post ainda</p>
                      <p className="text-sm text-gray-400">
                        Use <code className="bg-indigo-50 px-2 py-1 rounded-lg text-indigo-600 font-mono text-xs">POST /api/ai-ingest</code> para adicionar
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700">
                            <th className="py-3.5 px-4 font-semibold text-sm">Título</th>
                            <th className="py-3.5 px-4 font-semibold text-sm hidden sm:table-cell">Slug</th>
                            <th className="py-3.5 px-4 font-semibold text-sm hidden sm:table-cell">Categoria</th>
                            <th className="py-3.5 px-4 font-semibold text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-indigo-50/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-medium text-gray-800">{post.title}</p>
                              </td>
                              <td className="py-3.5 px-4 text-gray-500 hidden sm:table-cell text-sm">/{post.slug}</td>
                              <td className="py-3.5 px-4 hidden sm:table-cell">
                                <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                                  {post.category}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                  post.status === 'published'
                                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}