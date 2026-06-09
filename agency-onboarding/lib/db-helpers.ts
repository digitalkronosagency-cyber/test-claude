import { supabase } from './supabase'
import { DEFAULT_PROJECT_STEPS, DEFAULT_FORM_CONFIG } from './default-form-config'
import { randomUUID } from 'crypto'

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

export async function getAllClients() {
  const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getClientById(id: string) {
  const { data } = await supabase.from('clients').select('*').eq('id', id).maybeSingle()
  return data as Record<string, unknown> | null
}

export async function getClientByToken(token: string) {
  const { data } = await supabase.from('clients').select('*').eq('invite_token', token).maybeSingle()
  return data as Record<string, unknown> | null
}

export async function createClient(data: Record<string, unknown>) {
  const id = randomUUID()
  const token = randomUUID().replace(/-/g, '')

  const { data: client } = await supabase.from('clients').insert({
    id,
    invite_token: token,
    company_name: '',
    contact_name: null,
    email: '',
    phone: null,
    city: null,
    region: null,
    revenue_range: null,
    delivery_date: null,
    status: 'invited',
    ...data,
  }).select().single()

  const steps = DEFAULT_PROJECT_STEPS.map(s => ({
    id: randomUUID(),
    client_id: id,
    ...s,
  }))
  await supabase.from('project_steps').insert(steps)

  return client
}

export async function updateClient(id: string, data: Record<string, unknown>) {
  const { data: client } = await supabase.from('clients')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  return client
}

// ─── STEPS ────────────────────────────────────────────────────────────────────

export async function getStepsForClient(clientId: string) {
  const { data } = await supabase.from('project_steps').select('*')
    .eq('client_id', clientId).order('order_index')
  return data || []
}

export async function updateStep(stepId: string, clientId: string, data: Record<string, unknown>) {
  const { data: step } = await supabase.from('project_steps')
    .update(data).eq('id', stepId).eq('client_id', clientId).select().single()
  return step
}

export async function getStepById(stepId: string, clientId: string) {
  const { data } = await supabase.from('project_steps').select('*')
    .eq('id', stepId).eq('client_id', clientId).maybeSingle()
  return data as Record<string, unknown> | null
}

// ─── ONBOARDING RESPONSES ────────────────────────────────────────────────────

export async function getResponsesForClient(clientId: string) {
  const { data } = await supabase.from('onboarding_responses').select('*').eq('client_id', clientId)
  return (data || []) as Record<string, unknown>[]
}

export async function upsertResponse(clientId: string, sectionKey: string, data: Record<string, unknown>, completed: boolean) {
  const { data: result } = await supabase.from('onboarding_responses').upsert({
    id: randomUUID(),
    client_id: clientId,
    section_key: sectionKey,
    data,
    completed,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'client_id,section_key' }).select().single()
  return result
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function getMessages(clientId: string) {
  const { data } = await supabase.from('messages').select('*')
    .eq('client_id', clientId).order('created_at')
  return data || []
}

export async function getUnreadAdminMessages(clientId: string) {
  const { data } = await supabase.from('messages').select('*')
    .eq('client_id', clientId).eq('sender', 'admin').eq('read', false)
  return data || []
}

export async function createMessage(clientId: string, sender: string, content: string) {
  const { data } = await supabase.from('messages')
    .insert({ id: randomUUID(), client_id: clientId, sender, content })
    .select().single()
  return data
}

export async function markMessagesRead(clientId: string, sender: string) {
  await supabase.from('messages')
    .update({ read: true })
    .eq('client_id', clientId).eq('sender', sender).eq('read', false)
}

// ─── FILES ────────────────────────────────────────────────────────────────────

export async function getFilesForClient(clientId: string, visibleOnly = false) {
  let query = supabase.from('shared_files').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
  if (visibleOnly) query = query.eq('visible_to_client', true)
  const { data } = await query
  return data || []
}

export async function createSharedFile(data: Record<string, unknown>) {
  const { data: file } = await supabase.from('shared_files')
    .insert({ id: randomUUID(), ...data }).select().single()
  return file
}

// ─── FORM CONFIG ──────────────────────────────────────────────────────────────

export async function getFormConfig() {
  const { data } = await supabase.from('form_config').select('config').eq('id', 1).maybeSingle()
  if (!data) return DEFAULT_FORM_CONFIG
  return data.config
}

export async function setFormConfig(config: unknown) {
  await supabase.from('form_config').upsert({ id: 1, config, updated_at: new Date().toISOString() })
}
