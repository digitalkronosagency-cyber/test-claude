import { Client } from '@/types'

interface OnboardingData {
  company?: Record<string, string>
  activities?: { selected?: string[] }
  certifications?: { selected?: string[] }
  seo?: { city_main?: string; cities_secondary?: string[]; radius?: string; keywords?: string; competitors?: string }
  projects?: { list?: Array<{ name: string; type: string; city: string; budget: string; description: string }> }
  photos?: { count?: number }
  identity?: { has_logo?: boolean; color1?: string; color2?: string }
  objectives?: { selected?: string[] }
  goals?: { budget?: string; timeline?: string; current_site?: string; dislikes?: string; inspiration?: string }
}

export function generateClaudeCodeBrief(client: Client, responses: OnboardingData): string {
  return `# BRIEF CLAUDE CODE — REFONTE SITE WEB BTP
========================================
## ENTREPRISE
- Nom : ${responses.company?.company_name || client.company_name}
- Ville : ${responses.company?.city || client.city} — ${responses.company?.region || client.region}
- Téléphone : ${responses.company?.phone || client.phone}
- Email : ${responses.company?.email || client.email}
- CA annuel : ${responses.company?.revenue_range || client.revenue_range}
- Employés : ${responses.company?.employees || 'Non renseigné'}
- Fondée en : ${responses.company?.founded || 'Non renseigné'}

## ACTIVITÉS BTP
${responses.activities?.selected?.map((a: string) => '- ' + a).join('\n') || '- Non renseigné'}

## CERTIFICATIONS
${responses.certifications?.selected?.map((c: string) => '- ' + c).join('\n') || '- Non renseigné'}

## SEO — ZONE GÉOGRAPHIQUE
- Ville principale : ${responses.seo?.city_main || 'Non renseigné'}
- Villes secondaires : ${responses.seo?.cities_secondary?.join(', ') || 'Non renseigné'}
- Rayon : ${responses.seo?.radius || 'Non renseigné'}

## MOTS-CLÉS CIBLES
${responses.seo?.keywords || 'Non renseigné'}

## CONCURRENTS LOCAUX
${responses.seo?.competitors || 'Non renseigné'}

## RÉALISATIONS PHARES
${responses.projects?.list?.map(p =>
  `- ${p.name} (${p.type}, ${p.city}, ${p.budget})\n  ${p.description}`
).join('\n') || '- Non renseigné'}

## PHOTOS DISPONIBLES
${responses.photos?.count || 0} photos uploadées dans Supabase Storage
Bucket : client-photos/${client.id}/

## IDENTITÉ VISUELLE
- Logo : ${responses.identity?.has_logo ? 'Oui' : 'Non'}
- Couleur principale : ${responses.identity?.color1 || 'Non renseigné'}
- Couleur secondaire : ${responses.identity?.color2 || 'Non renseigné'}

## OBJECTIFS DU SITE
${responses.objectives?.selected?.map((o: string) => '- ' + o).join('\n') || '- Non renseigné'}

## BUDGET & DÉLAIS
- Budget : ${responses.goals?.budget || 'Non renseigné'}
- Délai : ${responses.goals?.timeline || 'Non renseigné'}
- Site actuel : ${responses.goals?.current_site || 'Non renseigné'}

## CE QUI NE VA PAS DANS LE SITE ACTUEL
${responses.goals?.dislikes || 'Non renseigné'}

## SITES D'INSPIRATION
${responses.goals?.inspiration || 'Non renseigné'}

## INSTRUCTIONS POUR CLAUDE CODE
1. Utilise le skill frontend-design — design distinctif, pas de templates génériques
2. Utilise le skill claude-seo — optimise chaque page sur les mots-clés listés
3. Crée des pages géolocalisées pour chaque ville de la zone d'intervention
4. Intègre les certifications comme éléments de réassurance visuelle
5. Crée une galerie de réalisations avec les photos Supabase
6. Optimise le formulaire de contact pour maximiser les conversions
7. Intègre Schema.org LocalBusiness + Service sur chaque page
8. Performance cible : Lighthouse > 90 sur mobile
9. Déployable sur Vercel
========================================`
}
