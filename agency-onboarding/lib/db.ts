import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'app.db')

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  return _db
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      company_name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      region TEXT,
      revenue_range TEXT,
      status TEXT DEFAULT 'invited',
      invite_token TEXT UNIQUE DEFAULT (lower(hex(randomblob(16)))),
      invite_sent_at TEXT,
      delivery_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS onboarding_responses (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
      section_key TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT '{}',
      completed INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(client_id, section_key)
    );

    CREATE TABLE IF NOT EXISTS project_steps (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
      step_key TEXT NOT NULL,
      step_name TEXT NOT NULL,
      step_icon TEXT DEFAULT '📋',
      status TEXT DEFAULT 'todo',
      order_index INTEGER NOT NULL,
      admin_notes TEXT,
      client_message TEXT,
      requires_approval INTEGER DEFAULT 0,
      approved_at TEXT,
      estimated_date TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
      sender TEXT NOT NULL,
      content TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS shared_files (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      file_type TEXT,
      size_bytes INTEGER,
      uploaded_by TEXT DEFAULT 'admin',
      visible_to_client INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS form_config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      config TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `)
}

// Helper: parse JSON fields from SQLite rows
export function parseRow<T>(row: Record<string, unknown> | undefined): T | null {
  if (!row) return null
  const parsed: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) {
    if (typeof v === 'string' && (v.startsWith('{') || v.startsWith('['))) {
      try { parsed[k] = JSON.parse(v) } catch { parsed[k] = v }
    } else if (v === 0 || v === 1) {
      // Keep booleans as-is for non-flag fields; convert obvious flags
      parsed[k] = v
    } else {
      parsed[k] = v
    }
  }
  return parsed as T
}

export function parseRows<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map(r => parseRow<T>(r)!)
}
