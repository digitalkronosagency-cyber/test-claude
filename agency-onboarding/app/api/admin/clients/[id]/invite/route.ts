import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getClientById, updateClient } from '@/lib/db-helpers'
import { sendInvitationEmail } from '@/lib/emails'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const client = await getClientById(id)
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/${client.invite_token}`

  await sendInvitationEmail({
    to: client.email as string,
    companyName: client.company_name as string,
    contactName: (client.contact_name as string) || '',
    inviteToken: client.invite_token as string,
  })

  await updateClient(id, { invite_sent_at: new Date().toISOString(), status: 'invited' })

  return NextResponse.json({ success: true, inviteLink })
}
