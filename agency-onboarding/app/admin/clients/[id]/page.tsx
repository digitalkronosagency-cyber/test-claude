'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Client, ProjectStep, Message, SharedFile, OnboardingResponse } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Send, Copy, CheckCircle, RefreshCw } from 'lucide-react'
import { generateClaudeCodeBrief } from '@/lib/brief-generator'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const STEP_STATUS_LABELS: Record<string, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  waiting_client: 'Attente client',
  done: 'Terminé',
}

const STEP_STATUS_COLORS: Record<string, string> = {
  todo: 'text-gray-400',
  in_progress: 'text-blue-500',
  waiting_client: 'text-yellow-500',
  done: 'text-green-500',
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<{
    client: Client
    steps: ProjectStep[]
    responses: OnboardingResponse[]
    messages: Message[]
    files: SharedFile[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [briefText, setBriefText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/clients/${id}`)
    if (res.ok) {
      setData(await res.json())
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  async function updateStep(stepId: string, updates: Record<string, unknown>) {
    await fetch(`/api/admin/clients/${id}/steps`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, ...updates }),
    })
    fetchData()
  }

  async function sendMessage() {
    if (!newMessage.trim()) return
    setSendingMessage(true)
    await fetch(`/api/admin/clients/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    })
    setNewMessage('')
    setSendingMessage(false)
    fetchData()
  }

  async function updateStatus(status: string) {
    await fetch(`/api/admin/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
  }

  function generateBrief() {
    if (!data) return
    const responsesMap: Record<string, Record<string, unknown>> = {}
    data.responses.forEach(r => {
      responsesMap[r.section_key] = r.data
    })
    const brief = generateClaudeCodeBrief(data.client, responsesMap)
    setBriefText(brief)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (!data) return <div className="min-h-screen flex items-center justify-center">Client introuvable</div>

  const { client, steps, responses, messages, files } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-[#1a6dff]">{client.company_name}</h1>
          <span className="text-gray-400 text-sm">{client.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={client.status}
            onChange={e => updateStatus(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded px-3 py-1 border border-gray-600"
          >
            <option value="invited">Invité</option>
            <option value="onboarding">Onboarding</option>
            <option value="in_progress">En cours</option>
            <option value="review">Révision</option>
            <option value="delivered">Livré</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Client info bar */}
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-wrap gap-6 text-sm">
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{client.email}</span></div>
            <div><span className="text-gray-500">Tél:</span> <span className="font-medium">{client.phone || '—'}</span></div>
            <div><span className="text-gray-500">Région:</span> <span className="font-medium">{client.region || '—'}</span></div>
            {client.delivery_date && (
              <div><span className="text-gray-500">Livraison:</span> <span className="font-medium">
                {format(new Date(client.delivery_date), 'dd MMM yyyy', { locale: fr })}
              </span></div>
            )}
            <div>
              <span className="text-gray-500">Lien client:</span>{' '}
              <button
                className="text-[#1a6dff] hover:underline"
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/client/${client.invite_token}`)}
              >
                Copier le lien
              </button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="project">
          <TabsList className="mb-6">
            <TabsTrigger value="project">Projet</TabsTrigger>
            <TabsTrigger value="form">Formulaire</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages.filter(m => !m.read && m.sender === 'client').length})</TabsTrigger>
            <TabsTrigger value="files">Fichiers ({files.length})</TabsTrigger>
            <TabsTrigger value="brief">Brief</TabsTrigger>
          </TabsList>

          {/* PROJECT TAB */}
          <TabsContent value="project">
            <div className="space-y-3">
              {steps.map(step => (
                <StepCard key={step.id} step={step} onUpdate={updates => updateStep(step.id, updates)} />
              ))}
            </div>
          </TabsContent>

          {/* FORM TAB */}
          <TabsContent value="form">
            <div className="space-y-4">
              {responses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Le client n'a pas encore rempli le formulaire.</p>
              ) : (
                responses.map(r => (
                  <Card key={r.id}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        {r.section_key}
                        <Badge variant={r.completed ? 'success' : 'secondary'}>
                          {r.completed ? 'Complété' : 'En cours'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                        {JSON.stringify(r.data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <Card>
              <CardContent className="p-4">
                <div className="h-96 overflow-y-auto space-y-3 mb-4 border rounded p-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center mt-20">Aucun message</p>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                          msg.sender === 'admin'
                            ? 'bg-[#1a6dff] text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          {msg.content}
                          <p className="text-xs opacity-60 mt-1">
                            {format(new Date(msg.created_at), 'dd/MM HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 resize-none"
                    rows={2}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  />
                  <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FILES TAB */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Fichiers partagés</CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun fichier partagé</p>
                ) : (
                  <div className="space-y-2">
                    {files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{file.original_name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(file.created_at), 'dd/MM/yyyy')} — {file.uploaded_by}
                          </p>
                        </div>
                        <Badge variant={file.visible_to_client ? 'success' : 'secondary'}>
                          {file.visible_to_client ? 'Visible client' : 'Interne'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* BRIEF TAB */}
          <TabsContent value="brief">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Brief Claude Code
                  <div className="flex gap-2">
                    <Button onClick={generateBrief} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Générer
                    </Button>
                    {briefText && (
                      <Button onClick={() => navigator.clipboard.writeText(briefText)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {briefText ? (
                  <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto whitespace-pre-wrap border">
                    {briefText}
                  </pre>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">Cliquez sur "Générer" pour créer le brief à partir des réponses du formulaire</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StepCard({ step, onUpdate }: { step: ProjectStep; onUpdate: (u: Record<string, unknown>) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [adminNotes, setAdminNotes] = useState(step.admin_notes || '')
  const [clientMessage, setClientMessage] = useState(step.client_message || '')
  const [estimatedDate, setEstimatedDate] = useState(step.estimated_date || '')

  return (
    <Card className={`transition-all ${step.status === 'done' ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{step.step_icon}</span>
            <div>
              <p className="font-medium">{step.step_name}</p>
              <p className={`text-xs ${STEP_STATUS_COLORS[step.status]}`}>{STEP_STATUS_LABELS[step.status]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step.requires_approval && (
              <Badge variant="info">Approbation requise</Badge>
            )}
            <select
              value={step.status}
              onChange={e => onUpdate({ status: e.target.value })}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="waiting_client">Attente client</option>
              <option value="done">Terminé</option>
            </select>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600 text-sm">
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div>
              <Label className="text-xs">Message visible par le client</Label>
              <Textarea
                value={clientMessage}
                onChange={e => setClientMessage(e.target.value)}
                rows={2}
                className="text-sm mt-1"
                placeholder="Message d'avancement visible par le client..."
              />
            </div>
            <div>
              <Label className="text-xs">Notes internes (admin seulement)</Label>
              <Textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={2}
                className="text-sm mt-1"
                placeholder="Notes internes..."
              />
            </div>
            <div className="flex gap-3 items-end">
              <div>
                <Label className="text-xs">Date estimée</Label>
                <Input
                  type="date"
                  value={estimatedDate}
                  onChange={e => setEstimatedDate(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
              <Button
                size="sm"
                onClick={() => onUpdate({ admin_notes: adminNotes, client_message: clientMessage, estimated_date: estimatedDate })}
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
