# Déploiement sur Vercel — digitalkronosagency Onboarding

## 1. Créer les comptes gratuits nécessaires

| Service | URL | Usage |
|---------|-----|-------|
| Vercel | vercel.com | Déploiement |
| Supabase | supabase.com | Base de données + Storage |
| Resend | resend.com | Emails transactionnels |
| GitHub | github.com | Hébergement code |

---

## 2. Supabase — Setup base de données

### 2.1 Créer un projet
1. Aller sur supabase.com → New Project
2. Choisir un nom et une région proche de tes clients (Europe West)
3. Copier le **Database Password** (tu en auras besoin)

### 2.2 Créer les tables
1. Aller dans **SQL Editor**
2. Coller et exécuter le script SQL ci-dessous :

```sql
-- Clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text unique not null,
  phone text,
  city text,
  region text,
  revenue_range text,
  status text default 'invited',
  invite_token text unique default gen_random_uuid()::text,
  invite_sent_at timestamptz,
  delivery_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  section_key text not null,
  data jsonb not null default '{}',
  completed boolean default false,
  updated_at timestamptz default now(),
  unique(client_id, section_key)
);

create table project_steps (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  step_key text not null,
  step_name text not null,
  step_icon text default '📋',
  status text default 'todo',
  order_index integer not null,
  admin_notes text,
  client_message text,
  requires_approval boolean default false,
  approved_at timestamptz,
  estimated_date date,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  sender text not null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table shared_files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  filename text not null,
  original_name text not null,
  storage_path text not null,
  file_type text,
  size_bytes integer,
  uploaded_by text default 'admin',
  visible_to_client boolean default true,
  created_at timestamptz default now()
);

create table form_config (
  id integer primary key default 1,
  config jsonb not null,
  updated_at timestamptz default now()
);

-- Row Level Security (désactivé car on utilise le service role côté serveur)
alter table clients enable row level security;
alter table onboarding_responses enable row level security;
alter table project_steps enable row level security;
alter table messages enable row level security;
alter table shared_files enable row level security;
alter table form_config enable row level security;

-- Policies pour le service role (accès total depuis le serveur)
create policy "Service role full access" on clients using (true) with check (true);
create policy "Service role full access" on onboarding_responses using (true) with check (true);
create policy "Service role full access" on project_steps using (true) with check (true);
create policy "Service role full access" on messages using (true) with check (true);
create policy "Service role full access" on shared_files using (true) with check (true);
create policy "Service role full access" on form_config using (true) with check (true);
```

### 2.3 Créer les buckets Storage
1. Aller dans **Storage** → New Bucket
2. Créer : `client-photos` (Public: OFF)
3. Créer : `shared-files` (Public: OFF)

### 2.4 Récupérer les clés API
**Settings → API :**
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (⚠️ garder secret)

---

## 3. Resend — Setup emails

1. Créer un compte sur resend.com
2. **Domains** → Add Domain → entrer `digitalkronosagency.com`
3. Ajouter les DNS records indiqués (dans ton hébergeur de domaine)
4. **API Keys** → Create API Key
5. Copier la clé → `RESEND_API_KEY`

> Si tu n'as pas encore de domaine, utilise l'adresse test Resend : `onboarding@resend.dev`

---

## 4. GitHub — Push du code

```bash
cd agency-onboarding
git init
git add .
git commit -m "Initial commit — digitalkronosagency onboarding app"
gh repo create agency-onboarding --public --push
# ou manuellement :
git remote add origin https://github.com/TON_USERNAME/agency-onboarding.git
git push -u origin main
```

---

## 5. Vercel — Déploiement

1. Aller sur vercel.com → **New Project**
2. Connecter ton compte GitHub
3. Sélectionner le repo `agency-onboarding`
4. Dans **Environment Variables**, ajouter :

```
NEXT_PUBLIC_SUPABASE_URL         = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    = eyJ...
SUPABASE_SERVICE_ROLE_KEY        = eyJ...
RESEND_API_KEY                   = re_...
RESEND_FROM_EMAIL                = onboarding@digitalkronosagency.com
ADMIN_EMAIL                      = admin@digitalkronosagency.com
ADMIN_PASSWORD                   = MotDePasseSecurisé123!
JWT_SECRET                       = une-chaine-aleatoire-longue-et-secrete
NEXT_PUBLIC_APP_URL              = https://ton-app.vercel.app
```

5. Cliquer **Deploy** → ton app est en ligne en 2 minutes !
6. Mettre à jour `NEXT_PUBLIC_APP_URL` avec l'URL réelle de Vercel

---

## 6. Premier lancement

### Lancer en local

```bash
cd agency-onboarding
# Remplir .env.local avec tes vraies clés Supabase + Resend
npm run dev
# → http://localhost:3000
```

### Seeder la base avec des données de test

```bash
# Installer tsx si pas déjà installé
npm install -D tsx
# Lancer le seed
npx tsx scripts/seed.ts
```

### Créer ton premier client (production)

1. Aller sur `/admin/login`
2. Se connecter avec l'email ADMIN_EMAIL et ADMIN_PASSWORD
3. Cliquer **Nouveau client** → remplir le formulaire
4. Dans la liste, cliquer **Inviter** → l'email part automatiquement
5. Partager aussi le lien manuellement si besoin

---

## 7. Personnalisation

### Changer les couleurs
Les couleurs principales sont définies dans Tailwind :
- Orange : `text-orange-500`, `bg-orange-500`  
- Fond sombre : `bg-[#1a1a2e]`

Pour personnaliser, modifier ces classes dans les composants ou créer un thème Tailwind.

### Modifier le formulaire
Aller sur `/admin/form-editor` pour :
- Ajouter/supprimer des sections
- Ajouter/modifier des champs
- Réordonner par drag & drop
- Sauvegarder → mis à jour en temps réel pour tous les clients

### Ajouter des étapes projet
Modifier `lib/default-form-config.ts` → `DEFAULT_PROJECT_STEPS`

---

## Structure des URLs

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil |
| `/admin/login` | Connexion admin |
| `/admin` | Dashboard admin |
| `/admin/clients/[id]` | Fiche client détaillée |
| `/admin/form-editor` | Éditeur de formulaire |
| `/client/[token]` | Dashboard client |
| `/client/[token]/onboarding` | Formulaire client |
| `/client/[token]/messages` | Messagerie client |
| `/client/[token]/files` | Documents partagés |
| `/client/[token]/approve/[stepId]` | Validation d'étape |
