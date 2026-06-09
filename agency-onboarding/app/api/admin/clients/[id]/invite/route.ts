import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/emails'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  await sendInvitationEmail({
    to: client.email,
    companyName: client.company_name,
    contactName: client.contact_name || '',
    inviteToken: client.invite_token,
  })

  await supabaseAdmin
    .from('clients')
    .update({ invite_sent_at: new Date().toISOString(), status: 'invited' })
    .eq('id', id)

  return NextResponse.json({ success: true, inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/client/${client.invite_token}` })
}
