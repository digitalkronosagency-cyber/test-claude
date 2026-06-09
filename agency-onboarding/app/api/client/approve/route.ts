import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { stepId, comment } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('project_steps')
    .update({
      status: 'done',
      approved_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      ...(comment ? { admin_notes: comment } : {}),
    })
    .eq('id', stepId)
    .eq('client_id', session.clientId)
    .eq('requires_approval', true)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
