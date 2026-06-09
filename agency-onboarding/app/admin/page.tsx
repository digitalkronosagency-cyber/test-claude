'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Client } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Send, Eye, Users, Clock, CheckCircle, Archive, LogOut } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const STATUS_LABELS: Record<string, string> = {
  invited: 'Invité',
  onboarding: 'Onboarding',
  in_progress: 'En cours',
  review: 'Révision',
  delivered: 'Livré',
  archived: 'Archivé',
}

const STATUS_VARIANTS: Record<string, 'default' | 'info' | 'warning' | 'success' | 'secondary' | 'destructive' | 'outline'> = {
  invited: 'secondary',
  onboarding: 'info',
  in_progress: 'warning',
  review: 'default',
  delivered: 'success',
  archived: 'outline',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClient, setNewClient] = useState({
    company_name: '', contact_name: '', email: '', phone: '', city: '', region: '', delivery_date: '',
  })

  const fetchClients = useCallback(async () => {
    const res = await fetch('/api/admin/clients')
    if (res.ok) setClients(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  async function createClient(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    })
    if (res.ok) {
      setShowNewClient(false)
      setNewClient({ company_name: '', contact_name: '', email: '', phone: '', city: '', region: '', delivery_date: '' })
      fetchClients()
    }
  }

  async function sendInvite(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const res = await fetch(`/api/admin/clients/${id}/invite`, { method: 'POST' })
    if (res.ok) {
      const { inviteLink } = await res.json()
      await navigator.clipboard.writeText(inviteLink).catch(() => {})
      alert(`Invitation envoyée ! Lien copié : ${inviteLink}`)
      fetchClients()
    }
  }

  async function logout() {
    await fetch('/api/auth/admin', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const filtered = clients.filter(c =>
    filter === '' ||
    c.company_name.toLowerCase().includes(filter.toLowerCase()) ||
    c.city?.toLowerCase().includes(filter.toLowerCase()) ||
    c.status === filter
  )

  const stats = {
    active: clients.filter(c => c.status === 'in_progress').length,
    waiting: clients.filter(c => c.status === 'invited' || c.status === 'onboarding').length,
    delivered: clients.filter(c => c.status === 'delivered').length,
    total: clients.length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1a6dff]">Azure Média</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/form-editor" className="text-sm text-gray-300 hover:text-white">
            Éditeur formulaire
          </Link>
          <button onClick={logout} className="text-gray-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-[#1a6dff]" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total clients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-gray-500">En cours</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Archive className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.waiting}</p>
                <p className="text-xs text-gray-500">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.delivered}</p>
                <p className="text-xs text-gray-500">Livrés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Input
            placeholder="Rechercher par nom, ville, statut..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau client</DialogTitle>
              </DialogHeader>
              <form onSubmit={createClient} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nom entreprise *</Label>
                    <Input value={newClient.company_name} onChange={e => setNewClient({...newClient, company_name: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <Input value={newClient.contact_name} onChange={e => setNewClient({...newClient, contact_name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <Input value={newClient.city} onChange={e => setNewClient({...newClient, city: e.target.value})} />
                  </div>
                  <div>
                    <Label>Région</Label>
                    <Input value={newClient.region} onChange={e => setNewClient({...newClient, region: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Date de livraison estimée</Label>
                    <Input type="date" value={newClient.delivery_date} onChange={e => setNewClient({...newClient, delivery_date: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNewClient(false)}>Annuler</Button>
                  <Button type="submit">Créer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients table */}
        <Card>
          <CardHeader>
            <CardTitle>Clients ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-gray-500">Chargement...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Aucun client trouvé</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 pr-4">Entreprise</th>
                      <th className="pb-3 pr-4">Ville</th>
                      <th className="pb-3 pr-4">Statut</th>
                      <th className="pb-3 pr-4">Livraison</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map(client => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <p className="font-medium">{client.company_name}</p>
                          <p className="text-gray-500 text-xs">{client.contact_name}</p>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{client.city}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={STATUS_VARIANTS[client.status]}>
                            {STATUS_LABELS[client.status]}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {client.delivery_date
                            ? format(new Date(client.delivery_date), 'dd MMM yyyy', { locale: fr })
                            : '—'}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Link href={`/admin/clients/${client.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </Link>
                            <Button size="sm" variant="secondary" onClick={e => sendInvite(client.id, e)}>
                              <Send className="h-3 w-3 mr-1" />
                              Inviter
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
