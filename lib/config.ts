function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable d'environnement manquante : ${key}`);
  return value;
}

function optional(key: string, fallback = ""): string {
  return process.env[key] || fallback;
}

export const config = {
  institut: {
    id: required("INSTITUT_ID"),
    nom: required("NOM_INSTITUT"),
    adresse: required("ADRESSE"),
    telephone: required("TELEPHONE"),
    email: required("EMAIL"),
    horaires: optional("HORAIRES"),
    lienAvisGoogle: optional("LIEN_AVIS_GOOGLE"),
  },
  branding: {
    couleurPrincipale: optional("COULEUR_PRINCIPALE", "#D4537E"),
    couleurSecondaire: optional("COULEUR_SECONDAIRE", "#FAF7F5"),
    logoUrl: optional("LOGO_URL", "/logo.png"),
  },
  supabase: {
    url: required("SUPABASE_URL"),
    anonKey: required("SUPABASE_ANON_KEY"),
    // serviceRoleKey uniquement côté serveur
    serviceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
  },
} as const;

export type Config = typeof config;
