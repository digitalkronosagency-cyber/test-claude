'use client'
import Link from 'next/link'
import { Client, ProjectStep } from '@/types'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, FileText, CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  client: Client
  steps: ProjectStep[]
  token: string
  formCompletion: number
  projectCompletion: number
  unreadMessages: number
  availableFiles: number
}

const stepStatusIcon = (status: string) => {
  switch (status) {
    case 'done': return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'in_progress': return <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" />
    case 'waiting_client': return <AlertCircle className="h-5 w-5 text-yellow-500" />
    default: return <Circle className="h-5 w-5 text-gray-300" />
  }
}

export default function ClientDashboardView({
  client, steps, token, formCompletion, projectCompletion, unreadMessages, availableFiles
}: Props) {
  const doneCount = steps.filter(s => s.status === 'done').length
  const currentStep = steps.find(s => s.status === 'in_progress') || steps.find(s => s.status === 'waiting_client')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-4 py-5">
        <div className="max-w-lg mx-auto">
          <p className="text-[#1a6dff] font-bold text-xl">Azure Média</p>
          <p className="text-gray-300 mt-1">
            Bonjour {client.contact_name || client.company_name} 👋
          </p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Project progress */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Avancement du projet</h2>
              <span className="text-2xl font-bold text-[#1a6dff]">{projectCompletion}%</span>
            </div>
            <Progress value={projectCompletion} className="h-3 mb-3" />
            <p className="text-sm text-gray-500 mb-1">{doneCount} étapes sur {steps.length} terminées</p>

            {client.delivery_date && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-4 w-4 text-[#1a6dff]" />
                <p className="text-sm text-blue-700">
                  Livraison prévue le <strong>{format(new Date(client.delivery_date), 'dd MMMM yyyy', { locale: fr })}</strong>
                </p>
              </div>
            )}

            {currentStep?.client_message && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-700 mb-1">Message de l'agence :</p>
                <p className="text-sm text-blue-800">{currentStep.client_message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Étapes du projet</h2>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{stepStatusIcon(step.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{step.step_icon}</span>
                      <span className={`text-sm font-medium ${
                        step.status === 'done' ? 'text-gray-400 line-through' :
                        step.status === 'in_progress' ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.step_name}
                      </span>
                      {step.status === 'waiting_client' && step.requires_approval && (
                        <Link href={`/client/${token}/approve/${step.id}`}>
                          <Badge variant="warning" className="text-xs cursor-pointer">Votre avis requis</Badge>
                        </Link>
                      )}
                    </div>
                    {step.estimated_date && step.status !== 'done' && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Prévu: {format(new Date(step.estimated_date), 'dd/MM/yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900">Votre dossier</h2>
              <span className="text-sm font-bold text-[#1a6dff]">{formCompletion}%</span>
            </div>
            <Progress value={formCompletion} className="h-2 mb-3" />
            <p className="text-sm text-gray-500 mb-3">
              {formCompletion < 100
                ? 'Complétez votre formulaire pour que nous puissions démarrer votre projet'
                : 'Votre dossier est complet !'}
            </p>
            <Link href={`/client/${token}/onboarding`}>
              <Button variant={formCompletion === 100 ? 'outline' : 'default'} className="w-full">
                {formCompletion === 100 ? 'Voir mes réponses' : 'Continuer le formulaire'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <div className="grid grid-cols-2 gap-4">
          <Link href={`/client/${token}/messages`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="relative">
                  <MessageCircle className="h-8 w-8 text-blue-500" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">Messages</p>
                  <p className="text-xs text-gray-500">
                    {unreadMessages > 0 ? `${unreadMessages} non lu${unreadMessages > 1 ? 's' : ''}` : 'Aucun nouveau'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/client/${token}/files`}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Documents</p>
                  <p className="text-xs text-gray-500">
                    {availableFiles > 0 ? `${availableFiles} fichier${availableFiles > 1 ? 's' : ''}` : 'Aucun fichier'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
