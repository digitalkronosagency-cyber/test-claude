import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  const [clientRes, stepsRes, responsesRes, messagesRes, filesRes] = await Promise.all([
    supabaseAdmin.from('clients').select('*').eq('id', id).single(),
    supabaseAdmin.from('project_steps').select('*').eq('client_id', id).order('order_index'),
    supabaseAdmin.from('onboarding_responses').select('*').eq('client_id', id),
    supabaseAdmin.from('messages').select('*').eq('client_id', id).order('created_at'),
    supabaseAdmin.from('shared_files').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  if (clientRes.error) return NextResponse.json({ error: clientRes.error.message }, { status: 404 })

  return NextResponse.json({
    client: clientRes.data,
    steps: stepsRes.data || [],
    responses: responsesRes.data || [],
    messages: messagesRes.data || [],
    files: filesRes.data || [],
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabaseAdmin
    .from('clients')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
