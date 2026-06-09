import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getResponsesForClient, upsertResponse, updateClient, getClientById } from '@/lib/db-helpers'
import { getFormConfig } from '@/lib/db-helpers'
import { sendFormCompletedEmail } from '@/lib/emails'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  return NextResponse.json({
    responses: getResponsesForClient(session.clientId),
    formConfig: getFormConfig(),
  })
}

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { section_key, data, completed } = await req.json()

  const result = upsertResponse(session.clientId, section_key, data, completed || false)

  // Update status to onboarding if currently invited
  const client = getClientById(session.clientId) as Record<string, unknown> | undefined
  if (client?.status === 'invited') {
    updateClient(session.clientId, { status: 'onboarding' })
  }

  return NextResponse.json(result)
}

export async function PUT() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const client = getClientById(session.clientId) as Record<string, unknown> | undefined
  if (client) {
    updateClient(session.clientId, { status: 'in_progress' })
    await sendFormCompletedEmail({
      companyName: client.company_name as string,
      clientId: session.clientId,
    }).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
