import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getClientById, updateClient, getStepsForClient, getResponsesForClient, getMessages, getFilesForClient } from '@/lib/db-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const client = getClientById(id)
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  return NextResponse.json({
    client,
    steps: getStepsForClient(id),
    responses: getResponsesForClient(id),
    messages: getMessages(id),
    files: getFilesForClient(id),
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const client = updateClient(id, body)
  return NextResponse.json(client)
}
