import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { DEFAULT_PROJECT_STEPS } from '@/lib/default-form-config'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { company_name, contact_name, email, phone, city, region, revenue_range, delivery_date } = body

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .insert({ company_name, contact_name, email, phone, city, region, revenue_range, delivery_date })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create default project steps
  const steps = DEFAULT_PROJECT_STEPS.map(s => ({ ...s, client_id: client.id }))
  await supabaseAdmin.from('project_steps').insert(steps)

  return NextResponse.json(client)
}
