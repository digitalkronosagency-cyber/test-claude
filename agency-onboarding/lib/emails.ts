import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@digitalkronosagency.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendInvitationEmail(params: {
  to: string
  companyName: string
  contactName: string
  inviteToken: string
}) {
  const link = `${APP_URL}/client/${params.inviteToken}`
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `${params.companyName} — Votre espace projet est prêt`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h1 style="color: #f97316; margin: 0; font-size: 24px;">digitalkronosagency</h1>
        </div>
        <p style="font-size: 16px; color: #333;">Bonjour ${params.contactName || params.companyName},</p>
        <p style="font-size: 16px; color: #333;">Votre espace de suivi de projet est maintenant disponible.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background: #f97316; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
            👉 Accéder à mon espace
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">En quelques minutes, vous pourrez :</p>
        <ul style="font-size: 14px; color: #666;">
          <li>Remplir votre formulaire de démarrage</li>
          <li>Suivre l'avancement de votre site web</li>
          <li>Échanger directement avec notre équipe</li>
        </ul>
        <p style="font-size: 14px; color: #999;">Ou copiez ce lien : ${link}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">digitalkronosagency</p>
      </div>
    `,
  })
}

export async function sendFormCompletedEmail(params: {
  companyName: string
  clientId: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL!
  const link = `${APP_URL}/admin/clients/${params.clientId}`
  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `🎉 ${params.companyName} a complété son formulaire`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2>Formulaire complété !</h2>
        <p><strong>${params.companyName}</strong> vient de finaliser son formulaire d'onboarding.</p>
        <a href="${link}" style="background: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Voir la fiche client
        </a>
      </div>
    `,
  })
}

export async function sendNewMessageEmail(params: {
  to: string
  senderName: string
  messagePreview: string
  link: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `💬 Nouveau message de ${params.senderName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2>Nouveau message</h2>
        <p>Vous avez reçu un message de <strong>${params.senderName}</strong> :</p>
        <blockquote style="background: #f5f5f5; padding: 16px; border-left: 4px solid #f97316; margin: 20px 0;">
          ${params.messagePreview}
        </blockquote>
        <a href="${params.link}" style="background: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
          Répondre
        </a>
      </div>
    `,
  })
}

export async function sendStatusUpdateEmail(params: {
  to: string
  companyName: string
  stepName: string
  inviteToken: string
}) {
  const link = `${APP_URL}/client/${params.inviteToken}`
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `✅ Votre projet avance — ${params.stepName} terminée`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h1 style="color: #f97316; margin: 0; font-size: 24px;">digitalkronosagency</h1>
        </div>
        <h2>Bonne nouvelle, ${params.companyName} !</h2>
        <p>L'étape <strong>${params.stepName}</strong> de votre projet est maintenant terminée.</p>
        <a href="${link}" style="background: #f97316; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
          Voir mon tableau de bord
        </a>
      </div>
    `,
  })
}
