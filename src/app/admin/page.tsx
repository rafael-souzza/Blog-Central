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
    fetch('/api/posts?tenant_id=' + selectedTenant)
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
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Blog Central</h1>
          <span className="text-sm text-white/80">Admin</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Criar Blog</h2>
              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Slug</label>
                  <input type="text" placeholder="meu-blog" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Blog</label>
                  <input type="text" placeholder="Meu Blog" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cor</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" />
                    <span className="text-sm text-gray-500">{newColor}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Criando...' : 'Criar Blog'}
                </button>
              </form>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Seus Blogs</h2>
              {tenants.length === 0 ? (
                <p className="text-gray-400 text-sm">Nenhum blog ainda.</p>
              ) : (
                <div className="space-y-2">
                  {tenants.map((tenant) => (
                    <button key={tenant.id} onClick={() => setSelectedTenant(tenant.id)} className={`w-full text-left p-4 rounded-xl flex items-center gap-3 ${selectedTenant === tenant.id ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: tenant.primary_color }}>
                        <span className="text-white font-bold text-sm">{tenant.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{tenant.name}</p>
                        <p className="text-sm text-gray-500">/{tenant.slug}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {selectedTenant === null ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-xl font-semibold text-gray-500">Selecione um blog</p>
                  <p className="text-sm mt-2">para visualizar seus posts</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Posts de {tenants.find((t) => t.id === selectedTenant)?.name}
                  </h2>
                  {posts.length === 0 ? (
                    <p className="text-gray-400">Nenhum post ainda.</p>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700">
                          <th className="py-3 px-4 font-semibold text-sm">Titulo</th>
                          <th className="py-3 px-4 font-semibold text-sm">Slug</th>
                          <th className="py-3 px-4 font-semibold text-sm">Categoria</th>
                          <th className="py-3 px-4 font-semibold text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{post.title}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">/{post.slug}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{post.category}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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