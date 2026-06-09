import { NextRequest, NextResponse } from 'next/server'
import { createClientSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  const { data: client, error } = await supabaseAdmin
    .from('clients')
    .select('id, status')
    .eq('invite_token', token)
    .single()

  if (error || !client) {
    return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 401 })
  }

  const sessionToken = await createClientSession(client.id)
  const response = NextResponse.json({ success: true, clientId: client.id })
  response.cookies.set('client_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return response
}
