import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ stepId: string }> }) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { stepId } = await params

  const { data, error } = await supabaseAdmin
    .from('project_steps')
    .select('step_name, step_icon, client_message, requires_approval')
    .eq('id', stepId)
    .eq('client_id', session.clientId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(data)
}
