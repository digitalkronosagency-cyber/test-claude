-- ============================================================
-- Migration 002 : rôle gérante + colonnes actif + fonction atomique
-- ============================================================

-- ── Table admins ────────────────────────────────────────────────────────────
create table admins (
  id           uuid primary key default uuid_generate_v4(),
  email        text not null,
  institut_id  uuid not null references instituts(id) on delete cascade,
  role         text not null default 'gerante' check (role in ('gerante', 'admin')),
  created_at   timestamptz not null default now(),
  unique (email, institut_id)
);

alter table admins enable row level security;
-- Lecture uniquement via service role (back-office server-side)
create policy "Service role uniquement" on admins for all using (false);

-- ── Colonne actif sur forfaits ───────────────────────────────────────────────
alter table forfaits add column if not exists actif boolean not null default true;

create index if not exists idx_forfaits_actif on forfaits (actif);

-- ── Colonne actif sur equipe ─────────────────────────────────────────────────
alter table equipe add column if not exists actif boolean not null default true;

-- ── Politique RLS supplémentaire : lecture publique seulement des membres actifs
drop policy if exists "Lecture publique de l'équipe" on equipe;
create policy "Lecture publique des membres actifs"
  on equipe for select using (actif = true);

-- ── Fonction atomique : marquer une prestation et décrémenter les séances ────
create or replace function admin_marquer_prestation(
  p_forfait_cliente_id uuid,
  p_cliente_id         uuid,
  p_date_prestation    date,
  p_estheticienne      text,
  p_notes              text default null
)
returns void
language plpgsql
security definer   -- s'exécute avec les droits du owner (service role)
as $$
declare
  v_restantes integer;
begin
  -- Verrouiller la ligne pour éviter les courses concurrentes
  select seances_restantes
    into v_restantes
    from forfaits_clientes
   where id = p_forfait_cliente_id
     for update;

  if v_restantes is null then
    raise exception 'Forfait introuvable : %', p_forfait_cliente_id;
  end if;

  if v_restantes <= 0 then
    raise exception 'Aucune séance restante sur ce forfait';
  end if;

  update forfaits_clientes
     set seances_restantes = seances_restantes - 1
   where id = p_forfait_cliente_id;

  insert into prestations_realisees
    (cliente_id, forfait_clientes_id, date_prestation, estheticienne, notes)
  values
    (p_cliente_id, p_forfait_cliente_id, p_date_prestation, p_estheticienne, p_notes);
end;
$$;

-- ── Index supplémentaires utiles pour les listes admin ───────────────────────
create index if not exists idx_clientes_nom on clientes (nom, prenom);
create index if not exists idx_demandes_statut_created on demandes_creneau (statut, created_at desc);
