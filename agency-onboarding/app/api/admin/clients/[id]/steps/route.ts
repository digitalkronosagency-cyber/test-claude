import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendStatusUpdateEmail } from '@/lib/emails'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const { stepId, status, admin_notes, client_message, requires_approval, estimated_date } = await req.json()

  const updateData: Record<string, unknown> = {}
  if (status !== undefined) updateData.status = status
  if (admin_notes !== undefined) updateData.admin_notes = admin_notes
  if (client_message !== undefined) updateData.client_message = client_message
  if (requires_approval !== undefined) updateData.requires_approval = requires_approval
  if (estimated_date !== undefined) updateData.estimated_date = estimated_date
  if (status === 'done') updateData.completed_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('project_steps')
    .update(updateData)
    .eq('id', stepId)
    .eq('client_id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email if step completed
  if (status === 'done') {
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('email, company_name, invite_token')
      .eq('id', id)
      .single()

    if (client) {
      await sendStatusUpdateEmail({
        to: client.email,
        companyName: client.company_name,
        stepName: data.step_name,
        inviteToken: client.invite_token,
      }).catch(console.error)
    }
  }

  return NextResponse.json(data)
}
