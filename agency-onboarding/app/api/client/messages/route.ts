import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendNewMessageEmail } from '@/lib/emails'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('client_id', session.clientId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mark admin messages as read
  await supabaseAdmin
    .from('messages')
    .update({ read: true })
    .eq('client_id', session.clientId)
    .eq('sender', 'admin')
    .eq('read', false)

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { content } = await req.json()

  const { data: msg, error } = await supabaseAdmin
    .from('messages')
    .insert({ client_id: session.clientId, sender: 'client', content })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admin
  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('company_name, invite_token')
    .eq('id', session.clientId)
    .single()

  if (client) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    await sendNewMessageEmail({
      to: process.env.ADMIN_EMAIL!,
      senderName: client.company_name,
      messagePreview: content.substring(0, 200),
      link: `${appUrl}/admin/clients/${session.clientId}`,
    }).catch(console.error)
  }

  return NextResponse.json(msg)
}
