-- ============================================================
-- Migration : schéma initial Institut de Beauté
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";


-- ============================================================
-- 1. instituts
-- ============================================================
create table instituts (
  id                   uuid primary key default uuid_generate_v4(),
  nom                  text not null,
  adresse              text,
  telephone            text,
  email                text,
  horaires             text,
  logo_url             text,
  couleur_principale   text,
  couleur_secondaire   text,
  created_at           timestamptz not null default now()
);

alter table instituts enable row level security;

-- Lecture publique (landing page)
create policy "Lecture publique des instituts"
  on instituts for select using (true);

-- Écriture réservée aux admins (service role bypasse la RLS)
create policy "Écriture réservée au service role"
  on instituts for all using (false);


-- ============================================================
-- 2. equipe
-- ============================================================
create table equipe (
  id           uuid primary key default uuid_generate_v4(),
  institut_id  uuid not null references instituts(id) on delete cascade,
  nom          text not null,
  presentation text,
  photo_url    text,
  created_at   timestamptz not null default now()
);

alter table equipe enable row level security;

create policy "Lecture publique de l'équipe"
  on equipe for select using (true);

create policy "Écriture réservée au service role"
  on equipe for all using (false);


-- ============================================================
-- 3. prestations_catalogue
-- ============================================================
create table prestations_catalogue (
  id              uuid primary key default uuid_generate_v4(),
  institut_id     uuid not null references instituts(id) on delete cascade,
  nom             text not null,
  prix            numeric(8,2) not null check (prix >= 0),
  duree_minutes   integer not null check (duree_minutes > 0),
  zone            text,
  created_at      timestamptz not null default now()
);

alter table prestations_catalogue enable row level security;

create policy "Lecture publique du catalogue"
  on prestations_catalogue for select using (true);

create policy "Écriture réservée au service role"
  on prestations_catalogue for all using (false);


-- ============================================================
-- 4. forfaits
-- ============================================================
create table forfaits (
  id                    uuid primary key default uuid_generate_v4(),
  institut_id           uuid not null references instituts(id) on delete cascade,
  nom                   text not null,
  nombre_seances_total  integer not null check (nombre_seances_total > 0),
  prix                  numeric(8,2) not null check (prix >= 0),
  duree_validite_jours  integer not null check (duree_validite_jours > 0),
  created_at            timestamptz not null default now()
);

alter table forfaits enable row level security;

create policy "Lecture publique des forfaits"
  on forfaits for select using (true);

create policy "Écriture réservée au service role"
  on forfaits for all using (false);


-- ============================================================
-- 5. clientes
-- ============================================================
create table clientes (
  id           uuid primary key default uuid_generate_v4(),
  institut_id  uuid not null references instituts(id) on delete cascade,
  nom          text not null,
  prenom       text not null,
  email        text,
  telephone    text,
  created_at   timestamptz not null default now(),
  unique (institut_id, email)
);

alter table clientes enable row level security;

-- Une cliente ne peut lire que ses propres données (via auth.uid() → à relier avec auth.users si besoin)
create policy "Lecture par la cliente elle-même"
  on clientes for select
  using (auth.uid()::text = id::text);

create policy "Écriture réservée au service role"
  on clientes for all using (false);


-- ============================================================
-- 6. forfaits_clientes
-- ============================================================
create table forfaits_clientes (
  id                uuid primary key default uuid_generate_v4(),
  forfait_id        uuid not null references forfaits(id) on delete restrict,
  cliente_id        uuid not null references clientes(id) on delete cascade,
  seances_restantes integer not null check (seances_restantes >= 0),
  date_achat        date not null default current_date,
  date_expiration   date not null,
  created_at        timestamptz not null default now()
);

alter table forfaits_clientes enable row level security;

create policy "Une cliente voit ses propres forfaits"
  on forfaits_clientes for select
  using (
    exists (
      select 1 from clientes c
      where c.id = forfaits_clientes.cliente_id
        and auth.uid()::text = c.id::text
    )
  );

create policy "Écriture réservée au service role"
  on forfaits_clientes for all using (false);


-- ============================================================
-- 7. prestations_realisees
-- ============================================================
create table prestations_realisees (
  id                   uuid primary key default uuid_generate_v4(),
  cliente_id           uuid not null references clientes(id) on delete cascade,
  -- Null si prestation hors forfait
  forfait_clientes_id  uuid references forfaits_clientes(id) on delete set null,
  date_prestation      date not null,
  estheticienne        text,
  notes                text,
  created_at           timestamptz not null default now()
);

-- Colonne avec accent dans l'énoncé — on crée un alias sans accent pour la robustesse
comment on column prestations_realisees.estheticienne is 'Nom de l''esthéticienne ayant réalisé la prestation';

alter table prestations_realisees enable row level security;

create policy "Une cliente voit son historique"
  on prestations_realisees for select
  using (
    exists (
      select 1 from clientes c
      where c.id = prestations_realisees.cliente_id
        and auth.uid()::text = c.id::text
    )
  );

create policy "Écriture réservée au service role"
  on prestations_realisees for all using (false);


-- ============================================================
-- 8. demandes_creneau
-- ============================================================
create type statut_demande as enum ('en_attente', 'confirme', 'annule');

create table demandes_creneau (
  id                      uuid primary key default uuid_generate_v4(),
  institut_id             uuid not null references instituts(id) on delete cascade,
  -- Null si la demande vient d'une visiteuse non-cliente
  cliente_id              uuid references clientes(id) on delete set null,
  nom_demandeur           text not null,
  telephone_demandeur     text not null,
  disponibilite_souhaitee text not null,
  statut                  statut_demande not null default 'en_attente',
  created_at              timestamptz not null default now()
);

alter table demandes_creneau enable row level security;

-- Insertion publique (formulaire de contact sur le site)
create policy "Insertion publique de demandes"
  on demandes_creneau for insert with check (true);

-- Lecture : uniquement pour la cliente concernée ou le service role
create policy "Lecture par la cliente concernée"
  on demandes_creneau for select
  using (
    cliente_id is not null
    and auth.uid()::text = cliente_id::text
  );

create policy "Écriture réservée au service role"
  on demandes_creneau for update using (false);


-- ============================================================
-- 9. parametres_institut
-- ============================================================
create table parametres_institut (
  id                    uuid primary key default uuid_generate_v4(),
  institut_id           uuid not null unique references instituts(id) on delete cascade,
  sms_active            boolean not null default false,
  parrainage_actif      boolean not null default false,
  recompense_parrainage text,
  lien_avis_google      text,
  created_at            timestamptz not null default now()
);

alter table parametres_institut enable row level security;

create policy "Lecture publique des paramètres"
  on parametres_institut for select using (true);

create policy "Écriture réservée au service role"
  on parametres_institut for all using (false);


-- ============================================================
-- Index utiles
-- ============================================================
create index on equipe (institut_id);
create index on prestations_catalogue (institut_id);
create index on forfaits (institut_id);
create index on clientes (institut_id);
create index on clientes (email);
create index on forfaits_clientes (cliente_id);
create index on forfaits_clientes (forfait_id);
create index on forfaits_clientes (date_expiration);
create index on prestations_realisees (cliente_id);
create index on prestations_realisees (forfait_clientes_id);
create index on demandes_creneau (institut_id, statut);
