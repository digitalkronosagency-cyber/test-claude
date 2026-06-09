import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { updateStep } from '@/lib/db-helpers'

export async function POST(req: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { stepId, comment } = await req.json()

  const data = await updateStep(stepId, session.clientId, {
    status: 'done',
    approved_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    ...(comment ? { admin_notes: comment } : {}),
  })

  return NextResponse.json(data)
}
