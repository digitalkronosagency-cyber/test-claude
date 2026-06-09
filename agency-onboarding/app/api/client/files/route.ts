import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getFilesForClient } from '@/lib/db-helpers'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json(getFilesForClient(session.clientId, true))
}
