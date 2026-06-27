import { config } from "@/lib/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

import SiteHeader from "@/app/components/SiteHeader";
import HeroSection from "@/app/components/HeroSection";
import PrestationsSection from "@/app/components/PrestationsSection";
import ForfaitsSection from "@/app/components/ForfaitsSection";
import EquipeSection from "@/app/components/EquipeSection";
import AvisSection from "@/app/components/AvisSection";
import ContactSection from "@/app/components/ContactSection";
import SiteFooter from "@/app/components/SiteFooter";

// Revalidation toutes les heures — les données catalogue changent rarement
export const revalidate = 3600;

async function fetchVitrine(institutId: string) {
  const supabase = createSupabaseAdminClient();

  const [prestationsRes, forfaitsRes, equipeRes] = await Promise.all([
    supabase
      .from("prestations_catalogue")
      .select("id, nom, prix, duree_minutes, zone")
      .eq("institut_id", institutId)
      .order("zone")
      .order("prix"),
    supabase
      .from("forfaits")
      .select("id, nom, nombre_seances_total, prix, duree_validite_jours")
      .eq("institut_id", institutId)
      .order("prix"),
    supabase
      .from("equipe")
      .select("id, nom, presentation, photo_url")
      .eq("institut_id", institutId)
      .order("nom"),
  ]);

  return {
    prestations: prestationsRes.data ?? [],
    forfaits: forfaitsRes.data ?? [],
    equipe: equipeRes.data ?? [],
  };
}

export default async function HomePage() {
  const { institut, branding } = config;

  // Données catalogue depuis Supabase — fallback sur tableaux vides si BD non encore provisionnée
  let prestations: Awaited<ReturnType<typeof fetchVitrine>>["prestations"] = [];
  let forfaits: Awaited<ReturnType<typeof fetchVitrine>>["forfaits"] = [];
  let equipe: Awaited<ReturnType<typeof fetchVitrine>>["equipe"] = [];

  try {
    const data = await fetchVitrine(institut.id);
    prestations = data.prestations;
    forfaits = data.forfaits;
    equipe = data.equipe;
  } catch {
    // Supabase non configuré (clés placeholder) — la page s'affiche quand même
  }

  return (
    <>
      <SiteHeader
        nom={institut.nom}
        couleurPrincipale={branding.couleurPrincipale}
      />

      <main>
        <HeroSection
          nom={institut.nom}
          couleurPrincipale={branding.couleurPrincipale}
          couleurSecondaire={branding.couleurSecondaire}
        />

        <PrestationsSection
          prestations={prestations}
          couleurPrincipale={branding.couleurPrincipale}
        />

        <ForfaitsSection
          forfaits={forfaits}
          couleurPrincipale={branding.couleurPrincipale}
          couleurSecondaire={branding.couleurSecondaire}
        />

        <EquipeSection
          equipe={equipe}
          couleurPrincipale={branding.couleurPrincipale}
          couleurSecondaire={branding.couleurSecondaire}
        />

        <AvisSection
          lienAvisGoogle={institut.lienAvisGoogle}
          couleurPrincipale={branding.couleurPrincipale}
          couleurSecondaire={branding.couleurSecondaire}
          nomInstitut={institut.nom}
        />

        <ContactSection
          adresse={institut.adresse}
          telephone={institut.telephone}
          email={institut.email}
          horaires={institut.horaires}
          couleurPrincipale={branding.couleurPrincipale}
          couleurSecondaire={branding.couleurSecondaire}
        />
      </main>

      <SiteFooter
        nom={institut.nom}
        email={institut.email}
        telephone={institut.telephone}
        adresse={institut.adresse}
        lienAvisGoogle={institut.lienAvisGoogle}
        couleurPrincipale={branding.couleurPrincipale}
      />
    </>
  );
}
