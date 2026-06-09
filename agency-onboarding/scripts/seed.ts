import { createClient } from '@supabase/supabase-js'
import { DEFAULT_PROJECT_STEPS, DEFAULT_FORM_CONFIG } from '../lib/default-form-config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SEED_CLIENTS = [
  {
    company_name: 'Dupont Maçonnerie',
    contact_name: 'Jean Dupont',
    email: 'jean.dupont@dupont-maconnerie.fr',
    phone: '06 12 34 56 78',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    revenue_range: '500K-1M€',
    status: 'invited',
    delivery_date: '2024-04-01',
  },
  {
    company_name: 'Martin Plomberie',
    contact_name: 'Pierre Martin',
    email: 'p.martin@martin-plomberie.fr',
    phone: '06 98 76 54 32',
    city: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    revenue_range: '1M-5M€',
    status: 'onboarding',
    delivery_date: '2024-03-15',
  },
  {
    company_name: 'Roux Construction',
    contact_name: 'Marc Roux',
    email: 'm.roux@roux-construction.fr',
    phone: '01 23 45 67 89',
    city: 'Paris',
    region: 'Île-de-France',
    revenue_range: '5M-20M€',
    status: 'delivered',
    delivery_date: '2024-01-15',
  },
]

const MARTIN_RESPONSES = [
  {
    section_key: 'company',
    data: {
      company_name: 'Martin Plomberie',
      contact_name: 'Pierre Martin',
      email: 'p.martin@martin-plomberie.fr',
      phone: '06 98 76 54 32',
      city: 'Bordeaux',
      region: 'Nouvelle-Aquitaine',
      founded: '2008',
      employees: '6-20',
      revenue_range: '1M-5M€',
    },
    completed: true,
  },
  {
    section_key: 'activities',
    data: {
      selected: ['Plomberie', 'Chauffage', 'Climatisation'],
      speciality: 'Spécialiste installation systèmes solaires et pompes à chaleur',
    },
    completed: true,
  },
  {
    section_key: 'certifications',
    data: {
      selected: ['RGE (Reconnu Garant de l\'Environnement)', 'QualiPAC', 'QualiSol'],
    },
    completed: true,
  },
  {
    section_key: 'seo',
    data: {
      city_main: 'Bordeaux',
      cities_secondary: ['Mérignac', 'Pessac', 'Talence', 'Bègles'],
      radius: '30 km',
      keywords: 'plombier bordeaux, installation pompe à chaleur bordeaux, plomberie rge bordeaux',
      competitors: 'plomberie-dupuis-bordeaux.fr, martin-plomberie33.fr',
    },
    completed: true,
  },
  {
    section_key: 'goals',
    data: {
      current_site: 'www.martin-plomberie-bordeaux.fr (fait en 2015)',
      dislikes: 'Site trop vieux, pas responsive, pas bien référencé sur Google, design dépassé',
      budget: '3000-5000€',
      timeline: '2-3 mois',
    },
    completed: false,
  },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Insert form config
  await supabase.from('form_config').upsert({
    id: 1,
    config: DEFAULT_FORM_CONFIG,
    updated_at: new Date().toISOString(),
  })
  console.log('✓ Form config created')

  for (const clientData of SEED_CLIENTS) {
    // Create client
    const { data: client, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single()

    if (error) {
      console.error(`✗ Error creating ${clientData.company_name}:`, error.message)
      continue
    }

    console.log(`✓ Client created: ${client.company_name} (token: ${client.invite_token})`)

    // Create project steps
    const steps = DEFAULT_PROJECT_STEPS.map(s => ({
      ...s,
      client_id: client.id,
      status: clientData.status === 'delivered' ? 'done' : 'todo',
    }))

    if (clientData.status === 'onboarding') {
      steps[0].status = 'done'
      steps[1].status = 'in_progress'
    }

    await supabase.from('project_steps').insert(steps)

    // Add responses for Martin Plomberie
    if (clientData.company_name === 'Martin Plomberie') {
      for (const response of MARTIN_RESPONSES) {
        await supabase.from('onboarding_responses').insert({
          client_id: client.id,
          ...response,
          updated_at: new Date().toISOString(),
        })
      }
      console.log('  ✓ Responses added for Martin Plomberie')
    }

    // Add messages for Martin
    if (clientData.company_name === 'Martin Plomberie') {
      await supabase.from('messages').insert([
        {
          client_id: client.id,
          sender: 'admin',
          content: 'Bonjour Pierre, j\'ai bien reçu vos premières informations. Pouvez-vous compléter la section "Objectifs" pour que je puisse démarrer l\'audit ?',
          read: true,
        },
        {
          client_id: client.id,
          sender: 'client',
          content: 'Bonjour ! Bien sûr, je complète ça aujourd\'hui. Merci pour le suivi !',
          read: true,
        },
      ])
      console.log('  ✓ Messages added')
    }
  }

  console.log('\n🎉 Seed complete!')
  console.log('\nClients créés :')
  const { data: clients } = await supabase.from('clients').select('company_name, invite_token, status')
  clients?.forEach(c => {
    console.log(`  - ${c.company_name} (${c.status}) → /client/${c.invite_token}`)
  })
}

seed().catch(console.error)
