const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const USE_RESEND = !!process.env.RESEND_API_KEY

async function sendEmail(to: string, subject: string, html: string) {
  if (USE_RESEND) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    return resend.emails.send({ from, to, subject, html })
  }
  // Local dev: log email to console
  console.log('\n📧 ─── EMAIL (mode local) ─────────────────────────')
  console.log(`  To:      ${to}`)
  console.log(`  Subject: ${subject}`)
  console.log('──────────────────────────────────────────────────\n')
  return { data: { id: 'local-' + Date.now() }, error: null }
}

export async function sendInvitationEmail(params: {
  to: string
  companyName: string
  contactName: string
  inviteToken: string
}) {
  const link = `${APP_URL}/client/${params.inviteToken}`
  console.log(`\n🔗 Lien d'invitation : ${link}\n`)
  return sendEmail(
    params.to,
    `${params.companyName} — Votre espace projet est prêt`,
    `<p>Bonjour ${params.contactName || params.companyName},</p>
     <p>Accédez à votre espace : <a href="${link}">${link}</a></p>
     <p>Azure Média</p>`
  )
}

export async function sendFormCompletedEmail(params: {
  companyName: string
  clientId: string
}) {
  const link = `${APP_URL}/admin/clients/${params.clientId}`
  return sendEmail(
    process.env.ADMIN_EMAIL || 'admin@Azure Média.com',
    `🎉 ${params.companyName} a complété son formulaire`,
    `<p><strong>${params.companyName}</strong> a finalisé son formulaire.</p>
     <p><a href="${link}">Voir la fiche client</a></p>`
  )
}

export async function sendNewMessageEmail(params: {
  to: string
  senderName: string
  messagePreview: string
  link: string
}) {
  return sendEmail(
    params.to,
    `💬 Nouveau message de ${params.senderName}`,
    `<p>Message de <strong>${params.senderName}</strong> :</p>
     <blockquote>${params.messagePreview}</blockquote>
     <p><a href="${params.link}">Répondre</a></p>`
  )
}

export async function sendStatusUpdateEmail(params: {
  to: string
  companyName: string
  stepName: string
  inviteToken: string
}) {
  const link = `${APP_URL}/client/${params.inviteToken}`
  return sendEmail(
    params.to,
    `✅ Votre projet avance — ${params.stepName} terminée`,
    `<p>L'étape <strong>${params.stepName}</strong> est terminée.</p>
     <p><a href="${link}">Voir mon tableau de bord</a></p>`
  )
}
