import { NextRequest, NextResponse } from 'next/server'
import { getClientSession, getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const clientSession = await getClientSession()
  const adminSession = await getAdminSession()

  if (!clientSession && !adminSession) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string || 'client-photos'
  const clientId = clientSession?.clientId || (formData.get('clientId') as string)

  if (!file || !clientId) {
    return NextResponse.json({ error: 'Fichier ou client manquant' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `${clientId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, arrayBuffer, { contentType: file.type })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  // Save to shared_files if it's a shared file
  if (bucket === 'shared-files' && adminSession) {
    await supabaseAdmin.from('shared_files').insert({
      client_id: clientId,
      filename,
      original_name: file.name,
      storage_path: filename,
      file_type: file.type,
      size_bytes: file.size,
      uploaded_by: 'admin',
    })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename)

  return NextResponse.json({ path: filename, url: publicUrl, name: file.name })
}
