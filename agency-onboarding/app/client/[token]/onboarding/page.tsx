'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FormSection, FormField } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'

interface SectionData {
  [key: string]: unknown
}

export default function OnboardingForm() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [sections, setSections] = useState<FormSection[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, SectionData>>({})
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Authenticate client
    fetch('/api/auth/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(() => {
      return fetch('/api/client/onboarding')
    }).then(r => r.json()).then(data => {
      setSections(data.formConfig?.sections || [])
      const responsesMap: Record<string, SectionData> = {}
      data.responses?.forEach((r: { section_key: string; data: SectionData }) => {
        responsesMap[r.section_key] = r.data
      })
      setResponses(responsesMap)
      setLoading(false)
    })
  }, [token])

  const saveSection = useCallback(async (sectionKey: string, data: SectionData) => {
    setSaveStatus('saving')
    await fetch('/api/client/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section_key: sectionKey, data }),
    })
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }, [])

  function updateField(sectionKey: string, fieldId: string, value: unknown) {
    const newData = { ...responses[sectionKey], [fieldId]: value }
    setResponses({ ...responses, [sectionKey]: newData })

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSection(sectionKey, newData)
    }, 1000)
  }

  async function goNext() {
    const section = sections[currentIndex]
    if (section) {
      const isLast = currentIndex === sections.length - 1
      await fetch('/api/client/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_key: section.key,
          data: responses[section.key] || {},
          completed: true,
        }),
      })
      if (isLast) {
        await fetch('/api/client/onboarding', { method: 'PUT' })
        router.push(`/client/${token}`)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  async function uploadFile(sectionKey: string, fieldId: string, files: FileList | null) {
    if (!files || files.length === 0) return
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('bucket', 'client-photos')

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const { path, name } = await res.json()
      const existing = (responses[sectionKey]?.[fieldId] as string[]) || []
      updateField(sectionKey, fieldId, [...existing, { path, name }])
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (sections.length === 0) return <div className="min-h-screen flex items-center justify-center">Formulaire non disponible</div>

  const section = sections[currentIndex]
  const progress = Math.round(((currentIndex + 1) / sections.length) * 100)
  const sectionData = responses[section.key] || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a1a2e] text-white px-4 py-4">
        <div className="max-w-lg mx-auto">
          <p className="text-orange-500 font-bold">digitalkronosagency</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-400">Étape {currentIndex + 1} sur {sections.length}</p>
            {saveStatus !== 'idle' && (
              <span className="text-xs text-green-400">
                {saveStatus === 'saving' ? 'Sauvegarde...' : '✓ Sauvegardé'}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {section.icon} {section.title}
          </h1>
          {section.description && <p className="text-gray-500 mt-1">{section.description}</p>}
        </div>

        <div className="space-y-5">
          {section.fields.map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={sectionData[field.id]}
              onChange={val => updateField(section.key, field.id, val)}
              onUpload={files => uploadFile(section.key, field.id, files)}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={() => setCurrentIndex(currentIndex - 1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
          )}
          <Button onClick={goNext} className="flex-1">
            {currentIndex === sections.length - 1 ? (
              <><Check className="h-4 w-4 mr-2" />Envoyer mon dossier</>
            ) : (
              <>Suivant<ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FieldRenderer({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: FormField
  value: unknown
  onChange: (val: unknown) => void
  onUpload: (files: FileList | null) => void
}) {
  const strVal = (value as string) || ''
  const arrVal = (value as string[]) || []

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.help && <p className="text-xs text-gray-500 mt-0.5">{field.help}</p>}

      <div className="mt-1.5">
        {field.type === 'textarea' && (
          <Textarea
            value={strVal}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        )}
        {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number') && (
          <Input
            type={field.type}
            value={strVal}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        )}
        {field.type === 'select' && (
          <select
            value={strVal}
            onChange={e => onChange(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Sélectionner...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        {(field.type === 'multiselect' || field.type === 'checkbox') && (
          <div className="grid grid-cols-2 gap-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-orange-50 transition-colors">
                <input
                  type="checkbox"
                  checked={arrVal.includes(opt)}
                  onChange={e => {
                    if (e.target.checked) onChange([...arrVal, opt])
                    else onChange(arrVal.filter(v => v !== opt))
                  }}
                  className="rounded accent-orange-500"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {field.type === 'file' && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Cliquez ou glissez vos fichiers ici</p>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              className="hidden"
              onChange={e => onUpload(e.target.files)}
            />
            {Array.isArray(value) && value.length > 0 && (
              <p className="text-xs text-green-600 mt-1">{value.length} fichier(s) envoyé(s)</p>
            )}
          </label>
        )}
      </div>
    </div>
  )
}
