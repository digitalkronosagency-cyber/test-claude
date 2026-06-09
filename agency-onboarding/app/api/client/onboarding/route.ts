import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFormCompletedEmail } from '@/lib/emails'
import { DEFAULT_FORM_CONFIG } from '@/lib/default-form-config'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [responsesRes, formConfigRes] = await Promise.all([
    supabaseAdmin.from('onboarding_responses').select('*').eq('client_id', session.clientId),
    supabaseAdmin.from('form_config').select('*').eq('id', 1).single(),
  ])

  return NextResponse.json({
    responses: responsesRes.data || [],
    formConfig: formConfigRes.data?.config || DEFAULT_FORM_CONFIG,
  })
}

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { section_key, data, completed } = await req.json()

  const { data: result, error } = await supabaseAdmin
    .from('onboarding_responses')
    .upsert({
      client_id: session.clientId,
      section_key,
      data,
      completed: completed || false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'client_id,section_key' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update client status to onboarding
  await supabaseAdmin
    .from('clients')
    .update({ status: 'onboarding', updated_at: new Date().toISOString() })
    .eq('id', session.clientId)
    .eq('status', 'invited')

  return NextResponse.json(result)
}

export async function PUT() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Mark all sections as completed and send notification
  const { data: client } = await supabaseAdmin
    .from('clients')
    .update({ status: 'in_progress', updated_at: new Date().toISOString() })
    .eq('id', session.clientId)
    .select('company_name, email')
    .single()

  if (client) {
    await sendFormCompletedEmail({
      companyName: client.company_name,
      clientId: session.clientId,
    }).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
