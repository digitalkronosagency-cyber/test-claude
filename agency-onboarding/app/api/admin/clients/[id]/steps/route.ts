import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateStep, getClientById } from '@/lib/db-helpers'
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

  const step = await updateStep(stepId, id, updateData) as Record<string, unknown>

  if (status === 'done') {
    const client = await getClientById(id)
    if (client?.email) {
      await sendStatusUpdateEmail({
        to: client.email as string,
        companyName: client.company_name as string,
        stepName: step?.step_name as string,
        inviteToken: client.invite_token as string,
      }).catch(console.error)
    }
  }

  return NextResponse.json(step)
}
