import { NextRequest, NextResponse } from 'next/server'
import { createClientSession } from '@/lib/auth'
import { getClientByToken } from '@/lib/db-helpers'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  const client = getClientByToken(token) as Record<string, unknown> | undefined
  if (!client) {
    return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 401 })
  }

  const sessionToken = await createClientSession(client.id as string)
  const response = NextResponse.json({ success: true, clientId: client.id })
  response.cookies.set('client_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return response
}
