import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Inicializa tabelas se não existirem (executado uma vez no cold start)
async function initializeDatabase() {
  await client.execute(`
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
  `);

  await client.execute(`
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
  `);
}

// Inicializa as tabelas imediatamente (promise, mas não bloqueia export)
initializeDatabase();

// Wrapper que mantém a interface better-sqlite3 para as rotas existentes
const db = {
  prepare(sql: string) {
    return {
      all: (...params: any[]) => {
        // Converte parâmetros posicionais para array
        return client.execute({ sql, args: params }).then((rs) => rs.rows);
      },
      get: (...params: any[]) => {
        return client.execute({ sql, args: params }).then((rs) => rs.rows[0] ?? null);
      },
      run: (...params: any[]) => {
        return client.execute({ sql, args: params }).then((rs) => ({
          lastInsertRowid: Number(rs.lastInsertRowid),
          changes: rs.rowsAffected,
        }));
      },
    };
  },
};

export default db;