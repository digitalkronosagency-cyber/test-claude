import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { DEFAULT_FORM_CONFIG } from '@/lib/default-form-config'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('form_config')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !data) {
    return NextResponse.json({ config: DEFAULT_FORM_CONFIG })
  }

  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { config } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('form_config')
    .upsert({ id: 1, config, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
