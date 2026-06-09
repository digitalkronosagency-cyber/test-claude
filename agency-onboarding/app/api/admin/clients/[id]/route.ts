import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getClientById, updateClient, getStepsForClient, getResponsesForClient, getMessages, getFilesForClient } from '@/lib/db-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const client = await getClientById(id)
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const [steps, responses, messages, files] = await Promise.all([
    getStepsForClient(id),
    getResponsesForClient(id),
    getMessages(id),
    getFilesForClient(id),
  ])

  return NextResponse.json({ client, steps, responses, messages, files })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const client = await updateClient(id, body)
  return NextResponse.json(client)
}
