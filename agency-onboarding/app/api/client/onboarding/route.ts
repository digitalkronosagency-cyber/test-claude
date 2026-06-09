import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getResponsesForClient, upsertResponse, updateClient, getClientById, getFormConfig } from '@/lib/db-helpers'
import { sendFormCompletedEmail } from '@/lib/emails'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [responses, formConfig] = await Promise.all([
    getResponsesForClient(session.clientId),
    getFormConfig(),
  ])

  return NextResponse.json({ responses, formConfig })
}

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { section_key, data, completed } = await req.json()

  const [result, client] = await Promise.all([
    upsertResponse(session.clientId, section_key, data, completed || false),
    getClientById(session.clientId),
  ])

  if (client?.status === 'invited') {
    await updateClient(session.clientId, { status: 'onboarding' })
  }

  return NextResponse.json(result)
}

export async function PUT() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const client = await getClientById(session.clientId)
  if (client) {
    await updateClient(session.clientId, { status: 'in_progress' })
    await sendFormCompletedEmail({
      companyName: client.company_name as string,
      clientId: session.clientId,
    }).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
