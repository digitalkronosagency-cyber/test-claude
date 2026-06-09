import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClientSession, verifyClientToken } from '@/lib/auth'
import { getClientByToken, getClientById, getStepsForClient, getResponsesForClient, getUnreadAdminMessages, getFilesForClient, getFormConfig } from '@/lib/db-helpers'
import ClientDashboardView from '@/components/client/ClientDashboard'

export default async function ClientTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const cookieStore = await cookies()
  let clientId: string | null = null

  const existingSession = cookieStore.get('client_session')?.value
  if (existingSession) {
    const verified = await verifyClientToken(existingSession)
    if (verified) clientId = verified.clientId
  }

  if (!clientId) {
    const client = getClientByToken(token) as Record<string, unknown> | undefined
    if (!client) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide</h1>
            <p className="text-gray-500">Ce lien d'invitation n'est pas valide ou a expiré.</p>
          </div>
        </div>
      )
    }
    clientId = client.id as string
  }

  const client = getClientById(clientId) as Record<string, unknown> | undefined
  if (!client) redirect('/')

  const formConfig = getFormConfig() as { sections: unknown[] }
  const totalSections = formConfig?.sections?.length || 9
  const responses = getResponsesForClient(clientId)
  const completedSections = responses.filter(r => r.completed).length
  const formCompletion = Math.round((completedSections / totalSections) * 100)

  const steps = getStepsForClient(clientId) as Record<string, unknown>[]
  const doneSteps = steps.filter(s => s.status === 'done').length
  const projectCompletion = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <ClientDashboardView
      client={client as any}
      steps={steps as any}
      token={token}
      formCompletion={formCompletion}
      projectCompletion={projectCompletion}
      unreadMessages={getUnreadAdminMessages(clientId).length}
      availableFiles={getFilesForClient(clientId, true).length}
    />
  )
}
