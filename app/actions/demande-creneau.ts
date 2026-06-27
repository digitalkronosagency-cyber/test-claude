"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";

export type DemandeCreneauState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function soumettreDemandeCreneauAction(
  _prev: DemandeCreneauState,
  formData: FormData
): Promise<DemandeCreneauState> {
  const nom = (formData.get("nom") as string | null)?.trim();
  const telephone = (formData.get("telephone") as string | null)?.trim();
  const disponibilite = (formData.get("disponibilite") as string | null)?.trim();

  if (!nom || !telephone || !disponibilite) {
    return { status: "error", message: "Tous les champs sont requis." };
  }

  if (!/^[\d\s\+\.\-()]{6,20}$/.test(telephone)) {
    return { status: "error", message: "Numéro de téléphone invalide." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("demandes_creneau").insert({
      institut_id: config.institut.id,
      nom_demandeur: nom,
      telephone_demandeur: telephone,
      disponibilite_souhaitee: disponibilite,
      statut: "en_attente",
    });

    if (error) throw error;
    return { status: "success" };
  } catch (err) {
    console.error("[demande_creneau]", err);
    return {
      status: "error",
      message: "Une erreur est survenue. Merci de réessayer ou de nous appeler directement.",
    };
  }
}
