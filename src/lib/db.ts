import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error('TURSO_DATABASE_URL e TURSO_AUTH_TOKEN são obrigatórios. Verifique o arquivo .env.local');
}

const db = createClient({ url, authToken });

async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      primary_color TEXT NOT NULL DEFAULT '#3B82F6',
      secondary_color TEXT NOT NULL DEFAULT '#1E3A5F',
      sections TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      category TEXT DEFAULT 'general',
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
      UNIQUE(tenant_id, slug)
    );
  `);
  console.log('✓ Tabelas criadas/verificadas no Turso');
}

initializeDatabase().catch(console.error);

export default db;
