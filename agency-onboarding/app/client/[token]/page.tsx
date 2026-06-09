import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClientSession, verifyClientToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import ClientDashboardView from '@/components/client/ClientDashboard'

export default async function ClientTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const cookieStore = await cookies()
  let clientId: string | null = null

  // Check existing session
  const existingSession = cookieStore.get('client_session')?.value
  if (existingSession) {
    const verified = await verifyClientToken(existingSession)
    if (verified) clientId = verified.clientId
  }

  // If no session, validate token and create session
  if (!clientId) {
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('id, status')
      .eq('invite_token', token)
      .single()

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
    clientId = client.id
  }

  return <ClientDashboardWrapper clientId={clientId!} token={token} />
}

async function ClientDashboardWrapper({ clientId, token }: { clientId: string; token: string }) {
  const [clientRes, stepsRes, responsesRes, messagesRes, filesRes, formConfigRes] = await Promise.all([
    supabaseAdmin.from('clients').select('*').eq('id', clientId).single(),
    supabaseAdmin.from('project_steps').select('*').eq('client_id', clientId).order('order_index'),
    supabaseAdmin.from('onboarding_responses').select('*').eq('client_id', clientId),
    supabaseAdmin.from('messages').select('*').eq('client_id', clientId).eq('read', false).eq('sender', 'admin'),
    supabaseAdmin.from('shared_files').select('*').eq('client_id', clientId).eq('visible_to_client', true),
    supabaseAdmin.from('form_config').select('config').eq('id', 1).single(),
  ])

  if (!clientRes.data) redirect('/')

  const formConfig = formConfigRes.data?.config
  const totalSections = formConfig?.sections?.length || 9
  const completedSections = responsesRes.data?.filter(r => r.completed).length || 0
  const formCompletion = Math.round((completedSections / totalSections) * 100)

  const steps = stepsRes.data || []
  const doneSteps = steps.filter(s => s.status === 'done').length
  const projectCompletion = steps.length > 0 ? Math.round((doneSteps / steps.length) * 100) : 0

  return (
    <ClientDashboardView
      client={clientRes.data}
      steps={steps}
      token={token}
      formCompletion={formCompletion}
      projectCompletion={projectCompletion}
      unreadMessages={messagesRes.data?.length || 0}
      availableFiles={filesRes.data?.length || 0}
    />
  )
}
