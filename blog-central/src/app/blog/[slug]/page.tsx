// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import db from '../../../lib/db';

interface Tenant {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  sections: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string | null;
  category: string;
  status: string;
  created_at: string;
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Busca o tenant pelo slug
  const tenant = db.prepare('SELECT * FROM tenants WHERE slug = ?').get(slug) as Tenant | undefined;

  if (!tenant) {
    notFound();
  }

  // Busca os posts publicados do tenant
  const posts = db.prepare(
    'SELECT * FROM posts WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC'
  ).all(tenant.id, 'published') as Post[];

  // Parse das seções (array de strings com nomes de seção)
  let sections: string[] = [];
  try {
    sections = JSON.parse(tenant.sections || '[]');
  } catch {
    sections = [];
  }

  // Se não houver seções configuradas, usa um padrão: posts e about
  const displaySections = sections.length > 0 ? sections : ['posts', 'about'];

  return (
    <div style={{ '--primary': tenant.primary_color, '--secondary': tenant.secondary_color } as React.CSSProperties}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--primary)', padding: '2rem', color: '#fff' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{tenant.name}</h1>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>Bem-vindo ao blog</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {displaySections.map((section) => {
          if (section === 'posts') {
            return (
              <section key="posts" style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--secondary)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                  Posts
                </h2>
                {posts.length === 0 ? (
                  <p>Nenhum post publicado ainda.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {posts.map((post) => (
                      <article key={post.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem' }}>
                        {post.image_url && (
                          <img src={post.image_url} alt={post.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />
                        )}
                        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--secondary)' }}>{post.title}</h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
                          {post.category} · {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.content}</div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          }

          if (section === 'about') {
            return (
              <section key="about" style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--secondary)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                  Sobre
                </h2>
                <p>Este é o blog <strong>{tenant.name}</strong>. Aqui você encontra conteúdo sobre diversos temas.</p>
              </section>
            );
          }

          // Seção customizada genérica (placeholder)
          return (
            <section key={section} style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: 'var(--secondary)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', textTransform: 'capitalize' }}>
                {section}
              </h2>
              <p>Conteúdo da seção &quot;{section}&quot; em breve.</p>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--secondary)', padding: '1rem', color: '#fff', textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>© {new Date().getFullYear()} {tenant.name} — Powered by Blog Central</p>
      </footer>
    </div>
  );
}