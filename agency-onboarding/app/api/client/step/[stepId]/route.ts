import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getStepById } from '@/lib/db-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ stepId: string }> }) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { stepId } = await params
  const step = await getStepById(stepId, session.clientId)
  if (!step) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(step)
}
