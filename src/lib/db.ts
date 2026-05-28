import Database from "better-sqlite3";

// Cria/abre o banco local
const db = new Database("blog.db");

// Inicializa tabelas se não existirem
function initializeDatabase() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      primary_color TEXT NOT NULL DEFAULT '#3B82F6',
      secondary_color TEXT NOT NULL DEFAULT '#1E3A5F',
      sections TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();

  db.prepare(`
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
    )
  `).run();

  console.log("✓ Tabelas criadas/verificadas no SQLite local");
}

initializeDatabase();

export default db;
