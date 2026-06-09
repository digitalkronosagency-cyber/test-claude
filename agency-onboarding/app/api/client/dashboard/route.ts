import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { DEFAULT_FORM_CONFIG } from '@/lib/default-form-config'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [clientRes, stepsRes, responsesRes, messagesRes, filesRes, formConfigRes] = await Promise.all([
    supabaseAdmin.from('clients').select('*').eq('id', session.clientId).single(),
    supabaseAdmin.from('project_steps').select('*').eq('client_id', session.clientId).order('order_index'),
    supabaseAdmin.from('onboarding_responses').select('*').eq('client_id', session.clientId),
    supabaseAdmin.from('messages').select('*').eq('client_id', session.clientId).eq('read', false).eq('sender', 'admin'),
    supabaseAdmin.from('shared_files').select('*').eq('client_id', session.clientId).eq('visible_to_client', true),
    supabaseAdmin.from('form_config').select('*').eq('id', 1).single(),
  ])

  if (clientRes.error) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const formConfig = formConfigRes.data?.config || DEFAULT_FORM_CONFIG
  const totalSections = formConfig.sections.length
  const completedSections = responsesRes.data?.filter(r => r.completed).length || 0
  const formCompletion = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  const steps = stepsRes.data || []
  const doneSteps = steps.filter(s => s.status === 'done').length
  const projectCompletion = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0

  return NextResponse.json({
    client: clientRes.data,
    steps,
    formCompletion,
    projectCompletion,
    unreadMessages: messagesRes.data?.length || 0,
    availableFiles: filesRes.data?.length || 0,
  })
}
