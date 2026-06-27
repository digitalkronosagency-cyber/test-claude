import { config } from "@/lib/config";
import { fetchVitrinePrestations, fetchVitrineForfaits, fetchVitrineEquipe } from "@/lib/queries/admin";

import SiteHeader from "@/app/components/SiteHeader";
import HeroSection from "@/app/components/HeroSection";
import PrestationsSection from "@/app/components/PrestationsSection";
import ForfaitsSection from "@/app/components/ForfaitsSection";
import EquipeSection from "@/app/components/EquipeSection";
import AvisSection from "@/app/components/AvisSection";
import ContactSection from "@/app/components/ContactSection";
import SiteFooter from "@/app/components/SiteFooter";

export const revalidate = 3600;

export default async function HomePage() {
  const { institut, branding } = config;

  let prestations: Awaited<ReturnType<typeof fetchVitrinePrestations>> = [];
  let forfaits: Awaited<ReturnType<typeof fetchVitrineForfaits>> = [];
  let equipe: Awaited<ReturnType<typeof fetchVitrineEquipe>> = [];

  try {
    [prestations, forfaits, equipe] = await Promise.all([
      fetchVitrinePrestations(),
      fetchVitrineForfaits(),
      fetchVitrineEquipe(),
    ]);
  } catch {
    // DB non configurée — page s'affiche quand même
  }

  return (
    <>
      <SiteHeader nom={institut.nom} couleurPrincipale={branding.couleurPrincipale} />
      <main>
        <HeroSection nom={institut.nom} couleurPrincipale={branding.couleurPrincipale} couleurSecondaire={branding.couleurSecondaire} />
        <PrestationsSection prestations={prestations} couleurPrincipale={branding.couleurPrincipale} />
        <ForfaitsSection forfaits={forfaits} couleurPrincipale={branding.couleurPrincipale} couleurSecondaire={branding.couleurSecondaire} />
        <EquipeSection equipe={equipe} couleurPrincipale={branding.couleurPrincipale} couleurSecondaire={branding.couleurSecondaire} />
        <AvisSection lienAvisGoogle={institut.lienAvisGoogle} couleurPrincipale={branding.couleurPrincipale} couleurSecondaire={branding.couleurSecondaire} nomInstitut={institut.nom} />
        <ContactSection adresse={institut.adresse} telephone={institut.telephone} email={institut.email} horaires={institut.horaires} couleurPrincipale={branding.couleurPrincipale} couleurSecondaire={branding.couleurSecondaire} />
      </main>
      <SiteFooter nom={institut.nom} email={institut.email} telephone={institut.telephone} adresse={institut.adresse} lienAvisGoogle={institut.lienAvisGoogle} couleurPrincipale={branding.couleurPrincipale} />
    </>
  );
}
