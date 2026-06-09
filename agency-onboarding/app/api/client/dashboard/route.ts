import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getClientById, getStepsForClient, getResponsesForClient, getUnreadAdminMessages, getFilesForClient, getFormConfig } from '@/lib/db-helpers'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const client = getClientById(session.clientId)
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const formConfig = getFormConfig() as { sections: unknown[] }
  const totalSections = formConfig?.sections?.length || 9
  const responses = getResponsesForClient(session.clientId)
  const completedSections = responses.filter(r => r.completed).length
  const formCompletion = Math.round((completedSections / totalSections) * 100)

  const steps = getStepsForClient(session.clientId) as Record<string, unknown>[]
  const doneSteps = steps.filter(s => s.status === 'done').length
  const projectCompletion = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0

  return NextResponse.json({
    client,
    steps,
    formCompletion,
    projectCompletion,
    unreadMessages: getUnreadAdminMessages(session.clientId).length,
    availableFiles: getFilesForClient(session.clientId, true).length,
  })
}
