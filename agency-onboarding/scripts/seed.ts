import { createClient, createMessage, upsertResponse, getStepsForClient, updateStep } from '../lib/db-helpers'

async function seed() {
  console.log('🗑️  Seeding database...\n')

  // ── Client 1: Dupont Maçonnerie ──
  const dupont = await createClient({
    company_name: 'Dupont Maçonnerie',
    contact_name: 'Jean Dupont',
    email: 'jean.dupont@dupont-maconnerie.fr',
    phone: '06 12 34 56 78',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    revenue_range: '500K-1M€',
    status: 'invited',
    delivery_date: '2024-06-01',
  }) as Record<string, unknown>
  console.log(`✓ Dupont Maçonnerie → /client/${dupont.invite_token}`)

  // ── Client 2: Martin Plomberie ──
  const martin = await createClient({
    company_name: 'Martin Plomberie',
    contact_name: 'Pierre Martin',
    email: 'p.martin@martin-plomberie.fr',
    phone: '06 98 76 54 32',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    revenue_range: '1M-5M€',
    status: 'onboarding',
    delivery_date: '2024-04-15',
  }) as Record<string, unknown>

  await Promise.all([
    upsertResponse(martin.id as string, 'company', {
      company_name: 'Martin Plomberie',
      contact_name: 'Pierre Martin',
      email: 'p.martin@martin-plomberie.fr',
      phone: '06 98 76 54 32',
      city: 'Bordeaux',
      region: 'Nouvelle-Aquitaine',
      founded: '2008',
      employees: '6-20',
      revenue_range: '1M-5M€',
    }, true),
    upsertResponse(martin.id as string, 'activities', {
      selected: ['Plomberie', 'Chauffage', 'Climatisation'],
      speciality: 'Spécialiste installation PAC et systèmes solaires',
    }, true),
    upsertResponse(martin.id as string, 'certifications', {
      selected: ["RGE (Reconnu Garant de l'Environnement)", 'QualiPAC', 'QualiSol'],
    }, true),
    upsertResponse(martin.id as string, 'seo', {
      city_main: 'Bordeaux',
      cities_secondary: 'Mérignac, Pessac, Talence',
      radius: '30 km',
      keywords: 'plombier bordeaux, installation pompe à chaleur bordeaux',
    }, true),
    upsertResponse(martin.id as string, 'goals', {
      current_site: 'www.martin-plomberie-bordeaux.fr',
      dislikes: 'Site trop vieux, pas responsive, mal référencé',
      budget: '3000-5000€',
      timeline: '2-3 mois',
    }, false),
  ])

  const martinSteps = await getStepsForClient(martin.id as string) as { id: string }[]
  if (martinSteps[0]) await updateStep(martinSteps[0].id, martin.id as string, { status: 'done', completed_at: new Date().toISOString() })
  if (martinSteps[1]) await updateStep(martinSteps[1].id, martin.id as string, {
    status: 'in_progress',
    client_message: "Nous analysons votre site actuel et préparons les recommandations SEO. Résultats d'ici 3 jours.",
  })

  await createMessage(martin.id as string, 'admin', "Bonjour Pierre, j'ai bien reçu vos premières informations. Pouvez-vous compléter la section \"Objectifs\" ?")
  await createMessage(martin.id as string, 'client', "Bonjour ! Bien sûr, je complète ça aujourd'hui. Merci pour le suivi !")
  console.log(`✓ Martin Plomberie → /client/${martin.invite_token}`)

  // ── Client 3: Roux Construction ──
  const roux = await createClient({
    company_name: 'Roux Construction',
    contact_name: 'Marc Roux',
    email: 'm.roux@roux-construction.fr',
    phone: '01 23 45 67 89',
    city: 'Paris',
    region: 'Île-de-France',
    revenue_range: '5M-20M€',
    status: 'delivered',
    delivery_date: '2024-01-15',
  }) as Record<string, unknown>

  const rouxSteps = await getStepsForClient(roux.id as string) as { id: string }[]
  await Promise.all(rouxSteps.map(s => updateStep(s.id, roux.id as string, { status: 'done', completed_at: new Date().toISOString() })))

  await createMessage(roux.id as string, 'admin', '🎉 Votre site est en ligne ! Félicitations pour ce beau projet.')
  await createMessage(roux.id as string, 'client', 'Merci pour le travail exceptionnel ! Notre trafic a déjà augmenté de 40%.')
  console.log(`✓ Roux Construction → /client/${roux.invite_token}`)

  console.log('\n🎉 Seed terminé !\n')
  console.log('─────────────────────────────────────────────────')
  console.log('  Admin:     https://digitalkronosagency-onboarding.vercel.app/admin/login')
  console.log('  Email:     admin@digitalkronosagency.com')
  console.log('  Password:  admin123')
  console.log('─────────────────────────────────────────────────\n')
}

seed().catch(console.error)
