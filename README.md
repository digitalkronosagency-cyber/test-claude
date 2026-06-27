# Template Institut de Beauté — Next.js 14

Template multi-client pour instituts de beauté indépendants. Toutes les informations spécifiques au client sont injectées via des variables d'environnement.

## Démarrage rapide

```bash
cp .env.example .env.local   # puis remplir les variables
npm install
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les variables requises :

| Variable | Description |
|---|---|
| `INSTITUT_ID` | Identifiant unique du client |
| `NOM_INSTITUT` | Nom affiché sur le site |
| `COULEUR_PRINCIPALE` | Hex ex. `#D4537E` |
| `COULEUR_SECONDAIRE` | Hex ex. `#FAF7F5` |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin (server-side uniquement) |

## Base de données Supabase

### Appliquer le schéma

Dans l'éditeur SQL Supabase (ou via `psql`) :

```bash
psql $DATABASE_URL -f supabase/migrations/20240001_init_schema.sql
```

### Charger les données de test

```bash
psql $DATABASE_URL -f supabase/seed.sql
```

Le seed crée les données fictives de l'Institut Belle Époque avec des cas de test couvrant :
- Forfait bientôt épuisé (Marie — 1 séance restante)
- Forfait expirant dans 15 jours (Julie — 3 séances restantes)
- Nouvelle cliente sans forfait (Sarah)
- Cliente avec 2 forfaits simultanés (Anne)
- Forfait terminé avec historique complet (Pauline — 6 séances)

### Structure des tables

```
instituts               → informations de l'institut
equipe                  → esthéticiennes
prestations_catalogue   → soins proposés à l'unité
forfaits                → packs vendables
clientes                → espace client
forfaits_clientes       → forfaits achetés par chaque cliente
prestations_realisees   → historique des séances
demandes_creneau        → formulaire de prise de RDV
parametres_institut     → options (SMS, parrainage…)
```

Row Level Security activé sur toutes les tables. Les écritures passent par le service role (API routes / Server Actions).

## Architecture

```
app/                    → Pages (App Router)
  layout.tsx            → Couleurs dynamiques via CSS custom properties
  page.tsx              → Accueil
  espace-client/        → Espace connecté
lib/
  config.ts             → Lecture centralisée des variables d'environnement
  supabase/
    client.ts           → Client navigateur (singleton)
    server.ts           → Client SSR + client admin
    middleware.ts       → Rafraîchissement de session
middleware.ts           → Middleware Next.js
supabase/
  migrations/           → Schéma SQL
  seed.sql              → Données de test
```
