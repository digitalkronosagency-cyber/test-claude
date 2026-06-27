import { createSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";
import EspaceClientNav from "./components/EspaceClientNav";

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Le middleware gère les redirections mais on double-check ici pour les routes protégées
  // La page /connexion est rendue sans nav (elle n'a pas besoin de layout connecté)
  const showNav = !!user;

  if (!showNav) {
    // Page connexion : pas de chrome espace-client
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: config.branding.couleurSecondaire }}
    >
      <EspaceClientNav
        nomInstitut={config.institut.nom}
        couleurPrincipale={config.branding.couleurPrincipale}
        userEmail={user.email ?? ""}
      />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
}
