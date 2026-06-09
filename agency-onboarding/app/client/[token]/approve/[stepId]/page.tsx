'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ApprovePage() {
  const { token, stepId } = useParams<{ token: string; stepId: string }>()
  const router = useRouter()
  const [step, setStep] = useState<{ step_name: string; step_icon: string; client_message: string | null } | null>(null)
  const [comment, setComment] = useState('')
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    // Fetch step info via supabase client (public read on project_steps needed or via API)
    fetch('/api/auth/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(() => {
      return fetch(`/api/client/step/${stepId}`)
    }).then(r => r.ok ? r.json() : null).then(data => {
      if (data) setStep(data)
    })
  }, [token, stepId])

  async function approve() {
    setApproving(true)
    const res = await fetch('/api/client/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, comment }),
    })
    if (res.ok) {
      setApproved(true)
      setTimeout(() => router.push(`/client/${token}`), 2000)
    }
    setApproving(false)
  }

  if (!step) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a1a2e] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href={`/client/${token}`} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="text-orange-500 font-bold">digitalkronosagency</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {approved ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Approuvé !</h1>
            <p className="text-gray-500">Merci pour votre validation. Retour au tableau de bord...</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <span className="text-5xl">{step.step_icon}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-3">{step.step_name}</h1>
                <p className="text-gray-500 mt-1">Votre approbation est requise pour continuer</p>
              </div>

              {step.client_message && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-blue-700 mb-1">Message de l'agence :</p>
                  <p className="text-sm text-blue-800">{step.client_message}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
                <Textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Vos remarques ou questions..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <Button onClick={approve} disabled={approving} className="w-full" size="lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                {approving ? 'Validation en cours...' : 'J\'approuve ✓'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
