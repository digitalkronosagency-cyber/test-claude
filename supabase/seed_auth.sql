-- ============================================================
-- Seed : utilisateurs Supabase Auth pour les clientes de test
-- À exécuter APRÈS seed.sql, dans l'éditeur SQL Supabase
-- (nécessite les droits sur le schéma auth)
-- ============================================================
-- Mot de passe utilisé pour toutes les clientes de test : Test1234!
-- Le hash bcrypt correspond à ce mot de passe (coût 10)
-- ============================================================

do $$
declare
  v_password_hash text := '$2a$10$PX9Z.9V2zDv3e3lOd1MNS.sLQfEwmYHtF7Hv2hQvCl8Ax0sLFOjvq';
  -- NB : remplace ce hash par un vrai hash bcrypt si tu veux un autre mot de passe.
  -- Générer un hash : SELECT crypt('TonMotDePasse', gen_salt('bf', 10));
begin
  -- Marie Lefevre (1 séance restante)
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    'e1000000-0000-0000-0000-000000000001',
    'marie.lefevre@email.fr',
    v_password_hash,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

  -- Julie Bernard (expiration dans 15 jours + 3 séances) ← cas de test principal
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    'e1000000-0000-0000-0000-000000000002',
    'julie.bernard@email.fr',
    v_password_hash,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

  -- Sarah Moreau (sans forfait)
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    'e1000000-0000-0000-0000-000000000003',
    'sarah.moreau@email.fr',
    v_password_hash,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

  -- Anne Girard (2 forfaits simultanés)
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    'e1000000-0000-0000-0000-000000000004',
    'anne.girard@email.fr',
    v_password_hash,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

  -- Pauline Roux (forfait épuisé)
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    'e1000000-0000-0000-0000-000000000005',
    'pauline.roux@email.fr',
    v_password_hash,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

end $$;

-- ============================================================
-- Vérification
-- ============================================================
-- select email, email_confirmed_at from auth.users
-- where email like '%@email.fr';
