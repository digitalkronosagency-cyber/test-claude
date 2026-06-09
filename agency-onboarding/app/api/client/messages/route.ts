import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getMessages, createMessage, markMessagesRead, getClientById } from '@/lib/db-helpers'
import { sendNewMessageEmail } from '@/lib/emails'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const messages = getMessages(session.clientId)
  markMessagesRead(session.clientId, 'admin')
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { content } = await req.json()
  const msg = createMessage(session.clientId, 'client', content)

  const client = getClientById(session.clientId) as Record<string, unknown> | undefined
  if (client) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    await sendNewMessageEmail({
      to: process.env.ADMIN_EMAIL!,
      senderName: client.company_name as string,
      messagePreview: content.substring(0, 200),
      link: `${appUrl}/admin/clients/${session.clientId}`,
    }).catch(console.error)
  }

  return NextResponse.json(msg)
}
