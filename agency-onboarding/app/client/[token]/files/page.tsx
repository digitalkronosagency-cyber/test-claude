'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { SharedFile } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, FileText, Image, Download } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function FilesPage() {
  const { token } = useParams<{ token: string }>()
  const [files, setFiles] = useState<SharedFile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFiles = useCallback(async () => {
    await fetch('/api/auth/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const res = await fetch('/api/client/files')
    if (res.ok) setFiles(await res.json())
    setLoading(false)
  }, [token])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  function getFileIcon(type: string | null) {
    if (type?.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a1a2e] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href={`/client/${token}`} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-orange-500 font-bold">digitalkronosagency</p>
            <p className="text-gray-400 text-sm">Documents partagés</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-400 mt-20">Chargement...</p>
        ) : files.length === 0 ? (
          <div className="text-center mt-20">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun fichier disponible pour le moment</p>
            <p className="text-gray-400 text-sm mt-1">Votre agence partagera des documents ici</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map(file => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  {getFileIcon(file.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.original_name}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(file.created_at), 'dd MMM yyyy', { locale: fr })}
                      {file.size_bytes ? ` — ${formatSize(file.size_bytes)}` : ''}
                    </p>
                  </div>
                  <a
                    href={`/api/download?path=${file.storage_path}&bucket=shared-files`}
                    className="text-orange-500 hover:text-orange-600"
                    download={file.original_name}
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
