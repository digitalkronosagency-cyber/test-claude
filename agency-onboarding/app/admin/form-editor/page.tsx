'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormSection, FormField } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2, Save, GripVertical } from 'lucide-react'

const FIELD_TYPES = ['text', 'email', 'tel', 'number', 'select', 'multiselect', 'checkbox', 'textarea', 'file']

export default function FormEditor() {
  const router = useRouter()
  const [sections, setSections] = useState<FormSection[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/form-config')
      .then(r => r.json())
      .then(data => {
        setSections(data.config?.sections || [])
        if (data.config?.sections?.length > 0) {
          setSelectedSection(data.config.sections[0].id)
        }
        setLoading(false)
      })
  }, [])

  const currentSection = sections.find(s => s.id === selectedSection)
  const currentField = currentSection?.fields.find(f => f.id === selectedField)

  async function save() {
    setSaving(true)
    await fetch('/api/admin/form-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: { sections } }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addSection() {
    const id = `section_${Date.now()}`
    const newSection: FormSection = {
      id,
      key: id,
      title: 'Nouvelle section',
      icon: '📋',
      fields: [],
    }
    setSections([...sections, newSection])
    setSelectedSection(id)
  }

  function addField() {
    if (!selectedSection) return
    const id = `field_${Date.now()}`
    const newField: FormField = {
      id,
      label: 'Nouveau champ',
      type: 'text',
      required: false,
    }
    setSections(sections.map(s =>
      s.id === selectedSection
        ? { ...s, fields: [...s.fields, newField] }
        : s
    ))
    setSelectedField(id)
  }

  function updateSection(id: string, updates: Partial<FormSection>) {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  function deleteSection(id: string) {
    setSections(sections.filter(s => s.id !== id))
    setSelectedSection(sections[0]?.id || null)
  }

  function updateField(fieldId: string, updates: Partial<FormField>) {
    if (!selectedSection) return
    setSections(sections.map(s =>
      s.id === selectedSection
        ? { ...s, fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f) }
        : s
    ))
  }

  function deleteField(fieldId: string) {
    if (!selectedSection) return
    setSections(sections.map(s =>
      s.id === selectedSection
        ? { ...s, fields: s.fields.filter(f => f.id !== fieldId) }
        : s
    ))
    setSelectedField(null)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-orange-500">Éditeur de formulaire</h1>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — sections */}
        <div className="w-64 bg-white border-r overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Sections</h2>
            <button onClick={addSection} className="text-orange-500 hover:text-orange-600">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => { setSelectedSection(section.id); setSelectedField(null) }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  selectedSection === section.id ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50'
                }`}
              >
                <GripVertical className="h-3 w-3 text-gray-300 flex-shrink-0" />
                <span className="truncate">{section.icon} {section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center — section fields */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentSection ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Input
                    value={currentSection.icon}
                    onChange={e => updateSection(currentSection.id, { icon: e.target.value })}
                    className="w-16 text-center"
                  />
                  <Input
                    value={currentSection.title}
                    onChange={e => updateSection(currentSection.id, { title: e.target.value })}
                    className="font-semibold"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addField}>
                    <Plus className="h-3 w-3 mr-1" />
                    Champ
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSection(currentSection.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {currentSection.fields.map(field => (
                  <Card
                    key={field.id}
                    className={`cursor-pointer transition-all ${
                      selectedField === field.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-gray-300" />
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                            {field.required && <Badge variant="warning" className="text-xs">Obligatoire</Badge>}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteField(field.id) }}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
                {currentSection.fields.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>Aucun champ dans cette section</p>
                    <Button size="sm" className="mt-3" onClick={addField}>Ajouter un champ</Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>Sélectionnez une section ou créez-en une nouvelle</p>
            </div>
          )}
        </div>

        {/* Right sidebar — field properties */}
        <div className="w-72 bg-white border-l overflow-y-auto p-4">
          <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-4">
            Propriétés du champ
          </h2>
          {currentField ? (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={currentField.label}
                  onChange={e => updateField(currentField.id, { label: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <select
                  value={currentField.type}
                  onChange={e => updateField(currentField.id, { type: e.target.value as FormField['type'] })}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                >
                  {FIELD_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={currentField.placeholder || ''}
                  onChange={e => updateField(currentField.id, { placeholder: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Texte d'aide</Label>
                <Input
                  value={currentField.help || ''}
                  onChange={e => updateField(currentField.id, { help: e.target.value })}
                  className="mt-1"
                />
              </div>
              {(currentField.type === 'select' || currentField.type === 'multiselect' || currentField.type === 'checkbox') && (
                <div>
                  <Label className="text-xs">Options (une par ligne)</Label>
                  <textarea
                    value={(currentField.options || []).join('\n')}
                    onChange={e => updateField(currentField.id, { options: e.target.value.split('\n').filter(Boolean) })}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={currentField.required}
                  onChange={e => updateField(currentField.id, { required: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="required" className="text-xs cursor-pointer">Champ obligatoire</Label>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Sélectionnez un champ pour modifier ses propriétés</p>
          )}
        </div>
      </div>
    </div>
  )
}
