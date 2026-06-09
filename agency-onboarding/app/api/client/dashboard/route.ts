import { NextResponse } from 'next/server'
import { getClientSession } from '@/lib/auth'
import { getClientById, getStepsForClient, getResponsesForClient, getUnreadAdminMessages, getFilesForClient, getFormConfig } from '@/lib/db-helpers'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const client = await getClientById(session.clientId)
  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const [formConfig, responses, steps, unreadMessages, availableFilesArr] = await Promise.all([
    getFormConfig() as Promise<{ sections: unknown[] }>,
    getResponsesForClient(session.clientId),
    getStepsForClient(session.clientId),
    getUnreadAdminMessages(session.clientId),
    getFilesForClient(session.clientId, true),
  ])

  const totalSections = (formConfig as { sections: unknown[] })?.sections?.length || 9
  const completedSections = responses.filter(r => r.completed).length
  const formCompletion = Math.round((completedSections / totalSections) * 100)

  const doneSteps = (steps as Record<string, unknown>[]).filter(s => s.status === 'done').length
  const projectCompletion = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0

  return NextResponse.json({
    client,
    steps,
    formCompletion,
    projectCompletion,
    unreadMessages: unreadMessages.length,
    availableFiles: availableFilesArr.length,
  })
}
