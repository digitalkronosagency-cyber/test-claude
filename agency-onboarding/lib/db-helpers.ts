import { getDb, parseRow, parseRows } from './db'
import { DEFAULT_PROJECT_STEPS, DEFAULT_FORM_CONFIG } from './default-form-config'
import { randomUUID } from 'crypto'

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

export function getAllClients() {
  const db = getDb()
  return db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all()
}

export function getClientById(id: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM clients WHERE id = ?').get(id) as Record<string, unknown> | undefined
}

export function getClientByToken(token: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM clients WHERE invite_token = ?').get(token) as Record<string, unknown> | undefined
}

export function createClient(data: Record<string, unknown>) {
  const db = getDb()
  const id = randomUUID()
  const token = randomUUID().replace(/-/g, '')
  db.prepare(`
    INSERT INTO clients (id, company_name, contact_name, email, phone, city, region, revenue_range, delivery_date, invite_token, status)
    VALUES (@id, @company_name, @contact_name, @email, @phone, @city, @region, @revenue_range, @delivery_date, @invite_token, @status)
  `).run({ id, invite_token: token, company_name: '', contact_name: null, email: '', phone: null, city: null, region: null, revenue_range: null, delivery_date: null, status: 'invited', ...data })

  // Create default project steps
  const insert = db.prepare(`
    INSERT INTO project_steps (id, client_id, step_key, step_name, step_icon, order_index, requires_approval)
    VALUES (@id, @client_id, @step_key, @step_name, @step_icon, @order_index, @requires_approval)
  `)
  const insertMany = db.transaction((steps: typeof DEFAULT_PROJECT_STEPS) => {
    for (const s of steps) {
      insert.run({ id: randomUUID(), client_id: id, ...s, requires_approval: s.requires_approval ? 1 : 0 })
    }
  })
  insertMany(DEFAULT_PROJECT_STEPS)

  return db.prepare('SELECT * FROM clients WHERE id = ?').get(id)
}

export function updateClient(id: string, data: Record<string, unknown>) {
  const db = getDb()
  const sets = Object.keys(data).map(k => `${k} = @${k}`).join(', ')
  db.prepare(`UPDATE clients SET ${sets}, updated_at = datetime('now') WHERE id = @id`).run({ ...data, id })
  return db.prepare('SELECT * FROM clients WHERE id = ?').get(id)
}

// ─── STEPS ────────────────────────────────────────────────────────────────────

export function getStepsForClient(clientId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM project_steps WHERE client_id = ? ORDER BY order_index').all(clientId)
}

export function updateStep(stepId: string, clientId: string, data: Record<string, unknown>) {
  const db = getDb()
  const sets = Object.keys(data).map(k => `${k} = @${k}`).join(', ')
  db.prepare(`UPDATE project_steps SET ${sets} WHERE id = @id AND client_id = @client_id`).run({ ...data, id: stepId, client_id: clientId })
  return db.prepare('SELECT * FROM project_steps WHERE id = ?').get(stepId)
}

export function getStepById(stepId: string, clientId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM project_steps WHERE id = ? AND client_id = ?').get(stepId, clientId) as Record<string, unknown> | undefined
}

// ─── ONBOARDING RESPONSES ────────────────────────────────────────────────────

export function getResponsesForClient(clientId: string) {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM onboarding_responses WHERE client_id = ?').all(clientId) as Record<string, unknown>[]
  return rows.map(r => ({ ...r, data: typeof r.data === 'string' ? JSON.parse(r.data as string) : r.data, completed: r.completed === 1 }))
}

export function upsertResponse(clientId: string, sectionKey: string, data: Record<string, unknown>, completed: boolean) {
  const db = getDb()
  const id = randomUUID()
  db.prepare(`
    INSERT INTO onboarding_responses (id, client_id, section_key, data, completed, updated_at)
    VALUES (@id, @client_id, @section_key, @data, @completed, datetime('now'))
    ON CONFLICT(client_id, section_key) DO UPDATE SET
      data = @data, completed = @completed, updated_at = datetime('now')
  `).run({ id, client_id: clientId, section_key: sectionKey, data: JSON.stringify(data), completed: completed ? 1 : 0 })
  return db.prepare('SELECT * FROM onboarding_responses WHERE client_id = ? AND section_key = ?').get(clientId, sectionKey)
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export function getMessages(clientId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM messages WHERE client_id = ? ORDER BY created_at').all(clientId)
}

export function getUnreadAdminMessages(clientId: string) {
  const db = getDb()
  return db.prepare('SELECT * FROM messages WHERE client_id = ? AND sender = "admin" AND read = 0').all(clientId)
}

export function createMessage(clientId: string, sender: string, content: string) {
  const db = getDb()
  const id = randomUUID()
  db.prepare('INSERT INTO messages (id, client_id, sender, content) VALUES (?, ?, ?, ?)').run(id, clientId, sender, content)
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(id)
}

export function markMessagesRead(clientId: string, sender: string) {
  const db = getDb()
  db.prepare('UPDATE messages SET read = 1 WHERE client_id = ? AND sender = ? AND read = 0').run(clientId, sender)
}

// ─── FILES ────────────────────────────────────────────────────────────────────

export function getFilesForClient(clientId: string, visibleOnly = false) {
  const db = getDb()
  const query = visibleOnly
    ? 'SELECT * FROM shared_files WHERE client_id = ? AND visible_to_client = 1 ORDER BY created_at DESC'
    : 'SELECT * FROM shared_files WHERE client_id = ? ORDER BY created_at DESC'
  return db.prepare(query).all(clientId)
}

export function createSharedFile(data: Record<string, unknown>) {
  const db = getDb()
  const id = randomUUID()
  db.prepare(`
    INSERT INTO shared_files (id, client_id, filename, original_name, storage_path, file_type, size_bytes, uploaded_by)
    VALUES (@id, @client_id, @filename, @original_name, @storage_path, @file_type, @size_bytes, @uploaded_by)
  `).run({ id, ...data })
  return db.prepare('SELECT * FROM shared_files WHERE id = ?').get(id)
}

// ─── FORM CONFIG ──────────────────────────────────────────────────────────────

export function getFormConfig() {
  const db = getDb()
  const row = db.prepare('SELECT * FROM form_config WHERE id = 1').get() as Record<string, unknown> | undefined
  if (!row) return DEFAULT_FORM_CONFIG
  return typeof row.config === 'string' ? JSON.parse(row.config as string) : row.config
}

export function setFormConfig(config: unknown) {
  const db = getDb()
  db.prepare(`
    INSERT INTO form_config (id, config, updated_at) VALUES (1, @config, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET config = @config, updated_at = datetime('now')
  `).run({ config: JSON.stringify(config) })
}
