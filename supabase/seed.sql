-- ============================================================
-- Seed : données fictives pour "Institut Belle Époque"
-- À exécuter via : psql $DATABASE_URL -f supabase/seed.sql
-- ou depuis l'éditeur SQL Supabase (en service role)
-- ============================================================

-- UUIDs fixes pour permettre des ré-exécutions idempotentes
do $$
declare
  -- Institut
  v_institut_id         uuid := 'a1000000-0000-0000-0000-000000000001';

  -- Équipe
  v_sophie_id           uuid := 'b1000000-0000-0000-0000-000000000001';
  v_lea_id              uuid := 'b1000000-0000-0000-0000-000000000002';
  v_camille_id          uuid := 'b1000000-0000-0000-0000-000000000003';

  -- Prestations catalogue
  v_epil_jambes_id      uuid := 'c1000000-0000-0000-0000-000000000001';
  v_epil_aisselles_id   uuid := 'c1000000-0000-0000-0000-000000000002';
  v_epil_maillot_id     uuid := 'c1000000-0000-0000-0000-000000000003';
  v_soin_visage_id      uuid := 'c1000000-0000-0000-0000-000000000004';
  v_manucure_id         uuid := 'c1000000-0000-0000-0000-000000000005';

  -- Forfaits
  v_pack_jambes_6_id    uuid := 'd1000000-0000-0000-0000-000000000001';
  v_pack_aisselles_6_id uuid := 'd1000000-0000-0000-0000-000000000002';
  v_carte_visage_10_id  uuid := 'd1000000-0000-0000-0000-000000000003';
  v_pack_decouverte_id  uuid := 'd1000000-0000-0000-0000-000000000004';

  -- Clientes
  v_marie_id            uuid := 'e1000000-0000-0000-0000-000000000001';
  v_julie_id            uuid := 'e1000000-0000-0000-0000-000000000002';
  v_sarah_id            uuid := 'e1000000-0000-0000-0000-000000000003';
  v_anne_id             uuid := 'e1000000-0000-0000-0000-000000000004';
  v_pauline_id          uuid := 'e1000000-0000-0000-0000-000000000005';

  -- Forfaits clientes
  v_fc_marie_id         uuid := 'f1000000-0000-0000-0000-000000000001';
  v_fc_julie_id         uuid := 'f1000000-0000-0000-0000-000000000002';
  v_fc_anne_jambes_id   uuid := 'f1000000-0000-0000-0000-000000000003';
  v_fc_anne_visage_id   uuid := 'f1000000-0000-0000-0000-000000000004';
  v_fc_pauline_id       uuid := 'f1000000-0000-0000-0000-000000000005';

begin

  -- ──────────────────────────────────────────────────────────
  -- Institut
  -- ──────────────────────────────────────────────────────────
  insert into instituts (id, nom, adresse, telephone, email, horaires, couleur_principale, couleur_secondaire)
  values (
    v_institut_id,
    'Institut Belle Époque',
    '12 rue de la Paix, Bordeaux',
    '05 56 00 00 00',
    'contact@belle-epoque-bordeaux.fr',
    'Lun-Sam 9h00-19h00 — Dimanche fermé',
    '#D4537E',
    '#FAF7F5'
  )
  on conflict (id) do nothing;

  -- Paramètres
  insert into parametres_institut (institut_id, sms_active, parrainage_actif, recompense_parrainage, lien_avis_google)
  values (
    v_institut_id,
    false,
    true,
    'Une séance offerte pour tout parrainage validé',
    'https://g.page/belle-epoque-bordeaux/review'
  )
  on conflict (institut_id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Équipe
  -- ──────────────────────────────────────────────────────────
  insert into equipe (id, institut_id, nom, presentation) values
  (
    v_sophie_id, v_institut_id,
    'Sophie Martin',
    'Esthéticienne diplômée depuis 10 ans, Sophie est spécialisée en épilation et soins du corps. Sa douceur et sa précision en font la préférée de nos clientes les plus fidèles.'
  ),
  (
    v_lea_id, v_institut_id,
    'Léa Dubois',
    'Passionnée par les soins du visage et les nouvelles techniques de beauté, Léa a suivi une formation avancée en dermato-cosmétique. Elle saura sublimer votre peau avec expertise.'
  ),
  (
    v_camille_id, v_institut_id,
    'Camille Petit',
    'Camille a rejoint l''équipe Belle Époque après 5 ans en institut parisien. Spécialiste manucure et pédicure, elle transforme chaque soin des mains en véritable moment de détente.'
  )
  on conflict (id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Catalogue prestations
  -- ──────────────────────────────────────────────────────────
  insert into prestations_catalogue (id, institut_id, nom, prix, duree_minutes, zone) values
  (v_epil_jambes_id,    v_institut_id, 'Épilation jambes complètes',      45.00, 30, 'Jambes'),
  (v_epil_aisselles_id, v_institut_id, 'Épilation aisselles',             15.00, 10, 'Aisselles'),
  (v_epil_maillot_id,   v_institut_id, 'Épilation maillot',               20.00, 15, 'Maillot'),
  (v_soin_visage_id,    v_institut_id, 'Soin du visage hydratant',        60.00, 45, 'Visage'),
  (v_manucure_id,       v_institut_id, 'Manucure',                        35.00, 30, 'Mains')
  on conflict (id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Forfaits
  -- ──────────────────────────────────────────────────────────
  insert into forfaits (id, institut_id, nom, nombre_seances_total, prix, duree_validite_jours) values
  (v_pack_jambes_6_id,    v_institut_id, 'Pack épilation jambes 6 séances',       6,  480.00, 365),
  (v_pack_aisselles_6_id, v_institut_id, 'Pack épilation aisselles 6 séances',    6,  180.00, 365),
  (v_carte_visage_10_id,  v_institut_id, 'Carte fidélité 10 soins visage',        10, 450.00, 548),
  (v_pack_decouverte_id,  v_institut_id, 'Pack découverte 3 séances jambes',      3,  260.00, 180)
  on conflict (id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Clientes
  -- ──────────────────────────────────────────────────────────
  insert into clientes (id, institut_id, nom, prenom, email, telephone) values
  (v_marie_id,   v_institut_id, 'Lefevre',  'Marie',    'marie.lefevre@email.fr',   '06 11 22 33 44'),
  (v_julie_id,   v_institut_id, 'Bernard',  'Julie',    'julie.bernard@email.fr',   '06 22 33 44 55'),
  (v_sarah_id,   v_institut_id, 'Moreau',   'Sarah',    'sarah.moreau@email.fr',    '06 33 44 55 66'),
  (v_anne_id,    v_institut_id, 'Girard',   'Anne',     'anne.girard@email.fr',     '06 44 55 66 77'),
  (v_pauline_id, v_institut_id, 'Roux',     'Pauline',  'pauline.roux@email.fr',    '06 55 66 77 88')
  on conflict (id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Forfaits clientes
  -- ──────────────────────────────────────────────────────────

  -- Marie Lefevre : pack jambes — 1 séance restante (alerte "bientôt épuisé")
  insert into forfaits_clientes (id, forfait_id, cliente_id, seances_restantes, date_achat, date_expiration)
  values (
    v_fc_marie_id,
    v_pack_jambes_6_id,
    v_marie_id,
    1,
    current_date - interval '8 months',
    current_date + interval '4 months'
  )
  on conflict (id) do nothing;

  -- Julie Bernard : pack jambes — expire dans 15 jours, 3 séances restantes (alerte "expiration proche")
  insert into forfaits_clientes (id, forfait_id, cliente_id, seances_restantes, date_achat, date_expiration)
  values (
    v_fc_julie_id,
    v_pack_jambes_6_id,
    v_julie_id,
    3,
    current_date - interval '11 months',
    current_date + interval '15 days'
  )
  on conflict (id) do nothing;

  -- Sarah Moreau : aucun forfait → pas d'insertion

  -- Anne Girard : 2 forfaits simultanés en cours
  insert into forfaits_clientes (id, forfait_id, cliente_id, seances_restantes, date_achat, date_expiration)
  values
  (
    v_fc_anne_jambes_id,
    v_pack_jambes_6_id,
    v_anne_id,
    4,
    current_date - interval '3 months',
    current_date + interval '9 months'
  ),
  (
    v_fc_anne_visage_id,
    v_carte_visage_10_id,
    v_anne_id,
    7,
    current_date - interval '2 months',
    current_date + interval '16 months'
  )
  on conflict (id) do nothing;

  -- Pauline Roux : pack jambes terminé (0 séance restante), expiré
  insert into forfaits_clientes (id, forfait_id, cliente_id, seances_restantes, date_achat, date_expiration)
  values (
    v_fc_pauline_id,
    v_pack_jambes_6_id,
    v_pauline_id,
    0,
    current_date - interval '14 months',
    current_date - interval '2 months'
  )
  on conflict (id) do nothing;


  -- ──────────────────────────────────────────────────────────
  -- Historique prestations réalisées
  -- ──────────────────────────────────────────────────────────

  -- Marie (5 séances consommées sur 6)
  insert into prestations_realisees (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes) values
  (v_marie_id, v_fc_marie_id, current_date - interval '8 months',  'Sophie Martin',  'Première séance, cliente très satisfaite.'),
  (v_marie_id, v_fc_marie_id, current_date - interval '6 months',  'Sophie Martin',  null),
  (v_marie_id, v_fc_marie_id, current_date - interval '4 months',  'Léa Dubois',     null),
  (v_marie_id, v_fc_marie_id, current_date - interval '2 months',  'Sophie Martin',  'Repousse légère, cire adaptée.'),
  (v_marie_id, v_fc_marie_id, current_date - interval '3 weeks',   'Sophie Martin',  null);

  -- Julie (3 séances consommées sur 6)
  insert into prestations_realisees (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes) values
  (v_julie_id, v_fc_julie_id, current_date - interval '11 months', 'Camille Petit',  null),
  (v_julie_id, v_fc_julie_id, current_date - interval '8 months',  'Sophie Martin',  null),
  (v_julie_id, v_fc_julie_id, current_date - interval '5 months',  'Sophie Martin',  'Cliente à prévenir pour l''expiration imminente.');

  -- Anne (2 séances jambes + 3 séances visage consommées)
  insert into prestations_realisees (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes) values
  (v_anne_id, v_fc_anne_jambes_id, current_date - interval '3 months',  'Sophie Martin', null),
  (v_anne_id, v_fc_anne_jambes_id, current_date - interval '6 weeks',   'Sophie Martin', null),
  (v_anne_id, v_fc_anne_visage_id, current_date - interval '2 months',  'Léa Dubois',    'Peau déshydratée, protocole hydratation intense appliqué.'),
  (v_anne_id, v_fc_anne_visage_id, current_date - interval '5 weeks',   'Léa Dubois',    null),
  (v_anne_id, v_fc_anne_visage_id, current_date - interval '2 weeks',   'Léa Dubois',    'Résultats très visibles, cliente ravie.');

  -- Pauline (6 séances complètes — forfait épuisé)
  insert into prestations_realisees (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes) values
  (v_pauline_id, v_fc_pauline_id, current_date - interval '14 months', 'Camille Petit',  'Première séance.'),
  (v_pauline_id, v_fc_pauline_id, current_date - interval '12 months', 'Camille Petit',  null),
  (v_pauline_id, v_fc_pauline_id, current_date - interval '10 months', 'Sophie Martin',  null),
  (v_pauline_id, v_fc_pauline_id, current_date - interval '8 months',  'Sophie Martin',  null),
  (v_pauline_id, v_fc_pauline_id, current_date - interval '5 months',  'Camille Petit',  null),
  (v_pauline_id, v_fc_pauline_id, current_date - interval '3 months',  'Camille Petit',  'Dernière séance du pack. À relancer pour renouvellement.');


  -- ──────────────────────────────────────────────────────────
  -- Demandes de créneau (2 en attente)
  -- ──────────────────────────────────────────────────────────
  insert into demandes_creneau (institut_id, cliente_id, nom_demandeur, telephone_demandeur, disponibilite_souhaitee, statut)
  values
  (
    v_institut_id,
    v_sarah_id,
    'Sarah Moreau',
    '06 33 44 55 66',
    'Mardi ou jeudi après-midi, semaine prochaine',
    'en_attente'
  ),
  (
    v_institut_id,
    null,
    'Clara Fontaine',
    '07 12 34 56 78',
    'N''importe quel matin de la semaine du 10 au 14',
    'en_attente'
  );

end $$;
