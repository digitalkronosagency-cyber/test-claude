import { NextRequest, NextResponse } from 'next/server'
import { getClientSession, getAdminSession } from '@/lib/auth'
import { createSharedFile } from '@/lib/db-helpers'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  const clientSession = await getClientSession()
  const adminSession = await getAdminSession()

  if (!clientSession && !adminSession) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = (formData.get('bucket') as string) || 'client-photos'
  const clientId = clientSession?.clientId || (formData.get('clientId') as string)

  if (!file || !clientId) {
    return NextResponse.json({ error: 'Fichier ou client manquant' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'bin'
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', bucket, clientId)

  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)

  const storagePath = `/uploads/${bucket}/${clientId}/${filename}`

  if (bucket === 'shared-files' && adminSession) {
    createSharedFile({
      client_id: clientId,
      filename,
      original_name: file.name,
      storage_path: storagePath,
      file_type: file.type,
      size_bytes: file.size,
      uploaded_by: 'admin',
    })
  }

  return NextResponse.json({ path: storagePath, url: storagePath, name: file.name })
}
