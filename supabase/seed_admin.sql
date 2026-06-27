-- ============================================================
-- Seed admin : gérante de l'Institut Belle Époque
-- À exécuter après seed.sql et seed_auth.sql
-- ============================================================

do $$
declare
  v_institut_id uuid := 'a1000000-0000-0000-0000-000000000001';
  v_admin_id    uuid := 'f0000000-0000-0000-0000-000000000001';
begin

  -- ── Utilisateur Auth ─────────────────────────────────────────────────────
  -- Mot de passe : Admin1234!
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, aud, role
  ) values (
    v_admin_id,
    'gerante@belle-epoque.fr',
    '$2a$10$PX9Z.9V2zDv3e3lOd1MNS.sLQfEwmYHtF7Hv2hQvCl8Ax0sLFOjvq',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(), now(), 'authenticated', 'authenticated'
  )
  on conflict (id) do nothing;

  -- ── Ligne admins ─────────────────────────────────────────────────────────
  insert into admins (email, institut_id, role)
  values ('gerante@belle-epoque.fr', v_institut_id, 'gerante')
  on conflict (email, institut_id) do nothing;

end $$;
